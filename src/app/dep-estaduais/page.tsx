import type { Metadata } from "next";
import assembleiasData from "@/data/assembleias.json";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import { DeputadosExplorer } from "@/components/deputados/DeputadosExplorer";
import type { Assembleia } from "@/types/politicos";

export const metadata: Metadata = {
  title: "Deputados Estaduais",
  description:
    "Consulte os deputados estaduais e distritais nas 27 Casas Legislativas do Brasil com carregamento sob demanda por estado.",
};

export default function DeputadosEstaduaisPage() {
  const assembleias = assembleiasData as Assembleia[];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-2">
        <p className="text-xs font-bold tracking-wider text-brand-emerald uppercase">
          26 Assembleias Legislativas + CLDF
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          Deputados Estaduais
        </h1>
        <p className="max-w-2xl text-sm text-brand-muted sm:text-base">
          Selecione um estado para consultar a bancada estadual sob demanda via
          API — sem baixar os dados de todos os estados de uma só vez.
        </p>
      </div>

      <AvisoFiscalizacao
        mensagem="Os dados de cada Assembleia Legislativa são carregados sob demanda para garantir rapidez no celular. Clique em um parlamentar para visualizar as 8 abas estruturadas de fiscalização."
      />

      <DeputadosExplorer assembleias={assembleias} />
    </div>
  );
}
