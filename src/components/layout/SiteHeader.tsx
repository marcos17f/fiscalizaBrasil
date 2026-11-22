"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ShieldCheck, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/governadores", label: "Governadores" },
  { href: "/dep-estaduais", label: "Dep. Estaduais" },
  { href: "/prefeitos", label: "Prefeitos" },
  { href: "/vereadores", label: "Vereadores" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="bg-brand-navy text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6">
          <p className="flex items-center gap-2 text-slate-200">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span>
              <strong className="font-semibold text-white">
                O Fiscaliza Brasil não julga.
              </strong>{" "}
              Apresenta informações públicas de fontes oficiais.
            </span>
          </p>
          <span className="hidden shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300 md:inline-block">
            Protótipo Next.js • Alta Performance
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-emerald text-white shadow-sm transition-transform group-hover:scale-105">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="block font-display text-lg font-extrabold tracking-tight text-brand-navy">
              FISCALIZA <span className="text-brand-emerald">BRASIL</span>
            </span>
            <span className="block text-[11px] font-medium text-brand-muted">
              Transparência e controle social
            </span>
          </div>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const ativo =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                  ativo
                    ? "bg-brand-blue text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-100 hover:text-brand-navy"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMenuAberto((prev) => !prev)}
          aria-expanded={menuAberto}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
        >
          {menuAberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuAberto && (
        <nav
          aria-label="Navegação mobile"
          className="border-t border-slate-200 bg-white px-4 py-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const ativo =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuAberto(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                    ativo
                      ? "bg-brand-blue text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
