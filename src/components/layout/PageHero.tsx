import Link from "next/link";
import { ChevronRight } from "lucide-react";

type MetricaHero = {
  valor: string;
  label: string;
  destaque?: boolean;
};

type Props = {
  categoria: string;
  titulo: string;
  descricao: string;
  breadcrumb: string;
  metricas?: readonly MetricaHero[];
};

export function PageHero({
  categoria,
  titulo,
  descricao,
  breadcrumb,
  metricas,
}: Props) {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 bg-brand-navy text-white">
      <div className="bg-civic-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-emerald-500/18 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-13">
        {/* Breadcrumb */}
        <nav
          aria-label="Navegação estrutural"
          className="mb-4 flex items-center gap-1.5 text-xs font-medium text-slate-400"
        >
          <Link href="/" className="transition-colors hover:text-emerald-300">
            Início
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          <span className="text-slate-200">{breadcrumb}</span>
        </nav>

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="h-0.5 w-6 rounded-full bg-emerald-400" />
              <p className="text-[11px] font-bold tracking-[0.14em] text-emerald-300 uppercase">
                {categoria}
              </p>
            </div>
            <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {titulo}
            </h1>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {descricao}
            </p>
          </div>

          {metricas && metricas.length > 0 && (
            <div className="grid w-full shrink-0 grid-cols-2 gap-2.5 sm:grid-cols-3 lg:flex lg:w-auto lg:flex-wrap">
              {metricas.map((m, idx) => (
                <div
                  key={m.label}
                  className={`rounded-2xl border px-4 py-3 backdrop-blur-xs ${
                    metricas.length === 3 && idx === 2
                      ? "col-span-2 sm:col-span-1"
                      : ""
                  } ${
                    m.destaque
                      ? "border-emerald-400/30 bg-emerald-500/15"
                      : "border-white/12 bg-white/[0.05]"
                  }`}
                >
                  <p
                    className={`tabular-nums text-lg font-extrabold ${
                      m.destaque ? "text-emerald-200" : "text-white"
                    }`}
                  >
                    {m.valor}
                  </p>
                  <p className="text-[11px] font-medium text-slate-300">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
