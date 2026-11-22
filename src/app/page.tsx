import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Building2,
  Camera,
  CheckCircle2,
  Database,
  FileSearch,
  FileText,
  Globe2,
  HeartHandshake,
  HelpCircle,
  Landmark,
  Mail,
  MapPin,
  Megaphone,
  MessageSquarePlus,
  Scale,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import assembleiasData from "@/data/assembleias.json";
import deputadosEstaduaisData from "@/data/deputados-estaduais.json";
import deputadosFederaisData from "@/data/deputados-federais.json";
import governadoresData from "@/data/governadores.json";
import senadoresData from "@/data/senadores.json";
import { BuscaRapidaHome } from "@/components/home/BuscaRapidaHome";
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

const PERGUNTAS_CIDADAOS = [
  {
    numero: "01",
    titulo: "Como seu deputado e senador votaram?",
    descricao:
      "Consulte votações nominais em plenário, projetos de autoria e comissões sem depender de recortes de redes sociais.",
    href: "/senadores",
    cta: "Ver votações e projetos",
  },
  {
    numero: "02",
    titulo: "Para onde foram as emendas parlamentares?",
    descricao:
      "Acompanhe valores indicados e pagos em linguagem simples, área beneficiada e situação de cada repasse.",
    href: "/senadores",
    cta: "Consultar emendas",
  },
  {
    numero: "03",
    titulo: "Quanto sua Prefeitura aplicou em Saúde e Educação?",
    descricao:
      "Veja o balanço orçamentário real dos 5.570 municípios no SICONFI, além do limite de pessoal da LRF.",
    href: "/prefeitos",
    cta: "Consultar sua cidade",
  },
  {
    numero: "04",
    titulo: "Quais compras e editais estão acontecendo agora?",
    descricao:
      "Confira licitações recentes no PNCP e compare com o Plano de Governo protocolado no TSE.",
    href: "/governadores",
    cta: "Ver editais e planos",
  },
] as const;

const ESFERAS = [
  {
    href: "/senadores",
    titulo: "Senadores",
    subtitulo: "Senado Federal • União",
    descricao:
      "Conheça os representantes do seu estado no Senado Federal com projetos, comissões, votações nominais, cota CEAPS e emendas traduzidas.",
    itens: [
      "Autorias e votações nominais ao vivo",
      "Despesas da cota parlamentar (CEAPS)",
      "Emendas em linguagem simples",
    ],
    badge: `${senadores.length} senadores • API Senado`,
    badgeCor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icone: Scale,
  },
  {
    href: "/deputados-federais",
    titulo: "Deputados Federais",
    subtitulo: "Câmara dos Deputados • União",
    descricao:
      "Acompanhe quem representa seu estado na Câmara Federal com proposições, frentes, presença em sessões e notas fiscais da cota CEAP.",
    itens: [
      "Projetos de lei com link de tramitação",
      "Comissões, frentes e presença recente",
      "Gastos da cota parlamentar (CEAP)",
    ],
    badge: `${depFederais.length} deputados • API Câmara`,
    badgeCor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icone: Landmark,
  },
  {
    href: "/dep-estaduais",
    titulo: "Deputados Estaduais",
    subtitulo: "26 Assembleias + CLDF • Estados",
    descricao:
      "Veja quem atua na Assembleia Legislativa do seu estado com ficha TSE ao vivo, folhas e emendas da ALESP (SP) e verbas da ALMG (MG).",
    itens: [
      "27 Casas Legislativas sob demanda",
      "Bens e histórico eleitoral (TSE)",
      "Folha/Emendas ALESP e Verba ALMG",
    ],
    badge: `${totalDeputadosEstaduais} de ${totalVagasAssembleias} • 27 UFs`,
    badgeCor: "bg-blue-50 text-blue-800 border-blue-200",
    icone: Landmark,
  },
  {
    href: "/governadores",
    titulo: "Governadores",
    subtitulo: "Poder Executivo • Estados e DF",
    descricao:
      "Acompanhe o governo do seu estado com chapa eleita no TSE, Plano de Governo PDF, finanças do SICONFI, LRF e licitações do PNCP.",
    itens: [
      "Orçamento realizado e gastos por área",
      "Indicador de pessoal (LRF) e PNCP",
      "Chapa, bens (TSE) e link dos 27 TCEs",
    ],
    badge: `${governadores.length} UFs • TSE + SICONFI + PNCP`,
    badgeCor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icone: Building2,
  },
  {
    href: "/prefeitos",
    titulo: "Prefeitos",
    subtitulo: "Poder Executivo • 5.570 Municípios",
    descricao:
      "Acompanhe a administração da sua cidade: prefeito e vice eleitos (TSE 2024), Plano de Governo PDF, receitas/despesas SICONFI e PNCP.",
    itens: [
      "Todos os 5.570 municípios (IBGE + TSE)",
      "Receita, empenhado, liquidado e pago",
      "Editais recentes no PNCP e limite LRF",
    ],
    badge: "5.570 cidades • Ao vivo",
    badgeCor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icone: MapPin,
  },
  {
    href: "/vereadores",
    titulo: "Vereadores",
    subtitulo: "Câmaras Municipais • ~58 mil cadeiras",
    descricao:
      "Descubra quem representa a população na Câmara Municipal da sua cidade com vereadores eleitos em 2024, bens no TSE e orçamento legislativo.",
    itens: [
      "Lista de eleitos por cidade (TSE 2024)",
      "Perfil completo em 8 abas por vereador",
      "Custo anual do Legislativo (SICONFI)",
    ],
    badge: "~58 mil vereadores • TSE 2024",
    badgeCor: "bg-blue-50 text-blue-800 border-blue-200",
    icone: Users,
  },
] as const;

