import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Server, ShieldCheck } from "lucide-react";
import paginasData from "@/data/paginas-institucionais.json";
import { PaginaInstitucionalView } from "@/components/institucional/PaginaInstitucionalView";
import type { PaginaInstitucional } from "@/types/politicos";

const paginas = paginasData as Record<string, PaginaInstitucional>;

export const metadata: Metadata = {
  title: "Apoie o Fiscaliza Brasil",
  description:
    "Saiba como apoiar a manutenção e a independência do portal Fiscaliza Brasil.",
};

export default function ApoiePage() {
  const pagina = paginas["quem-apoia-o-fiscaliza-brasil"];
  return (
    <PaginaInstitucionalView
      pagina={pagina}
      categoria="Ajude a Manter o Projeto"
      subtitulo="O Fiscaliza Brasil é independente e aberto gratuitamente a toda a população. Seu apoio mantém os servidores, a coleta de dados oficiais e a conferência editorial."
      metricas={[
        { valor: "Gratuito", label: "Para todo cidadão" },
        { valor: "0%", label: "Verba partidária", destaque: true },
      ]}
      topoExtra={
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card-elevated rounded-2xl border border-slate-200/90 bg-white p-6">
            <Server className="h-5 w-5 text-brand-emerald" />
            <h2 className="mt-3 text-base font-bold text-brand-navy">
              Infraestrutura & APIs
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              Mantém o portal rápido no celular, com cache, monitoramento e
              integração contínua às fontes oficiais.
            </p>
          </div>
          <div className="card-elevated rounded-2xl border border-slate-200/90 bg-white p-6">
            <ShieldCheck className="h-5 w-5 text-brand-blue" />
            <h2 className="mt-3 text-base font-bold text-brand-navy">
              Independência Editorial
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              Apoiadores não interferem na metodologia, nos dados publicados nem
              na linha imparcial do portal.
            </p>
          </div>
          <div className="card-elevated flex flex-col justify-between rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6">
            <div>
              <HeartHandshake className="h-5 w-5 text-brand-emerald" />
              <h2 className="mt-3 text-base font-bold text-brand-navy">
                Quer apoiar ou colaborar?
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                Entre em contato com a equipe para conhecer as modalidades de
                apoio cidadão.
              </p>
            </div>
            <Link
              href="/contato"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-emerald hover:underline"
            >
              Falar com a equipe
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      }
    />
  );
}
