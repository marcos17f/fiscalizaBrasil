import type { Metadata } from "next";
import paginasData from "@/data/paginas-institucionais.json";
import { PaginaInstitucionalView } from "@/components/institucional/PaginaInstitucionalView";
import type { PaginaInstitucional } from "@/types/politicos";

const paginas = paginasData as Record<string, PaginaInstitucional>;

export const metadata: Metadata = {
  title: "Apoie o Fiscaliza Brasil",
  description:
    "Saiba como apoiar a manutenção e a independência do portal Fiscaliza Brasil.",
};

export default function ApoiePage() {
  const pagina = paginas["quem-apoia-o-fiscaliza-brasil"];
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <PaginaInstitucionalView
        pagina={pagina}
        categoria="Ajude a Manter o Projeto"
      />
    </div>
  );
}
