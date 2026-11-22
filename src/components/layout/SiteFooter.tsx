import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-brand-navy text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 text-white">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="font-display text-lg font-extrabold tracking-tight">
              FISCALIZA <span className="text-emerald-400">BRASIL</span>
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Seu voto escolhe. A informação esclarece. Você fiscaliza. Plataforma
            independente dedicada a organizar informações públicas verificadas
            em fontes oficiais.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-wider text-white uppercase">
            Representantes
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/senadores" className="hover:text-emerald-400">
                Senadores (81)
              </Link>
            </li>
            <li>
              <Link href="/deputados-federais" className="hover:text-emerald-400">
                Deputados Federais (513)
              </Link>
            </li>
            <li>
              <Link href="/dep-estaduais" className="hover:text-emerald-400">
                Deputados Estaduais (27 UFs)
              </Link>
            </li>
            <li>
              <Link href="/governadores" className="hover:text-emerald-400">
                Governadores (27 UFs)
              </Link>
            </li>
            <li>
              <Link href="/prefeitos" className="hover:text-emerald-400">
                Prefeitos (5.570 Municípios)
              </Link>
            </li>
            <li>
              <Link href="/vereadores" className="hover:text-emerald-400">
                Vereadores (Câmaras Municipais)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-wider text-white uppercase">
            Institucional
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/sobre-o-fiscaliza-brasil" className="hover:text-emerald-400">
                Sobre o Fiscaliza Brasil
              </Link>
            </li>
            <li>
              <Link href="/politica-explicada" className="hover:text-emerald-400">
                Política Explicada
              </Link>
            </li>
            <li>
              <Link href="/participe" className="hover:text-emerald-400">
                Participe
              </Link>
            </li>
            <li>
              <Link href="/denuncias" className="hover:text-emerald-400">
                Denúncias
              </Link>
            </li>
            <li>
              <Link href="/quem-apoia-o-fiscaliza-brasil" className="hover:text-emerald-400">
                Apoie o Projeto
              </Link>
            </li>
            <li>
              <Link href="/quem-patrocina-o-fiscaliza-brasil" className="hover:text-emerald-400">
                Patrocine
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-emerald-400">
                Contato
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-wider text-white uppercase">
            Fontes & LGPD
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>Câmara dos Deputados — API v2</li>
            <li>Senado Federal & Emendas (CGU)</li>
            <li>TSE DivulgaCandContas & IBGE</li>
            <li>SICONFI / Tesouro Nacional (RREO)</li>
            <li>27 Assembleias (ALESP & ALMG ao vivo)</li>
            <li className="pt-2">
              <Link
                href="/privacidade"
                className="font-semibold text-emerald-400 hover:underline"
              >
                Política de Privacidade (LGPD)
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:px-6">
          <p>
            Fiscaliza Brasil — Reconstrução completa em Next.js 15 + React 19 +
            TypeScript + Tailwind CSS.
          </p>
          <p>Carregamento sob demanda • ~99% menor que a versão original.</p>
        </div>
      </div>
    </footer>
  );
}
