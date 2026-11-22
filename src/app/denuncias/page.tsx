import type { Metadata } from "next";
import paginasData from "@/data/paginas-institucionais.json";
import { FormularioCidadao } from "@/components/institucional/FormularioCidadao";
import { PaginaInstitucionalView } from "@/components/institucional/PaginaInstitucionalView";
import type { PaginaInstitucional } from "@/types/politicos";

const paginas = paginasData as Record<string, PaginaInstitucional>;

export const metadata: Metadata = {
  title: "Denúncias",
  description:
    "Espaço para informar fatos de interesse público envolvendo órgãos, obras, contratos ou recursos públicos com geração de protocolo.",
};

export default function DenunciasPage() {
  const pagina = paginas["denuncias"];
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <PaginaInstitucionalView
        pagina={pagina}
        categoria="Participação Cidadã"
      />
      <FormularioCidadao
        canal="denuncias"
        titulo="Registrar relato de interesse público"
        descricao="As informações recebidas são registradas para análise e verificação. Um número de protocolo será gerado ao enviar."
        opcoesAssunto={[
          "Obra pública ou infraestrutura",
          "Contrato ou licitação",
          "Serviço público (saúde, educação, transporte)",
          "Uso de recursos ou emendas parlamentares",
          "Outro fato de interesse público",
        ]}
        textoBotao="Registrar e gerar protocolo"
      />
    </div>
  );
}
