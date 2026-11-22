import { NextResponse } from "next/server";
import { buscarVotacoesNominaisDeputado } from "@/lib/camara";
import type {
  DespesaCamara,
  EventoCamara,
  FrenteCamara,
  OrgaoCamara,
  ProposicaoCamara,
} from "@/types/politicos";

type CamaraDetalheApi = {
  dados?: {
    id: number;
    nomeCivil?: string;
    cpf?: string;
    sexo?: string;
    dataNascimento?: string;
    municipioNascimento?: string;
    ufNascimento?: string;
    escolaridade?: string;
    ultimoStatus?: {
      nome?: string;
      siglaPartido?: string;
      siglaUf?: string;
      situacao?: string;
      condicaoEleitoral?: string;
      gabinete?: {
        nome?: string;
        predio?: string;
        sala?: string;
        andar?: string;
        telefone?: string;
        email?: string;
      };
    };
  };
};

async function fetchJsonSafe<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
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

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const depId = Number(id);
  const base = "https://dadosabertos.camara.leg.br/api/v2";

  const [
    perfilRaw,
    despesasRaw,
    proposicoesRaw,
    orgaosRaw,
    eventosRaw,
    frentesRaw,
    votacoesNominais,
  ] = await Promise.all([
    fetchJsonSafe<CamaraDetalheApi>(`${base}/deputados/${id}`),
    fetchJsonSafe<{ dados?: DespesaCamara[] }>(
      `${base}/deputados/${id}/despesas?ordem=DESC&ordenarPor=ano&itens=20`
    ),
    fetchJsonSafe<{ dados?: ProposicaoCamara[] }>(
      `${base}/proposicoes?idDeputadoAutor=${id}&ordem=DESC&ordenarPor=id&itens=15`
    ),
    fetchJsonSafe<{ dados?: OrgaoCamara[] }>(
      `${base}/deputados/${id}/orgaos?ordem=DESC&ordenarPor=dataInicio&itens=10`
    ),
    fetchJsonSafe<{ dados?: EventoCamara[] }>(
      `${base}/deputados/${id}/eventos?ordem=DESC&ordenarPor=dataHoraInicio&itens=15`
    ),
    fetchJsonSafe<{ dados?: FrenteCamara[] }>(
      `${base}/deputados/${id}/frentes`
    ),
    buscarVotacoesNominaisDeputado(depId).catch(() => []),
  ]);

  const despesas = despesasRaw?.dados ?? [];
  const totalDespesasRecentes = despesas.reduce(
    (acc, d) => acc + (Number(d.valorLiquido) || 0),
    0
  );

  return NextResponse.json(
    {
      perfil: perfilRaw?.dados ?? null,
      despesas,
      totalDespesasRecentes,
      proposicoes: proposicoesRaw?.dados ?? [],
      orgaos: orgaosRaw?.dados ?? [],
      eventos: eventosRaw?.dados ?? [],
      frentes: (frentesRaw?.dados ?? []).slice(0, 12),
      votacoesNominais,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
