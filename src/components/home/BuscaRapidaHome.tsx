"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";

const DESTINOS = [
  { href: "/prefeitos", label: "Prefeitos — 5.570 Municípios (TSE + SICONFI + PNCP)" },
  { href: "/vereadores", label: "Vereadores — Câmaras Municipais (~58 mil eleitos)" },
  { href: "/governadores", label: "Governadores — 27 Estados (TSE + SICONFI + LRF)" },
  { href: "/dep-estaduais", label: "Deputados Estaduais — 27 Assembleias (ALESP + ALMG)" },
  { href: "/deputados-federais", label: "Deputados Federais — 513 na Câmara (API v2)" },
  { href: "/senadores", label: "Senadores — 81 no Senado (Votos, Projetos & CEAPS)" },
] as const;

export function BuscaRapidaHome() {
  const router = useRouter();
  const [destino, setDestino] = useState<string>("/prefeitos");

  const handleIr = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(destino);
  };

  return (
    <form
      onSubmit={handleIr}
      className="mt-8 rounded-2xl border border-white/15 bg-slate-950/35 p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-white/10 backdrop-blur-xl sm:p-2.5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="atalho-esfera-home" className="sr-only">
            Escolha qual esfera política consultar
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            id="atalho-esfera-home"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className="min-h-[48px] w-full appearance-none rounded-xl bg-white py-3.5 pr-9 pl-10 text-base font-semibold text-brand-navy shadow-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none sm:text-sm"
          >
            {DESTINOS.map((item) => (
              <option key={item.href} value={item.href}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="inline-flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-emerald px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-emerald-dark active:scale-[0.99] sm:w-auto"
        >
          Consultar agora
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
