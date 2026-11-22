import type { Metadata } from "next";
import { Camera, FileText, MessageSquarePlus, Video } from "lucide-react";
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

const FORMAS = [
  {
    titulo: "Documentos & Links",
    desc: "Indique editais, diários oficiais ou prestações de contas para verificação.",
    icone: FileText,
  },
  {
    titulo: "Fotos de Obras",
    desc: "Registre placas de obras públicas, prazos e situação real no local.",
    icone: Camera,
  },
  {
    titulo: "Vídeos & Relatos",
    desc: "Compartilhe registros objetivos de interesse público da sua cidade.",
    icone: Video,
  },
  {
    titulo: "Sugestões & Correções",
    desc: "Aponte melhorias, novos temas ou atualizações de cadastro.",
    icone: MessageSquarePlus,
  },
] as const;

export default function ParticipePage() {
  const pagina = paginas["participe"];
  return (
    <PaginaInstitucionalView
      pagina={pagina}
      categoria="Participação Cidadã"
      subtitulo="A transparência cresce quando o cidadão participa. Envie sugestões, fontes oficiais, pedidos de correção ou informações de interesse público com geração de protocolo."
      metricas={[
        { valor: "Protocolo", label: "Gerado na hora", destaque: true },
        { valor: "LGPD", label: "Dados protegidos" },
      ]}
      mostrarAviso={false}
      topoExtra={
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FORMAS.map((item) => {
              const Icone = item.icone;
              return (
                <div
                  key={item.titulo}
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-mint text-brand-emerald">
                    <Icone className="h-5 w-5" />
                  </div>
                  <h2 className="mt-3 text-sm font-bold text-brand-navy">
                    {item.titulo}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mx-auto max-w-4xl">
            <FormularioCidadao
              canal="participe"
              titulo="Participe do Fiscaliza Brasil"
              descricao="Envie sua sugestão, indique uma informação para conferir ou ajude a melhorar nosso conteúdo."
              opcoesAssunto={[
                "Sugerir um tema",
                "Informar um erro ou pedir uma correção",
                "Compartilhar uma informação de interesse público",
                "Enviar documentos, fotos ou vídeos (informar links)",
                "Colaborar com o projeto",
                "Outro assunto",
              ]}
              textoBotao="Enviar participação"
            />
          </div>
        </div>
      }
    />
  );
}