const PILARES_ENCONTRA = [
  {
    titulo: "Senado Federal",
    descricao:
      "Senadores, projetos de autoria, votações nominais, comissões, emendas e despesas CEAPS.",
    href: "/senadores",
    icone: Scale,
  },
  {
    titulo: "Câmara Federal",
    descricao:
      "Deputados, proposições, comissões, frentes parlamentares, presença e cota CEAP.",
    href: "/deputados-federais",
    icone: Landmark,
  },
  {
    titulo: "Assembleias Legislativas",
    descricao:
      "Acompanhe a atuação legislativa nas 27 unidades federativas, com folha ALESP e verbas ALMG.",
    href: "/dep-estaduais",
    icone: Building2,
  },
  {
    titulo: "Câmaras Municipais",
    descricao:
      "Conheça os vereadores eleitos da sua cidade, bens declarados e o custo anual da Câmara.",
    href: "/vereadores",
    icone: Users,
  },
  {
    titulo: "Transparência & Finanças",
    descricao:
      "Receitas, despesas por função (Saúde, Educação, Segurança), limite LRF e editais no PNCP.",
    href: "/prefeitos",
    icone: BarChart3,
  },
  {
    titulo: "Política Explicada",
    descricao:
      "Entenda as competências de cada cargo e saiba ler dados públicos com critérios objetivos.",
    href: "/politica-explicada",
    icone: BookOpen,
  },
] as const;

const PASSOS_COMO_FUNCIONA = [
  {
    numero: "01",
    titulo: "Brasil",
    descricao:
      "Comece pela visão nacional: Senado Federal e Câmara dos Deputados.",
  },
  {
    numero: "02",
    titulo: "Estado",
    descricao:
      "Escolha seu estado para consultar o Governador e a Assembleia Legislativa.",
  },
  {
    numero: "03",
    titulo: "Município",
    descricao:
      "Localize sua cidade entre os 5.570 municípios brasileiros pelo IBGE.",
  },
  {
    numero: "04",
    titulo: "Representantes",
    descricao:
      "Veja quem foi eleito, patrimônio declarado, plano de governo e atuação.",
  },
  {
    numero: "05",
    titulo: "Fiscalize",
    descricao:
      "Acompanhe votos, emendas, contas e licitações — e tire suas conclusões.",
  },
] as const;

const FASES_ORCAMENTO = [
  {
    etapa: "1. Previsto",
    resumo: "Quanto foi planejado arrecadar ou gastar no orçamento anual.",
    cor: "bg-slate-400",
  },
  {
    etapa: "2. Empenhado",
    resumo: "Recurso reservado para pagar uma compra, obra ou contrato.",
    cor: "bg-sky-400",
  },
  {
    etapa: "3. Liquidado",
    resumo: "Serviço ou entrega conferido e atestado pelo órgão público.",
    cor: "bg-blue-400",
  },
  {
    etapa: "4. Pago",
    resumo: "Dinheiro efetivamente transferido da conta pública ao fornecedor.",
    cor: "bg-emerald-400",
  },
] as const;

