import { NextResponse } from "next/server";
import { buscarResumoFiscalSiconfi } from "@/lib/siconfi";
import { buscarPrefeitoEleitoTse } from "@/lib/tse";
import { getEstadoPorUf } from "@/lib/ufs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uf = (searchParams.get("uf") ?? "").toUpperCase().trim();
  const ibgeRaw = (searchParams.get("ibge") ?? "").trim();
  const cidade = (searchParams.get("cidade") ?? "").trim();

  const estado = getEstadoPorUf(uf);
  const ibge = Number(ibgeRaw);

  if (!estado || !cidade || !Number.isInteger(ibge) || ibge <= 0) {
    return NextResponse.json(
      {
        error:
          "Parâmetros inválidos. Informe uf válida, código IBGE numérico e nome da cidade.",
      },
      { status: 400 }
    );
  }

  const [tseResult, siconfi] = await Promise.all([
    buscarPrefeitoEleitoTse(estado.uf, cidade).catch(() => ({
      codigoTse: null,
      prefeito: null,
    })),
    buscarResumoFiscalSiconfi(ibge).catch(() => null),
  ]);

  return NextResponse.json(
    {
      uf: estado.uf,
      ibge,
      cidade,
      codigoTse: tseResult.codigoTse,
      prefeito: tseResult.prefeito,
      siconfi,
      fontesConsultadas: {
        tse: Boolean(tseResult.prefeito),
        siconfi: Boolean(siconfi),
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
