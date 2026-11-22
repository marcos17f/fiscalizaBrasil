import type { Metadata } from "next";
import deputadosFederaisData from "@/data/deputados-federais.json";
import { PageHero } from "@/components/layout/PageHero";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import { DeputadosFederaisExplorer } from "@/components/camara/DeputadosFederaisExplorer";
import type { DeputadoFederal } from "@/types/politicos";

export const metadata: Metadata = {
  title: "Deputados Federais",
  description:
    "Acompanhe os 513 deputados federais em exercício com projetos de lei, comissões, frentes, presença e despesas da Cota Parlamentar diretamente da API oficial da Câmara.",
};

export default function DeputadosFederaisPage() {
  const deputados = deputadosFederaisData as DeputadoFederal[];

  return (
    <div>
      <PageHero
        categoria="Câmara dos Deputados • 57ª Legislatura"
        titulo="Deputados Federais em Exercício"
        descricao={`Pesquise entre os ${deputados.length} deputados federais por nome, estado ou partido. Ao abrir qualquer ficha, projetos de lei, comissões, frentes, presença e despesas da Cota Parlamentar são consultados ao vivo.`}
        breadcrumb="Deputados Federais"
        metricas={[
          { valor: String(deputados.length), label: "Deputados" },
          { valor: "2023–2027", label: "Mandato atual" },
          { valor: "Ao vivo", label: "Câmara API v2", destaque: true },
        ]}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        <AvisoFiscalizacao
          mensagem="Mandato atual: 01/02/2023 até 31/01/2027. Projetos, comissões, frentes parlamentares, eventos de presença e despesas CEAP são obtidos diretamente da API oficial v2 da Câmara dos Deputados."
        />
        <DeputadosFederaisExplorer deputados={deputados} />
      </div>
    </div>
  );
}
