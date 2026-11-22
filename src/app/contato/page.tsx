import type { Metadata } from "next";
import { Mail, MessageSquare, ShieldCheck } from "lucide-react";
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
    <PaginaInstitucionalView
      pagina={pagina}
      categoria="Atendimento & Canais"
      subtitulo="Fale diretamente com a equipe do Fiscaliza Brasil para esclarecimentos, pedidos de correção com fonte oficial, imprensa ou parcerias."
      metricas={[
        { valor: "Protocolo", label: "Em todo envio", destaque: true },
        { valor: "LGPD", label: "Atendimento seguro" },
      ]}
      mostrarAviso={false}
      topoExtra={
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <MessageSquare className="h-5 w-5 text-brand-emerald" />
              <h2 className="mt-3 text-sm font-bold text-brand-navy">
                Dúvidas & Sugestões
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Perguntas sobre o funcionamento do portal, metodologia e novas
                áreas.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <ShieldCheck className="h-5 w-5 text-brand-blue" />
              <h2 className="mt-3 text-sm font-bold text-brand-navy">
                Correção de Dados
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Encontrou divergência em algum registro? Envie o link da fonte
                oficial para revisão rápida.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <Mail className="h-5 w-5 text-brand-navy" />
              <h2 className="mt-3 text-sm font-bold text-brand-navy">
                Imprensa & Parcerias
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Contato para apoio institucional, patrocínio ou entrevistas
                sobre o projeto.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-4xl">
            <FormularioCidadao
              canal="contato"
              titulo="Envie sua mensagem"
              descricao="Dúvidas sobre o portal, solicitações de esclarecimento, correções ou comunicação de problemas técnicos."
              textoBotao="Enviar mensagem"
            />
          </div>
        </div>
      }
    />
  );
}
