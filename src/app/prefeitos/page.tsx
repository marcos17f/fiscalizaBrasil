import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import { PrefeitosExplorer } from "@/components/municipios/PrefeitosExplorer";

export const metadata: Metadata = {
  title: "Prefeitos",
  description:
    "Consulte prefeitos e gestões municipais nos 5.570 municípios brasileiros com IBGE, TSE 2024, Plano de Governo PDF, SICONFI (RREO + LRF) e licitações PNCP.",
};

export default function PrefeitosPage() {
  return (
    <div>
      <PageHero
        categoria="Poder Executivo Municipal • 5.570 Cidades"
        titulo="Prefeitos do Brasil"
        descricao="Escolha o estado e o município para consultar o prefeito e vice eleitos em 2024, o PDF oficial do Plano de Governo, o balanço orçamentário no SICONFI, o limite da LRF e editais recentes no PNCP."
        breadcrumb="Prefeitos"
        metricas={[
          { valor: "5.570", label: "Municípios (IBGE)" },
          { valor: "2025–2028", label: "Mandato atual" },
          { valor: "Ao vivo", label: "TSE + SICONFI + PNCP", destaque: true },
        ]}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        <AvisoFiscalizacao
          mensagem="Integração ao vivo com 4 fontes oficiais: IBGE (5.570 municípios), TSE DivulgaCandContas 2024 (prefeito, vice, bens e plano de governo PDF), SICONFI / Tesouro Nacional (balanço e LRF) e PNCP (licitações recentes)."
        />
        <PrefeitosExplorer />
      </div>
    </div>
  );
}
