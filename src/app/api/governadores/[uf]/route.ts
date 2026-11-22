import { NextResponse } from "next/server";
import { buscarResumoFiscalSiconfi } from "@/lib/siconfi";
import { buscarGovernadorTse } from "@/lib/tse";
import { getEstadoPorUf } from "@/lib/ufs";

export async function GET(
  request: Request,
  context: { params: Promise<{ uf: string }> }
) {
  const { uf } = await context.params;
  const estado = getEstadoPorUf(uf);

  if (!estado) {
    return NextResponse.json(
      { error: "Estado (UF) não encontrado." },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);
  const nome = (searchParams.get("nome") ?? "").trim() || undefined;

  const [tse, siconfi] = await Promise.all([
    buscarGovernadorTse(estado.uf, nome).catch(() => ({
      eleicao2022: null,
      eleicao2026: null,
    })),
    buscarResumoFiscalSiconfi(estado.codigoIbge).catch(() => null),
  ]);

  return NextResponse.json(
    {
      uf: estado.uf,
      estado: estado.nome,
      codigoIbge: estado.codigoIbge,
      tse,
      siconfi,
      fontesConsultadas: {
        tse2022: Boolean(tse.eleicao2022),
        tse2026: Boolean(tse.eleicao2026),
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
