import type {
  AutoriaSenador,
  ComissaoSenador,
  DespesaCeapsSenador,
  ResumoCeapsSenador,
  VotacaoSenador,
} from "@/types/politicos";

const SENADO_LEGIS_BASE = "https://legis.senado.leg.br/dadosabertos";
const SENADO_ADM_BASE = "https://adm.senado.gov.br/adm-dadosabertos/api/v1";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36",
  Accept: "application/json",
};

function toArray<T>(val: T | T[] | undefined | null): T[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

async function fetchJson<T>(url: string, timeoutMs = 12000): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: HEADERS,
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

type RawAutoria = {
  Materia?: {
    Codigo?: string;
    DescricaoIdentificacao?: string;
    Sigla?: string;
    Numero?: string;
    Ano?: string;
    Ementa?: string;
    Data?: string;
  };
};

type RawVotacao = {
  CodigoSessaoVotacao?: string;
  SessaoPlenaria?: { DataSessao?: string };
  Materia?: {
    DescricaoIdentificacao?: string;
    Ementa?: string;
  };
  DescricaoVotacao?: string;
  DescricaoResultado?: string;
  SiglaDescricaoVoto?: string;
};

type RawComissao = {
  IdentificacaoComissao?: {
    SiglaComissao?: string;
    NomeComissao?: string;
  };
  DescricaoParticipacao?: string;
  DataInicio?: string;
  DataFim?: string;
};

type RawCeapsItem = {
  id: number;
  ano: number;
  mes: number;
  codSenador: number;
  tipoDespesa?: string;
  fornecedor?: string;
  data?: string;
  detalhamento?: string;
  valorReembolsado?: number;
};

// Cache anual da CEAPS indexado por codSenador (evita baixar 9 MB a cada request)
const cacheCeapsPorAno = new Map<
  number,
  { loadedAt: number; porSenador: Map<number, RawCeapsItem[]> }
>();
const promiseCeapsEmVoo = new Map<number, Promise<Map<number, RawCeapsItem[]>>>();

async function carregarIndiceCeaps(ano: number): Promise<Map<number, RawCeapsItem[]>> {
  const cached = cacheCeapsPorAno.get(ano);
  if (cached && Date.now() - cached.loadedAt < 3_600_000) {
    return cached.porSenador;
  }

  const emVoo = promiseCeapsEmVoo.get(ano);
  if (emVoo) return emVoo;

  const p = (async () => {
    const lista = await fetchJson<RawCeapsItem[]>(
      `${SENADO_ADM_BASE}/senadores/despesas_ceaps/${ano}`,
      18000
    );
    const mapa = new Map<number, RawCeapsItem[]>();
    if (Array.isArray(lista)) {
      for (const item of lista) {
        const cod = Number(item.codSenador);
        if (!Number.isFinite(cod)) continue;
        const arr = mapa.get(cod);
        if (arr) arr.push(item);
        else mapa.set(cod, [item]);
      }
    }
    cacheCeapsPorAno.set(ano, { loadedAt: Date.now(), porSenador: mapa });
    promiseCeapsEmVoo.delete(ano);
    return mapa;
  })();

  promiseCeapsEmVoo.set(ano, p);
  return p;
}

export async function buscarAutoriasSenador(
  codigo: string
): Promise<AutoriaSenador[]> {
  // Tenta 2026 e 2025 em paralelo para sempre ter atividade recente
  const [raw26, raw25] = await Promise.all([
    fetchJson<{
      MateriasAutoriaParlamentar?: {
        Parlamentar?: { Autorias?: { Autoria?: RawAutoria | RawAutoria[] } };
      };
    }>(`${SENADO_LEGIS_BASE}/senador/${encodeURIComponent(codigo)}/autorias?ano=2026`),
    fetchJson<{
      MateriasAutoriaParlamentar?: {
        Parlamentar?: { Autorias?: { Autoria?: RawAutoria | RawAutoria[] } };
      };
    }>(`${SENADO_LEGIS_BASE}/senador/${encodeURIComponent(codigo)}/autorias?ano=2025`),
  ]);

  const itens = [
    ...toArray(raw26?.MateriasAutoriaParlamentar?.Parlamentar?.Autorias?.Autoria),
    ...toArray(raw25?.MateriasAutoriaParlamentar?.Parlamentar?.Autorias?.Autoria),
  ];

  const vistos = new Set<string>();
  const resultado: AutoriaSenador[] = [];

  for (const a of itens) {
    const m = a.Materia;
    if (!m?.Codigo || vistos.has(m.Codigo)) continue;
    vistos.add(m.Codigo);
    resultado.push({
      codigo: m.Codigo,
      identificacao: m.DescricaoIdentificacao ?? `${m.Sigla ?? ""} ${m.Numero ?? ""}/${m.Ano ?? ""}`,
      sigla: m.Sigla ?? "",
      numero: m.Numero ?? "",
      ano: m.Ano ?? "",
      ementa: m.Ementa ?? "Ementa não informada.",
      data: m.Data ?? "",
      linkOficial: `https://www25.senado.leg.br/web/atividade/materias/-/materia/${m.Codigo}`,
    });
  }

  return resultado
    .sort((a, b) => (b.data || "").localeCompare(a.data || ""))
    .slice(0, 15);
}

export async function buscarVotacoesSenador(
  codigo: string
): Promise<VotacaoSenador[]> {
  const [raw26, raw25] = await Promise.all([
    fetchJson<{
      VotacaoParlamentar?: {
        Parlamentar?: { Votacoes?: { Votacao?: RawVotacao | RawVotacao[] } };
      };
    }>(`${SENADO_LEGIS_BASE}/senador/${encodeURIComponent(codigo)}/votacoes?ano=2026`),
    fetchJson<{
      VotacaoParlamentar?: {
        Parlamentar?: { Votacoes?: { Votacao?: RawVotacao | RawVotacao[] } };
      };
    }>(`${SENADO_LEGIS_BASE}/senador/${encodeURIComponent(codigo)}/votacoes?ano=2025`),
  ]);

  const itens = [
    ...toArray(raw26?.VotacaoParlamentar?.Parlamentar?.Votacoes?.Votacao),
    ...toArray(raw25?.VotacaoParlamentar?.Parlamentar?.Votacoes?.Votacao),
  ];

  const vistos = new Set<string>();
  const resultado: VotacaoSenador[] = [];

  for (const v of itens) {
    const key = `${v.CodigoSessaoVotacao ?? ""}-${v.Materia?.DescricaoIdentificacao ?? ""}-${v.SessaoPlenaria?.DataSessao ?? ""}`;
    if (vistos.has(key)) continue;
    vistos.add(key);

    resultado.push({
      codigoSessaoVotacao: v.CodigoSessaoVotacao ?? key,
      data: v.SessaoPlenaria?.DataSessao ?? "",
      materia: v.Materia?.DescricaoIdentificacao ?? "Matéria em Plenário",
      ementa: v.Materia?.Ementa ?? "",
      descricaoVotacao: v.DescricaoVotacao ?? "",
      resultado: v.DescricaoResultado ?? "—",
      voto: v.SiglaDescricaoVoto ?? "—",
    });
  }

  return resultado
    .sort((a, b) => (b.data || "").localeCompare(a.data || ""))
    .slice(0, 20);
}

export async function buscarComissoesSenador(
  codigo: string
): Promise<ComissaoSenador[]> {
  const raw = await fetchJson<{
    MembroComissaoParlamentar?: {
      Parlamentar?: {
        MembroComissoes?: { Comissao?: RawComissao | RawComissao[] };
      };
    };
  }>(`${SENADO_LEGIS_BASE}/senador/${encodeURIComponent(codigo)}/comissoes`);

  const itens = toArray(
    raw?.MembroComissaoParlamentar?.Parlamentar?.MembroComissoes?.Comissao
  );

  return itens
    .map((c) => ({
      sigla: c.IdentificacaoComissao?.SiglaComissao ?? "—",
      nome: c.IdentificacaoComissao?.NomeComissao ?? "Comissão",
      participacao: c.DescricaoParticipacao ?? "Membro",
      dataInicio: c.DataInicio ?? "",
      ativa: !c.DataFim,
    }))
    .sort((a, b) => Number(b.ativa) - Number(a.ativa) || b.dataInicio.localeCompare(a.dataInicio))
    .slice(0, 10);
}

export async function buscarCeapsSenador(
  codigo: string
): Promise<ResumoCeapsSenador | null> {
  const codNum = Number(codigo);
  if (!Number.isFinite(codNum)) return null;

  for (const ano of [2026, 2025]) {
    const indice = await carregarIndiceCeaps(ano);
    const despesas = indice.get(codNum);
    if (!despesas || despesas.length === 0) continue;

    const totalAno = despesas.reduce(
      (acc, d) => acc + (Number(d.valorReembolsado) || 0),
      0
    );

    const porCatMap = new Map<string, number>();
    for (const d of despesas) {
      const cat = (d.tipoDespesa ?? "Outras despesas").trim();
      porCatMap.set(cat, (porCatMap.get(cat) ?? 0) + (Number(d.valorReembolsado) || 0));
    }

    const porCategoria = Array.from(porCatMap.entries())
      .map(([categoria, valor]) => ({ categoria, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 6);

    const recentes: DespesaCeapsSenador[] = [...despesas]
      .sort((a, b) => (b.data ?? "").localeCompare(a.data ?? ""))
      .slice(0, 15)
      .map((d) => ({
        id: d.id,
        ano: d.ano,
        mes: d.mes,
        tipoDespesa: (d.tipoDespesa ?? "Despesa CEAPS").trim(),
        fornecedor: d.fornecedor ?? "Fornecedor não informado",
        data: d.data ?? `${d.mes}/${d.ano}`,
        detalhamento: d.detalhamento ?? "",
        valorReembolsado: Number(d.valorReembolsado) || 0,
      }));

    return {
      ano,
      totalAno,
      quantidadeLancamentos: despesas.length,
      porCategoria,
      recentes,
    };
  }

  return null;
}
