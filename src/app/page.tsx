import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Gauge,
  Landmark,
  MapPin,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import assembleiasData from "@/data/assembleias.json";
import deputadosData from "@/data/deputados-estaduais.json";
import governadoresData from "@/data/governadores.json";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import type { Assembleia, DeputadoEstadual, Governador } from "@/types/politicos";

const governadores = governadoresData as Governador[];
const assembleias = assembleiasData as Assembleia[];
const bancadas = deputadosData as Record<string, DeputadoEstadual[]>;

const totalDeputados = Object.values(bancadas).reduce(
  (acc, lista) => acc + lista.length,
  0
);
const totalVagasAssembleias = assembleias.reduce((acc, a) => acc + a.vagas, 0);

const ESFERAS = [
  {
    href: "/governadores",
    titulo: "Governadores",
    subtitulo: "Poder Executivo Estadual",
    descricao:
      "Consulte os 27 governadores com dados eleitorais ao vivo do TSE (chapa, vice, bens, plano de governo) e finanças reais do Estado via SICONFI.",
    badge: `${governadores.length} UFs • TSE + SICONFI ao vivo`,
    badgeCor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icone: Building2,
  },
  {
    href: "/dep-estaduais",
    titulo: "Deputados Estaduais",
    subtitulo: "26 Assembleias + CLDF",
    descricao:
      "Navegue pelas 27 Casas Legislativas sob demanda por UF, com ficha eleitoral do TSE ao vivo e verbas indenizatórias reais na ALMG (MG).",
    badge: `${totalDeputados} de ${totalVagasAssembleias} • TSE + ALMG`,
    badgeCor: "bg-blue-50 text-blue-800 border-blue-200",
    icone: Landmark,
  },
  {
    href: "/prefeitos",
    titulo: "Prefeitos",
    subtitulo: "Poder Executivo Municipal",
    descricao:
      "Todos os 5.570 municípios conectados ao IBGE + TSE 2024 (prefeito, vice, bens e plano de governo PDF) + SICONFI (receitas e gastos por área).",
    badge: "5.570 cidades • IBGE + TSE + SICONFI",
    badgeCor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icone: MapPin,
  },
  {
    href: "/vereadores",
    titulo: "Vereadores",
    subtitulo: "Câmaras Municipais",
    descricao:
      "Consulta ao vivo de todos os vereadores eleitos em 2024 por estado e município (IBGE + TSE), com foto, partido e perfil completo em 8 abas.",
    badge: "~58 mil vereadores • TSE 2024 ao vivo",
    badgeCor: "bg-blue-50 text-blue-800 border-blue-200",
    icone: Users,
  },
] as const;

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-blue to-brand-navy text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(8,127,91,0.35),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3.5 py-1 text-xs font-semibold text-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Controle Social & Dados Públicos Oficiais
            </span>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-[1.12]">
              Seu voto escolhe.{" "}
              <span className="text-emerald-300">A informação esclarece.</span>{" "}
              Você fiscaliza.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
              A democracia não termina na urna. Acompanhe quem representa você
              nos estados e municípios em um só lugar — com navegação rápida no
              celular e dados organizados a partir de fontes oficiais.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/governadores"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-emerald px-5 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-emerald-dark"
              >
                Consultar Governadores
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dep-estaduais"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-xs transition-colors hover:bg-white/20"
              >
                Explorar Assembleias (27 UFs)
              </Link>
            </div>
          </div>

          {/* Métricas rápidas */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-xs">
              <p className="text-2xl font-extrabold text-white">27</p>
              <p className="mt-0.5 text-xs text-slate-300">Governadores (UFs)</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-xs">
              <p className="text-2xl font-extrabold text-white">
                {totalDeputados.toLocaleString("pt-BR")}
              </p>
              <p className="mt-0.5 text-xs text-slate-300">
                Deputados Estaduais
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-xs">
              <p className="text-2xl font-extrabold text-white">5.570</p>
              <p className="mt-0.5 text-xs text-slate-300">
                Municípios (API IBGE)
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-xs">
              <p className="text-2xl font-extrabold text-emerald-300">~99%</p>
              <p className="mt-0.5 text-xs text-slate-300">
                Menos peso por página
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 sm:py-14">
        <AvisoFiscalizacao
          mensagem="O Fiscaliza Brasil não julga e não emite opiniões político-partidárias. Nosso objetivo é reunir dados públicos de fontes oficiais (TSE, IBGE, Assembleias e Portais da Transparência) em linguagem clara para o cidadão."
        />

        {/* Grid das 4 esferas */}
        <section aria-labelledby="titulo-esferas">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2
                id="titulo-esferas"
                className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl"
              >
                Quem representa você?
              </h2>
              <p className="mt-1 text-sm text-brand-muted sm:text-base">
                Escolha uma das 4 esferas solicitadas para testar a navegação,
                filtros e estrutura de perfil.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {ESFERAS.map((esfera) => {
              const Icone = esfera.icone;
              return (
                <Link
                  key={esfera.href}
                  href={esfera.href}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-mint text-brand-emerald transition-colors group-hover:bg-brand-emerald group-hover:text-white">
                        <Icone className="h-6 w-6" />
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${esfera.badgeCor}`}
                      >
                        {esfera.badge}
                      </span>
                    </div>

                    <p className="mt-4 text-xs font-semibold tracking-wide text-brand-muted uppercase">
                      {esfera.subtitulo}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-brand-navy group-hover:text-brand-blue">
                      {esfera.titulo}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {esfera.descricao}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-brand-blue">
                    Acessar {esfera.titulo.toLowerCase()}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Diferencial técnico */}
        <section
          aria-labelledby="titulo-arquitetura"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
        >
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-brand-emerald uppercase">
            <Zap className="h-4 w-4" />
            Diagnóstico Técnico & Evolução
          </div>
          <h2
            id="titulo-arquitetura"
            className="mt-2 text-2xl font-extrabold text-brand-navy"
          >
            Por que esta arquitetura carrega instantaneamente no celular?
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Na análise do site atual em WordPress, identificamos que scripts
            globais injetam mais de <strong>8 MB de dados inline</strong> em
            todas as páginas (inclusive na Home e em Prefeitos). Neste protótipo
            em Next.js + TypeScript, os dados são separados por estado e
            carregados sob demanda via API.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-bold text-brand-navy">
                <Gauge className="h-4 w-4 text-brand-emerald" />
                Sob demanda por UF
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                Ao selecionar um estado em Deputados Estaduais, apenas a bancada
                daquela Assembleia é baixada via{" "}
                <code className="rounded bg-slate-200/70 px-1 py-0.5 text-[11px]">
                  /api/dep-estaduais/[uf]
                </code>
                .
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-bold text-brand-navy">
                <CheckCircle2 className="h-4 w-4 text-brand-emerald" />
                100% Tipado & Modular
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                Um único componente de perfil em 8 abas atende todas as esferas,
                eliminando duplicação de plugins e facilita futuras atualizações
                do TSE.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-bold text-brand-navy">
                <MapPin className="h-4 w-4 text-brand-emerald" />
                Pronto para Escala Municipal
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                Prefeitos (5.570) e Vereadores (~58 mil) consultam o IBGE ao
                vivo e suportam banco relacional (PostgreSQL) ou JSON por UF.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
