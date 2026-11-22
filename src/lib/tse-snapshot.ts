import fs from "node:fs/promises";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { normalizarTexto } from "@/lib/ufs";
import type {
  BemDeclaradoTSE,
  PerfilTSE,
  VereadorEleitoTSE,
} from "@/types/politicos";

const ELEICAO_2024_ANO = 2024;
const ELEICAO_2024_ID = 2045202024;

type SnapshotBem = {
  o: number;
  t: string;
  d: string;
  v: number;
};

type SnapshotVice = {
  nomeUrna: string;
  nomeCompleto: string;
  partido: string;
};

type SnapshotCand = {
  id: number;
  nu: string;
  nc: string;
  nr: number;
  ps: string;
  pn: string | null;
  col: string | null;
  comp: string | null;
  tot: string;
  oc: string | null;
  gi: string | null;
  dn: string | null;
  ufn: string | null;
  tb: number;
  bens: SnapshotBem[];
  vice?: SnapshotVice;
};

export type SnapshotMunicipio = {
  ue: string;
  nome: string;
  chave: string;
  prefeito: SnapshotCand | null;
  vereadores: SnapshotCand[];
};

type SnapshotUf = {
  uf: string;
  ano: number;
  eleicaoId: number;
  geradoEm: string;
  municipios: SnapshotMunicipio[];
};

const UFS_MUNICIPAIS = [
  "AC", "AL", "AM", "AP", "BA", "CE", "ES", "GO", "MA", "MG",
  "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO",
  "RR", "RS", "SC", "SE", "SP", "TO",
] as const;

const cacheUf = new Map<string, SnapshotUf | null>();
const cacheUeParaUf = new Map<string, string>();

