"use client";

import {
  Award,
  ExternalLink,
  FileText,
  History,
  Loader2,
  Scale,
  Wallet,
} from "lucide-react";
import { formatarMoeda } from "@/lib/formatters";
import type { PerfilTSE } from "@/types/politicos";

type Props = {
  perfil: PerfilTSE | null;
  perfilSecundario?: PerfilTSE | null;
  carregando: boolean;
  entidadeNome: string;
};

export function PainelEleitoralTSE({
  perfil,
  perfilSecundario,
  carregando,
  entidadeNome,
}: Props) {
  if (carregando) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-brand-muted">
        <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
        Consultando registros oficiais no TSE DivulgaCandContas...
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-950">
        <p className="font-semibold">
          Registro eleitoral não localizado automaticamente para {entidadeNome}.
        </p>
        <p className="mt-1 text-xs text-amber-900">
          Em casos de posse de suplente, troca de nome de urna ou mudança de
          mandato fora da eleição ordinária, consulte diretamente o portal do
          TSE.
        </p>
        <a
          href="https://divulgacandcontas.tse.jus.br/divulga/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
        >
          Abrir TSE DivulgaCandContas
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2.5 text-xs text-emerald-950">
        <span className="font-semibold">
          Fonte ao vivo: TSE DivulgaCandContas • Eleições {perfil.ano}
        </span>
        <a
          href={perfil.linkOficialTse}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-brand-blue hover:underline"
        >
          Ficha completa e contas no TSE
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Resumo eleitoral */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-brand-muted uppercase">
            <Award className="h-3.5 w-3.5 text-brand-emerald" />
            Resultado ({perfil.ano})
          </p>
          <p className="mt-1 text-base font-extrabold text-brand-navy">
            {perfil.totalizacao ?? perfil.situacaoCandidatura ?? "—"}
          </p>
          <p className="mt-0.5 text-xs text-slate-600">
            Nº {perfil.numero} • {perfil.partidoSigla}
            {perfil.reeleicao ? " • Reeleição" : ""}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-brand-muted uppercase">
            <Wallet className="h-3.5 w-3.5 text-brand-blue" />
            Total de Bens Declarados
          </p>
          <p className="mt-1 text-base font-extrabold text-brand-navy">
            {formatarMoeda(perfil.totalDeBens)}
          </p>
          <p className="mt-0.5 text-xs text-slate-600">
            {perfil.bens.length}{" "}
            {perfil.bens.length === 1 ? "item declarado" : "itens declarados"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-brand-muted uppercase">
            <Scale className="h-3.5 w-3.5 text-slate-500" />
            Teto de Gastos (1º Turno)
          </p>
          <p className="mt-1 text-base font-extrabold text-brand-navy">
            {perfil.gastoCampanha1T
              ? formatarMoeda(perfil.gastoCampanha1T)
              : "Consultar TSE"}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-600">
            Coligação: {perfil.coligacao ?? perfil.partidoSigla}
          </p>
        </div>
      </div>

      {/* Comparativo de eleição secundária (ex: 2022 vs 2026 para Governadores) */}
      {perfilSecundario && perfilSecundario.ano !== perfil.ano && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-950">
          <p className="font-bold">
            Registro também encontrado nas Eleições {perfilSecundario.ano}:
          </p>
          <p className="mt-1">
            <strong>{perfilSecundario.nomeUrna}</strong> (
            {perfilSecundario.partidoSigla}) —{" "}
            {perfilSecundario.totalizacao ?? "—"} • Bens declarados:{" "}
            <strong>{formatarMoeda(perfilSecundario.totalDeBens)}</strong>{" "}
            <a
              href={perfilSecundario.linkOficialTse}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center gap-0.5 font-bold text-brand-blue hover:underline"
            >
              Ver ficha {perfilSecundario.ano}
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      )}

      {/* Plano de governo (quando disponível — Prefeitos/Governadores) */}
      {perfil.planoDeGovernoUrl && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-white p-4">
          <div className="flex items-center gap-2.5">
            <FileText className="h-5 w-5 text-brand-emerald" />
            <div>
              <p className="text-sm font-bold text-brand-navy">
                Plano de Governo Oficial ({perfil.ano})
              </p>
              <p className="text-xs text-slate-600">
                Documento PDF protocolado no TSE para acompanhamento das
                promessas de campanha.
              </p>
            </div>
          </div>
          <a
            href={perfil.planoDeGovernoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-emerald px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-emerald-dark"
          >
            Ver Plano no TSE
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {/* Lista de Bens Declarados */}
      {perfil.bens.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="text-sm font-bold text-brand-navy">
            Principais Bens Declarados à Justiça Eleitoral ({perfil.ano})
          </h4>
          <div className="mt-3 divide-y divide-slate-100">
            {perfil.bens.slice(0, 8).map((bem) => (
              <div
                key={`${bem.ordem}-${bem.tipo}-${bem.valor}`}
                className="flex items-start justify-between gap-3 py-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800">{bem.tipo}</p>
                  {bem.descricao && (
                    <p className="line-clamp-1 text-slate-500">
                      {bem.descricao}
                    </p>
                  )}
                </div>
                <span className="shrink-0 font-bold text-brand-navy">
                  {formatarMoeda(bem.valor)}
                </span>
              </div>
            ))}
          </div>
          {perfil.bens.length > 8 && (
            <p className="mt-2 text-[11px] text-brand-muted">
              Exibindo os 8 maiores bens de {perfil.bens.length} itens
              declarados. Consulte a lista completa no DivulgaCandContas.
            </p>
          )}
        </div>
      )}

      {/* Histórico de Eleições Anteriores */}
      {perfil.eleicoesAnteriores.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="flex items-center gap-1.5 text-sm font-bold text-brand-navy">
            <History className="h-4 w-4 text-brand-blue" />
            Histórico de Candidaturas no TSE
          </h4>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-brand-muted">
                  <th className="py-1.5 pr-3 font-semibold">Ano</th>
                  <th className="py-1.5 pr-3 font-semibold">Cargo</th>
                  <th className="py-1.5 pr-3 font-semibold">Partido</th>
                  <th className="py-1.5 pr-3 font-semibold">Local</th>
                  <th className="py-1.5 font-semibold">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {perfil.eleicoesAnteriores.slice(0, 6).map((el, idx) => (
                  <tr key={`${el.ano}-${el.cargo}-${idx}`}>
                    <td className="py-2 pr-3 font-bold text-brand-navy">
                      {el.ano}
                    </td>
                    <td className="py-2 pr-3 text-slate-700">{el.cargo}</td>
                    <td className="py-2 pr-3 font-semibold text-emerald-800">
                      {el.partido}
                    </td>
                    <td className="py-2 pr-3 text-slate-600">{el.local}</td>
                    <td className="py-2 text-slate-800">
                      {el.situacaoTotalizacao}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
