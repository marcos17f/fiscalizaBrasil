import { NextResponse } from "next/server";
import assembleiasData from "@/data/assembleias.json";
import deputadosData from "@/data/deputados-estaduais.json";
import alespData from "@/data/alesp-detalhes.json";
import { normalizarTexto } from "@/lib/ufs";
import type { AlespDetalhe, Assembleia, DeputadoEstadual } from "@/types/politicos";

const assembleias = assembleiasData as Assembleia[];
const bancadas = deputadosData as Record<string, DeputadoEstadual[]>;
const alespDetalhes = alespData as Record<string, AlespDetalhe>;

function buscarDetalheAlesp(nome: string): AlespDetalhe | null {
  const alvo = normalizarTexto(nome);
  if (alespDetalhes[alvo]) return alespDetalhes[alvo];

  // Fallback por correspondência parcial (ex: "Alex de Madureira" vs "Alex Madureira")
  const tokens = alvo.split(" ").filter((t) => t.length > 2);
  for (const [chave, valor] of Object.entries(alespDetalhes)) {
    if (tokens.length >= 2 && tokens.every((t) => chave.includes(t))) {
      return valor;
    }
  }
  return null;
}

export async function GET(
  request: Request,
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

  const { searchParams } = new URL(request.url);
  const nomeDetalhe = searchParams.get("nome");

  if (nomeDetalhe) {
    const detalhe = siglaUf === "SP" ? buscarDetalheAlesp(nomeDetalhe) : null;
    return NextResponse.json(
      { uf: siglaUf, nome: nomeDetalhe, detalhe },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  }

  const deputados = bancadas[siglaUf] ?? [];

  return NextResponse.json(
    {
      assembleia,
      totalCadastrados: deputados.length,
      possuiDetalhesExtras: siglaUf === "SP",
      deputados,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
