"use client";

import { useState, type ReactNode } from "react";
import { BookOpen, Database, HelpCircle, Info } from "lucide-react";
import type { AbaPerfil } from "@/types/politicos";

type Props = {
  abas: readonly AbaPerfil[];
  entidadeNome: string;
  renderConteudoAba?: (aba: AbaPerfil) => ReactNode;
};

export function PerfilAbas({ abas, entidadeNome, renderConteudoAba }: Props) {
  const [abaAtivaId, setAbaAtivaId] = useState<string>(abas[0]?.id ?? "");
  const [mostrarAjuda, setMostrarAjuda] = useState(true);

  const abaAtual = abas.find((a) => a.id === abaAtivaId) ?? abas[0];

  if (!abaAtual) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      <div
        role="tablist"
        aria-label={`Seções do perfil de ${entidadeNome}`}
        className="no-scrollbar flex gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50/90 px-2.5 pt-2.5"
      >
        {abas.map((aba) => {
          const ativa = aba.id === abaAtual.id;
          return (
            <button
              key={aba.id}
              type="button"
              role="tab"
              aria-selected={ativa}
              onClick={() => setAbaAtivaId(aba.id)}
              className={`shrink-0 rounded-t-xl border-b-2 px-3.5 py-2.5 text-xs font-semibold transition-all sm:text-[13px] ${
                ativa
                  ? "border-brand-emerald bg-white text-brand-navy shadow-[0_-1px_4px_rgba(6,24,44,0.04)]"
                  : "border-transparent text-slate-600 hover:bg-white/70 hover:text-brand-navy"
              }`}
            >
              <span
                className={`tabular-nums mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-md text-[11px] font-bold ${
                  ativa
                    ? "bg-brand-navy text-white"
                    : "bg-slate-200/80 text-slate-600"
                }`}
              >
                {aba.numero}
              </span>
              {aba.titulo}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-extrabold text-brand-navy">
            <span className="tabular-nums text-brand-emerald">
              {String(abaAtual.numero).padStart(2, "0")}.
            </span>{" "}
            {abaAtual.titulo}
          </h3>
          <button
            type="button"
            onClick={() => setMostrarAjuda((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-brand-blue/30 hover:bg-blue-50 hover:text-brand-blue"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {mostrarAjuda ? "Ocultar explicação" : "O que esta aba informa?"}
          </button>
        </div>

        {mostrarAjuda && (
          <div className="rounded-xl border border-blue-100 border-l-4 border-l-brand-blue bg-blue-50/50 p-4 text-sm text-slate-800">
            <div className="flex items-start gap-2.5">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
              <div className="space-y-1.5">
                <p className="leading-relaxed">{abaAtual.explicacao}</p>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue">
                  <Database className="h-3.5 w-3.5 shrink-0" />
                  Fonte oficial: {abaAtual.fonteSugerida}
                </p>
              </div>
            </div>
          </div>
        )}

        {renderConteudoAba ? (
          renderConteudoAba(abaAtual)
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-sm text-slate-600">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <div>
                <p className="font-semibold text-slate-800">
                  Módulo estruturado para dados oficiais
                </p>
                <p className="mt-1 leading-relaxed">
                  Os registros de <strong>{abaAtual.titulo}</strong> para{" "}
                  <strong>{entidadeNome}</strong> seguem a metodologia do portal
                  ({abaAtual.fonteSugerida}).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
