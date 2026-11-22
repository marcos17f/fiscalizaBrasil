import type {
  FuncaoDespesaSiconfi,
  IndicadorLrfSiconfi,
  ResumoFiscalSiconfi,
} from "@/types/politicos";

const SICONFI_RREO = "https://apidatalake.tesouro.gov.br/ords/siconfi/tt/rreo";
const SICONFI_RGF = "https://apidatalake.tesouro.gov.br/ords/siconfi/tt/rgf";

const FUNCOES_OFICIAIS = new Set([
  "Legislativa",
  "Judiciária",
  "Essencial à Justiça",
  "Administração",
  "Defesa Nacional",
  "Segurança Pública",
  "Relações Exteriores",
  "Assistência Social",
  "Previdência Social",
  "Saúde",
  "Trabalho",
  "Educação",
  "Cultura",
  "Direitos da Cidadania",
  "Urbanismo",
  "Habitação",
  "Saneamento",
  "Gestão Ambiental",
  "Ciência e Tecnologia",
  "Agricultura",
  "Organização Agrária",
  "Indústria",
  "Comércio e Serviços",
  "Comunicações",
  "Energia",
  "Transporte",
  "Desporto e Lazer",
  "Encargos Especiais",
]);

type RawSiconfiItem = {
  exercicio: number;
  periodo: number;
  instituicao: string;
  cod_ibge: number;
  uf: string;
  populacao?: number | null;
  esfera: "E" | "M";
  coluna: string;
  cod_conta: string;
  conta: string;
  valor: number;
};

const cacheSiconfi = new Map<string, ResumoFiscalSiconfi | null>();

async function consultarSiconfi(url: string): Promise<RawSiconfiItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 14000);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "FiscalizaBrasil/1.0 (+https://fiscalizabrasil.org)",
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: RawSiconfiItem[] };
    return data.items ?? [];
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function consultarRreo(
  idEnte: number,
  exercicio: number,
  periodo: number,
  anexo: "RREO-Anexo 01" | "RREO-Anexo 02"
): Promise<RawSiconfiItem[]> {
  const params = new URLSearchParams({
    an_exercicio: String(exercicio),
    nr_periodo: String(periodo),
    co_tipo_demonstrativo: "RREO",
    no_anexo: anexo,
    id_ente: String(idEnte),
  });
  return consultarSiconfi(`${SICONFI_RREO}?${params.toString()}`);
}

