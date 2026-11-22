import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Landmark, MapPin, Scale, Users } from "lucide-react";
import paginasData from "@/data/paginas-institucionais.json";
import { PaginaInstitucionalView } from "@/components/institucional/PaginaInstitucionalView";
import type { PaginaInstitucional } from "@/types/politicos";

const paginas = paginasData as Record<string, PaginaInstitucional>;

export const metadata: Metadata = {
  title: "Política Explicada",
  description:
    "Entenda em linguagem simples quem decide, quem vota, quem executa e quem fiscaliza no poder público brasileiro.",
};

const MAPA_CARGOS = [
  {
    esfera: "União (Brasil)",
    executivo: "Presidente da República",
    legislativo: "Senadores (81) e Dep. Federais (513)",
    papel: "Leis nacionais, orçamento federal, políticas macro e repasses.",
    links: [
      { href: "/senadores", label: "Senadores", icone: Scale },
      { href: "/deputados-federais", label: "Dep. Federais", icone: Landmark },
    ],
  },
  {
    esfera: "Estados & DF (27)",
    executivo: "Governadores",
    legislativo: "Deputados Estaduais / Distritais",
    papel: "Segurança pública, ensino médio, hospitais estaduais e rodovias.",
    links: [
      { href: "/governadores", label: "Governadores", icone: Building2 },
      { href: "/dep-estaduais", label: "Dep. Estaduais", icone: Landmark },
    ],
  },
  {
    esfera: "Municípios (5.570)",
    executivo: "Prefeitos",
    legislativo: "Vereadores (~58 mil)",
    papel: "Postos de saúde, creches, ruas, iluminação, transporte local e IPTU.",
    links: [
      { href: "/prefeitos", label: "Prefeitos", icone: MapPin },
      { href: "/vereadores", label: "Vereadores", icone: Users },
    ],
  },
] as const;

export default function PoliticaExplicadaPage() {
  const pagina = paginas["politica-explicada"];
  return (
    <PaginaInstitucionalView
      pagina={pagina}
      categoria="Entenda Antes de Fiscalizar"
      subtitulo="Um guia direto, sem jargões e sem partidarismo para você saber quem faz o quê — do Palácio do Planalto à Câmara Municipal da sua cidade."
      metricas={[
        { valor: "3 esferas", label: "União, Estados e Cidades" },
        { valor: "6 cargos", label: "Mapeados no portal", destaque: true },
      ]}
      topoExtra={
        <div className="grid gap-4 lg:grid-cols-3">
          {MAPA_CARGOS.map((item) => (
            <div
              key={item.esfera}
              className="card-elevated flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6"
            >
              <div>
                <span className="inline-block rounded-full bg-brand-mint px-3 py-1 text-[11px] font-bold text-brand-emerald">
                  {item.esfera}
                </span>
                <div className="mt-4 space-y-2 text-xs">
                  <p className="text-slate-600">
                    <strong className="text-brand-navy">Executivo:</strong>{" "}
                    {item.executivo}
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-brand-navy">Legislativo:</strong>{" "}
                    {item.legislativo}
                  </p>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {item.papel}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {item.links.map((lnk) => (
                  <Link
                    key={lnk.href}
                    href={lnk.href}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
                  >
                    {lnk.label}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}
