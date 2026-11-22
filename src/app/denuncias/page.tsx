import type { Metadata } from "next";
import { ExternalLink, FileWarning, Lock, ShieldAlert } from "lucide-react";
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
    <PaginaInstitucionalView
      pagina={pagina}
      categoria="Controle Social • Canal de Relatos"
      subtitulo="Informe fatos objetivos de interesse público envolvendo obras, contratos, serviços ou uso de recursos públicos. Todo registro gera protocolo imediato."
      metricas={[
        { valor: "Protocolo", label: "Rastreável na hora", destaque: true },
        { valor: "Verificação", label: "Fatos e fontes oficiais" },
      ]}
      topoExtra={
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <FileWarning className="h-5 w-5 text-brand-emerald" />
              <h2 className="mt-3 text-sm font-bold text-brand-navy">
                Foco em fatos verificáveis
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Sempre que possível, inclua datas, cidade, órgão público, número
                de contrato/edital e links oficiais.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <Lock className="h-5 w-5 text-brand-blue" />
              <h2 className="mt-3 text-sm font-bold text-brand-navy">
                Cuidado com a LGPD
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Evite enviar CPF, endereço residencial ou dados sensíveis de
                terceiros não relacionados a atos públicos.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <ShieldAlert className="h-5 w-5 text-brand-alert" />
              <h2 className="mt-3 text-sm font-bold text-brand-navy">
                Canais oficiais de apuração
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Para investigação formal, protocole também na Ouvidoria oficial:{" "}
                <a
                  href="https://falabr.cgu.gov.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 font-bold text-brand-blue hover:underline"
                >
                  Fala.BR (CGU)
                  <ExternalLink className="h-3 w-3" />
                </a>
                .
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-4xl">
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
        </div>
      }
    />
  );
}
