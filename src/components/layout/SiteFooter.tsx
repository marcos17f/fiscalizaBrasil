import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-brand-navy text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="flex items-center gap-2.5 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/25">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-extrabold tracking-tight">
              FISCALIZA <span className="text-emerald-400">BRASIL</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Portal Nacional de Informação e Fiscalização Cidadã. Projeto privado
            e independente dedicado a organizar dados públicos de fontes
            oficiais em linguagem clara.
          </p>
          <p className="mt-4 text-xs font-medium text-emerald-300/90">
            Seu voto escolhe. A informação esclarece. Você fiscaliza.
          </p>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            Acompanhe
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link
                href="/senadores"
                className="transition-colors hover:text-emerald-400"
              >
                Senadores (81)
              </Link>
            </li>
            <li>
              <Link
                href="/deputados-federais"
                className="transition-colors hover:text-emerald-400"
              >
                Deputados Federais (513)
              </Link>
            </li>
            <li>
              <Link
                href="/dep-estaduais"
                className="transition-colors hover:text-emerald-400"
              >
                Deputados Estaduais (27 UFs)
              </Link>
            </li>
            <li>
              <Link
                href="/governadores"
                className="transition-colors hover:text-emerald-400"
              >
                Governadores (27 UFs)
              </Link>
            </li>
            <li>
              <Link
                href="/prefeitos"
                className="transition-colors hover:text-emerald-400"
              >
                Prefeitos (5.570 Municípios)
              </Link>
            </li>
            <li>
              <Link
                href="/vereadores"
                className="transition-colors hover:text-emerald-400"
              >
                Vereadores (Câmaras Municipais)
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            Institucional
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link
                href="/sobre-o-fiscaliza-brasil"
                className="transition-colors hover:text-emerald-400"
              >
                Sobre
              </Link>
            </li>
            <li>
              <Link
                href="/politica-explicada"
                className="transition-colors hover:text-emerald-400"
              >
                Política Explicada
              </Link>
            </li>
            <li>
              <Link
                href="/participe"
                className="transition-colors hover:text-emerald-400"
              >
                Participe
              </Link>
            </li>
            <li>
              <Link
                href="/denuncias"
                className="transition-colors hover:text-emerald-400"
              >
                Denúncias
              </Link>
            </li>
            <li>
              <Link
                href="/quem-apoia-o-fiscaliza-brasil"
                className="transition-colors hover:text-emerald-400"
              >
                Apoie
              </Link>
            </li>
            <li>
              <Link
                href="/quem-patrocina-o-fiscaliza-brasil"
                className="transition-colors hover:text-emerald-400"
              >
                Patrocine
              </Link>
            </li>
            <li>
              <Link
                href="/contato"
                className="transition-colors hover:text-emerald-400"
              >
                Contato
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            Fontes Oficiais & LGPD
          </h3>
          <ul className="mt-4 space-y-2 text-xs leading-relaxed text-slate-400">
            <li>Câmara dos Deputados (API v2) & Senado (CEAPS)</li>
            <li>TSE DivulgaCandContas & IBGE Localidades</li>
            <li>SICONFI / Tesouro Nacional (RREO & RGF)</li>
            <li>PNCP — Portal Nacional de Contratações</li>
            <li>27 Assembleias (ALESP & ALMG) & 27 TCEs</li>
            <li className="pt-2">
              <Link
                href="/privacidade"
                className="font-semibold text-emerald-400 hover:underline"
              >
                Política de Privacidade (LGPD) →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} Fiscaliza Brasil — Informação pública
            e controle social independente.
          </p>
          <p className="text-slate-500">
            Dados verificáveis em fontes oficiais do Poder Público.
          </p>
        </div>
      </div>
    </footer>
  );
}
