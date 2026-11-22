import type { Metadata } from "next";
import paginasData from "@/data/paginas-institucionais.json";
import { PaginaInstitucionalView } from "@/components/institucional/PaginaInstitucionalView";
import type { PaginaInstitucional } from "@/types/politicos";

const paginas = paginasData as Record<string, PaginaInstitucional>;

export const metadata: Metadata = {
  title: "Patrocine o Fiscaliza Brasil",
  description:
    "Entenda como empresas e apoiadores institucionais podem patrocinar a infraestrutura de dados abertos do Fiscaliza Brasil.",
};

export default function PatrocinePage() {
  const pagina = paginas["quem-patrocina-o-fiscaliza-brasil"];
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <PaginaInstitucionalView
        pagina={pagina}
        categoria="Patrocínio Institucional"
      />
    </div>
  );
}
