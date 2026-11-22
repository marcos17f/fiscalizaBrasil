"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";
import { ABAS_PREFEITO } from "@/lib/abas";
import { buscarMunicipiosPorUf } from "@/lib/ibge";
import { ESTADOS_BRASIL, getEstadoPorUf, normalizarTexto } from "@/lib/ufs";
import { PerfilAbas } from "@/components/ui/PerfilAbas";
import { PainelContratacoesPncp } from "@/components/dados/PainelContratacoesPncp";
import { PainelEleitoralTSE } from "@/components/dados/PainelEleitoralTSE";
import { PainelFiscalSiconfi } from "@/components/dados/PainelFiscalSiconfi";
import { PainelFiscalizacaoOficial } from "@/components/dados/PainelFiscalizacaoOficial";
import { PainelTrajetoriaTSE } from "@/components/dados/PainelTrajetoriaTSE";
import type {
  ContratacaoPncp,
  MunicipioIBGE,
  PerfilTSE,
  ResumoFiscalSiconfi,
} from "@/types/politicos";

type ApiPrefeitoResponse = {
  uf: string;
  ibge: number;
  cidade: string;
  codigoTse: string | null;
  prefeito: PerfilTSE | null;
  siconfi: ResumoFiscalSiconfi | null;
  contratacoesPncp: ContratacaoPncp[];
  fontesConsultadas: {
    tse: boolean;
    siconfi: boolean;
    pncp?: boolean;
  };
};

