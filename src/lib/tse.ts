import { normalizarTexto } from "@/lib/ufs";
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

async function fetchTseJson<T>(path: string, timeoutMs = 12000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${TSE_BASE}${path}`, {
      headers: FETCH_HEADERS,
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      throw new Error(`TSE retornou HTTP ${res.status}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
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
  let lista = cacheMunicipiosPorUf.get(sigla);

  if (!lista) {
    const data = await fetchTseJson<{ municipios?: RawMunicipioTSE[] }>(
      `/eleicao/buscar/${encodeURIComponent(sigla)}/${ELEICAO_MUNICIPAL_2024.id}/municipios`
    );
    lista = data.municipios ?? [];
    cacheMunicipiosPorUf.set(sigla, lista);
  }

  const alvo = normalizarTexto(nomeMunicipio);
  const exato = lista.find((m) => normalizarTexto(m.nome) === alvo);
  if (exato) return exato.codigo;

  // Fallback para pequenas variações ortográficas (ex: Mogi Mirim / Moji Mirim)
  const parcial = lista.find(
    (m) =>
      normalizarTexto(m.nome).includes(alvo) ||
      alvo.includes(normalizarTexto(m.nome))
  );
  return parcial?.codigo ?? null;
}

async function listarCandidatosRaw(
  ano: number,
  ueCodigo: string,
  eleicaoId: number,
  cargoCodigo: number
): Promise<RawCandidatoLista[]> {
  const cacheKey = `${ano}:${ueCodigo}:${eleicaoId}:${cargoCodigo}`;
  const cached = cacheCandidatosLista.get(cacheKey);
  if (cached) return cached;

  const data = await fetchTseJson<{ candidatos?: RawCandidatoLista[] }>(
    `/candidatura/listar/${ano}/${encodeURIComponent(ueCodigo)}/${eleicaoId}/${cargoCodigo}/candidatos`,
    18000
  );
  const lista = data.candidatos ?? [];
  cacheCandidatosLista.set(cacheKey, lista);
  return lista;
}

export async function buscarDetalheCandidatoTse(
  ano: number,
  ueCodigo: string,
  eleicaoId: number,
  candidatoId: number
): Promise<PerfilTSE> {
  const raw = await fetchTseJson<RawCandidatoDetalhe>(
    `/candidatura/buscar/${ano}/${encodeURIComponent(ueCodigo)}/${eleicaoId}/candidato/${candidatoId}`
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

  const proposta = (raw.arquivos ?? []).find(
    (a) => a.codTipo === "5" || (a.nome && /proposta|plano/i.test(a.nome))
  );
  const planoDeGovernoUrl =
    proposta?.url && proposta?.nome
      ? `https://divulgacandcontas.tse.jus.br/${proposta.url.replace(/^\/+/, "")}${encodeURIComponent(proposta.nome)}`
      : null;

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

  return {
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
    linkOficialTse: buildLinkOficialTse(ano, eleicaoId, ueCodigo, raw.id),
  };
}

export async function buscarPrefeitoEleitoTse(
  uf: string,
  nomeMunicipio: string
): Promise<{ codigoTse: string | null; prefeito: PerfilTSE | null }> {
  const codigoTse = await buscarCodigoMunicipioTse(uf, nomeMunicipio);
  if (!codigoTse) return { codigoTse: null, prefeito: null };

  const lista = await listarCandidatosRaw(
    ELEICAO_MUNICIPAL_2024.ano,
    codigoTse,
    ELEICAO_MUNICIPAL_2024.id,
    11
  );

  const eleito = lista.find((c) => isEleito(c.descricaoTotalizacao));
  if (!eleito) return { codigoTse, prefeito: null };

  const detalhe = await buscarDetalheCandidatoTse(
    ELEICAO_MUNICIPAL_2024.ano,
    codigoTse,
    ELEICAO_MUNICIPAL_2024.id,
    eleito.id
  );
  return { codigoTse, prefeito: detalhe };
}

export async function buscarVereadoresEleitosTse(
  uf: string,
  nomeMunicipio: string
): Promise<{ codigoTse: string | null; vereadores: VereadorEleitoTSE[] }> {
  const codigoTse = await buscarCodigoMunicipioTse(uf, nomeMunicipio);
  if (!codigoTse) return { codigoTse: null, vereadores: [] };

  const lista = await listarCandidatosRaw(
    ELEICAO_MUNICIPAL_2024.ano,
    codigoTse,
    ELEICAO_MUNICIPAL_2024.id,
    13
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

  return { codigoTse, vereadores: eleitos };
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
      const lista = await listarCandidatosRaw(pleito.ano, sigla, pleito.id, 3);
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
        escolhido.id
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
        cargoCodigo
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
        melhor.id
      );
    } catch {
      return null;
    }
  };

  const perfil2022 = await tentarPleito(ELEICAO_GERAL_2022);
  if (perfil2022) return perfil2022;
  return tentarPleito(ELEICAO_GERAL_2026);
}
