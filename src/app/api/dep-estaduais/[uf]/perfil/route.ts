import { NextResponse } from "next/server";
import { buscarDadosAlmgDeputado } from "@/lib/almg";
import { buscarDeputadoEstadualTse } from "@/lib/tse";
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
  const nome = (searchParams.get("nome") ?? "").trim();

  if (!nome || nome.length < 2) {
    return NextResponse.json(
      { error: "Informe o nome do parlamentar via parâmetro ?nome=." },
      { status: 400 }
    );
  }

  const [tse, almg] = await Promise.all([
    buscarDeputadoEstadualTse(estado.uf, nome).catch(() => null),
    estado.uf === "MG"
      ? buscarDadosAlmgDeputado(nome).catch(() => null)
      : Promise.resolve(null),
  ]);

  return NextResponse.json(
    {
      uf: estado.uf,
      nomeConsultado: nome,
      tse,
      almg,
      fontesConsultadas: {
        tse: Boolean(tse),
        almg: Boolean(almg),
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
