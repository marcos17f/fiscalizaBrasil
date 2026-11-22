import { NextResponse } from "next/server";
import senadoresData from "@/data/senadores.json";
import emendasData from "@/data/senadores-emendas.json";
import {
  buscarAutoriasSenador,
  buscarCeapsSenador,
  buscarComissoesSenador,
  buscarVotacoesSenador,
} from "@/lib/senado";
import { normalizarTexto } from "@/lib/ufs";
import type { EmendaSenador, Senador } from "@/types/politicos";

const senadores = senadoresData as Senador[];
const emendasPorChave = emendasData as Record<string, EmendaSenador[]>;

const indiceEmendas = new Map<string, EmendaSenador[]>();
for (const [nome, lista] of Object.entries(emendasPorChave)) {
  indiceEmendas.set(normalizarTexto(nome), lista);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await context.params;
  const senador = senadores.find((s) => s.codigo === codigo);

  if (!senador) {
    return NextResponse.json(
      { error: "Senador não encontrado." },
      { status: 404 }
    );
  }

  const emendas =
    indiceEmendas.get(normalizarTexto(senador.nome)) ??
    indiceEmendas.get(normalizarTexto(senador.nomeCompleto)) ??
    [];

  const totalIndicado = emendas.reduce((acc, e) => acc + (e.valorTotal || 0), 0);
  const totalPago = emendas.reduce((acc, e) => acc + (e.valorPago || 0), 0);

  const [autorias, votacoes, comissoes, ceaps] = await Promise.all([
    buscarAutoriasSenador(senador.codigo).catch(() => []),
    buscarVotacoesSenador(senador.codigo).catch(() => []),
    buscarComissoesSenador(senador.codigo).catch(() => []),
    buscarCeapsSenador(senador.codigo).catch(() => null),
  ]);

  return NextResponse.json(
    {
      senador,
      resumoEmendas: {
        quantidade: emendas.length,
        totalIndicado,
        totalPago,
      },
      emendas,
      autorias,
      votacoes,
      comissoes,
      ceaps,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
