import type { Metadata } from "next";
import assembleiasData from "@/data/assembleias.json";
import { PageHero } from "@/components/layout/PageHero";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import { DeputadosExplorer } from "@/components/deputados/DeputadosExplorer";
import type { Assembleia } from "@/types/politicos";

export const metadata: Metadata = {
  title: "Deputados Estaduais",
  description:
    "Consulte os deputados estaduais e distritais nas 27 Casas Legislativas do Brasil com dados TSE ao vivo, folhas da ALESP (SP) e verbas da ALMG (MG).",
};

export default function DeputadosEstaduaisPage() {
  const assembleias = assembleiasData as Assembleia[];
  const totalVagas = assembleias.reduce((acc, a) => acc + a.vagas, 0);

  return (
    <div>
      <PageHero
        categoria="26 Assembleias Legislativas + CLDF"
        titulo="Deputados Estaduais"
        descricao="Selecione um estado para consultar a bancada estadual sob demanda. Cada perfil combina dados eleitorais do TSE ao vivo, além de folhas/emendas da ALESP (SP) e verbas indenizatórias ao vivo da ALMG (MG)."
        breadcrumb="Deputados Estaduais"
        metricas={[
          { valor: "27", label: "Casas Legislativas" },
          {
            valor: totalVagas.toLocaleString("pt-BR"),
            label: "Cadeiras oficiais",
          },
          { valor: "TSE + ALs", label: "ALESP & ALMG", destaque: true },
        ]}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        <AvisoFiscalizacao
          mensagem="Os dados de cada Assembleia Legislativa são carregados sob demanda para garantir rapidez no celular. Clique em qualquer parlamentar para abrir as 8 abas estruturadas de fiscalização."
        />
        <DeputadosExplorer assembleias={assembleias} />
      </div>
    </div>
  );
}
