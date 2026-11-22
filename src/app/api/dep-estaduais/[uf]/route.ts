import { NextResponse } from "next/server";
import assembleiasData from "@/data/assembleias.json";
import deputadosData from "@/data/deputados-estaduais.json";
import type { Assembleia, DeputadoEstadual } from "@/types/politicos";

const assembleias = assembleiasData as Assembleia[];
const bancadas = deputadosData as Record<string, DeputadoEstadual[]>;

export async function GET(
  _request: Request,
  context: { params: Promise<{ uf: string }> }
) {
  const { uf } = await context.params;
  const siglaUf = uf.toUpperCase().trim();

  const assembleia = assembleias.find((a) => a.uf === siglaUf);
  if (!assembleia) {
    return NextResponse.json(
      { error: "Estado (UF) não encontrado." },
      { status: 404 }
    );
  }

  const deputados = bancadas[siglaUf] ?? [];

  return NextResponse.json(
    {
      assembleia,
      totalCadastrados: deputados.length,
      deputados,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
