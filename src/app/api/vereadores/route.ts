import { NextResponse } from "next/server";
import { buscarVereadoresEleitosTse } from "@/lib/tse";
import { getEstadoPorUf } from "@/lib/ufs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uf = (searchParams.get("uf") ?? "").toUpperCase().trim();
  const cidade = (searchParams.get("cidade") ?? "").trim();

  const estado = getEstadoPorUf(uf);
  if (!estado || !cidade) {
    return NextResponse.json(
      { error: "Parâmetros inválidos. Informe uf válida e nome da cidade." },
      { status: 400 }
    );
  }

  try {
    const { codigoTse, vereadores } = await buscarVereadoresEleitosTse(
      estado.uf,
      cidade
    );

    return NextResponse.json(
      {
        uf: estado.uf,
        cidade,
        codigoTse,
        anoEleicao: 2024,
        totalEleitos: vereadores.length,
        vereadores,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Não foi possível consultar a API oficial do TSE neste momento. Tente novamente em instantes.",
      },
      { status: 502 }
    );
  }
}