const ASSUNTOS_ACOMPANHAR = [
  {
    tag: "Poder Público • Emendas",
    titulo:
      "Emendas Parlamentares em linguagem simples: do valor indicado ao pago",
    descricao:
      "Entenda a diferença entre dinheiro prometido e dinheiro que efetivamente chegou à ponta. Consulte os repasses dos senadores e da ALESP por área e recebedor.",
    href: "/senadores",
    cta: "Explorar emendas no Senado",
  },
  {
    tag: "Transparência • Contas Públicas",
    titulo: "Saúde, Educação e Limite da LRF: como está o caixa da sua cidade?",
    descricao:
      "Com dados oficiais do Tesouro Nacional (SICONFI), você confere quanto sua Prefeitura e seu Estado arrecadaram, onde gastaram e se respeitam o limite de pessoal.",
    href: "/prefeitos",
    cta: "Consultar contas da sua cidade",
  },
  {
    tag: "Controle Social • Licitações & Planos",
    titulo:
      "Promessas registradas no TSE vs. compras públicas recentes no PNCP",
    descricao:
      "Acesse o PDF oficial do Plano de Governo de prefeitos e governadores e compare com os editais e contratações publicados recentemente no PNCP.",
    href: "/governadores",
    cta: "Conferir planos e editais",
  },
] as const;

const ACOES_PARTICIPACAO = [
  { label: "Enviar documentos", href: "/participe", icone: FileText },
  { label: "Enviar fotos", href: "/participe", icone: Camera },
  { label: "Enviar vídeos", href: "/participe", icone: Video },
  {
    label: "Sugerir pauta ou correção",
    href: "/participe",
    icone: MessageSquarePlus,
  },
  {
    label: "Comunicar possível irregularidade",
    href: "/denuncias",
    icone: ShieldAlert,
  },
] as const;

const FONTES_OFICIAIS = [
  "Senado Federal (Dados Abertos & CEAPS)",
  "Câmara dos Deputados (API v2)",
  "TSE DivulgaCandContas (2022, 2024 e 2026)",
  "SICONFI / Tesouro Nacional (RREO & RGF)",
  "PNCP — Portal Nacional de Contratações",
  "IBGE — Localidades (5.570 municípios)",
  "Portal da Transparência (CGU) & Fala.BR",
  "27 Tribunais de Contas (TCEs/TCMs)",
  "ALESP (SP) & ALMG (MG)",
] as const;

