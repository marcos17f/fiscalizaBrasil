"use client";

import {
  ArrowDownToLine,
  BarChart3,
  Coins,
  ExternalLink,
  Landmark,
  Loader2,
  Wallet,
} from "lucide-react";
import {
  formatarMoedaCompacta,
  formatarNumero,
  formatarPercentual,
} from "@/lib/formatters";
import type { ResumoFiscalSiconfi } from "@/types/politicos";

type Props = {
  siconfi: ResumoFiscalSiconfi | null;
  carregando: boolean;
  modo?: "completo" | "repasses";
  entidadeNome: string;
  codigoIbge?: number;
};

export function PainelFiscalSiconfi({
  siconfi,
  carregando,
  modo = "completo",
  entidadeNome,
  codigoIbge,
}: Props) {
  if (carregando) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-brand-muted">
        <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
        Consultando balanço oficial no SICONFI / Tesouro Nacional...
      </div>
    );
  }

  if (!siconfi) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-950">
        <p className="font-semibold">
          Demonstrativo RREO ainda não retornado pelo SICONFI para{" "}
          {entidadeNome}.
        </p>
        <p className="mt-1 text-xs leading-relaxed text-amber-900">
          Alguns entes podem ter entrega pendente ou retificação em andamento no
          Tesouro Nacional. Você pode conferir diretamente no portal oficial.
        </p>
        <a
          href="https://siconfi.tesouro.gov.br/siconfi/index.jsf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
        >
          Consultar no portal SICONFI
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    );
  }

  if (modo === "repasses") {
    const participacaoTransferencias =
      siconfi.receitaRealizada &&
      siconfi.transferenciasCorrentes &&
      siconfi.receitaRealizada > 0
        ? (siconfi.transferenciasCorrentes / siconfi.receitaRealizada) * 100
        : null;

    const participacaoTributaria =
      siconfi.receitaRealizada &&
      siconfi.receitaTributaria &&
      siconfi.receitaRealizada > 0
        ? (siconfi.receitaTributaria / siconfi.receitaRealizada) * 100
        : null;

    const linkCgu = codigoIbge
      ? `https://portaldatransparencia.gov.br/localidades/${codigoIbge}`
      : "https://portaldatransparencia.gov.br/transferencias";

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2.5 text-xs text-emerald-950">
          <span className="font-semibold">
            Fonte ao vivo: SICONFI / Tesouro Nacional (RREO {siconfi.exercicio} •{" "}
            {siconfi.periodo}º bimestre)
          </span>
          <span className="font-medium text-emerald-800">
            {siconfi.instituicao}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-muted uppercase">
              <ArrowDownToLine className="h-3.5 w-3.5 text-brand-emerald" />
              Transferências Correntes
            </p>
            <p className="mt-1.5 text-xl font-extrabold text-brand-navy">
              {formatarMoedaCompacta(siconfi.transferenciasCorrentes)}
            </p>
            {participacaoTransferencias !== null && (
              <p className="mt-1 text-xs text-slate-600">
                Representa{" "}
                <strong>{formatarPercentual(participacaoTransferencias)}</strong>{" "}
                da receita realizada
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-muted uppercase">
              <Coins className="h-3.5 w-3.5 text-brand-blue" />
              Arrecadação Própria (Impostos)
            </p>
            <p className="mt-1.5 text-xl font-extrabold text-brand-navy">
              {formatarMoedaCompacta(siconfi.receitaTributaria)}
            </p>
            {participacaoTributaria !== null && (
              <p className="mt-1 text-xs text-slate-600">
                Representa{" "}
                <strong>{formatarPercentual(participacaoTributaria)}</strong> da
                receita realizada
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-muted uppercase">
              <Landmark className="h-3.5 w-3.5 text-slate-500" />
              Receita Total Realizada
            </p>
            <p className="mt-1.5 text-xl font-extrabold text-brand-navy">
              {formatarMoedaCompacta(siconfi.receitaRealizada)}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Exercício {siconfi.exercicio} (RREO Anexo 01)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
          <p className="max-w-xl leading-relaxed">
            Para detalhar emendas parlamentares federais por autor e convênio
            específico (requer chave de API da CGU em produção), acesse o painel
            oficial da localidade no Portal da Transparência:
          </p>
          <a
            href={linkCgu}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-blue px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-navy"
          >
            Ver repasses na CGU
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    );
  }

  const maxFuncao = Math.max(
    ...siconfi.funcoesPrincipais.map((f) => f.liquidado),
    1
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2.5 text-xs text-emerald-950">
        <span className="font-semibold">
          Dados ao vivo: SICONFI / Tesouro Nacional — Exercício{" "}
          {siconfi.exercicio} ({siconfi.periodo}º bimestre)
        </span>
        {siconfi.populacao && (
          <span className="font-medium text-emerald-800">
            População referência: {formatarNumero(siconfi.populacao)} hab.
          </span>
        )}
      </div>

      {/* Cards das fases orçamentárias */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-brand-muted uppercase">
            <Wallet className="h-3.5 w-3.5 text-brand-emerald" />
            Receita Realizada
          </p>
          <p className="mt-1.5 text-lg font-extrabold text-brand-emerald">
            {formatarMoedaCompacta(siconfi.receitaRealizada)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Prevista: {formatarMoedaCompacta(siconfi.receitaPrevistaAtualizada)}
            {siconfi.receitaPercentual !== null
              ? ` (${formatarPercentual(siconfi.receitaPercentual)})`
              : ""}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-bold tracking-wide text-brand-muted uppercase">
            Despesa Empenhada
          </p>
          <p className="mt-1.5 text-lg font-extrabold text-brand-navy">
            {formatarMoedaCompacta(siconfi.despesaEmpenhada)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Dotação: {formatarMoedaCompacta(siconfi.despesaDotacaoAtualizada)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-bold tracking-wide text-brand-muted uppercase">
            Despesa Liquidada
          </p>
          <p className="mt-1.5 text-lg font-extrabold text-brand-blue">
            {formatarMoedaCompacta(siconfi.despesaLiquidada)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Serviço/entrega conferido
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-bold tracking-wide text-brand-muted uppercase">
            Despesa Paga
          </p>
          <p className="mt-1.5 text-lg font-extrabold text-slate-900">
            {formatarMoedaCompacta(siconfi.despesaPaga)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Efetivamente desembolsado
          </p>
        </div>
      </div>

      {/* Indicador da Lei de Responsabilidade Fiscal (RGF - Despesa com Pessoal) */}
      {siconfi.lrfPessoal && siconfi.lrfPessoal.percentualRcl !== null && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold tracking-wide text-brand-muted uppercase">
                Lei de Responsabilidade Fiscal (SICONFI RGF {siconfi.lrfPessoal.exercicio})
              </p>
              <p className="mt-0.5 text-sm font-bold text-brand-navy">
                Despesa com Pessoal:{" "}
                <span
                  className={
                    siconfi.lrfPessoal.percentualRcl >=
                    siconfi.lrfPessoal.limiteMaximo
                      ? "text-red-700"
                      : siconfi.lrfPessoal.percentualRcl >=
                          siconfi.lrfPessoal.limitePrudencial
                        ? "text-amber-700"
                        : "text-brand-emerald"
                  }
                >
                  {formatarPercentual(siconfi.lrfPessoal.percentualRcl)} da RCL
                </span>
              </p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <p>
                Limite legal:{" "}
                <strong>{siconfi.lrfPessoal.limiteMaximo}%</strong> • Prudencial:{" "}
                <strong>{siconfi.lrfPessoal.limitePrudencial}%</strong>
              </p>
              {siconfi.lrfPessoal.despesaPessoalTotal !== null && (
                <p className="text-[11px] text-brand-muted">
                  Folha (12 meses):{" "}
                  {formatarMoedaCompacta(siconfi.lrfPessoal.despesaPessoalTotal)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Despesas por função (RREO Anexo 02) */}
      {siconfi.funcoesPrincipais.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="flex items-center gap-2 text-sm font-bold text-brand-navy">
              <BarChart3 className="h-4 w-4 text-brand-blue" />
              Onde o orçamento foi aplicado (Despesas Liquidadas por Função)
            </h4>
            <span className="text-[11px] font-medium text-brand-muted">
              RREO Anexo 02 • Top {siconfi.funcoesPrincipais.length} áreas
            </span>
          </div>

          <div className="space-y-2.5">
            {siconfi.funcoesPrincipais.map((item) => {
              const largura = Math.max(
                4,
                Math.round((item.liquidado / maxFuncao) * 100)
              );
              return (
                <div key={item.funcao} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-slate-800">
                      {item.funcao}
                    </span>
                    <span className="font-bold text-brand-navy">
                      {formatarMoedaCompacta(item.liquidado)}{" "}
                      <span className="font-normal text-slate-500">
                        ({formatarPercentual(item.percentual)})
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-emerald"
                      style={{ width: `${largura}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
