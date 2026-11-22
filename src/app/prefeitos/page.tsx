import type { Metadata } from "next";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import { PrefeitosExplorer } from "@/components/municipios/PrefeitosExplorer";

export const metadata: Metadata = {
  title: "Prefeitos",
  description:
    "Consulte prefeitos e gestões municipais nos 5.570 municípios brasileiros usando a base oficial do IBGE e estrutura pronta para dados do TSE.",
};

export default function PrefeitosPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-2">
        <p className="text-xs font-bold tracking-wider text-brand-emerald uppercase">
          Poder Executivo Municipal • 5.570 Municípios
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          Prefeitos do Brasil
        </h1>
        <p className="max-w-2xl text-sm text-brand-muted sm:text-base">
          Selecione o estado e o município para consultar a ficha da Prefeitura.
          A lista de cidades é obtida em tempo real na API oficial do IBGE.
        </p>
      </div>

      <AvisoFiscalizacao
        mensagem="Integração ao vivo com 3 fontes oficiais: IBGE (5.570 municípios), TSE DivulgaCandContas 2024 (prefeito, vice, bens, histórico e plano de governo PDF) e SICONFI / Tesouro Nacional (balanço orçamentário e gastos por área)."
      />

      <PrefeitosExplorer />
    </div>
  );
}
