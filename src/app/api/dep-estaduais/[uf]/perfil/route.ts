import { NextResponse } from "next/server";
import alespData from "@/data/alesp-detalhes.json";
import { buscarDadosAlmgDeputado } from "@/lib/almg";
import { buscarDeputadoEstadualTse } from "@/lib/tse";
import { getEstadoPorUf, normalizarTexto } from "@/lib/ufs";
import type { AlespDetalhe } from "@/types/politicos";

const alespDetalhes = alespData as Record<string, AlespDetalhe>;

function buscarDetalheAlesp(nome: string): AlespDetalhe | null {
  const alvo = normalizarTexto(nome);
  if (alespDetalhes[alvo]) return alespDetalhes[alvo];

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

  const alesp = estado.uf === "SP" ? buscarDetalheAlesp(nome) : null;

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
      alesp,
      fontesConsultadas: {
        tse: Boolean(tse),
        almg: Boolean(almg),
        alesp: Boolean(alesp),
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
