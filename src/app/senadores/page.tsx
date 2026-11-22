import type { Metadata } from "next";
import senadoresData from "@/data/senadores.json";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import { SenadoresExplorer } from "@/components/senadores/SenadoresExplorer";
import type { Senador } from "@/types/politicos";

export const metadata: Metadata = {
  title: "Senadores",
  description:
    "Conheça os 81 senadores da República, filtre por estado ou partido e consulte emendas parlamentares traduzidas em linguagem simples.",
};

export default function SenadoresPage() {
  const senadores = senadoresData as Senador[];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-2">
        <p className="text-xs font-bold tracking-wider text-brand-emerald uppercase">
          Senado Federal • 81 Parlamentares
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          Senadores em Exercício
        </h1>
        <p className="max-w-2xl text-sm text-brand-muted sm:text-base">
          Consulte os representantes do seu estado no Senado Federal. Clique em
          qualquer senador para abrir a ficha completa com emendas parlamentares
          carregadas sob demanda.
        </p>
      </div>

      <AvisoFiscalizacao
        mensagem="Dados parlamentares obtidos da API de Dados Abertos do Senado Federal, combinados com o histórico de emendas parlamentares do Portal da Transparência (CGU) em linguagem clara."
      />

      <SenadoresExplorer senadores={senadores} />
    </div>
  );
}
