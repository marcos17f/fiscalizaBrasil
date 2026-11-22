import type { Metadata } from "next";
import deputadosFederaisData from "@/data/deputados-federais.json";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import { DeputadosFederaisExplorer } from "@/components/camara/DeputadosFederaisExplorer";
import type { DeputadoFederal } from "@/types/politicos";

export const metadata: Metadata = {
  title: "Deputados Federais",
  description:
    "Acompanhe os 513 deputados federais em exercício com projetos de lei e despesas da Cota Parlamentar diretamente da API oficial da Câmara.",
};

export default function DeputadosFederaisPage() {
  const deputados = deputadosFederaisData as DeputadoFederal[];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-2">
        <p className="text-xs font-bold tracking-wider text-brand-emerald uppercase">
          Câmara dos Deputados • 57ª Legislatura (2023–2027)
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          Deputados Federais em Exercício
        </h1>
        <p className="max-w-2xl text-sm text-brand-muted sm:text-base">
          Pesquise entre os {deputados.length} deputados federais por nome,
          estado ou partido. Ao abrir uma ficha, projetos de lei e despesas da
          Cota Parlamentar são consultados ao vivo na API oficial da Câmara.
        </p>
      </div>

      <AvisoFiscalizacao
        mensagem="Mandato atual: 01/02/2023 até 31/01/2027. Fonte oficial: Câmara dos Deputados — Dados Abertos API v2."
      />

      <DeputadosFederaisExplorer deputados={deputados} />
    </div>
  );
}
