import { normalizarTexto } from "@/lib/ufs";
import {
  buscarCandidatoSnapshotPorId,
  buscarPrefeitoSnapshot,
  buscarVereadoresSnapshot,
  encontrarMelhorMunicipio,
} from "@/lib/tse-snapshot";
import type {
  BemDeclaradoTSE,
  EleicaoAnteriorTSE,
  PerfilTSE,
  VereadorEleitoTSE,
  ViceTSE,
} from "@/types/politicos";

const TSE_BASE = "https://divulgacandcontas.tse.jus.br/divulga/rest/v1";

export const ELEICAO_MUNICIPAL_2024 = { ano: 2024, id: 2045202024 } as const;
export const ELEICAO_GERAL_2022 = { ano: 2022, id: 2040602022 } as const;
export const ELEICAO_GERAL_2026 = { ano: 2026, id: 20322002026 } as const;

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "pt-BR,pt;q=0.9",
  Referer: "https://divulgacandcontas.tse.jus.br/divulga/",
};

type RawMunicipioTSE = {
  codigo: string;
  nome: string;
};

type RawCandidatoLista = {
  id: number;
  nomeUrna: string;
  nomeCompleto: string;
  numero: number;
  descricaoSituacao?: string | null;
  descricaoTotalizacao?: string | null;
  nomeColigacao?: string | null;
  st_REELEICAO?: boolean | null;
  partido?: { sigla?: string | null; nome?: string | null } | null;
  cargo?: { nome?: string | null } | null;
};

type RawBem = {
  ordem?: number;
  descricaoDeTipoDeBem?: string | null;
  descricao?: string | null;
  valor?: number | null;
};

type RawVice = {
  nm_URNA?: string | null;
  nm_CANDIDATO?: string | null;
  sg_PARTIDO?: string | null;
  urlFoto?: string | null;
};

type RawArquivo = {
  nome?: string | null;
  url?: string | null;
  codTipo?: string | null;
};

type RawEleicaoAnterior = {
  nrAno?: number;
  cargo?: string | null;
  partido?: string | null;
  situacaoTotalizacao?: string | null;
  local?: string | null;
};

type RawCandidatoDetalhe = RawCandidatoLista & {
  fotoUrl?: string | null;
  composicaoColigacao?: string | null;
  ocupacao?: string | null;
  grauInstrucao?: string | null;
  dataDeNascimento?: string | null;
  nomeMunicipioNascimento?: string | null;
  sgUfNascimento?: string | null;
  totalDeBens?: number | null;
  bens?: RawBem[] | null;
  vices?: RawVice[] | null;
  sites?: string[] | null;
  gastoCampanha1T?: number | null;
  arquivos?: RawArquivo[] | null;
  eleicoesAnteriores?: RawEleicaoAnterior[] | null;
};

const cacheMunicipiosPorUf = new Map<string, RawMunicipioTSE[]>();
const cacheCandidatosLista = new Map<string, RawCandidatoLista[]>();
const cacheDetalheCandidato = new Map<string, PerfilTSE>();

