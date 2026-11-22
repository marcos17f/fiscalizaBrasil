"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  Landmark,
  MapPin,
  Menu,
  Scale,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const INSTITUCIONAL_NAV = [
  { href: "/", label: "Início" },
  { href: "/sobre-o-fiscaliza-brasil", label: "Sobre" },
  { href: "/politica-explicada", label: "Política Explicada" },
  { href: "/participe", label: "Participe" },
  { href: "/denuncias", label: "Denúncias" },
  { href: "/quem-apoia-o-fiscaliza-brasil", label: "Apoie" },
  { href: "/quem-patrocina-o-fiscaliza-brasil", label: "Patrocine" },
  { href: "/contato", label: "Contato" },
] as const;

const ESFERAS_NAV = [
  { href: "/senadores", label: "Senadores", icone: Scale },
  { href: "/deputados-federais", label: "Dep. Federais", icone: Landmark },
  { href: "/dep-estaduais", label: "Dep. Estaduais", icone: Landmark },
  { href: "/governadores", label: "Governadores", icone: Building2 },
  { href: "/prefeitos", label: "Prefeitos", icone: MapPin },
  { href: "/vereadores", label: "Vereadores", icone: Users },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  const isAtivo = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-[0_1px_12px_rgba(6,24,44,0.04)] backdrop-blur-md">
      {/* Faixa institucional de imparcialidade */}
      <div className="bg-brand-navy text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 text-[11px] sm:px-6 sm:py-2 sm:text-xs">
          <p className="flex items-center gap-2 text-slate-300">
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            <span className="sm:hidden">
              <strong className="font-semibold text-white">
                O Fiscaliza Brasil não julga.
              </strong>{" "}
              Dados de fontes oficiais.
            </span>
            <span className="hidden sm:inline">
              <strong className="font-semibold text-white">
                O Fiscaliza Brasil não julga.
              </strong>{" "}
              Organiza informações públicas verificadas em fontes oficiais.
            </span>
          </p>
          <span className="hidden shrink-0 items-center gap-1.5 text-[11px] font-medium text-emerald-300/90 lg:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            Portal Nacional de Fiscalização Cidadã
          </span>
        </div>
      </div>

      {/* Linha 1: Marca + Links Institucionais */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-navy via-brand-blue to-brand-emerald text-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-[1.03]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="block font-display text-[17px] font-extrabold tracking-tight text-brand-navy sm:text-lg">
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
          {INSTITUCIONAL_NAV.map((item) => {
            const ativo = isAtivo(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  ativo
                    ? "bg-slate-900 font-semibold text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-brand-navy"
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
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
        >
          {menuAberto ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Linha 2: Barra refinada das 6 Esferas Políticas */}
      <div className="border-t border-slate-100 bg-slate-50/90">
        <nav
          aria-label="Esferas políticas"
          className="no-scrollbar mx-auto flex max-w-7xl snap-x snap-mandatory items-center gap-1.5 overflow-x-auto px-4 py-2 sm:px-6"
        >
          <span className="mr-1 hidden shrink-0 text-[10px] font-bold tracking-wider text-slate-400 uppercase md:inline">
            Esferas:
          </span>
          {ESFERAS_NAV.map((item) => {
            const Icone = item.icone;
            const ativo = isAtivo(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex min-h-[38px] shrink-0 snap-start items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all sm:min-h-0 sm:py-1.5 sm:text-[13px] ${
                  ativo
                    ? "bg-brand-navy text-white shadow-xs"
                    : "bg-white text-slate-700 ring-1 ring-slate-200/80 hover:bg-brand-mint hover:text-brand-emerald hover:ring-emerald-200"
                }`}
              >
                <Icone
                  className={`h-3.5 w-3.5 ${
                    ativo ? "text-emerald-300" : "text-slate-400"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Menu Mobile & Tablet */}
      {menuAberto && (
        <nav
          aria-label="Menu institucional mobile"
          className="max-h-[75vh] overflow-y-auto border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden"
        >
          <p className="mb-2.5 px-1 text-[11px] font-bold tracking-wider text-brand-muted uppercase">
            Esferas Políticas
          </p>
          <div className="mb-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {ESFERAS_NAV.map((item) => {
              const Icone = item.icone;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuAberto(false)}
                  className={`flex min-h-[44px] items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                    isAtivo(item.href)
                      ? "bg-brand-navy text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-brand-mint hover:text-brand-emerald"
                  }`}
                >
                  <Icone className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <p className="mb-2.5 px-1 text-[11px] font-bold tracking-wider text-brand-muted uppercase">
            Institucional & Participação
          </p>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {INSTITUCIONAL_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuAberto(false)}
                className={`flex min-h-[44px] items-center rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                  isAtivo(item.href)
                    ? "bg-brand-navy text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
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
