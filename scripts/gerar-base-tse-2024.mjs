#!/usr/bin/env node
/**
 * ETL oficial do Portal de Dados Abertos do TSE (Eleições Municipais 2024 — Mandato 2025–2028)
 *
 * Fonte:
 *  - https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2024.zip
 *  - https://cdn.tse.jus.br/estatistica/sead/odsele/bem_candidato/bem_candidato_2024.zip
 *
 * Gera 26 arquivos compactos por UF em src/data/tse2024/{UF}.json (exclui DF, sem municípios),
 * usados pelo BFF como base oficial ultrarrápida e imune ao bloqueio WAF do DivulgaCandContas.
 *
 * Uso:
 *   node scripts/gerar-base-tse-2024.mjs [caminho-pasta-zips]
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";
import { gzipSync } from "node:zlib";

const UFS = [
  "AC", "AL", "AM", "AP", "BA", "CE", "ES", "GO", "MA", "MG",
  "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO",
  "RR", "RS", "SC", "SE", "SP", "TO",
];

const OUT_DIR = path.resolve(process.cwd(), "src", "data", "tse2024");
const WORK_DIR =
  process.argv[2] ||
  path.join(os.tmpdir(), "fiscaliza-tse-2024-etl");
const EXTRACT_DIR = path.join(WORK_DIR, "csv");

function normalizarTexto(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function limparCampo(v) {
  if (!v) return null;
  const s = v.trim();
  if (!s || s === "#NULO" || s === "#NE" || s === "-1" || s === "-3" || s === "-4") {
    return null;
  }
  return s;
}

function titleCasePt(str) {
  if (!str) return null;
  const minor = new Set(["de", "da", "do", "das", "dos", "e", "em", "a", "o"]);
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((w, idx) => {
      if (idx > 0 && minor.has(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

function parseCsvLine(line) {
  const fields = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ";" && !inQuotes) {
      fields.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

async function processarCsv(filePath, onRow) {
  const stream = fs.createReadStream(filePath, { encoding: "latin1" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let headers = null;
  for await (const line of rl) {
    if (!line) continue;
    const cols = parseCsvLine(line);
    if (!headers) {
      headers = cols;
      continue;
    }
    const row = {};
    for (let i = 0; i < headers.length; i++) {
      row[headers[i]] = cols[i] ?? "";
    }
    onRow(row);
  }
}

function parseValorBr(v) {
  if (!v) return 0;
  const n = Number(String(v).replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function garantirZips() {
  fs.mkdirSync(WORK_DIR, { recursive: true });
  fs.mkdirSync(EXTRACT_DIR, { recursive: true });

  const candZip = path.join(WORK_DIR, "consulta_cand_2024.zip");
  const bemZip = path.join(WORK_DIR, "bem_candidato_2024.zip");

  if (!fs.existsSync(candZip)) {
    console.log("Baixando consulta_cand_2024.zip...");
    execFileSync("curl", [
      "-L",
      "-sS",
      "https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2024.zip",
      "-o",
      candZip,
    ]);
  }
  if (!fs.existsSync(bemZip)) {
    console.log("Baixando bem_candidato_2024.zip...");
    execFileSync("curl", [
      "-L",
      "-sS",
      "https://cdn.tse.jus.br/estatistica/sead/odsele/bem_candidato/bem_candidato_2024.zip",
      "-o",
      bemZip,
    ]);
  }
  return { candZip, bemZip };
}

async function processarUf(uf, candZip, bemZip) {
  const candCsvName = `consulta_cand_2024_${uf}.csv`;
  const bemCsvName = `bem_candidato_2024_${uf}.csv`;
  const candCsvPath = path.join(EXTRACT_DIR, candCsvName);
  const bemCsvPath = path.join(EXTRACT_DIR, bemCsvName);

  if (!fs.existsSync(candCsvPath)) {
    execFileSync("tar", ["-xf", candZip, "-C", EXTRACT_DIR, candCsvName]);
  }
  if (!fs.existsSync(bemCsvPath)) {
    execFileSync("tar", ["-xf", bemZip, "-C", EXTRACT_DIR, bemCsvName]);
  }

  // Mapa por codigo TSE do municipio (SG_UE)
  const municipios = new Map();
  const eleitosPorSeq = new Map();
  const vicesPorChave = new Map(); // `${ue}:${nr}` -> vice

  await processarCsv(candCsvPath, (r) => {
    const cargo = r.CD_CARGO;
    if (cargo !== "11" && cargo !== "12" && cargo !== "13") return;

    const sit = r.CD_SIT_TOT_TURNO;
    if (sit !== "1" && sit !== "2" && sit !== "3") return;

    const ue = String(r.SG_UE || "").trim().padStart(5, "0");
    const nomeMun = limparCampo(r.NM_UE);
    if (!ue || !nomeMun) return;

    if (!municipios.has(ue)) {
      municipios.set(ue, {
        ue,
        nome: nomeMun,
        chave: normalizarTexto(nomeMun),
        prefeito: null,
        vereadores: [],
      });
    }
    const mun = municipios.get(ue);

    if (cargo === "12") {
      // Vice-prefeito eleito
      const nr = Number(r.NR_CANDIDATO) || 0;
      vicesPorChave.set(`${ue}:${nr}`, {
        nomeUrna: limparCampo(r.NM_URNA_CANDIDATO) || limparCampo(r.NM_CANDIDATO) || "Vice",
        nomeCompleto: limparCampo(r.NM_CANDIDATO) || "",
        partido: limparCampo(r.SG_PARTIDO) || "",
      });
      return;
    }

    const id = Number(r.SQ_CANDIDATO);
    if (!Number.isFinite(id)) return;

    const turno = Number(r.NR_TURNO) || 1;
    const totalizacao = titleCasePt(limparCampo(r.DS_SIT_TOT_TURNO)) || "Eleito";
    const coligacao = limparCampo(r.NM_COLIGACAO);
    const composicao = limparCampo(r.DS_COMPOSICAO_COLIGACAO);
    const cand = {
      id,
      nomeUrna: limparCampo(r.NM_URNA_CANDIDATO) || limparCampo(r.NM_CANDIDATO) || "",
      nomeCompleto: limparCampo(r.NM_CANDIDATO) || "",
      numero: Number(r.NR_CANDIDATO) || 0,
      partidoSigla: limparCampo(r.SG_PARTIDO) || "—",
      partidoNome: titleCasePt(limparCampo(r.NM_PARTIDO)),
      coligacao: coligacao && coligacao !== "PARTIDO ISOLADO" ? coligacao : null,
      composicaoColigacao:
        composicao && composicao !== "**" ? composicao : null,
      totalizacao,
      ocupacao: titleCasePt(limparCampo(r.DS_OCUPACAO)),
      grauInstrucao: titleCasePt(limparCampo(r.DS_GRAU_INSTRUCAO)),
      dataNascimento: limparCampo(r.DT_NASCIMENTO),
      ufNascimento: limparCampo(r.SG_UF_NASCIMENTO),
      totalDeBens: 0,
      bens: [],
      _turno: turno,
    };

    if (cargo === "11") {
      // Se houver 2o turno ou eleicao suplementar, prioriza turno maior / id maior
      if (
        !mun.prefeito ||
        turno > mun.prefeito._turno ||
        (turno === mun.prefeito._turno && id > mun.prefeito.id)
      ) {
        mun.prefeito = cand;
        eleitosPorSeq.set(String(id), cand);
      }
    } else if (cargo === "13") {
      if (!eleitosPorSeq.has(String(id))) {
        mun.vereadores.push(cand);
        eleitosPorSeq.set(String(id), cand);
      }
    }
  });

  // Enriquecer bens declarados apenas para os eleitos desta UF
  await processarCsv(bemCsvPath, (r) => {
    const seq = String(r.SQ_CANDIDATO || "").trim();
    const cand = eleitosPorSeq.get(seq);
    if (!cand) return;

    const valor = parseValorBr(r.VR_BEM_CANDIDATO);
    cand.totalDeBens = Math.round((cand.totalDeBens + valor) * 100) / 100;
    cand.bens.push({
      o: Number(r.NR_ORDEM_BEM_CANDIDATO) || cand.bens.length + 1,
      t: limparCampo(r.DS_TIPO_BEM_CANDIDATO) || "Bem declarado",
      d: (limparCampo(r.DS_BEM_CANDIDATO) || "").slice(0, 120),
      v: valor,
    });
  });

  // Montar payload compacto final
  const listaMunicipios = [];
  let totalPrefeitos = 0;
  let totalVereadores = 0;

  for (const mun of municipios.values()) {
    const compactarCand = (c, incluirVice) => {
      c.bens.sort((a, b) => b.v - a.v);
      const out = {
        id: c.id,
        nu: c.nomeUrna,
        nc: c.nomeCompleto,
        nr: c.numero,
        ps: c.partidoSigla,
        pn: c.partidoNome,
        col: c.coligacao,
        comp: c.composicaoColigacao,
        tot: c.totalizacao,
        oc: c.ocupacao,
        gi: c.grauInstrucao,
        dn: c.dataNascimento,
        ufn: c.ufNascimento,
        tb: c.totalDeBens,
        bens: c.bens.slice(0, 8),
      };
      if (incluirVice) {
        const vice = vicesPorChave.get(`${mun.ue}:${c.numero}`);
        if (vice) out.vice = vice;
      }
      return out;
    };

    const prefeitoOut = mun.prefeito ? compactarCand(mun.prefeito, true) : null;
    if (prefeitoOut) totalPrefeitos++;

    mun.vereadores.sort((a, b) => a.nomeUrna.localeCompare(b.nomeUrna, "pt-BR"));
    const vereadoresOut = mun.vereadores.map((v) => compactarCand(v, false));
    totalVereadores += vereadoresOut.length;

    listaMunicipios.push({
      ue: mun.ue,
      nome: mun.nome,
      chave: mun.chave,
      prefeito: prefeitoOut,
      vereadores: vereadoresOut,
    });
  }

  listaMunicipios.sort((a, b) => a.chave.localeCompare(b.chave));

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `${uf}.json.gz`);
  const payload = {
    uf,
    ano: 2024,
    eleicaoId: 2045202024,
    geradoEm: new Date().toISOString().slice(0, 10),
    municipios: listaMunicipios,
  };
  fs.writeFileSync(outPath, gzipSync(JSON.stringify(payload), { level: 9 }));

  // Limpa CSVs temporarios desta UF para economizar disco
  fs.unlinkSync(candCsvPath);
  fs.unlinkSync(bemCsvPath);

  const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(0);
  console.log(
    `${uf}: ${listaMunicipios.length} mun | ${totalPrefeitos} pref | ${totalVereadores} ver | ${sizeKb} KB`
  );
  return { municipios: listaMunicipios.length, prefeitos: totalPrefeitos, vereadores: totalVereadores };
}

async function main() {
  const { candZip, bemZip } = garantirZips();
  let tMun = 0;
  let tPref = 0;
  let tVer = 0;

  for (const uf of UFS) {
    const r = await processarUf(uf, candZip, bemZip);
    tMun += r.municipios;
    tPref += r.prefeitos;
    tVer += r.vereadores;
  }

  console.log(`\nCONCLUIDO: ${tMun} municipios | ${tPref} prefeitos | ${tVer} vereadores`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
