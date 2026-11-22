"use client";

import { ExternalLink, FileCheck2, Loader2 } from "lucide-react";
import { formatarDataBr, formatarMoeda } from "@/lib/formatters";
import type { ContratacaoPncp } from "@/types/politicos";

type Props = {
  contratacoes: ContratacaoPncp[];
  carregando: boolean;
  titulo: string;
};

export function PainelContratacoesPncp({
  contratacoes,
  carregando,
  titulo,
}: Props) {
  if (carregando) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-brand-muted">
        <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
        Consultando licitações recentes no PNCP (Portal Nacional de Contratações
        Públicas)...
      </div>
    );
  }

  if (contratacoes.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
        Nenhuma licitação (Pregão Eletrônico) publicada nos últimos 35 dias no
        PNCP para {titulo}.{" "}
        <a
          href="https://pncp.gov.br/app/editais"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-brand-blue hover:underline"
        >
          Pesquisar no PNCP
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2.5 text-xs text-emerald-950">
        <span className="flex items-center gap-1.5 font-semibold">
          <FileCheck2 className="h-4 w-4 text-brand-emerald" />
          Fonte ao vivo: PNCP — Licitações recentes ({contratacoes.length}{" "}
          editais)
        </span>
        <a
          href="https://pncp.gov.br/app/editais"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-brand-blue hover:underline"
        >
          Portal PNCP
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="max-h-80 space-y-2.5 overflow-y-auto pr-1">
        {contratacoes.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-md bg-brand-navy px-2 py-0.5 text-[10px] font-bold text-white">
                  {c.esfera}
                </span>
                <span className="font-bold text-brand-navy">{c.orgao}</span>
              </div>
              {c.valorEstimado !== null && (
                <span className="font-extrabold text-brand-emerald">
                  {formatarMoeda(c.valorEstimado)}
                </span>
              )}
            </div>
            <p className="mt-1.5 line-clamp-2 leading-relaxed text-slate-700">
              {c.objeto}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <span>
                {c.modalidade} Nº {c.numeroCompra}/{c.anoCompra} • Publicado em{" "}
                {formatarDataBr(c.dataPublicacao)}
              </span>
              <a
                href={c.linkPncp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-brand-blue hover:underline"
              >
                Abrir edital oficial
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