async function consultarRgfPessoal(
  idEnte: number,
  exercicio: number,
  esfera: "E" | "M"
): Promise<IndicadorLrfSiconfi | null> {
  const tentativas: Array<{
    ano: number;
    periodicidade: "Q" | "S";
    periodo: number;
  }> =
    exercicio >= 2026
      ? [
          { ano: exercicio, periodicidade: "Q", periodo: 2 },
          { ano: exercicio, periodicidade: "S", periodo: 1 },
          { ano: exercicio, periodicidade: "Q", periodo: 1 },
          { ano: 2025, periodicidade: "Q", periodo: 3 },
          { ano: 2025, periodicidade: "S", periodo: 2 },
        ]
      : [
          { ano: exercicio, periodicidade: "Q", periodo: 3 },
          { ano: exercicio, periodicidade: "S", periodo: 2 },
        ];

  const limiteMaximo = esfera === "E" ? 49 : 54;
  const limitePrudencial = esfera === "E" ? 46.55 : 51.3;

  for (const { ano, periodicidade, periodo } of tentativas) {
    const params = new URLSearchParams({
      an_exercicio: String(ano),
      in_periodicidade: periodicidade,
      nr_periodo: String(periodo),
      co_tipo_demonstrativo: "RGF",
      no_anexo: "RGF-Anexo 01",
      co_poder: "E",
      id_ente: String(idEnte),
    });

    const items = await consultarSiconfi(`${SICONFI_RGF}?${params.toString()}`);
    if (items.length === 0) continue;

    const itemPercentual = items.find(
      (i) =>
        /DespesaComPessoalTotal/i.test(i.cod_conta) &&
        /%\s*sobre\s*a\s*RCL/i.test(i.coluna)
    );
    const itemValor = items.find(
      (i) =>
        /DespesaComPessoalTotal/i.test(i.cod_conta) &&
        (/Valor/i.test(i.coluna) || /TOTAL\s*\(ÚLTIMOS/i.test(i.coluna))
    );

    if (itemPercentual || itemValor) {
      return {
        exercicio: ano,
        periodo,
        despesaPessoalTotal:
          typeof itemValor?.valor === "number" ? itemValor.valor : null,
        percentualRcl:
          typeof itemPercentual?.valor === "number"
            ? itemPercentual.valor
            : null,
        limiteMaximo,
        limitePrudencial,
      };
    }
  }

  return null;
}

function encontrarValor(
  items: RawSiconfiItem[],
  codConta: string,
  matchColuna: RegExp
): number | null {
  const item = items.find(
    (i) => i.cod_conta === codConta && matchColuna.test(i.coluna)
  );
  return typeof item?.valor === "number" ? item.valor : null;
}

export async function buscarResumoFiscalSiconfi(
  idEnte: number
): Promise<ResumoFiscalSiconfi | null> {
  const key = String(idEnte);
  if (cacheSiconfi.has(key)) {
    return cacheSiconfi.get(key) ?? null;
  }

  // Consulta em paralelo os períodos mais recentes (2026 B5/B4/B3 + 2025 B6) para escolher o mais atual sem latência sequencial
  const lotesParalelos: Array<{ exercicio: number; periodo: number }> = [
    { exercicio: 2026, periodo: 5 },
    { exercicio: 2026, periodo: 4 },
    { exercicio: 2026, periodo: 3 },
    { exercicio: 2025, periodo: 6 },
  ];

  const resultadosLote = await Promise.all(
    lotesParalelos.map(async (t) => ({
      ...t,
      anexo1: await consultarRreo(idEnte, t.exercicio, t.periodo, "RREO-Anexo 01"),
    }))
  );

  let escolhido = resultadosLote.find((r) => r.anexo1.length > 0);
  if (!escolhido) {
    const fallback2024 = await consultarRreo(idEnte, 2024, 6, "RREO-Anexo 01");
    if (fallback2024.length > 0) {
      escolhido = { exercicio: 2024, periodo: 6, anexo1: fallback2024 };
    }
  }

  if (escolhido) {
    const { exercicio, periodo, anexo1 } = escolhido;

    const meta = anexo1[0];

    const [anexo2, lrfPessoal] = await Promise.all([
      consultarRreo(idEnte, exercicio, periodo, "RREO-Anexo 02"),
      consultarRgfPessoal(idEnte, exercicio, meta.esfera).catch(() => null),
    ]);

    const receitaPrevistaAtualizada = encontrarValor(
      anexo1,
      "ReceitasExcetoIntraOrcamentarias",
      /PREVISÃO ATUALIZADA/i
    );
    const receitaRealizada = encontrarValor(
      anexo1,
      "ReceitasExcetoIntraOrcamentarias",
      /Até o Bimestre/i
    );
    const receitaPercentual = encontrarValor(
      anexo1,
      "ReceitasExcetoIntraOrcamentarias",
      /%\s*\(c\/a\)/i
    );
    const receitaTributaria = encontrarValor(
      anexo1,
      "ReceitaTributaria",
      /Até o Bimestre/i
    );
    const transferenciasCorrentes = encontrarValor(
      anexo1,
      "TransferenciasCorrentes",
      /Até o Bimestre/i
    );
    const despesaDotacaoAtualizada = encontrarValor(
      anexo1,
      "DespesasExcetoIntraOrcamentarias",
      /DOTAÇÃO ATUALIZADA/i
    );
    const despesaEmpenhada = encontrarValor(
      anexo1,
      "DespesasExcetoIntraOrcamentarias",
      /DESPESAS EMPENHADAS ATÉ O BIMESTRE/i
    );
    const despesaLiquidada = encontrarValor(
      anexo1,
      "DespesasExcetoIntraOrcamentarias",
      /DESPESAS LIQUIDADAS ATÉ O BIMESTRE/i
    );
    const despesaPaga = encontrarValor(
      anexo1,
      "DespesasExcetoIntraOrcamentarias",
      /DESPESAS PAGAS ATÉ O BIMESTRE/i
    );

    const mapaFuncoes = new Map<
      string,
      { empenhado: number; liquidado: number; percentual: number }
    >();

    for (const item of anexo2) {
      if (item.cod_conta !== "RREO2TotalDespesas") continue;
      if (!FUNCOES_OFICIAIS.has(item.conta)) continue;

      const atual = mapaFuncoes.get(item.conta) ?? {
        empenhado: 0,
        liquidado: 0,
        percentual: 0,
      };

      if (/DESPESAS EMPENHADAS ATÉ O BIMESTRE/i.test(item.coluna)) {
        atual.empenhado = item.valor;
      } else if (/DESPESAS LIQUIDADAS ATÉ O BIMESTRE/i.test(item.coluna)) {
        atual.liquidado = item.valor;
      } else if (/%\s*\(d\/total d\)/i.test(item.coluna)) {
        atual.percentual = item.valor;
      }

      mapaFuncoes.set(item.conta, atual);
    }

    const totalLiquidadoBase =
      despesaLiquidada && despesaLiquidada > 0 ? despesaLiquidada : 1;

    const leg = mapaFuncoes.get("Legislativa");
    const despesaLegislativa = leg?.liquidado ?? leg?.empenhado ?? null;
    const percentualLegislativa = leg
      ? leg.percentual > 0
        ? leg.percentual
        : (leg.liquidado / totalLiquidadoBase) * 100
      : null;

    const funcoesPrincipais: FuncaoDespesaSiconfi[] = Array.from(
      mapaFuncoes.entries()
    )
      .map(([funcao, vals]) => ({
        funcao,
        empenhado: vals.empenhado,
        liquidado: vals.liquidado,
        percentual:
          vals.percentual > 0
            ? vals.percentual
            : (vals.liquidado / totalLiquidadoBase) * 100,
      }))
      .filter((f) => f.liquidado > 0 || f.empenhado > 0)
      .sort((a, b) => b.liquidado - a.liquidado)
      .slice(0, 8);

    const resumo: ResumoFiscalSiconfi = {
      idEnte,
      instituicao: meta.instituicao,
      uf: meta.uf,
      esfera: meta.esfera,
      exercicio,
      periodo,
      populacao: meta.populacao ?? null,
      receitaPrevistaAtualizada,
      receitaRealizada,
      receitaPercentual,
      receitaTributaria,
      transferenciasCorrentes,
      despesaDotacaoAtualizada,
      despesaEmpenhada,
      despesaLiquidada,
      despesaPaga,
      despesaLegislativa,
      percentualLegislativa,
      funcoesPrincipais,
      lrfPessoal,
    };

    cacheSiconfi.set(key, resumo);
    return resumo;
  }

  cacheSiconfi.set(key, null);
  return null;
}
