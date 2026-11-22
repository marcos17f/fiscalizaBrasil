import type {
  FuncaoDespesaSiconfi,
  ResumoFiscalSiconfi,
} from "@/types/politicos";

const SICONFI_BASE = "https://apidatalake.tesouro.gov.br/ords/siconfi/tt/rreo";

// Funções oficiais de 1º nível (Portaria MOG nº 42/1999) para evitar duplicidade com subfunções
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

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 14000);

  try {
    const res = await fetch(`${SICONFI_BASE}?${params.toString()}`, {
      headers: {
        "User-Agent": "FiscalizaBrasil/1.0 (+https://fiscalizabrasil.org)",
        Accept: "application/json",
      },
      signal: controller.signal,
      next: { revalidate: 21600 },
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

  // Tenta 2025 fechado (6º bimestre); fallback para 2024 fechado (6º bimestre)
  const tentativas: Array<{ exercicio: number; periodo: number }> = [
    { exercicio: 2025, periodo: 6 },
    { exercicio: 2024, periodo: 6 },
  ];

  for (const { exercicio, periodo } of tentativas) {
    const anexo1 = await consultarRreo(
      idEnte,
      exercicio,
      periodo,
      "RREO-Anexo 01"
    );
    if (anexo1.length === 0) continue;

    const anexo2 = await consultarRreo(
      idEnte,
      exercicio,
      periodo,
      "RREO-Anexo 02"
    );

    const meta = anexo1[0];
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

    // Agregar funções de 1º nível do Anexo 02
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
      funcoesPrincipais,
    };

    cacheSiconfi.set(key, resumo);
    return resumo;
  }

  cacheSiconfi.set(key, null);
  return null;
}
