import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BookOpen, CheckCircle2, ListTree } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import type { BlocoInstitucional, PaginaInstitucional } from "@/types/politicos";

type MetricaHero = {
  valor: string;
  label: string;
  destaque?: boolean;
};

type Props = {
  pagina: PaginaInstitucional;
  categoria: string;
  subtitulo?: string;
  metricas?: readonly MetricaHero[];
  mostrarAviso?: boolean;
  topoExtra?: ReactNode;
  rodapeExtra?: ReactNode;
};

type SecaoAgrupada = {
  id: string;
  titulo: string | null;
  blocos: BlocoInstitucional[];
};

function slugify(texto: string, idx: number): string {
  const base = texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return base ? `${base}-${idx}` : `secao-${idx}`;
}

function agruparEmSecoes(blocos: BlocoInstitucional[]): SecaoAgrupada[] {
  const secoes: SecaoAgrupada[] = [];
  let atual: SecaoAgrupada = { id: "introducao-0", titulo: null, blocos: [] };

  for (const bloco of blocos) {
    if (bloco.tipo === "h1" || bloco.tipo === "h2") {
      if (atual.titulo !== null || atual.blocos.length > 0) {
        secoes.push(atual);
      }
      atual = {
        id: slugify(bloco.texto, secoes.length + 1),
        titulo: bloco.texto,
        blocos: [],
      };
    } else {
      atual.blocos.push(bloco);
    }
  }

  if (atual.titulo !== null || atual.blocos.length > 0) {
    secoes.push(atual);
  }

  return secoes;
}

