import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Scale, Sparkles } from "lucide-react";
import paginasData from "@/data/paginas-institucionais.json";
import { PaginaInstitucionalView } from "@/components/institucional/PaginaInstitucionalView";
import type { PaginaInstitucional } from "@/types/politicos";

const paginas = paginasData as Record<string, PaginaInstitucional>;

export const metadata: Metadata = {
  title: "Patrocine o Fiscaliza Brasil",
  description:
    "Entenda como empresas e apoiadores institucionais podem patrocinar a infraestrutura de dados abertos do Fiscaliza Brasil.",
};

export default function PatrocinePage() {
  const pagina = paginas["quem-patrocina-o-fiscaliza-brasil"];
  return (
    <PaginaInstitucionalView
      pagina={pagina}
      categoria="Patrocínio Institucional"
      subtitulo="Parcerias transparentes com empresas e instituições que valorizam cidadania, transparência pública e dados verificáveis — com blindagem editorial total."
      metricas={[
        { valor: "Nacional", label: "Alcance nos 27 estados" },
        { valor: "100%", label: "Blindagem editorial", destaque: true },
      ]}
      topoExtra={
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card-elevated rounded-2xl border border-slate-200/90 bg-white p-6">
            <Scale className="h-5 w-5 text-brand-emerald" />
            <h2 className="mt-3 text-base font-bold text-brand-navy">
              Regras claras de patrocínio
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              Não aceitamos patrocínio de partidos políticos, campanhas
              eleitorais ou agentes que busquem influência editorial.
            </p>
          </div>
          <div className="card-elevated rounded-2xl border border-slate-200/90 bg-white p-6">
            <Building2 className="h-5 w-5 text-brand-blue" />
            <h2 className="mt-3 text-base font-bold text-brand-navy">
              Impacto cívico real
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              Sua marca apoia diretamente o acesso gratuito da população a dados
              abertos em 5.570 municípios.
            </p>
          </div>
          <div className="card-elevated flex flex-col justify-between rounded-2xl border border-blue-200 bg-blue-50/60 p-6">
            <div>
              <Sparkles className="h-5 w-5 text-brand-blue" />
              <h2 className="mt-3 text-base font-bold text-brand-navy">
                Proposta institucional
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                Converse com a coordenação do Fiscaliza Brasil sobre cotas de
                patrocínio institucional.
              </p>
            </div>
            <Link
              href="/contato"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline"
            >
              Solicitar apresentação
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      }
    />
  );
}