export function normalizarFoneticoMunicipio(texto: string): string {
  return normalizarTexto(texto)
    .replace(/\b(de|do|da|dos|das|d)\b/g, " ")
    .replace(/th/g, "t")
    .replace(/ph/g, "f")
    .replace(/y/g, "i")
    .replace(/w/g, "v")
    .replace(/z/g, "s")
    .replace(/an$/g, "a")
    .replace(/([a-z])\1+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function distanciaLevenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

export function encontrarMelhorMunicipio<T extends { nome: string }>(
  lista: T[],
  nomeAlvo: string
): T | null {
  const alvo = normalizarTexto(nomeAlvo);
  if (!alvo) return null;

  // 1. Match exato normalizado
  const exato = lista.find((m) => normalizarTexto(m.nome) === alvo);
  if (exato) return exato;

  // 2. Match fonético (resolve Luiz/Luís, Euzébia/Eusébia, Tomé/Thomé, Barão do/de, Camacan/Camacã)
  const alvoFon = normalizarFoneticoMunicipio(nomeAlvo);
  const fonetico = lista.find(
    (m) => normalizarFoneticoMunicipio(m.nome) === alvoFon
  );
  if (fonetico) return fonetico;

  // 3. Menor distância de Levenshtein (com limiar estrito para evitar falsos positivos)
  const limite = alvo.length >= 8 ? 2 : 1;
  let melhor: T | null = null;
  let menorDist = limite + 1;

  for (const m of lista) {
    const normM = normalizarTexto(m.nome);
    if (Math.abs(normM.length - alvo.length) > limite) continue;
    const dist = distanciaLevenshtein(alvo, normM);
    if (dist < menorDist) {
      menorDist = dist;
      melhor = m;
    }
  }

  return melhor;
}

async function carregarSnapshotUf(uf: string): Promise<SnapshotUf | null> {
  const sigla = uf.toUpperCase().trim();
  if (sigla === "DF" || !/^[A-Z]{2}$/.test(sigla)) return null;

  if (cacheUf.has(sigla)) {
    return cacheUf.get(sigla) ?? null;
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "tse2024",
      `${sigla}.json.gz`
    );
    const compressed = await fs.readFile(filePath);
    const raw = gunzipSync(compressed).toString("utf8");
    const parsed = JSON.parse(raw) as SnapshotUf;
    cacheUf.set(sigla, parsed);
    for (const mun of parsed.municipios) {
      cacheUeParaUf.set(mun.ue, sigla);
    }
    return parsed;
  } catch {
    cacheUf.set(sigla, null);
    return null;
  }
}

function buildFotoUrl(candidatoId: number, ueCodigo: string): string {
  return `https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/${ELEICAO_2024_ID}/${candidatoId}/${ueCodigo}`;
}

function buildLinkOficial(candidatoId: number, ueCodigo: string): string {
  return `https://divulgacandcontas.tse.jus.br/divulga/#/candidato/${ELEICAO_2024_ANO}/${ELEICAO_2024_ID}/${ueCodigo}/${candidatoId}`;
}

function converterParaPerfilTse(
  cand: SnapshotCand,
  ueCodigo: string,
  cargo: "Prefeito" | "Vereador"
): PerfilTSE {
  const bens: BemDeclaradoTSE[] = (cand.bens ?? []).map((b) => ({
    ordem: b.o,
    tipo: b.t,
    descricao: b.d,
    valor: b.v,
  }));

  return {
    id: cand.id,
    ano: ELEICAO_2024_ANO,
    eleicaoId: ELEICAO_2024_ID,
    ueCodigo,
    nomeUrna: cand.nu,
    nomeCompleto: cand.nc,
    numero: cand.nr,
    cargo,
    partidoSigla: cand.ps,
    partidoNome: cand.pn,
    coligacao: cand.col,
    composicaoColigacao: cand.comp,
    situacaoCandidatura: "Apto",
    totalizacao: cand.tot,
    reeleicao: false,
    fotoUrl: buildFotoUrl(cand.id, ueCodigo),
    ocupacao: cand.oc,
    grauInstrucao: cand.gi,
    dataNascimento: cand.dn,
    naturalidade: cand.ufn ? `UF ${cand.ufn}` : null,
    totalDeBens: cand.tb,
    bens,
    vices: cand.vice
      ? [
          {
            nomeUrna: cand.vice.nomeUrna,
            nomeCompleto: cand.vice.nomeCompleto,
            partido: cand.vice.partido,
            fotoUrl: null,
          },
        ]
      : [],
    sites: [],
    gastoCampanha1T: null,
    planoDeGovernoUrl: null,
    eleicoesAnteriores: [],
    linkOficialTse: buildLinkOficial(cand.id, ueCodigo),
  };
}

export async function buscarMunicipioSnapshot(
  uf: string,
  nomeMunicipio: string
): Promise<SnapshotMunicipio | null> {
  const snap = await carregarSnapshotUf(uf);
  if (!snap) return null;
  return encontrarMelhorMunicipio(snap.municipios, nomeMunicipio);
}

export async function buscarPrefeitoSnapshot(
  uf: string,
  nomeMunicipio: string
): Promise<{ codigoTse: string | null; prefeito: PerfilTSE | null }> {
  const mun = await buscarMunicipioSnapshot(uf, nomeMunicipio);
  if (!mun) return { codigoTse: null, prefeito: null };
  if (!mun.prefeito) return { codigoTse: mun.ue, prefeito: null };

  return {
    codigoTse: mun.ue,
    prefeito: converterParaPerfilTse(mun.prefeito, mun.ue, "Prefeito"),
  };
}

export async function buscarVereadoresSnapshot(
  uf: string,
  nomeMunicipio: string
): Promise<{ codigoTse: string | null; vereadores: VereadorEleitoTSE[] }> {
  const mun = await buscarMunicipioSnapshot(uf, nomeMunicipio);
  if (!mun) return { codigoTse: null, vereadores: [] };

  const vereadores: VereadorEleitoTSE[] = mun.vereadores.map((v) => ({
    id: v.id,
    ano: ELEICAO_2024_ANO,
    eleicaoId: ELEICAO_2024_ID,
    ueCodigo: mun.ue,
    nomeUrna: v.nu,
    nomeCompleto: v.nc,
    numero: v.nr,
    partidoSigla: v.ps,
    coligacao: v.col,
    totalizacao: v.tot,
    reeleicao: false,
    fotoUrl: buildFotoUrl(v.id, mun.ue),
  }));

  return { codigoTse: mun.ue, vereadores };
}

export async function buscarCandidatoSnapshotPorId(
  ueCodigo: string,
  candidatoId: number,
  ufHint?: string
): Promise<PerfilTSE | null> {
  const ue = ueCodigo.trim().padStart(5, "0");

  const procurarNaUf = async (sigla: string): Promise<PerfilTSE | null> => {
    const snap = await carregarSnapshotUf(sigla);
    if (!snap) return null;
    const mun = snap.municipios.find((m) => m.ue === ue);
    if (!mun) return null;
    if (mun.prefeito && mun.prefeito.id === candidatoId) {
      return converterParaPerfilTse(mun.prefeito, mun.ue, "Prefeito");
    }
    const ver = mun.vereadores.find((v) => v.id === candidatoId);
    if (ver) {
      return converterParaPerfilTse(ver, mun.ue, "Vereador");
    }
    return null;
  };

  if (ufHint) {
    const hit = await procurarNaUf(ufHint);
    if (hit) return hit;
  }

  const ufMapeada = cacheUeParaUf.get(ue);
  if (ufMapeada) {
    const hit = await procurarNaUf(ufMapeada);
    if (hit) return hit;
  }

  for (const sigla of UFS_MUNICIPAIS) {
    if (sigla === ufHint || sigla === ufMapeada) continue;
    const hit = await procurarNaUf(sigla);
    if (hit) return hit;
  }

  return null;
}
