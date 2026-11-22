import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import { VereadoresExplorer } from "@/components/municipios/VereadoresExplorer";

export const metadata: Metadata = {
  title: "Vereadores",
  description:
    "Pesquise os ~58 mil vereadores eleitos nas 5.570 Câmaras Municipais com integração ao vivo no IBGE, TSE 2024 e orçamento legislativo no SICONFI.",
};

export default function VereadoresPage() {
  return (
    <div>
      <PageHero
        categoria="Câmaras Municipais • ~58 mil Vereadores"
        titulo="Vereadores do Brasil"
        descricao="Selecione seu estado e sua cidade para listar todos os vereadores eleitos nas Eleições Municipais 2024, abrir o perfil completo em 8 abas e conferir o custo anual do Legislativo municipal no SICONFI."
        breadcrumb="Vereadores"
        metricas={[
          { valor: "~58 mil", label: "Vereadores (TSE)" },
          { valor: "5.570", label: "Cidades (IBGE)" },
          { valor: "Ao vivo", label: "TSE 2024 + SICONFI", destaque: true },
        ]}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        <AvisoFiscalizacao
          mensagem="Consulta sob demanda por estado e cidade via IBGE, TSE DivulgaCandContas (Eleições 2024) e SICONFI / Tesouro Nacional (Função Legislativa) — garantindo carregamento leve no celular."
        />
        <VereadoresExplorer />
      </div>
    </div>
  );
}
