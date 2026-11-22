import type { Metadata } from "next";
import paginasData from "@/data/paginas-institucionais.json";
import { FormularioCidadao } from "@/components/institucional/FormularioCidadao";
import { PaginaInstitucionalView } from "@/components/institucional/PaginaInstitucionalView";
import type { PaginaInstitucional } from "@/types/politicos";

const paginas = paginasData as Record<string, PaginaInstitucional>;

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a equipe do Fiscaliza Brasil para dúvidas, correções ou assuntos gerais.",
};

export default function ContatoPage() {
  const pagina = paginas["contato"];
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <PaginaInstitucionalView
        pagina={pagina}
        categoria="Atendimento & Canais"
        mostrarAviso={false}
      />
      <FormularioCidadao
        canal="contato"
        titulo="Envie sua mensagem"
        descricao="Dúvidas sobre o portal, solicitações de esclarecimento ou comunicação de problemas técnicos."
        textoBotao="Enviar mensagem"
      />
    </div>
  );
}