export function PaginaInstitucionalView({
  pagina,
  categoria,
  subtitulo,
  metricas,
  mostrarAviso = true,
  topoExtra,
  rodapeExtra,
}: Props) {
  const primeiroParagrafo =
    subtitulo ??
    pagina.blocos.find((b) => b.tipo === "p")?.texto ??
    "Informação pública organizada de forma independente para o cidadão.";

  const secoes = agruparEmSecoes(pagina.blocos);
  const secoesComTitulo = secoes.filter((s) => Boolean(s.titulo));
  const exibirIndice = secoesComTitulo.length >= 3;

  return (
    <div>
      <PageHero
        categoria={categoria}
        titulo={pagina.titulo}
        descricao={
          primeiroParagrafo.length > 220
            ? `${primeiroParagrafo.slice(0, 217)}...`
            : primeiroParagrafo
        }
        breadcrumb={pagina.titulo}
        metricas={metricas}
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 sm:py-12">
        {mostrarAviso && (
          <AvisoFiscalizacao
            mensagem="O Fiscaliza Brasil é um projeto privado e independente. Não julga e não emite opiniões político-partidárias — organiza dados públicos verificáveis em fontes oficiais."
          />
        )}

        {topoExtra}

        {/* Sumário colapsável para Mobile e Tablet (< lg) */}
        {exibirIndice && (
          <details className="group rounded-2xl border border-slate-200/90 bg-white shadow-xs lg:hidden">
            <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-xs font-bold tracking-wider text-brand-navy uppercase">
              <span className="flex items-center gap-2">
                <ListTree className="h-4 w-4 text-brand-emerald" />
                Sumário desta página ({secoesComTitulo.length} tópicos)
              </span>
              <span className="text-[11px] font-semibold text-brand-blue group-open:hidden">
                Abrir
              </span>
              <span className="hidden text-[11px] font-semibold text-brand-blue group-open:inline">
                Fechar
              </span>
            </summary>
            <nav
              aria-label="Sumário mobile da página"
              className="grid gap-1 border-t border-slate-100 p-3 sm:grid-cols-2"
            >
              {secoesComTitulo.map((sec, idx) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="flex min-h-[40px] items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-brand-mint hover:text-brand-navy"
                >
                  <span className="tabular-nums text-[10px] font-extrabold text-brand-emerald">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="line-clamp-1">{sec.titulo}</span>
                </a>
              ))}
            </nav>
          </details>
        )}

        <div
          className={
            exibirIndice
              ? "grid items-start gap-8 lg:grid-cols-12"
              : "mx-auto max-w-4xl"
          }
        >
          {/* Índice lateral fixo no desktop para leitura confortável */}
          {exibirIndice && (
            <aside className="hidden lg:sticky lg:top-28 lg:col-span-4 lg:block">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-brand-emerald uppercase">
                  <ListTree className="h-3.5 w-3.5" />
                  Nesta página
                </p>
                <nav
                  aria-label="Índice da página"
                  className="mt-3 max-h-[60vh] space-y-1 overflow-y-auto pr-1"
                >
                  {secoesComTitulo.map((sec, idx) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="group flex items-start gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-brand-mint hover:text-brand-navy"
                    >
                      <span className="tabular-nums mt-0.5 text-[10px] font-extrabold text-brand-emerald">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="line-clamp-2 leading-snug group-hover:font-semibold">
                        {sec.titulo}
                      </span>
                    </a>
                  ))}
                </nav>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <Link
                    href="/prefeitos"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-blue"
                  >
                    Fiscalizar representantes
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </aside>
          )}

          {/* Conteúdo principal dividido em cards editoriais */}
          <div className={exibirIndice ? "space-y-5 lg:col-span-8" : "space-y-5"}>
            {secoes.map((sec, secIdx) => {
              const numeroSecao = sec.titulo
                ? secoesComTitulo.findIndex((s) => s.id === sec.id) + 1
                : null;

              return (
                <article
                  key={`${sec.id}-${secIdx}`}
                  id={sec.id}
                  className="scroll-mt-32 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-8"
                >
                  {sec.titulo && (
                    <div className="mb-4 flex items-start gap-3 border-b border-slate-100 pb-4">
                      {numeroSecao !== null && (
                        <span className="tabular-nums mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-mint font-display text-xs font-extrabold text-brand-emerald">
                          {String(numeroSecao).padStart(2, "0")}
                        </span>
                      )}
                      <h2 className="text-xl font-extrabold tracking-tight text-brand-navy sm:text-2xl">
                        {sec.titulo}
                      </h2>
                    </div>
                  )}

                  <div className="space-y-3.5">
                    {sec.blocos.map((bloco, idx) => {
                      if (bloco.tipo === "h3" || bloco.tipo === "h4") {
                        return (
                          <h3
                            key={idx}
                            className="flex items-center gap-2 pt-2 text-base font-bold text-brand-blue sm:text-lg"
                          >
                            <span className="h-4 w-1 shrink-0 rounded-full bg-brand-emerald" />
                            {bloco.texto}
                          </h3>
                        );
                      }

                      if (bloco.tipo === "li") {
                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 rounded-xl bg-slate-50/80 px-3.5 py-2.5 text-sm leading-relaxed text-slate-700"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-emerald" />
                            <span>{bloco.texto}</span>
                          </div>
                        );
                      }

                      return (
                        <p
                          key={idx}
                          className="text-sm leading-[1.78] text-slate-700 sm:text-[15.5px]"
                        >
                          {bloco.texto}
                        </p>
                      );
                    })}
                  </div>
                </article>
              );
            })}

            {rodapeExtra}

            {/* Rodapé editorial de continuidade */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-gradient-to-r from-brand-navy to-brand-blue p-6 text-white sm:flex-row sm:items-center sm:p-8">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-emerald-300 uppercase">
                  <BookOpen className="h-3.5 w-3.5" />
                  Continue acompanhando
                </p>
                <p className="mt-1 text-base font-bold text-white">
                  Consulte seus representantes em fontes oficiais agora mesmo.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/senadores"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-emerald px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-emerald-dark"
                >
                  Senadores & Câmara
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/prefeitos"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/20"
                >
                  Minha Cidade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
