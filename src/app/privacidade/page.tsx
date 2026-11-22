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
    <PaginaInstitucionalView
      pagina={pagina}
      categoria="LGPD & Transparência"
      subtitulo="Saiba como o Fiscaliza Brasil trata, protege e respeita os seus dados pessoais em total conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)."
      metricas={[
        { valor: "LGPD", label: "Lei 13.709/2018", destaque: true },
      ]}
      mostrarAviso={false}
    />
  );
}
