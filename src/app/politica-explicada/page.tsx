import type { Metadata } from "next";
import paginasData from "@/data/paginas-institucionais.json";
import { PaginaInstitucionalView } from "@/components/institucional/PaginaInstitucionalView";
import type { PaginaInstitucional } from "@/types/politicos";

const paginas = paginasData as Record<string, PaginaInstitucional>;

export const metadata: Metadata = {
  title: "Política Explicada",
  description:
    "Entenda em linguagem simples quem decide, quem vota, quem executa e quem fiscaliza no poder público brasileiro.",
};

export default function PoliticaExplicadaPage() {
  const pagina = paginas["politica-explicada"];
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <PaginaInstitucionalView
        pagina={pagina}
        categoria="Entenda Antes de Fiscalizar"
      />
    </div>
  );
}