async function fetchTseJson<T>(
  path: string,
  timeoutMs = 7000,
  tentativas = 2
): Promise<T> {
  let ultimoErro: unknown;

  for (let i = 0; i < tentativas; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`${TSE_BASE}${path}`, {
        headers: FETCH_HEADERS,
        signal: controller.signal,
        cache: "no-store",
      });
      if (!res.ok) {
        const err = new Error(`TSE retornou HTTP ${res.status}`);
        // Não faz retry em bloqueio WAF (403) ou recurso inexistente (404)
        if (res.status === 403 || res.status === 404 || res.status === 400) {
          throw err;
        }
        ultimoErro = err;
        continue;
      }
      return (await res.json()) as T;
    } catch (err) {
      ultimoErro = err;
      if (err instanceof Error && /HTTP 40[034]/.test(err.message)) {
        throw err;
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw ultimoErro instanceof Error
    ? ultimoErro
    : new Error("Falha ao consultar API do TSE");
}

export function isEleito(totalizacao?: string | null): boolean {
  if (!totalizacao) return false;
  return totalizacao.trim().toLowerCase().startsWith("eleit");
}

export function buildFotoUrlTse(
  eleicaoId: number,
  candidatoId: number,
  ueCodigo: string
): string {
  return `https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/${eleicaoId}/${candidatoId}/${ueCodigo}`;
}

export function buildLinkOficialTse(
  ano: number,
  eleicaoId: number,
  ueCodigo: string,
  candidatoId: number
): string {
  return `https://divulgacandcontas.tse.jus.br/divulga/#/candidato/${ano}/${eleicaoId}/${ueCodigo}/${candidatoId}`;
}

export async function buscarCodigoMunicipioTse(
  uf: string,
  nomeMunicipio: string
): Promise<string | null> {
  const sigla = uf.toUpperCase().trim();
  if (sigla === "DF") return null;

  let lista = cacheMunicipiosPorUf.get(sigla);

  if (!lista) {
    const data = await fetchTseJson<{ municipios?: RawMunicipioTSE[] }>(
      `/eleicao/buscar/${encodeURIComponent(sigla)}/${ELEICAO_MUNICIPAL_2024.id}/municipios`,
      7000
    );
    lista = data.municipios ?? [];
    cacheMunicipiosPorUf.set(sigla, lista);
  }

  const encontrado = encontrarMelhorMunicipio(lista, nomeMunicipio);
  return encontrado?.codigo ?? null;
}

async function listarCandidatosRaw(
  ano: number,
  ueCodigo: string,
  eleicaoId: number,
  cargoCodigo: number,
  timeoutMs = 12000
): Promise<RawCandidatoLista[]> {
  const cacheKey = `${ano}:${ueCodigo}:${eleicaoId}:${cargoCodigo}`;
  const cached = cacheCandidatosLista.get(cacheKey);
  if (cached) return cached;

  const data = await fetchTseJson<{ candidatos?: RawCandidatoLista[] }>(
    `/candidatura/listar/${ano}/${encodeURIComponent(ueCodigo)}/${eleicaoId}/${cargoCodigo}/candidatos`,
    timeoutMs
  );
  const lista = data.candidatos ?? [];
  cacheCandidatosLista.set(cacheKey, lista);
  return lista;
}

export async function buscarDetalheCandidatoTse(
  ano: number,
  ueCodigo: string,
  eleicaoId: number,
  candidatoId: number,
  ufHint?: string
): Promise<PerfilTSE> {
  const cacheKey = `${ano}:${ueCodigo}:${eleicaoId}:${candidatoId}`;
  const cached = cacheDetalheCandidato.get(cacheKey);
  if (cached) return cached;

  try {
    const raw = await fetchTseJson<RawCandidatoDetalhe>(
      `/candidatura/buscar/${ano}/${encodeURIComponent(ueCodigo)}/${eleicaoId}/candidato/${candidatoId}`,
      6000,
      1
    );

    const bens: BemDeclaradoTSE[] = (raw.bens ?? [])
      .map((b, idx) => ({
        ordem: b.ordem ?? idx + 1,
        tipo: b.descricaoDeTipoDeBem ?? "Bem declarado",
        descricao: b.descricao ?? "",
        valor: typeof b.valor === "number" ? b.valor : 0,
      }))
      .sort((a, b) => b.valor - a.valor);

    const vices: ViceTSE[] = (raw.vices ?? []).map((v) => ({
      nomeUrna: v.nm_URNA ?? v.nm_CANDIDATO ?? "Vice",
      nomeCompleto: v.nm_CANDIDATO ?? v.nm_URNA ?? "",
      partido: v.sg_PARTIDO ?? "",
      fotoUrl: v.urlFoto ?? null,
    }));

    const linkOficialTse = buildLinkOficialTse(
      ano,
      eleicaoId,
      ueCodigo,
      raw.id
    );

    const temProposta = (raw.arquivos ?? []).some(
      (a) => a.codTipo === "5" || (a.nome && /proposta|plano/i.test(a.nome))
    );
    // O download direto /candidaturas/oficial/*.pdf retorna HTTP 403 pelo WAF do TSE.
    // Direcionamos para a ficha oficial no DivulgaCandContas onde o PDF abre sem bloqueio.
    const planoDeGovernoUrl = temProposta ? linkOficialTse : null;

    const eleicoesAnteriores: EleicaoAnteriorTSE[] = (
      raw.eleicoesAnteriores ?? []
    )
      .map((e) => ({
        ano: e.nrAno ?? 0,
        cargo: e.cargo ?? "—",
        partido: e.partido ?? "—",
        situacaoTotalizacao: e.situacaoTotalizacao ?? "—",
        local: e.local ?? "—",
      }))
      .sort((a, b) => b.ano - a.ano);

    const naturalidade =
      raw.nomeMunicipioNascimento && raw.sgUfNascimento
        ? `${raw.nomeMunicipioNascimento}/${raw.sgUfNascimento}`
        : null;

    const sitesLimpos = (raw.sites ?? []).filter(
      (s) => typeof s === "string" && /^https?:\/\//i.test(s.trim())
    );

    const perfil: PerfilTSE = {
      id: raw.id,
      ano,
      eleicaoId,
      ueCodigo,
      nomeUrna: raw.nomeUrna,
      nomeCompleto: raw.nomeCompleto,
      numero: raw.numero,
      cargo: raw.cargo?.nome ?? "",
      partidoSigla: raw.partido?.sigla ?? "",
      partidoNome: raw.partido?.nome ?? null,
      coligacao: raw.nomeColigacao ?? null,
      composicaoColigacao:
        raw.composicaoColigacao && raw.composicaoColigacao !== "**"
          ? raw.composicaoColigacao
          : null,
      situacaoCandidatura: raw.descricaoSituacao ?? null,
      totalizacao: raw.descricaoTotalizacao ?? null,
      reeleicao: Boolean(raw.st_REELEICAO),
      fotoUrl: raw.fotoUrl ?? buildFotoUrlTse(eleicaoId, raw.id, ueCodigo),
      ocupacao: raw.ocupacao ?? null,
      grauInstrucao: raw.grauInstrucao ?? null,
      dataNascimento: raw.dataDeNascimento ?? null,
      naturalidade,
      totalDeBens: typeof raw.totalDeBens === "number" ? raw.totalDeBens : 0,
      bens,
      vices,
      sites: sitesLimpos,
      gastoCampanha1T:
        typeof raw.gastoCampanha1T === "number" && raw.gastoCampanha1T > 0
          ? raw.gastoCampanha1T
          : null,
      planoDeGovernoUrl,
      eleicoesAnteriores,
      linkOficialTse,
    };

    cacheDetalheCandidato.set(cacheKey, perfil);
    return perfil;
  } catch (err) {
    // Fallback automático para a base oficial do Portal de Dados Abertos TSE 2024
    if (ano === ELEICAO_MUNICIPAL_2024.ano) {
      const snap = await buscarCandidatoSnapshotPorId(
        ueCodigo,
        candidatoId,
        ufHint
      );
      if (snap) return snap;
    }
    throw err;
  }
}

export async function buscarPrefeitoEleitoTse(
  uf: string,
  nomeMunicipio: string
): Promise<{
  codigoTse: string | null;
  prefeito: PerfilTSE | null;
  origem: "ao-vivo" | "dados-abertos" | null;
}> {
  const sigla = uf.toUpperCase().trim();
  if (sigla === "DF") {
    return { codigoTse: null, prefeito: null, origem: null };
  }

  // 1. Base oficial local do Portal de Dados Abertos TSE 2024 (< 5ms, imune a WAF 403)
  const snapshot = await buscarPrefeitoSnapshot(sigla, nomeMunicipio);

  // 2. Se já temos o prefeito no snapshot, tentamos enriquecer ao vivo (histórico/teto) com timeout curto
  if (snapshot.codigoTse && snapshot.prefeito) {
    try {
      const aoVivo = await buscarDetalheCandidatoTse(
        ELEICAO_MUNICIPAL_2024.ano,
        snapshot.codigoTse,
        ELEICAO_MUNICIPAL_2024.id,
        snapshot.prefeito.id,
        sigla
      );
      return {
        codigoTse: snapshot.codigoTse,
        prefeito: aoVivo,
        origem:
          aoVivo.eleicoesAnteriores.length > 0 || aoVivo.gastoCampanha1T
            ? "ao-vivo"
            : "dados-abertos",
      };
    } catch {
      return {
        codigoTse: snapshot.codigoTse,
        prefeito: snapshot.prefeito,
        origem: "dados-abertos",
      };
    }
  }

  // 3. Fallback completo via API ao vivo se o município não estiver no snapshot
  try {
    const codigoTse = await buscarCodigoMunicipioTse(sigla, nomeMunicipio);
    if (!codigoTse) return { codigoTse: null, prefeito: null, origem: null };

    const lista = await listarCandidatosRaw(
      ELEICAO_MUNICIPAL_2024.ano,
      codigoTse,
      ELEICAO_MUNICIPAL_2024.id,
      11,
      8000
    );

    const eleito = lista.find((c) => isEleito(c.descricaoTotalizacao));
    if (!eleito) return { codigoTse, prefeito: null, origem: null };

    const detalhe = await buscarDetalheCandidatoTse(
      ELEICAO_MUNICIPAL_2024.ano,
      codigoTse,
      ELEICAO_MUNICIPAL_2024.id,
      eleito.id,
      sigla
    );
    return { codigoTse, prefeito: detalhe, origem: "ao-vivo" };
  } catch {
    return {
      codigoTse: snapshot.codigoTse,
      prefeito: snapshot.prefeito,
      origem: snapshot.prefeito ? "dados-abertos" : null,
    };
  }
}

export async function buscarVereadoresEleitosTse(
  uf: string,
  nomeMunicipio: string
): Promise<{
  codigoTse: string | null;
  vereadores: VereadorEleitoTSE[];
  origem: "ao-vivo" | "dados-abertos" | null;
}> {
  const sigla = uf.toUpperCase().trim();
  if (sigla === "DF") {
    return { codigoTse: null, vereadores: [], origem: null };
  }

  // 1. Snapshot oficial do Portal de Dados Abertos TSE 2024 (< 5ms, evita payloads > 2 MB e WAF 403)
  const snapshot = await buscarVereadoresSnapshot(sigla, nomeMunicipio);
  if (snapshot.codigoTse && snapshot.vereadores.length > 0) {
    return {
      codigoTse: snapshot.codigoTse,
      vereadores: snapshot.vereadores,
      origem: "dados-abertos",
    };
  }

  // 2. Fallback para API ao vivo do TSE
  const codigoTse =
    snapshot.codigoTse ?? (await buscarCodigoMunicipioTse(sigla, nomeMunicipio));
  if (!codigoTse) return { codigoTse: null, vereadores: [], origem: null };

  const lista = await listarCandidatosRaw(
    ELEICAO_MUNICIPAL_2024.ano,
    codigoTse,
    ELEICAO_MUNICIPAL_2024.id,
    13,
    15000
  );

  const eleitos: VereadorEleitoTSE[] = lista
    .filter((c) => isEleito(c.descricaoTotalizacao))
    .map((c) => ({
      id: c.id,
      ano: ELEICAO_MUNICIPAL_2024.ano,
      eleicaoId: ELEICAO_MUNICIPAL_2024.id,
      ueCodigo: codigoTse,
      nomeUrna: c.nomeUrna,
      nomeCompleto: c.nomeCompleto,
      numero: c.numero,
      partidoSigla: c.partido?.sigla ?? "—",
      coligacao: c.nomeColigacao ?? null,
      totalizacao: c.descricaoTotalizacao ?? "Eleito",
      reeleicao: Boolean(c.st_REELEICAO),
      fotoUrl: buildFotoUrlTse(ELEICAO_MUNICIPAL_2024.id, c.id, codigoTse),
    }))
    .sort((a, b) => a.nomeUrna.localeCompare(b.nomeUrna, "pt-BR"));

  return { codigoTse, vereadores: eleitos, origem: "ao-vivo" };
}

function casarPorNome(candidato: RawCandidatoLista, nomeAlvo: string): number {
  const alvo = normalizarTexto(nomeAlvo);
  const urna = normalizarTexto(candidato.nomeUrna);
  const completo = normalizarTexto(candidato.nomeCompleto);

  if (urna === alvo || completo === alvo) return 100;
  if (urna.includes(alvo) || alvo.includes(urna)) return 80;
  if (completo.includes(alvo)) return 75;

  const tokensAlvo = alvo.split(" ").filter((t) => t.length > 2);
  if (tokensAlvo.length === 0) return 0;
  const acertosUrna = tokensAlvo.filter((t) => urna.includes(t)).length;
  const acertosComp = tokensAlvo.filter((t) => completo.includes(t)).length;
  const melhor = Math.max(acertosUrna, acertosComp);
  if (melhor === tokensAlvo.length) return 70;
  if (tokensAlvo.length >= 2 && melhor >= tokensAlvo.length - 1) return 45;
  return 0;
}

export async function buscarGovernadorTse(
  uf: string,
  nomeReferencia?: string
): Promise<{ eleicao2022: PerfilTSE | null; eleicao2026: PerfilTSE | null }> {
  const sigla = uf.toUpperCase().trim();

  const buscarPorPleito = async (
    pleito: typeof ELEICAO_GERAL_2022 | typeof ELEICAO_GERAL_2026
  ): Promise<PerfilTSE | null> => {
    try {
      const lista = await listarCandidatosRaw(
        pleito.ano,
        sigla,
        pleito.id,
        3,
        10000
      );
      let escolhido: RawCandidatoLista | undefined;

      if (nomeReferencia) {
        const ranqueados = lista
          .map((c) => ({ c, score: casarPorNome(c, nomeReferencia) }))
          .filter((x) => x.score >= 70)
          .sort((a, b) => b.score - a.score);
        escolhido = ranqueados[0]?.c;
      }

      if (!escolhido) {
        escolhido = lista.find((c) => isEleito(c.descricaoTotalizacao));
      }

      if (!escolhido) return null;
      return await buscarDetalheCandidatoTse(
        pleito.ano,
        sigla,
        pleito.id,
        escolhido.id,
        sigla
      );
    } catch {
      return null;
    }
  };

  const [eleicao2022, eleicao2026] = await Promise.all([
    buscarPorPleito(ELEICAO_GERAL_2022),
    buscarPorPleito(ELEICAO_GERAL_2026),
  ]);

  return { eleicao2022, eleicao2026 };
}

export async function buscarDeputadoEstadualTse(
  uf: string,
  nomeParlamentar: string
): Promise<PerfilTSE | null> {
  const sigla = uf.toUpperCase().trim();
  const cargoCodigo = sigla === "DF" ? 8 : 7;

  const tentarPleito = async (
    pleito: typeof ELEICAO_GERAL_2022 | typeof ELEICAO_GERAL_2026
  ): Promise<PerfilTSE | null> => {
    try {
      const lista = await listarCandidatosRaw(
        pleito.ano,
        sigla,
        pleito.id,
        cargoCodigo,
        12000
      );
      const candidatosComScore = lista
        .map((c) => {
          const base = casarPorNome(c, nomeParlamentar);
          const bonusEleito = isEleito(c.descricaoTotalizacao) ? 15 : 0;
          return { c, score: base > 0 ? base + bonusEleito : 0 };
        })
        .filter((x) => x.score >= 60)
        .sort((a, b) => b.score - a.score);

      const melhor = candidatosComScore[0]?.c;
      if (!melhor) return null;

      return await buscarDetalheCandidatoTse(
        pleito.ano,
        sigla,
        pleito.id,
        melhor.id,
        sigla
      );
    } catch {
      return null;
    }
  };

  const perfil2022 = await tentarPleito(ELEICAO_GERAL_2022);
  if (perfil2022) return perfil2022;
  return tentarPleito(ELEICAO_GERAL_2026);
}