export function PrefeitosExplorer() {
  const [uf, setUf] = useState("");
  const [municipios, setMunicipios] = useState<MunicipioIBGE[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState(false);
  const [erroCidades, setErroCidades] = useState<string | null>(null);
  const [buscaCidade, setBuscaCidade] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] =
    useState<MunicipioIBGE | null>(null);

  const [dadosPrefeito, setDadosPrefeito] =
    useState<ApiPrefeitoResponse | null>(null);
  const [carregandoDados, setCarregandoDados] = useState(false);

  useEffect(() => {
    if (!uf) {
      setMunicipios([]);
      setCidadeSelecionada(null);
      setBuscaCidade("");
      setErroCidades(null);
      return;
    }

    const controller = new AbortController();
    setCarregandoCidades(true);
    setErroCidades(null);
    setCidadeSelecionada(null);
    setBuscaCidade("");

    buscarMunicipiosPorUf(uf, controller.signal)
      .then((lista) => setMunicipios(lista))
      .catch((e) => {
        if (controller.signal.aborted) return;
        setErroCidades(
          e instanceof Error
            ? e.message
            : "Não foi possível consultar a API do IBGE."
        );
        setMunicipios([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregandoCidades(false);
      });

    return () => controller.abort();
  }, [uf]);

  useEffect(() => {
    if (!cidadeSelecionada || !uf) {
      setDadosPrefeito(null);
      setCarregandoDados(false);
      return;
    }

    const controller = new AbortController();
    setCarregandoDados(true);
    setDadosPrefeito(null);

    const params = new URLSearchParams({
      uf,
      ibge: String(cidadeSelecionada.id),
      cidade: cidadeSelecionada.nome,
    });

    fetch(`/api/prefeitos?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: ApiPrefeitoResponse | null) => {
        if (!controller.signal.aborted) setDadosPrefeito(json);
      })
      .catch(() => {
        if (!controller.signal.aborted) setDadosPrefeito(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregandoDados(false);
      });

    return () => controller.abort();
  }, [cidadeSelecionada, uf]);

  const municipiosFiltrados = useMemo(() => {
    const termo = normalizarTexto(buscaCidade);
    if (!termo) return municipios;
    return municipios.filter((m) => normalizarTexto(m.nome).includes(termo));
  }, [municipios, buscaCidade]);

  const estadoAtual = uf ? getEstadoPorUf(uf) : undefined;
  const prefeito = dadosPrefeito?.prefeito ?? null;
  const vice = prefeito?.vices?.[0] ?? null;

  return (
    <div className="space-y-6">
      {/* Seletor em 2 passos */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="prefeito-uf"
              className="mb-1.5 block text-xs font-bold tracking-wide text-brand-navy uppercase"
            >
              1º Passo: Escolha o Estado (UF)
            </label>
            <select
              id="prefeito-uf"
              value={uf}
              onChange={(e) => setUf(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-slate-800 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
            >
              <option value="">Selecione um estado...</option>
              {ESTADOS_BRASIL.map((e) => (
                <option key={e.uf} value={e.uf}>
                  {e.nome} ({e.uf})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="prefeito-cidade"
              className="mb-1.5 block text-xs font-bold tracking-wide text-brand-navy uppercase"
            >
              2º Passo: Escolha o Município
            </label>
            <select
              id="prefeito-cidade"
              disabled={!uf || carregandoCidades || municipios.length === 0}
              value={cidadeSelecionada?.id ?? ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                const found = municipios.find((m) => m.id === id) ?? null;
                setCidadeSelecionada(found);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-slate-800 disabled:bg-slate-100 disabled:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
            >
              {!uf && <option value="">Aguardando escolha do estado...</option>}
              {uf && carregandoCidades && (
                <option value="">Carregando cidades de {uf} via IBGE...</option>
              )}
              {uf && !carregandoCidades && (
                <>
                  <option value="">
                    Selecione uma das {municipios.length} cidades de {uf}...
                  </option>
                  {municipios.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>

        {/* Busca rápida por nome */}
        {uf &&
          !carregandoCidades &&
          municipios.length > 0 &&
          !cidadeSelecionada && (
            <div className="mt-5 border-t border-slate-100 pt-5">
              <div className="relative max-w-md">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={buscaCidade}
                  onChange={(e) => setBuscaCidade(e.target.value)}
                  placeholder={`Filtrar entre ${municipios.length} municípios de ${estadoAtual?.nome ?? uf}...`}
                  className="w-full rounded-xl border border-slate-300 py-2 pr-4 pl-10 text-sm focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
                />
              </div>

              <div className="mt-4 grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 md:grid-cols-4">
                {municipiosFiltrados.slice(0, 80).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setCidadeSelecionada(m)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-800 transition-colors hover:border-brand-blue hover:bg-blue-50 hover:text-brand-blue"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-emerald" />
                    <span className="truncate">{m.nome}</span>
                  </button>
                ))}
              </div>
              {municipiosFiltrados.length > 80 && (
                <p className="mt-2 text-xs text-brand-muted">
                  Exibindo 80 de {municipiosFiltrados.length} cidades. Use o
                  campo de busca acima para localizar rapidamente.
                </p>
              )}
            </div>
          )}

        {carregandoCidades && (
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-brand-blue">
            <Loader2 className="h-4 w-4 animate-spin" />
            Consultando municípios oficiais no IBGE...
          </div>
        )}

        {erroCidades && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
            {erroCidades}
          </div>
        )}
      </div>

      {/* Ficha da Prefeitura selecionada */}
      {cidadeSelecionada && estadoAtual && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-r from-brand-navy to-brand-blue p-6 text-white shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {prefeito?.fotoUrl && (
                  <img
                    src={prefeito.fotoUrl}
                    alt={`Foto oficial de ${prefeito.nomeUrna}`}
                    className="h-20 w-20 shrink-0 rounded-2xl border-2 border-white/30 object-cover object-top"
                  />
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-200">
                      {estadoAtual.nome} ({estadoAtual.uf})
                    </span>
                    <span className="rounded-md bg-white/15 px-2.5 py-0.5 text-xs font-medium text-slate-200">
                      IBGE {cidadeSelecionada.id}
                    </span>
                    {carregandoDados ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium text-slate-100">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Consultando TSE 2024 + SICONFI...
                      </span>
                    ) : (
                      dadosPrefeito && (
                        <>
                          {dadosPrefeito.fontesConsultadas.tse && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/25 px-2 py-0.5 text-[11px] font-bold text-emerald-100">
                              <CheckCircle2 className="h-3 w-3" />
                              TSE 2024 ao vivo
                            </span>
                          )}
                          {dadosPrefeito.fontesConsultadas.siconfi && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/25 px-2 py-0.5 text-[11px] font-bold text-sky-100">
                              <CheckCircle2 className="h-3 w-3" />
                              SICONFI RREO
                            </span>
                          )}
                        </>
                      )
                    )}
                  </div>

                  <h2 className="mt-2 text-2xl font-extrabold text-white">
                    {prefeito
                      ? `${prefeito.nomeUrna} (${prefeito.partidoSigla})`
                      : `Prefeitura de ${cidadeSelecionada.nome}`}
                  </h2>
                  <p className="mt-1 text-sm text-slate-200">
                    {prefeito ? (
                      <>
                        Prefeito(a) de {cidadeSelecionada.nome} • Mandato
                        2025–2028
                        {prefeito.reeleicao ? " (Reeleito)" : ""}
                        {vice
                          ? ` • Vice: ${vice.nomeUrna} (${vice.partido})`
                          : ""}
                      </>
                    ) : carregandoDados ? (
                      "Buscando prefeito eleito nas Eleições 2024 e balanço fiscal no Tesouro Nacional..."
                    ) : (
                      `Prefeitura Municipal de ${cidadeSelecionada.nome}/${estadoAtual.uf} (verifique eleições suplementares no TSE se aplicável)`
                    )}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCidadeSelecionada(null)}
                className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20"
              >
                Trocar município
              </button>
            </div>
          </div>

          <PerfilAbas
            abas={ABAS_PREFEITO}
            entidadeNome={`Prefeitura de ${cidadeSelecionada.nome} (${estadoAtual.uf})`}
            renderConteudoAba={(aba) => {
              if (aba.id === "trajetoria") {
                return (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-muted uppercase">
                          <Building2 className="h-3.5 w-3.5" />
                          Município Identificado (IBGE / TSE)
                        </p>
                        <p className="mt-1 font-bold text-brand-navy">
                          {cidadeSelecionada.nome} — {estadoAtual.uf}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600">
                          IBGE: {cidadeSelecionada.id}
                          {dadosPrefeito?.codigoTse
                            ? ` • Código TSE: ${dadosPrefeito.codigoTse}`
                            : ""}{" "}
                          • Região {estadoAtual.regiao}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold text-brand-muted uppercase">
                          Chapa Eleita (2025–2028)
                        </p>
                        <p className="mt-1 font-bold text-brand-navy">
                          {prefeito
                            ? `${prefeito.nomeUrna} (${prefeito.partidoSigla})`
                            : "Carregando ou indisponível"}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600">
                          {vice
                            ? `Vice-prefeito(a): ${vice.nomeUrna} (${vice.partido})`
                            : "Consulte o TSE em caso de eleição suplementar"}
                        </p>
                      </div>
                    </div>

                    <PainelTrajetoriaTSE
                      perfil={prefeito}
                      carregando={carregandoDados}
                    />
                  </div>
                );
              }

              if (aba.id === "projetos") {
                return (
                  <div className="space-y-3">
                    {prefeito?.planoDeGovernoUrl ? (
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-white p-4">
                        <div className="flex items-center gap-2.5">
                          <FileText className="h-5 w-5 text-brand-emerald" />
                          <div>
                            <p className="text-sm font-bold text-brand-navy">
                              Plano de Governo Oficial — {prefeito.nomeUrna}{" "}
                              (2024)
                            </p>
                            <p className="text-xs text-slate-600">
                              Documento PDF registrado oficialmente no TSE para
                              fiscalizar as metas da gestão 2025–2028.
                            </p>
                          </div>
                        </div>
                        <a
                          href={prefeito.planoDeGovernoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-emerald px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-emerald-dark"
                        >
                          Abrir PDF do Plano
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
                        Plano de governo oficial disponível na ficha do
                        candidato no TSE DivulgaCandContas.
                      </div>
                    )}

                    <PainelContratacoesPncp
                      contratacoes={dadosPrefeito?.contratacoesPncp ?? []}
                      carregando={carregandoDados}
                      titulo={`${cidadeSelecionada.nome}/${estadoAtual.uf}`}
                    />

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
                      <p className="font-bold text-brand-navy">
                        Licitações, obras e convênios federais em{" "}
                        {cidadeSelecionada.nome}
                      </p>
                      <p className="mt-1 leading-relaxed">
                        Acompanhe convênios e transferências da União executadas
                        no município diretamente pelo Portal da Transparência:
                      </p>
                      <a
                        href={`https://portaldatransparencia.gov.br/localidades/${cidadeSelecionada.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 font-bold text-brand-blue hover:underline"
                      >
                        Ver painel da cidade na CGU
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                );
              }

              if (aba.id === "emendas") {
                return (
                  <PainelFiscalSiconfi
                    siconfi={dadosPrefeito?.siconfi ?? null}
                    carregando={carregandoDados}
                    modo="repasses"
                    entidadeNome={`Prefeitura de ${cidadeSelecionada.nome}/${estadoAtual.uf}`}
                    codigoIbge={cidadeSelecionada.id}
                  />
                );
              }

              if (aba.id === "financas") {
                return (
                  <PainelFiscalSiconfi
                    siconfi={dadosPrefeito?.siconfi ?? null}
                    carregando={carregandoDados}
                    modo="completo"
                    entidadeNome={`Prefeitura de ${cidadeSelecionada.nome}/${estadoAtual.uf}`}
                    codigoIbge={cidadeSelecionada.id}
                  />
                );
              }

              if (aba.id === "eleicoes") {
                return (
                  <PainelEleitoralTSE
                    perfil={prefeito}
                    carregando={carregandoDados}
                    entidadeNome={`Prefeito(a) de ${cidadeSelecionada.nome}/${estadoAtual.uf}`}
                  />
                );
              }

              if (aba.id === "fiscalizacao") {
                return (
                  <PainelFiscalizacaoOficial
                    estado={estadoAtual}
                    linkTse={prefeito?.linkOficialTse}
                    codigoIbge={cidadeSelecionada.id}
                  />
                );
              }

              return undefined;
            }}
          />
        </div>
      )}
    </div>
  );
}
