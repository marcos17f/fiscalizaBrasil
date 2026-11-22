import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Gauge,
  HeartHandshake,
  Info,
  Landmark,
  Mail,
  MapPin,
  Megaphone,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import assembleiasData from "@/data/assembleias.json";
import deputadosEstaduaisData from "@/data/deputados-estaduais.json";
import deputadosFederaisData from "@/data/deputados-federais.json";
import governadoresData from "@/data/governadores.json";
import senadoresData from "@/data/senadores.json";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import type {
  Assembleia,
  DeputadoEstadual,
  DeputadoFederal,
  Governador,
  Senador,
} from "@/types/politicos";

const senadores = senadoresData as Senador[];
const depFederais = deputadosFederaisData as DeputadoFederal[];
const governadores = governadoresData as Governador[];
const assembleias = assembleiasData as Assembleia[];
const bancadas = deputadosEstaduaisData as Record<string, DeputadoEstadual[]>;

const totalDeputadosEstaduais = Object.values(bancadas).reduce(
  (acc, lista) => acc + lista.length,
  0
);
const totalVagasAssembleias = assembleias.reduce((acc, a) => acc + a.vagas, 0);

const ESFERAS = [
  {
    href: "/senadores",
    titulo: "Senadores",
    subtitulo: "Senado Federal",
    descricao:
      "81 senadores com projetos, comissões, votações nominais e cota CEAPS ao vivo da API do Senado + emendas em linguagem simples.",
    badge: `${senadores.length} senadores • API Senado + CEAPS`,
    badgeCor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icone: Scale,
  },
  {
    href: "/deputados-federais",
    titulo: "Deputados Federais",
    subtitulo: "Câmara dos Deputados",
    descricao:
      "513 deputados com projetos, comissões, frentes, votações nominais, presença e despesas CEAP direto da API v2 da Câmara.",
    badge: `${depFederais.length} deputados • Câmara API v2`,
    badgeCor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icone: Landmark,
  },
  {
    href: "/dep-estaduais",
    titulo: "Deputados Estaduais",
    subtitulo: "26 Assembleias + CLDF",
    descricao:
      "Consulte as 27 Assembleias sob demanda com ficha TSE ao vivo, folhas/biografias/emendas da ALESP (SP) e verbas da ALMG (MG).",
    badge: `${totalDeputadosEstaduais} de ${totalVagasAssembleias} • TSE + ALESP + ALMG`,
    badgeCor: "bg-blue-50 text-blue-800 border-blue-200",
    icone: Landmark,
  },
  {
    href: "/governadores",
    titulo: "Governadores",
    subtitulo: "Poder Executivo Estadual",
    descricao:
      "Os 27 governadores em exercício com dados eleitorais ao vivo (TSE 2022/2026), Plano de Governo PDF e balanço fiscal (SICONFI).",
    badge: `${governadores.length} UFs • TSE + SICONFI ao vivo`,
    badgeCor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icone: Building2,
  },
  {
    href: "/prefeitos",
    titulo: "Prefeitos",
    subtitulo: "Poder Executivo Municipal",
    descricao:
      "Todos os 5.570 municípios integrados ao IBGE + TSE 2024 (prefeito, vice, bens e Plano PDF) + SICONFI (receitas e gastos por área).",
    badge: "5.570 cidades • IBGE + TSE + SICONFI",
    badgeCor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icone: MapPin,
  },
  {
    href: "/vereadores",
    titulo: "Vereadores",
    subtitulo: "Câmaras Municipais",
    descricao:
      "Consulta ao vivo de todos os vereadores eleitos em 2024 por estado e município (IBGE + TSE), com foto, partido e perfil em 8 abas.",
    badge: "~58 mil vereadores • TSE 2024 ao vivo",
    badgeCor: "bg-blue-50 text-blue-800 border-blue-200",
    icone: Users,
  },
] as const;