function SectionEyebrow({
  texto,
  claro = false,
}: {
  texto: string;
  claro?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`h-0.5 w-6 rounded-full ${
          claro ? "bg-emerald-400" : "bg-brand-emerald"
        }`}
      />
      <p
        className={`text-[11px] font-bold tracking-[0.14em] uppercase ${
          claro ? "text-emerald-300" : "text-brand-emerald"
        }`}
      >
        {texto}
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* 1. HERO EDITORIAL DARK NAVY COM TEXTURA CÍVICA */}
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="bg-civic-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-24 right-0 h-[480px] w-[480px] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-[320px] w-[420px] rounded-full bg-blue-500/15 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-22 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-200 backdrop-blur-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Depois da eleição...
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[54px] lg:leading-[1.06]">
                Você continuou acompanhando quem recebeu o{" "}
                <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                  seu voto?
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Você escolheu quem deveria representar seus interesses. Depois da
                urna, essas pessoas continuaram tomando decisões, criando leis e
                utilizando recursos públicos. No{" "}
                <strong className="font-semibold text-white">
                  Fiscaliza Brasil
                </strong>
                , você acompanha tudo com dados oficiais em um só lugar.
              </p>

              <BuscaRapidaHome />

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-300">
                <a
                  href="#quem-representa"
                  className="inline-flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-emerald-300"
                >
                  Explorar todas as 6 esferas
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <span className="hidden text-slate-600 sm:inline">•</span>
                <a
                  href="#como-funciona"
                  className="transition-colors hover:text-white"
                >
                  Como funciona (5 passos)
                </a>
                <span className="hidden text-slate-600 sm:inline">•</span>
                <Link
                  href="/politica-explicada"
                  className="transition-colors hover:text-white"
                >
                  Política Explicada
                </Link>
              </div>
            </div>

            {/* Painel Executivo "Brasil em Números" */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/12 bg-white/[0.04] p-5 shadow-2xl ring-1 ring-inset ring-white/10 backdrop-blur-xl sm:p-7">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.14em] text-emerald-300 uppercase">
                      Panorama Nacional
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-white">
                      Do Congresso até sua cidade
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-400/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    APIs ao vivo
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Link
                    href="/senadores"
                    className="group rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition-all hover:border-emerald-400/35 hover:bg-white/[0.09]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="tabular-nums text-2xl font-extrabold text-white">
                        {senadores.length}
                      </p>
                      <ArrowUpRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-emerald-300" />
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-300">
                      Senadores
                    </p>
                  </Link>

                  <Link
                    href="/deputados-federais"
                    className="group rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition-all hover:border-emerald-400/35 hover:bg-white/[0.09]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="tabular-nums text-2xl font-extrabold text-white">
                        {depFederais.length}
                      </p>
                      <ArrowUpRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-emerald-300" />
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-300">
                      Dep. Federais
                    </p>
                  </Link>

                  <Link
                    href="/dep-estaduais"
                    className="group rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition-all hover:border-emerald-400/35 hover:bg-white/[0.09]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="tabular-nums text-2xl font-extrabold text-white">
                        {totalDeputadosEstaduais.toLocaleString("pt-BR")}
                      </p>
                      <ArrowUpRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-emerald-300" />
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-300">
                      Dep. Estaduais
                    </p>
                  </Link>

                  <Link
                    href="/governadores"
                    className="group rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition-all hover:border-emerald-400/35 hover:bg-white/[0.09]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="tabular-nums text-2xl font-extrabold text-white">
                        {governadores.length}
                      </p>
                      <ArrowUpRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-emerald-300" />
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-300">
                      Governadores
                    </p>
                  </Link>

                  <Link
                    href="/prefeitos"
                    className="group rounded-2xl border border-emerald-400/25 bg-emerald-500/12 p-4 transition-all hover:border-emerald-400/50 hover:bg-emerald-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <p className="tabular-nums text-2xl font-extrabold text-emerald-200">
                        5.570
                      </p>
                      <ArrowUpRight className="h-4 w-4 text-emerald-300/70 transition-colors group-hover:text-emerald-200" />
                    </div>
                    <p className="mt-1 text-xs font-medium text-emerald-100">
                      Prefeituras (IBGE)
                    </p>
                  </Link>

                  <Link
                    href="/vereadores"
                    className="group rounded-2xl border border-emerald-400/25 bg-emerald-500/12 p-4 transition-all hover:border-emerald-400/50 hover:bg-emerald-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <p className="tabular-nums text-2xl font-extrabold text-emerald-200">
                        ~58 mil
                      </p>
                      <ArrowUpRight className="h-4 w-4 text-emerald-300/70 transition-colors group-hover:text-emerald-200" />
                    </div>
                    <p className="mt-1 text-xs font-medium text-emerald-100">
                      Vereadores (TSE)
                    </p>
                  </Link>
                </div>

                <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
                  Integrado a Senado, Câmara, TSE, SICONFI, PNCP, IBGE, ALESP e
                  ALMG.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FAIXA CLARA: VOCÊ SABE O QUE ACONTECEU DEPOIS? */}
      <section
        aria-labelledby="titulo-depois"
        className="bg-brand-surface py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6">
          <div className="max-w-3xl">
            <SectionEyebrow texto="A democracia continua todos os dias" />
            <h2
              id="titulo-depois"
              className="mt-3 text-2xl font-extrabold text-brand-navy sm:text-4xl"
            >
              Você sabe o que aconteceu depois da eleição?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-muted">
              Reunimos em linguagem clara as perguntas que todo cidadão tem
              direito de responder consultando fontes públicas oficiais.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PERGUNTAS_CIDADAOS.map((item) => (
              <Link
                key={item.titulo}
                href={item.href}
                className="card-elevated group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 hover:-translate-y-0.5 hover:border-brand-blue/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="tabular-nums text-xs font-extrabold text-brand-emerald">
                      {item.numero}
                    </span>
                    <HelpCircle className="h-4 w-4 text-slate-300 transition-colors group-hover:text-brand-emerald" />
                  </div>
                  <h3 className="mt-3 text-base font-bold leading-snug text-brand-navy group-hover:text-brand-blue">
                    {item.titulo}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                    {item.descricao}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue">
                  {item.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>

          <AvisoFiscalizacao
            mensagem="O Fiscaliza Brasil não julga e não emite opiniões político-partidárias. Nosso papel é organizar informações públicas verificadas em fontes oficiais para que você conheça os fatos e tire suas próprias conclusões."
          />
        </div>
      </section>

      {/* 3. FAIXA BRANCA PURA: QUEM REPRESENTA VOCÊ? (6 ESFERAS) */}
      <section
        id="quem-representa"
        aria-labelledby="titulo-esferas"
        className="scroll-mt-28 border-y border-slate-200/80 bg-white py-16 sm:py-22"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <SectionEyebrow texto="Quem representa você?" />
              <h2
                id="titulo-esferas"
                className="mt-3 text-2xl font-extrabold text-brand-navy sm:text-4xl"
              >
                Conheça quem representa você em cada esfera de governo.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-brand-muted">
              Acompanhe representantes do município, do estado e da União e
              consulte as informações públicas disponíveis sobre sua atuação.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ESFERAS.map((esfera) => {
              const Icone = esfera.icone;
              return (
                <Link
                  key={esfera.href}
                  href={esfera.href}
                  className="card-elevated group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 hover:-translate-y-1 hover:border-brand-blue/40"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-navy via-brand-blue to-brand-emerald opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-mint text-brand-emerald ring-1 ring-emerald-200/60 transition-colors group-hover:bg-brand-emerald group-hover:text-white">
                        <Icone className="h-6 w-6" />
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${esfera.badgeCor}`}
                      >
                        {esfera.badge}
                      </span>
                    </div>

                    <p className="mt-5 text-[11px] font-bold tracking-wider text-brand-muted uppercase">
                      {esfera.subtitulo}
                    </p>
                    <h3 className="mt-1 text-xl font-extrabold text-brand-navy group-hover:text-brand-blue">
                      {esfera.titulo}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {esfera.descricao}
                    </p>

                    <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                      {esfera.itens.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-emerald" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-bold text-brand-navy group-hover:text-brand-blue">
                    <span>Consultar {esfera.titulo.toLowerCase()}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FAIXA SUPERFÍCIE: O QUE VOCÊ ENCONTRA + COMO FUNCIONA */}
      <section className="bg-brand-surface py-16 sm:py-22">
        <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6">
          {/* O que você encontra */}
          <div aria-labelledby="titulo-encontra">
            <div className="mb-9 max-w-3xl">
              <SectionEyebrow texto="O que você encontra" />
              <h2
                id="titulo-encontra"
                className="mt-3 text-2xl font-extrabold text-brand-navy sm:text-4xl"
              >
                Um lugar para conhecer os fatos e entender o que acontece na
                vida pública.
              </h2>
              <p className="mt-3 text-base text-brand-muted">
                Informações organizadas para facilitar o acompanhamento dos
                representantes, das instituições e dos recursos públicos.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PILARES_ENCONTRA.map((pilar) => {
                const Icone = pilar.icone;
                return (
                  <Link
                    key={pilar.titulo}
                    href={pilar.href}
                    className="card-elevated group rounded-2xl border border-slate-200/90 bg-white p-6 hover:-translate-y-0.5 hover:border-brand-emerald/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-brand-navy transition-colors group-hover:bg-brand-navy group-hover:text-white">
                        <Icone className="h-5 w-5" />
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-brand-emerald" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-brand-navy group-hover:text-brand-blue">
                      {pilar.titulo}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {pilar.descricao}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Como funciona (5 passos com linha conectora no desktop) */}
          <div
            id="como-funciona"
            aria-labelledby="titulo-como-funciona"
            className="scroll-mt-28 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-10 lg:p-12"
          >
            <div className="max-w-3xl">
              <SectionEyebrow texto="Como funciona" />
              <h2
                id="titulo-como-funciona"
                className="mt-3 text-2xl font-extrabold text-brand-navy sm:text-4xl"
              >
                Do Brasil até o seu município.
              </h2>
              <p className="mt-2 text-base text-brand-muted">
                Uma navegação simples em 5 passos para chegar rapidamente às
                informações que você procura.
              </p>
            </div>

            <div className="relative mt-10">
              {/* Linha conectora horizontal no desktop */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-5 right-12 left-12 hidden h-px bg-gradient-to-r from-brand-navy/20 via-brand-emerald/40 to-brand-navy/20 lg:block"
              />

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {PASSOS_COMO_FUNCIONA.map((passo) => (
                  <div
                    key={passo.numero}
                    className="relative flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5"
                  >
                    <span className="tabular-nums relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy font-display text-xs font-extrabold text-white shadow-xs ring-4 ring-white">
                      {passo.numero}
                    </span>
                    <h3 className="mt-4 text-base font-bold text-brand-navy">
                      {passo.titulo}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {passo.descricao}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAIXA DARK EDITORIAL: INFORMAÇÃO QUE FAZ DIFERENÇA + RÉGUA DO ORÇAMENTO */}
      <section
        aria-labelledby="titulo-diferenca"
        className="relative overflow-hidden bg-brand-navy py-16 text-white sm:py-22"
      >
        <div className="bg-civic-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl space-y-10 px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionEyebrow texto="Informação que faz diferença" claro />
              <h2
                id="titulo-diferenca"
                className="mt-3 text-2xl font-extrabold text-white sm:text-4xl"
              >
                Não fique apenas com discursos, promessas ou versões prontas.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
                O Fiscaliza Brasil organiza informações públicas e traduz os
                termos técnicos para que qualquer cidadão possa conferir os
                fatos e formar sua própria opinião.
              </p>
            </div>
            <div className="lg:col-span-5 lg:flex lg:justify-end">
              <Link
                href="/politica-explicada"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-emerald px-5 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-emerald-dark"
              >
                Ler guia Política Explicada
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Régua infográfica das 4 fases do dinheiro público */}
          <div className="rounded-3xl border border-white/12 bg-white/[0.04] p-6 ring-1 ring-inset ring-white/10 backdrop-blur-md sm:p-8">
            <p className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
              Como ler as contas públicas sem cair em desinformação
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FASES_ORCAMENTO.map((fase) => (
                <div
                  key={fase.etapa}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${fase.cor}`} />
                    <p className="text-sm font-bold text-white">{fase.etapa}</p>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {fase.resumo}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAIXA BRANCA: ASSUNTOS IMPORTANTES + PARTICIPAÇÃO CIDADÃ */}
      <section className="border-b border-slate-200/80 bg-white py-16 sm:py-22">
        <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6">
          {/* Assuntos importantes */}
          <div aria-labelledby="titulo-assuntos">
            <div className="mb-9 max-w-3xl">
              <SectionEyebrow texto="Destaques de interesse público" />
              <h2
                id="titulo-assuntos"
                className="mt-3 text-2xl font-extrabold text-brand-navy sm:text-4xl"
              >
                Assuntos importantes para acompanhar.
              </h2>
              <p className="mt-2 text-base text-brand-muted">
                Uma seleção objetiva de temas relevantes do Poder Público, sem
                transformar o portal em um jornal partidário.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {ASSUNTOS_ACOMPANHAR.map((assunto) => (
                <Link
                  key={assunto.titulo}
                  href={assunto.href}
                  className="card-elevated group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 hover:-translate-y-0.5 hover:border-brand-blue/40"
                >
                  <div>
                    <span className="inline-block rounded-full bg-brand-mint px-3 py-1 text-[11px] font-bold text-brand-emerald">
                      {assunto.tag}
                    </span>
                    <h3 className="mt-4 text-lg font-bold leading-snug text-brand-navy group-hover:text-brand-blue">
                      {assunto.titulo}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      {assunto.descricao}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 border-t border-slate-100 pt-4 text-xs font-bold text-brand-blue">
                    {assunto.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Participação cidadã + Independência */}
          <div
            aria-labelledby="titulo-participe"
            className="grid gap-6 lg:grid-cols-12"
          >
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/70 p-6 sm:p-9 lg:col-span-8">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-brand-emerald uppercase">
                <Megaphone className="h-4 w-4" />
                Participação Cidadã • Participe
              </div>
              <h2
                id="titulo-participe"
                className="mt-2.5 text-2xl font-extrabold text-brand-navy sm:text-3xl"
              >
                A participação da população ajuda a ampliar a transparência.
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                Envie informações, documentos, fotos, vídeos, sugestões de pauta
                ou comunique possíveis irregularidades envolvendo obras,
                contratos ou recursos públicos — com geração imediata de
                protocolo.
              </p>

              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {ACOES_PARTICIPACAO.map((acao) => {
                  const Icone = acao.icone;
                  return (
                    <Link
                      key={acao.label}
                      href={acao.href}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy shadow-2xs transition-all hover:border-brand-blue/50 hover:bg-blue-50/50 hover:text-brand-blue"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icone className="h-4 w-4 shrink-0 text-brand-emerald" />
                        {acao.label}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 via-white to-white p-6 shadow-xs sm:p-8 lg:col-span-4">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-emerald text-white shadow-xs">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <p className="mt-5 text-[11px] font-bold tracking-wider text-brand-emerald uppercase">
                  Independência
                </p>
                <h3 className="mt-1 text-xl font-extrabold text-brand-navy">
                  Projeto privado e independente
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  O Fiscaliza Brasil não recebe verba partidária. Conheça como
                  apoiar ou patrocinar a manutenção da infraestrutura de dados
                  abertos.
                </p>
              </div>

              <div className="mt-6 space-y-2.5">
                <Link
                  href="/quem-apoia-o-fiscaliza-brasil"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-emerald px-4 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-brand-emerald-dark"
                >
                  Apoiar o Fiscaliza Brasil
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/quem-patrocina-o-fiscaliza-brasil"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-brand-navy transition-colors hover:bg-slate-50"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-brand-emerald" />
                    Patrocine
                  </Link>
                  <Link
                    href="/contato"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-brand-navy transition-colors hover:bg-slate-50"
                  >
                    <Mail className="h-3.5 w-3.5 text-brand-blue" />
                    Contato
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAIXA FINAL: SOBRE, FONTES OFICIAIS & CTA DE FECHAMENTO */}
      <section className="bg-brand-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6">
          <div
            aria-labelledby="titulo-sobre-fontes"
            className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-10"
          >
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-brand-emerald uppercase">
                  <Globe2 className="h-4 w-4" />
                  Sobre o projeto
                </div>
                <h2
                  id="titulo-sobre-fontes"
                  className="mt-2.5 text-2xl font-extrabold text-brand-navy"
                >
                  Informação pública organizada para o cidadão.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  O Fiscaliza Brasil é um{" "}
                  <strong className="text-brand-navy">
                    Portal Nacional de Informação e Fiscalização Cidadã
                  </strong>
                  . O projeto facilita o acesso a informações públicas sobre
                  representantes, instituições, decisões e recursos públicos —
                  com navegação rápida no celular e dados verificáveis.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/sobre-o-fiscaliza-brasil"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-blue"
                  >
                    <FileSearch className="h-3.5 w-3.5" />
                    Conheça o Fiscaliza Brasil
                  </Link>
                  <Link
                    href="/privacidade"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-brand-navy transition-colors hover:bg-slate-100"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald" />
                    Política de Privacidade (LGPD)
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <p className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-brand-navy uppercase">
                  <Database className="h-4 w-4 text-brand-emerald" />
                  Fontes Oficiais Conectadas ao Portal
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {FONTES_OFICIAIS.map((fonte) => (
                    <span
                      key={fonte}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      <SearchCheck className="h-3.5 w-3.5 shrink-0 text-brand-emerald" />
                      {fonte}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA de Fechamento */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-navy via-brand-blue to-brand-emerald p-8 text-center text-white shadow-xl sm:p-14">
            <div className="bg-civic-grid pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                Seu voto escolhe. Sua fiscalização acompanha.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-100 sm:text-base">
                Conheça quem representa você e acompanhe as decisões que afetam
                sua cidade, seu estado e o Brasil.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#quem-representa"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-brand-navy shadow-md transition-colors hover:bg-slate-100"
                >
                  Começar a acompanhar
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/denuncias"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-xs transition-colors hover:bg-white/20"
                >
                  Registrar relato ou denúncia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
