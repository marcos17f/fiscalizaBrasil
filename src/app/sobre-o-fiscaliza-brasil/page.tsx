import type { Metadata } from "next";
import paginasData from "@/data/paginas-institucionais.json";
import { PaginaInstitucionalView } from "@/components/institucional/PaginaInstitucionalView";
import type { PaginaInstitucional } from "@/types/politicos";

const paginas = paginasData as Record<string, PaginaInstitucional>;

export const metadata: Metadata = {
  title: "Sobre o Fiscaliza Brasil",
  description:
    "Conheça o propósito, a independência e a metodologia de fontes oficiais do Fiscaliza Brasil.",
};

export default function SobrePage() {
  const pagina = paginas["sobre-o-fiscaliza-brasil"];
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <PaginaInstitucionalView
        pagina={pagina}
        categoria="Conheça o Projeto"
      />
    </div>
  );
}
