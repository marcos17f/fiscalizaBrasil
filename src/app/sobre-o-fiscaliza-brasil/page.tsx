import type { Metadata } from "next";
import { Database, Eye, ShieldCheck } from "lucide-react";
import paginasData from "@/data/paginas-institucionais.json";
import { PaginaInstitucionalView } from "@/components/institucional/PaginaInstitucionalView";
import type { PaginaInstitucional } from "@/types/politicos";

const paginas = paginasData as Record<string, PaginaInstitucional>;

export const metadata: Metadata = {
  title: "Sobre o Fiscaliza Brasil",
  description:
    "Conheça o propósito, a independência e a metodologia de fontes oficiais do Fiscaliza Brasil.",
};

const PILARES = [
  {
    titulo: "100% Independente",
    descricao:
      "Projeto privado, sem vínculo partidário, sem financiamento eleitoral e sem agenda ideológica.",
    icone: ShieldCheck,
  },
  {
    titulo: "Fontes Oficiais",
    descricao:
      "Todos os dados são estruturados a partir de APIs e portais públicos: TSE, Câmara, Senado, SICONFI, PNCP, IBGE e TCEs.",
    icone: Database,
  },
  {
    titulo: "Linguagem Cidadã",
    descricao:
      "Traduzimos termos orçamentários e legislativos para que qualquer brasileiro entenda os fatos.",
    icone: Eye,
  },
] as const;

export default function SobrePage() {
  const pagina = paginas["sobre-o-fiscaliza-brasil"];
  return (
    <PaginaInstitucionalView
      pagina={pagina}
      categoria="Conheça o Projeto"
      subtitulo="Portal Nacional de Informação e Fiscalização Cidadã — criado para aproximar o eleitor das decisões, leis e recursos públicos com total imparcialidade."
      metricas={[
        { valor: "6 esferas", label: "União, Estados e Municípios" },
        { valor: "9+ fontes", label: "APIs oficiais conectadas", destaque: true },
      ]}
      topoExtra={
        <div className="grid gap-4 md:grid-cols-3">
          {PILARES.map((p) => {
            const Icone = p.icone;
            return (
              <div
                key={p.titulo}
                className="card-elevated rounded-2xl border border-slate-200/90 bg-white p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-mint text-brand-emerald">
                  <Icone className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-base font-bold text-brand-navy">
                  {p.titulo}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {p.descricao}
                </p>
              </div>
            );
          })}
        </div>
      }
    />
  );
}
