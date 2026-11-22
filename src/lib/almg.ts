import { normalizarTexto } from "@/lib/ufs";
import type { DadosAlmgDeputado, ItemVerbaAlmg } from "@/types/politicos";

const ALMG_BASE = "https://dadosabertos.almg.gov.br/ws";

type RawAlmgListaItem = {
  id: number;
  nome: string;
  partido: string;
};

type RawAlmgDetalhe = {
  deputado?: {
    id: number;
    nome: string;
    situacao?: string;
    atividadeProfissional?: string;
    naturalidadeMunicipio?: string;
    naturalidadeUf?: string;
    emails?: Array<{ endereco?: string }>;
  };
};

type RawAlmgDatas = {
  listaFechamentoVerba?: Array<{ dataReferencia?: string }>;
};

type RawAlmgVerba = {
  list?: Array<{ descTipoDespesa?: string; valor?: number }>;
};

let cacheListaAlmg: RawAlmgListaItem[] | null = null;

async function fetchAlmg<T>(path: string): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(`${ALMG_BASE}${path}`, {
      headers: {
        "User-Agent": "FiscalizaBrasil/1.0 (+https://fiscalizabrasil.org)",
        Accept: "application/json",
      },
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

export async function buscarDadosAlmgDeputado(
  nomeParlamentar: string
): Promise<DadosAlmgDeputado | null> {
  if (!cacheListaAlmg) {
    const data = await fetchAlmg<{ list?: RawAlmgListaItem[] }>(
      "/deputados/em_exercicio?formato=json"
    );
    cacheListaAlmg = data?.list ?? [];
  }

  const alvo = normalizarTexto(nomeParlamentar);
  const encontrado =
    cacheListaAlmg.find((d) => normalizarTexto(d.nome) === alvo) ??
    cacheListaAlmg.find(
      (d) =>
        normalizarTexto(d.nome).includes(alvo) ||
        alvo.includes(normalizarTexto(d.nome))
    );

  if (!encontrado) return null;

  const [detalheData, datasData] = await Promise.all([
    fetchAlmg<RawAlmgDetalhe>(`/deputados/${encontrado.id}?formato=json`),
    fetchAlmg<RawAlmgDatas>(
      `/prestacao_contas/verbas_indenizatorias/deputados/${encontrado.id}/datas?formato=json`
    ),
  ]);

  const dep = detalheData?.deputado;
  const emailRaw = dep?.emails?.[0]?.endereco;
  const email = emailRaw
    ? emailRaw.includes("@")
      ? emailRaw
      : `${emailRaw}@almg.gov.br`
    : null;

  const naturalidade =
    dep?.naturalidadeMunicipio && dep?.naturalidadeUf
      ? `${dep.naturalidadeMunicipio}/${dep.naturalidadeUf}`
      : null;

  const datas = (datasData?.listaFechamentoVerba ?? [])
    .map((d) => d.dataReferencia)
    .filter((d): d is string => Boolean(d))
    .sort();

  const ultimaData = datas.at(-1) ?? null;
  let itensVerba: ItemVerbaAlmg[] = [];
  let totalVerbaMes: number | null = null;
  let mesReferenciaVerba: string | null = null;

  if (ultimaData) {
    const match = /^(\d{4})-(\d{2})/.exec(ultimaData);
    if (match) {
      const [, ano, mes] = match;
      mesReferenciaVerba = `${mes}/${ano}`;
      const verbaData = await fetchAlmg<RawAlmgVerba>(
        `/prestacao_contas/verbas_indenizatorias/deputados/${encontrado.id}/${ano}/${mes}?formato=json`
      );
      itensVerba = (verbaData?.list ?? [])
        .map((v) => ({
          categoria: v.descTipoDespesa ?? "Outras despesas",
          valor: typeof v.valor === "number" ? v.valor : 0,
        }))
        .filter((v) => v.valor > 0)
        .sort((a, b) => b.valor - a.valor);
      totalVerbaMes = itensVerba.reduce((acc, item) => acc + item.valor, 0);
    }
  }

  return {
    idAlmg: encontrado.id,
    nome: dep?.nome ?? encontrado.nome,
    situacao: dep?.situacao ?? "Em exercício",
    atividadeProfissional: dep?.atividadeProfissional ?? null,
    email,
    naturalidade,
    mesReferenciaVerba,
    totalVerbaMes,
    itensVerba,
    portalUrl: `https://www.almg.gov.br/deputados/conheca_os_deputados/deputados-info.html?idDep=${encontrado.id}`,
  };
}
