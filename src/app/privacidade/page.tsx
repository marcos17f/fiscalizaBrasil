import type { Metadata } from "next";
import paginasData from "@/data/paginas-institucionais.json";
import { PaginaInstitucionalView } from "@/components/institucional/PaginaInstitucionalView";
import type { PaginaInstitucional } from "@/types/politicos";

const paginas = paginasData as Record<string, PaginaInstitucional>;

export const metadata: Metadata = {
  title: "Política de Privacidade (LGPD)",
  description:
    "Política de Privacidade e tratamento de dados pessoais do Fiscaliza Brasil conforme a LGPD (Lei nº 13.709/2018).",
};

export default function PrivacidadePage() {
  const paginaBruta = paginas["privacy-policy"];
  const pagina: PaginaInstitucional = {
    ...paginaBruta,
    titulo: "Política de Privacidade (LGPD)",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <PaginaInstitucionalView
        pagina={pagina}
        categoria="LGPD & Transparência"
        mostrarAviso={false}
      />
    </div>
  );
}
