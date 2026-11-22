import type { Metadata } from "next";
import paginasData from "@/data/paginas-institucionais.json";
import { PaginaInstitucionalView } from "@/components/institucional/PaginaInstitucionalView";
import { ParticipeInterativo } from "@/components/institucional/ParticipeInterativo";
import type { PaginaInstitucional } from "@/types/politicos";

const paginas = paginasData as Record<string, PaginaInstitucional>;

export const metadata: Metadata = {
  title: "Participe",
  description:
    "Envie documentos, links oficiais, fotos de obras, vídeos, relatos ou sugestões com geração de protocolo no Fiscaliza Brasil.",
};

export default function ParticipePage() {
  const pagina = paginas["participe"];
  return (
    <PaginaInstitucionalView
      pagina={pagina}
      categoria="Participação Cidadã"
      subtitulo="A transparência cresce quando o cidadão participa. Clique no tipo de envio abaixo para anexar documentos, links oficiais, fotos de obras, vídeos ou sugestões."
      metricas={[
        { valor: "Anexos", label: "PDF, fotos e vídeos", destaque: true },
        { valor: "Protocolo", label: "Gerado na hora" },
      ]}
      mostrarAviso={false}
      topoExtra={<ParticipeInterativo />}
    />
  );
}
