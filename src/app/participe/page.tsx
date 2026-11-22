import type { Metadata } from "next";
import paginasData from "@/data/paginas-institucionais.json";
import { FormularioCidadao } from "@/components/institucional/FormularioCidadao";
import { PaginaInstitucionalView } from "@/components/institucional/PaginaInstitucionalView";
import type { PaginaInstitucional } from "@/types/politicos";

const paginas = paginasData as Record<string, PaginaInstitucional>;

export const metadata: Metadata = {
  title: "Participe",
  description:
    "Envie sua sugestão, indique uma fonte oficial para conferência ou colabore com o Fiscaliza Brasil.",
};

export default function ParticipePage() {
  const pagina = paginas["participe"];
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <FormularioCidadao
        canal="participe"
        titulo="Participe do Fiscaliza Brasil"
        descricao="Envie sua sugestão, indique uma informação para conferir ou ajude a melhorar nosso conteúdo."
        opcoesAssunto={[
          "Sugerir um tema",
          "Informar um erro ou pedir uma correção",
          "Compartilhar uma informação de interesse público",
          "Colaborar com o projeto",
          "Outro assunto",
        ]}
        textoBotao="Enviar participação"
      />
      <PaginaInstitucionalView
        pagina={pagina}
        categoria="Participação Cidadã"
        mostrarAviso={false}
      />
    </div>
  );
}
