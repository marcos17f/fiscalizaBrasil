"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ShieldCheck, X } from "lucide-react";

const INSTITUCIONAL_NAV = [
  { href: "/", label: "Home" },
  { href: "/sobre-o-fiscaliza-brasil", label: "Sobre" },
  { href: "/politica-explicada", label: "Política Explicada" },
  { href: "/participe", label: "Participe" },
  { href: "/denuncias", label: "Denúncias" },
  { href: "/quem-apoia-o-fiscaliza-brasil", label: "Apoie" },
  { href: "/quem-patrocina-o-fiscaliza-brasil", label: "Patrocine" },
  { href: "/contato", label: "Contato" },
] as const;

const ESFERAS_NAV = [
  { href: "/senadores", label: "Senadores" },
  { href: "/deputados-federais", label: "Dep. Federais" },
  { href: "/dep-estaduais", label: "Dep. Estaduais" },
  { href: "/governadores", label: "Governadores" },
  { href: "/prefeitos", label: "Prefeitos" },
  { href: "/vereadores", label: "Vereadores" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  const isAtivo = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      {/* Faixa de imparcialidade */}
      <div className="bg-brand-navy text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6">
          <p className="flex items-center gap-2 text-slate-200">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span>
              <strong className="font-semibold text-white">
                O Fiscaliza Brasil não julga. Não emite opiniões.
              </strong>{" "}
              Apresenta informações públicas verificadas em fontes oficiais.
            </span>
          </p>
          <span className="hidden shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300 lg:inline-block">
            Next.js 15 • Portal Completo
          </span>
        </div>
      </div>

      {/* Linha 1: Marca + Links Institucionais */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-emerald text-white shadow-sm transition-transform group-hover:scale-105">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="block font-display text-lg font-extrabold tracking-tight text-brand-navy">
              FISCALIZA <span className="text-brand-emerald">BRASIL</span>
            </span>
            <span className="block text-[11px] font-medium text-brand-muted">
              Seu voto escolhe. Você fiscaliza.
            </span>
          </div>
        </Link>

        <nav
          aria-label="Navegação institucional"
          className="hidden items-center gap-0.5 lg:flex"
        >
          {INSTITUCIONAL_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                isAtivo(item.href)
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-brand-navy"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuAberto((prev) => !prev)}
          aria-expanded={menuAberto}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
        >
          {menuAberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Linha 2: Barra das 6 Esferas Políticas */}
      <div className="border-t border-slate-100 bg-slate-50/90">
        <nav
          aria-label="Esferas políticas"
          className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-4 py-2 sm:px-6"
        >
          {ESFERAS_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors sm:text-sm ${
                isAtivo(item.href)
                  ? "bg-brand-blue text-white shadow-2xs"
                  : "bg-white text-brand-navy ring-1 ring-slate-200 hover:bg-brand-mint hover:text-brand-emerald"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Menu Mobile */}
      {menuAberto && (
        <nav
          aria-label="Menu institucional mobile"
          className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden"
        >
          <p className="mb-2 px-2 text-[11px] font-bold tracking-wider text-brand-muted uppercase">
            Institucional
          </p>
          <div className="grid grid-cols-2 gap-1">
            {INSTITUCIONAL_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuAberto(false)}
                className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                  isAtivo(item.href)
                    ? "bg-brand-navy text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
