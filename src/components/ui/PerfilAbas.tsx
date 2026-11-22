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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div
        role="tablist"
        aria-label={`Seções do perfil de ${entidadeNome}`}
        className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50/70 px-2 pt-2"
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
              className={`shrink-0 rounded-t-lg border-b-2 px-3.5 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${
                ativa
                  ? "border-brand-blue bg-white text-brand-navy shadow-2xs"
                  : "border-transparent text-slate-600 hover:bg-white/60 hover:text-slate-900"
              }`}
            >
              <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200/80 text-[11px] font-bold text-slate-700">
                {aba.numero}
              </span>
              {aba.titulo}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-brand-navy">
            {abaAtual.numero}. {abaAtual.titulo}
          </h3>
          <button
            type="button"
            onClick={() => setMostrarAjuda((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 transition-colors hover:bg-blue-100"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {mostrarAjuda ? "Ocultar explicação" : "O que esta aba informa?"}
          </button>
        </div>

        {mostrarAjuda && (
          <div className="rounded-xl border-l-4 border-l-blue-500 bg-blue-50/70 p-4 text-sm text-blue-950">
            <div className="flex items-start gap-2.5">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              <div className="space-y-1.5">
                <p className="leading-relaxed">{abaAtual.explicacao}</p>
                <p className="flex items-center gap-1.5 text-xs font-medium text-blue-800">
                  <Database className="h-3.5 w-3.5" />
                  Fonte oficial prevista: {abaAtual.fonteSugerida}
                </p>
              </div>
            </div>
          </div>
        )}

        {renderConteudoAba ? (
          renderConteudoAba(abaAtual)
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <div>
                <p className="font-semibold text-slate-800">
                  Módulo pronto para integração de dados oficiais
                </p>
                <p className="mt-1 leading-relaxed">
                  Os registros detalhados de <strong>{abaAtual.titulo}</strong>{" "}
                  para <strong>{entidadeNome}</strong> serão carregados sob
                  demanda a partir da base estruturada ({abaAtual.fonteSugerida}),
                  sem sobrecarregar o carregamento da página.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
