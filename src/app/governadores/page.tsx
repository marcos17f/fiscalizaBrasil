import type { Metadata } from "next";
import governadoresData from "@/data/governadores.json";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import { GovernadoresExplorer } from "@/components/governadores/GovernadoresExplorer";
import type { Governador } from "@/types/politicos";

export const metadata: Metadata = {
  title: "Governadores",
  description:
    "Consulte os 27 governadores do Brasil por estado, região ou partido e acesse o perfil estruturado em 8 abas de transparência.",
};

export default function GovernadoresPage() {
  const governadores = governadoresData as Governador[];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-2">
        <p className="text-xs font-bold tracking-wider text-brand-emerald uppercase">
          Poder Executivo Estadual
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          Governadores do Brasil
        </h1>
        <p className="max-w-2xl text-sm text-brand-muted sm:text-base">
          Acompanhe os representantes das 27 unidades federativas. Filtre por
          nome, estado, região ou partido e clique em qualquer card para abrir o
          perfil completo.
        </p>
      </div>

      <AvisoFiscalizacao
        mensagem="Identificação e períodos do cadastro em conferência editorial contínua. O Fiscaliza Brasil apresenta informações públicas oficiais sem emitir juízo de valor."
        notaEditorial="Referência de extração do cadastro atual: 29/10/2026 • 27 unidades federativas."
      />

      <GovernadoresExplorer governadores={governadores} />
    </div>
  );
}
