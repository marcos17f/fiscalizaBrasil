import type { VotacaoNominalCamara } from "@/types/politicos";

const CAMARA_BASE = "https://dadosabertos.camara.leg.br/api/v2";

type RawVotacaoLista = {
  id: string;
  data: string;
  proposicaoObjeto?: string | null;
  descricao?: string | null;
  aprovacao?: number | null;
};

type RawVotoIndividual = {
  tipoVoto?: string;
  deputado_?: { id?: number };
};

type VotacaoIndexada = {
  idVotacao: string;
  data: string;
  proposicao: string;
  descricao: string;
  aprovacao: number | null;
  votosPorDeputado: Map<number, string>;
};

let cacheVotacoesPlenario: {
  loadedAt: number;
  lista: VotacaoIndexada[];
} | null = null;
let promiseVotacoesEmVoo: Promise<VotacaoIndexada[]> | null = null;

async function fetchCamara<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function carregarVotacoesNominaisRecentes(): Promise<VotacaoIndexada[]> {
  if (
    cacheVotacoesPlenario &&
    Date.now() - cacheVotacoesPlenario.loadedAt < 3_600_000
  ) {
    return cacheVotacoesPlenario.lista;
  }
  if (promiseVotacoesEmVoo) return promiseVotacoesEmVoo;

  promiseVotacoesEmVoo = (async () => {
    const listRaw = await fetchCamara<{ dados?: RawVotacaoLista[] }>(
      `${CAMARA_BASE}/votacoes?idOrgao=180&ordem=DESC&ordenarPor=dataHoraRegistro&itens=40`
    );

    const candidatas = (listRaw?.dados ?? []).slice(0, 24);
    const indexadas: VotacaoIndexada[] = [];

    // Busca em lotes paralelos de 6 até juntar 8 votações nominais com voto individual
    for (let i = 0; i < candidatas.length && indexadas.length < 8; i += 6) {
      const lote = candidatas.slice(i, i + 6);
      const resultados = await Promise.all(
        lote.map(async (v) => {
          const votosRaw = await fetchCamara<{ dados?: RawVotoIndividual[] }>(
            `${CAMARA_BASE}/votacoes/${encodeURIComponent(v.id)}/votos`
          );
          const votos = votosRaw?.dados ?? [];
          if (votos.length === 0) return null;

          const mapa = new Map<number, string>();
          for (const item of votos) {
            if (item.deputado_?.id && item.tipoVoto) {
              mapa.set(item.deputado_.id, item.tipoVoto);
            }
          }
          if (mapa.size === 0) return null;

          return {
            idVotacao: v.id,
            data: v.data,
            proposicao: v.proposicaoObjeto ?? "Votação em Plenário",
            descricao: v.descricao ?? "",
            aprovacao: typeof v.aprovacao === "number" ? v.aprovacao : null,
            votosPorDeputado: mapa,
          } satisfies VotacaoIndexada;
        })
      );

      for (const r of resultados) {
        if (r) indexadas.push(r);
      }
    }

    cacheVotacoesPlenario = { loadedAt: Date.now(), lista: indexadas };
    promiseVotacoesEmVoo = null;
    return indexadas;
  })();

  return promiseVotacoesEmVoo;
}

export async function buscarVotacoesNominaisDeputado(
  deputadoId: number
): Promise<VotacaoNominalCamara[]> {
  const todas = await carregarVotacoesNominaisRecentes();
  const doDeputado: VotacaoNominalCamara[] = [];

  for (const v of todas) {
    const voto = v.votosPorDeputado.get(deputadoId);
    if (!voto) continue;
    doDeputado.push({
      idVotacao: v.idVotacao,
      data: v.data,
      proposicao: v.proposicao,
      descricao: v.descricao,
      voto,
      aprovacao: v.aprovacao,
    });
  }

  return doDeputado;
}
