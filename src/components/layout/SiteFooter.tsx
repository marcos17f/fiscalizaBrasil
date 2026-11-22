import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-brand-navy text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 text-white">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="font-display text-lg font-extrabold tracking-tight">
              FISCALIZA <span className="text-emerald-400">BRASIL</span>
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Seu voto escolhe. A informação esclarece. Você fiscaliza. Plataforma
            independente dedicada a organizar dados públicos de fontes oficiais
            de forma simples e acessível.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-wider text-white uppercase">
            Esferas de Governo
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/governadores" className="hover:text-emerald-400 transition-colors">
                Governadores (27 UFs)
              </Link>
            </li>
            <li>
              <Link href="/dep-estaduais" className="hover:text-emerald-400 transition-colors">
                Deputados Estaduais (27 Assembleias)
              </Link>
            </li>
            <li>
              <Link href="/prefeitos" className="hover:text-emerald-400 transition-colors">
                Prefeitos (5.570 Municípios)
              </Link>
            </li>
            <li>
              <Link href="/vereadores" className="hover:text-emerald-400 transition-colors">
                Vereadores (Câmaras Municipais)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-wider text-white uppercase">
            Fontes Oficiais de Referência
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>TSE — Dados Abertos e DivulgaCandContas</li>
            <li>IBGE — API Oficial de Localidades</li>
            <li>Portal da Transparência (CGU) & SICONFI</li>
            <li>26 Assembleias Legislativas + CLDF</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:px-6">
          <p>
            Protótipo demonstrativo em Next.js 15 + React 19 + TypeScript + Tailwind CSS.
          </p>
          <p>Arquitetura modular sob demanda — páginas leves e mobile-first.</p>
        </div>
      </div>
    </footer>
  );
}