const ATALHOS_INSTITUCIONAIS = [
  {
    href: "/sobre-o-fiscaliza-brasil",
    titulo: "Sobre o Projeto",
    descricao: "Conheça nossa missão, independência e metodologia oficial.",
    icone: Info,
  },
  {
    href: "/politica-explicada",
    titulo: "Política Explicada",
    descricao: "Entenda quem faz o quê antes de fiscalizar.",
    icone: BookOpen,
  },
  {
    href: "/participe",
    titulo: "Participe",
    descricao: "Envie sugestões, correções e fontes oficiais.",
    icone: Users,
  },
  {
    href: "/denuncias",
    titulo: "Denúncias",
    descricao: "Informe fatos de interesse público com protocolo.",
    icone: Megaphone,
  },
  {
    href: "/quem-apoia-o-fiscaliza-brasil",
    titulo: "Apoie o Projeto",
    descricao: "Ajude a manter o portal privado e independente.",
    icone: HeartHandshake,
  },
  {
    href: "/quem-patrocina-o-fiscaliza-brasil",
    titulo: "Patrocine",
    descricao: "Parcerias institucionais para infraestrutura aberta.",
    icone: Sparkles,
  },
  {
    href: "/contato",
    titulo: "Contato",
    descricao: "Fale diretamente com a equipe do Fiscaliza Brasil.",
    icone: Mail,
  },
  {
    href: "/privacidade",
    titulo: "Privacidade (LGPD)",
    descricao: "Regras transparentes de proteção de dados pessoais.",
    icone: ShieldCheck,
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
              Transparência Pública & Controle Social
            </span>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-[1.12]">
              Seu voto escolhe.{" "}
              <span className="text-emerald-300">A informação esclarece.</span>{" "}
              Você fiscaliza.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
              Depois da eleição, você continuou acompanhando quem recebeu o seu
              voto? A democracia não termina na urna — ela continua todos os
              dias.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/deputados-federais"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-emerald px-5 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-emerald-dark"
              >
                Quero acompanhar agora
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/politica-explicada"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-xs transition-colors hover:bg-white/20"
              >
                Política Explicada
              </Link>
            </div>
          </div>

          {/* Métricas */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-xs">
              <p className="text-2xl font-extrabold text-white">
                {senadores.length}
              </p>
              <p className="mt-0.5 text-xs text-slate-300">Senadores</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-xs">
              <p className="text-2xl font-extrabold text-white">
                {depFederais.length}
              </p>
              <p className="mt-0.5 text-xs text-slate-300">Dep. Federais</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-xs">
              <p className="text-2xl font-extrabold text-white">
                {totalDeputadosEstaduais.toLocaleString("pt-BR")}
              </p>
              <p className="mt-0.5 text-xs text-slate-300">Dep. Estaduais</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-xs">
              <p className="text-2xl font-extrabold text-white">
                {governadores.length}
              </p>
              <p className="mt-0.5 text-xs text-slate-300">Governadores</p>
            </div>
            <div className="col-span-2 rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-xs sm:col-span-1">
              <p className="text-2xl font-extrabold text-emerald-300">5.570</p>
              <p className="mt-0.5 text-xs text-slate-300">Municípios (IBGE)</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 sm:py-14">
        <AvisoFiscalizacao
          mensagem="O Fiscaliza Brasil não julga e não emite opiniões político-partidárias. Nosso objetivo é reunir dados públicos de fontes oficiais (Câmara, Senado, TSE, IBGE, Assembleias e Portais da Transparência) em linguagem clara."
        />

        {/* Grid das 6 esferas */}
        <section aria-labelledby="titulo-esferas">
          <div className="mb-6">
            <h2
              id="titulo-esferas"
              className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl"
            >
              Quem representa você?
            </h2>
            <p className="mt-1 text-sm text-brand-muted sm:text-base">
              Acompanhe representantes do município, do estado e da União em um
              só lugar.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${esfera.badgeCor}`}
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
                    Consultar {esfera.titulo.toLowerCase()}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Participação & Institucional */}
        <section aria-labelledby="titulo-cidadao">
          <h2
            id="titulo-cidadao"
            className="text-2xl font-extrabold tracking-tight text-brand-navy"
          >
            Entenda, participe e apoie
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ATALHOS_INSTITUCIONAIS.map((item) => {
              const Icone = item.icone;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-brand-emerald/50 hover:shadow-sm"
                >
                  <Icone className="h-6 w-6 text-brand-emerald" />
                  <h3 className="mt-3 font-bold text-brand-navy group-hover:text-brand-blue">
                    {item.titulo}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {item.descricao}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Diferencial técnico */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-brand-emerald uppercase">
            <Zap className="h-4 w-4" />
            Arquitetura Next.js 15 + TypeScript
          </div>
          <h2 className="mt-2 text-2xl font-extrabold text-brand-navy">
            Todo o portal reconstruído sem o gargalo de 8 MB por página
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-bold text-brand-navy">
                <Gauge className="h-4 w-4 text-brand-emerald" />
                Dados sob demanda
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                Emendas de senadores, projetos/gastos da Câmara e folhas da
                ALESP só são carregados quando o cidadão abre o perfil.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-bold text-brand-navy">
                <CheckCircle2 className="h-4 w-4 text-brand-emerald" />
                Zero truncamento
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                No WordPress original, o bloco de emendas de senadores quebrava
                por limite do editor. Aqui cada recurso tem sua rota de API.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-bold text-brand-navy">
                <MapPin className="h-4 w-4 text-brand-emerald" />
                APIs oficiais ao vivo
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                Câmara API v2, Senado (Projetos, Votações e CEAPS), TSE
                (2022/2024/2026), SICONFI (RREO + LRF), PNCP, IBGE, ALESP e ALMG
                integrados sob demanda.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
