import { NextResponse } from "next/server";
import { buscarDetalheCandidatoTse } from "@/lib/tse";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ano = Number(searchParams.get("ano"));
  const eleicao = Number(searchParams.get("eleicao"));
  const id = Number(searchParams.get("id"));
  const ue = (searchParams.get("ue") ?? "").trim();

  if (
    !Number.isInteger(ano) ||
    !Number.isInteger(eleicao) ||
    !Number.isInteger(id) ||
    !/^[A-Za-z0-9]{2,10}$/.test(ue)
  ) {
    return NextResponse.json(
      { error: "Parâmetros de candidato TSE inválidos." },
      { status: 400 }
    );
  }

  try {
    const perfil = await buscarDetalheCandidatoTse(ano, ue, eleicao, id);
    return NextResponse.json(
      { perfil },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Falha ao obter detalhe do candidato na API oficial do TSE." },
      { status: 502 }
    );
  }
}
