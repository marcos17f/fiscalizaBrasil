import { NextResponse } from "next/server";
import { buscarResumoFiscalSiconfi } from "@/lib/siconfi";
import { buscarVereadoresEleitosTse } from "@/lib/tse";
import { getEstadoPorUf } from "@/lib/ufs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uf = (searchParams.get("uf") ?? "").toUpperCase().trim();
  const cidade = (searchParams.get("cidade") ?? "").trim();
  const ibge = Number(searchParams.get("ibge") ?? "");

  const estado = getEstadoPorUf(uf);
  if (!estado || !cidade) {
    return NextResponse.json(
      { error: "Parâmetros inválidos. Informe uf válida e nome da cidade." },
      { status: 400 }
    );
  }

  try {
    const [tseRes, siconfi] = await Promise.all([
      buscarVereadoresEleitosTse(estado.uf, cidade),
      Number.isInteger(ibge) && ibge > 0
        ? buscarResumoFiscalSiconfi(ibge).catch(() => null)
        : Promise.resolve(null),
    ]);

    return NextResponse.json(
      {
        uf: estado.uf,
        cidade,
        codigoTse: tseRes.codigoTse,
        anoEleicao: 2024,
        totalEleitos: tseRes.vereadores.length,
        vereadores: tseRes.vereadores,
        orcamentoLegislativo: siconfi
          ? {
              exercicio: siconfi.exercicio,
              periodo: siconfi.periodo,
              despesaLegislativa: siconfi.despesaLegislativa,
              percentualLegislativa: siconfi.percentualLegislativa,
              despesaTotalMunicipio: siconfi.despesaLiquidada,
            }
          : null,
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
