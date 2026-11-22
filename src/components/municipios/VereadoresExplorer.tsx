"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Search,
  Users,
  X,
} from "lucide-react";
import { ABAS_VEREADOR } from "@/lib/abas";
import { formatarMoedaCompacta, formatarPercentual } from "@/lib/formatters";
import { buscarMunicipiosPorUf } from "@/lib/ibge";
import { ESTADOS_BRASIL, getEstadoPorUf, normalizarTexto } from "@/lib/ufs";
import { PerfilAbas } from "@/components/ui/PerfilAbas";
import { PainelEleitoralTSE } from "@/components/dados/PainelEleitoralTSE";
import { PainelFiscalizacaoOficial } from "@/components/dados/PainelFiscalizacaoOficial";
import { PainelTrajetoriaTSE } from "@/components/dados/PainelTrajetoriaTSE";
import type {
  MunicipioIBGE,
  PerfilTSE,
  VereadorEleitoTSE,
} from "@/types/politicos";

type OrcamentoLegislativo = {
  exercicio: number;
  periodo: number;
  despesaLegislativa: number | null;
  percentualLegislativa: number | null;
  despesaTotalMunicipio: number | null;
};

type ApiVereadoresResponse = {
  uf: string;
  cidade: string;
  codigoTse: string | null;
  anoEleicao: number;
  totalEleitos: number;
  vereadores: VereadorEleitoTSE[];
  orcamentoLegislativo: OrcamentoLegislativo | null;
};

function AvatarVereador({
  fotoUrl,
  nome,
}: {
  fotoUrl: string;
  nome: string;
}) {
  const [erro, setErro] = useState(false);
  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  if (!fotoUrl || erro) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-navy font-display text-xs font-bold text-white">
        {iniciais}
      </div>
    );
  }

  return (
    <img
      src={fotoUrl}
      alt={`Foto oficial de ${nome}`}
      loading="lazy"
      onError={() => setErro(true)}
      className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 object-cover object-top"
    />
  );
}

export function VereadoresExplorer() {
  const [uf, setUf] = useState("");
  const [municipios, setMunicipios] = useState<MunicipioIBGE[]>([]);
  const [cidadeId, setCidadeId] = useState("");
  const [carregandoCidades, setCarregandoCidades] = useState(false);
  const [erroCidades, setErroCidades] = useState<string | null>(null);

  const [consultado, setConsultado] = useState<MunicipioIBGE | null>(null);
  const [vereadores, setVereadores] = useState<VereadorEleitoTSE[]>([]);
  const [orcamentoLeg, setOrcamentoLeg] = useState<OrcamentoLegislativo | null>(
    null
  );
  const [carregandoVereadores, setCarregandoVereadores] = useState(false);
  const [erroVereadores, setErroVereadores] = useState<string | null>(null);

  const [buscaNome, setBuscaNome] = useState("");
  const [filtroPartido, setFiltroPartido] = useState("Todos");

  const [verSelecionado, setVerSelecionado] =
    useState<VereadorEleitoTSE | null>(null);
  const [detalheTse, setDetalheTse] = useState<PerfilTSE | null>(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);

  useEffect(() => {
    if (!uf) {
      setMunicipios([]);
      setCidadeId("");
      setConsultado(null);
      setVereadores([]);
      setErroCidades(null);
      return;
    }

    const controller = new AbortController();
    setCarregandoCidades(true);
    setErroCidades(null);
    setCidadeId("");
    setConsultado(null);
    setVereadores([]);

    buscarMunicipiosPorUf(uf, controller.signal)
      .then((lista) => setMunicipios(lista))
      .catch((e) => {
        if (controller.signal.aborted) return;
        setErroCidades(
          e instanceof Error
            ? e.message
            : "Erro ao consultar municípios no IBGE."
        );
        setMunicipios([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregandoCidades(false);
      });

    return () => controller.abort();
  }, [uf]);

  useEffect(() => {
    if (!verSelecionado) {
      setDetalheTse(null);
      setCarregandoDetalhe(false);
      return;
    }

    const controller = new AbortController();
    setCarregandoDetalhe(true);
    setDetalheTse(null);

    const params = new URLSearchParams({
      ano: String(verSelecionado.ano),
      ue: verSelecionado.ueCodigo,
      eleicao: String(verSelecionado.eleicaoId),
      id: String(verSelecionado.id),
      ...(uf ? { uf } : {}),
    });

    fetch(`/api/tse/candidato?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { perfil?: PerfilTSE } | null) => {
        if (!controller.signal.aborted) setDetalheTse(json?.perfil ?? null);
      })
      .catch(() => {
        if (!controller.signal.aborted) setDetalheTse(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregandoDetalhe(false);
      });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVerSelecionado(null);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      controller.abort();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [verSelecionado]);

  const estadoAtual = uf ? getEstadoPorUf(uf) : undefined;

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = municipios.find((m) => String(m.id) === cidadeId) ?? null;
    if (!found || !uf) return;

    setConsultado(found);
    setBuscaNome("");
    setFiltroPartido("Todos");
    setCarregandoVereadores(true);
    setErroVereadores(null);
    setVereadores([]);
    setOrcamentoLeg(null);

    try {
      const params = new URLSearchParams({
        uf,
        cidade: found.nome,
        ibge: String(found.id),
      });
      const res = await fetch(`/api/vereadores?${params.toString()}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          body?.error ?? `Falha ao consultar vereadores (HTTP ${res.status})`
        );
      }
      const data: ApiVereadoresResponse = await res.json();
      setVereadores(data.vereadores);
      setOrcamentoLeg(data.orcamentoLegislativo ?? null);
    } catch (err) {
      setErroVereadores(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os vereadores deste município."
      );
    } finally {
      setCarregandoVereadores(false);
    }
  };

  const partidos = useMemo(() => {
    const set = new Set(vereadores.map((v) => v.partidoSigla).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [vereadores]);

  const vereadoresFiltrados = useMemo(() => {
    const termo = normalizarTexto(buscaNome);
    return vereadores.filter((v) => {
      if (filtroPartido !== "Todos" && v.partidoSigla !== filtroPartido) {
        return false;
      }
      if (!termo) return true;
      return normalizarTexto(
        `${v.nomeUrna} ${v.nomeCompleto} ${v.partidoSigla} ${v.numero}`
      ).includes(termo);
    });
  }, [vereadores, buscaNome, filtroPartido]);

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleBuscar}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6"
      >
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-4">
            <label
              htmlFor="ver-uf"
              className="mb-1.5 block text-xs font-bold tracking-wide text-brand-navy uppercase"
            >
              Estado (UF)
            </label>
            <select
              id="ver-uf"
              value={uf}
              onChange={(e) => setUf(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-slate-800 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
            >
              <option value="">Selecione o Estado</option>
              {ESTADOS_BRASIL.map((e) => (
                <option key={e.uf} value={e.uf}>
                  {e.uf} — {e.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-5">
            <label
              htmlFor="ver-cidade"
              className="mb-1.5 block text-xs font-bold tracking-wide text-brand-navy uppercase"
            >
              Município
            </label>
            <select
              id="ver-cidade"
              disabled={!uf || carregandoCidades || municipios.length === 0}
              value={cidadeId}
              onChange={(e) => setCidadeId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-slate-800 disabled:bg-slate-100 disabled:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
            >
              {!uf && <option value="">Selecione primeiro o Estado</option>}
              {uf && carregandoCidades && (
                <option value="">Carregando cidades de {uf}...</option>
              )}
              {uf && !carregandoCidades && (
                <>
                  <option value="">
                    Selecione a cidade ({municipios.length} municípios)
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

          <div className="flex items-end gap-2 md:col-span-3">
            <button
              type="submit"
              disabled={!cidadeId || carregandoCidades || carregandoVereadores}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-emerald px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-emerald-dark disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {carregandoCidades || carregandoVereadores ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Buscar vereadores
            </button>
          </div>
        </div>

        {erroCidades && (
          <p className="mt-3 text-xs font-semibold text-red-700">
            {erroCidades}
          </p>
        )}
      </form>

      {/* Atalhos rápidos por estado */}
      {!uf && (
        <div>
          <p className="mb-3 text-xs font-bold tracking-wider text-brand-muted uppercase">
            Ou selecione um estado diretamente
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
            {ESTADOS_BRASIL.map((e) => (
              <button
                key={e.uf}
                type="button"
                onClick={() => setUf(e.uf)}
                className="flex flex-col items-center rounded-xl border border-slate-200 bg-white px-3 py-3 text-center shadow-2xs transition-all hover:border-brand-blue hover:bg-blue-50"
              >
                <span className="font-display text-base font-extrabold text-brand-navy">
                  {e.uf}
                </span>
                <span className="mt-0.5 line-clamp-1 text-[11px] text-brand-muted">
                  {e.nome}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resultado da consulta */}
      {consultado && estadoAtual && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-brand-navy px-2.5 py-0.5 text-xs font-bold text-white">
                    {estadoAtual.uf}
                  </span>
                  <span className="text-xs font-semibold text-brand-muted">
                    IBGE {consultado.id}
                  </span>
                </div>
                <h2 className="mt-2 text-2xl font-extrabold text-brand-navy">
                  Câmara Municipal de {consultado.nome}
                </h2>
                <p className="mt-0.5 text-xs text-brand-muted">
                  Vereadores eleitos nas Eleições Municipais 2024 (Mandato
                  2025–2028)
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {carregandoVereadores
                  ? "Consultando TSE..."
                  : `${vereadores.length} eleitos (TSE oficial)`}
              </span>
            </div>

            {!carregandoVereadores && vereadores.length > 0 && (
              <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-12">
                <div className="relative md:col-span-6">
                  <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={buscaNome}
                    onChange={(e) => setBuscaNome(e.target.value)}
                    placeholder="Filtrar vereador por nome, número ou partido..."
                    className="w-full rounded-xl border border-slate-300 py-2 pr-4 pl-10 text-sm focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-3">
                  <select
                    value={filtroPartido}
                    onChange={(e) => setFiltroPartido(e.target.value)}
                    aria-label="Filtrar vereadores por partido"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
                  >
                    <option value="Todos">
                      Todos os partidos ({partidos.length})
                    </option>
                    {partidos.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-end text-xs font-semibold text-brand-muted md:col-span-3">
                  {vereadoresFiltrados.length} de {vereadores.length} vereadores
                </div>
              </div>
            )}
          </div>

          {carregandoVereadores ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-12 text-sm font-semibold text-brand-muted">
              <Loader2 className="h-5 w-5 animate-spin text-brand-blue" />
              Buscando vereadores eleitos de {consultado.nome} no TSE
              DivulgaCandContas...
            </div>
          ) : erroVereadores ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
              <p className="font-bold">Erro ao consultar TSE</p>
              <p className="mt-1">{erroVereadores}</p>
            </div>
          ) : vereadoresFiltrados.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Users className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 font-bold text-slate-800">
                {vereadores.length === 0
                  ? "Nenhum vereador localizado para este município"
                  : "Nenhum vereador encontrado com este filtro"}
              </p>
              {estadoAtual.uf === "DF" && (
                <p className="mt-1 text-xs text-slate-500">
                  O Distrito Federal não possui Câmaras Municipais; seus
                  representantes locais são os Deputados Distritais na CLDF.
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {vereadoresFiltrados.map((ver) => (
                <article
                  key={ver.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-brand-blue/40 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <AvatarVereador
                      fotoUrl={ver.fotoUrl}
                      nome={ver.nomeUrna}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                          {ver.partidoSigla}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          Nº {ver.numero}
                        </span>
                        {ver.reeleicao && (
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                            Reeleito
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 truncate text-sm font-bold text-brand-navy">
                        {ver.nomeUrna}
                      </h3>
                      <p className="mt-0.5 truncate text-[11px] text-brand-muted">
                        {ver.totalizacao}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setVerSelecionado(ver)}
                    className="mt-4 w-full rounded-xl bg-slate-900 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-blue"
                  >
                    Abrir Perfil (8 abas + TSE)
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de Perfil do Vereador */}
      {verSelecionado && consultado && estadoAtual && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-ver-titulo"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-xs sm:p-6"
          onClick={() => setVerSelecionado(null)}
        >
          <div
            className="my-4 w-full max-w-4xl overflow-hidden rounded-2xl bg-slate-50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-brand-navy to-brand-blue p-5 text-white sm:p-6">
              <button
                type="button"
                onClick={() => setVerSelecionado(null)}
                aria-label="Fechar perfil"
                className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col gap-4 pr-12 sm:flex-row sm:items-center">
                <img
                  src={detalheTse?.fotoUrl ?? verSelecionado.fotoUrl}
                  alt={`Foto oficial de ${verSelecionado.nomeUrna}`}
                  className="h-20 w-20 shrink-0 rounded-2xl border-2 border-white/30 object-cover object-top"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-200">
                      {verSelecionado.partidoSigla} • Nº {verSelecionado.numero}
                    </span>
                    <span className="rounded-md bg-white/15 px-2.5 py-0.5 text-xs font-medium text-slate-100">
                      {verSelecionado.totalizacao}
                    </span>
                    {carregandoDetalhe ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Consultando bens e histórico...
                      </span>
                    ) : (
                      detalheTse && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/25 px-2 py-0.5 text-[11px] font-bold text-emerald-100">
                          <CheckCircle2 className="h-3 w-3" />
                          TSE 2024 ao vivo
                        </span>
                      )
                    )}
                  </div>
                  <h2
                    id="modal-ver-titulo"
                    className="mt-2 text-2xl font-extrabold text-white"
                  >
                    {verSelecionado.nomeUrna}
                  </h2>
                  <p className="mt-1 text-sm text-slate-200">
                    Vereador(a) de {consultado.nome}/{estadoAtual.uf} • Mandato
                    2025–2028
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <PerfilAbas
                abas={ABAS_VEREADOR}
                entidadeNome={`${verSelecionado.nomeUrna} (${consultado.nome}/${estadoAtual.uf})`}
                renderConteudoAba={(aba) => {
                  if (aba.id === "trajetoria") {
                    return (
                      <div className="space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold text-brand-muted uppercase">
                              Câmara Municipal
                            </p>
                            <p className="mt-1 font-bold text-brand-navy">
                              {consultado.nome} — {estadoAtual.uf}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-600">
                              Código IBGE: {consultado.id} • Mandato 2025–2028
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold text-brand-muted uppercase">
                              Situação Eleitoral (2024)
                            </p>
                            <p className="mt-1 font-bold text-brand-navy">
                              {verSelecionado.totalizacao}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-600">
                              {verSelecionado.reeleicao
                                ? "Mandato de reeleição"
                                : "Primeiro mandato neste ciclo"}
                            </p>
                          </div>
                        </div>

                        <PainelTrajetoriaTSE
                          perfil={detalheTse}
                          carregando={carregandoDetalhe}
                        />
                      </div>
                    );
                  }

                  if (aba.id === "custos") {
                    if (orcamentoLeg?.despesaLegislativa) {
                      return (
                        <div className="space-y-3">
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                            <p className="text-xs font-semibold text-emerald-900">
                              Fonte ao vivo: SICONFI / Tesouro Nacional (RREO{" "}
                              {orcamentoLeg.exercicio} • Função Legislativa)
                            </p>
                            <p className="mt-1 text-xl font-extrabold text-brand-emerald">
                              {formatarMoedaCompacta(
                                orcamentoLeg.despesaLegislativa
                              )}
                            </p>
                            <p className="mt-0.5 text-xs text-emerald-950">
                              Custo total da função Legislativa em{" "}
                              <strong>{consultado.nome}</strong>
                              {orcamentoLeg.percentualLegislativa !== null
                                ? ` (${formatarPercentual(orcamentoLeg.percentualLegislativa)} do orçamento municipal)`
                                : ""}
                              {vereadores.length > 0
                                ? ` • Média estimada por cadeira (${vereadores.length} vereadores): ${formatarMoedaCompacta(orcamentoLeg.despesaLegislativa / vereadores.length)}/ano`
                                : ""}
                            </p>
                          </div>
                          <p className="text-xs text-slate-600">
                            Este valor corresponde ao custo global da Câmara
                            Municipal (folha, estrutura e gabinetes) declarado
                            ao Tesouro Nacional. Para ver a folha individual do
                            vereador, consulte o Portal da Transparência da
                            Câmara ou o {estadoAtual.tceSigla}.
                          </p>
                        </div>
                      );
                    }
                    return undefined;
                  }

                  if (aba.id === "eleicoes") {
                    return (
                      <PainelEleitoralTSE
                        perfil={detalheTse}
                        carregando={carregandoDetalhe}
                        entidadeNome={`${verSelecionado.nomeUrna} (${consultado.nome}/${estadoAtual.uf})`}
                      />
                    );
                  }

                  if (aba.id === "controle") {
                    return (
                      <PainelFiscalizacaoOficial
                        estado={estadoAtual}
                        linkTse={detalheTse?.linkOficialTse}
                        codigoIbge={consultado.id}
                      />
                    );
                  }

                  return undefined;
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
