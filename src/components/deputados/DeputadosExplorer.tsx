"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Landmark,
  Loader2,
  MapPin,
  Receipt,
  Search,
  Users,
  X,
} from "lucide-react";
import { ABAS_DEPUTADO_ESTADUAL } from "@/lib/abas";
import { getEstadoPorUf, normalizarTexto, REGIOES } from "@/lib/ufs";
import { PerfilAbas } from "@/components/ui/PerfilAbas";
import { PainelEleitoralTSE } from "@/components/dados/PainelEleitoralTSE";
import { PainelFiscalizacaoOficial } from "@/components/dados/PainelFiscalizacaoOficial";
import { PainelTrajetoriaTSE } from "@/components/dados/PainelTrajetoriaTSE";
import type {
  AlespDetalhe,
  Assembleia,
  DadosAlmgDeputado,
  DeputadoEstadual,
  PerfilTSE,
  Regiao,
} from "@/types/politicos";

type Props = {
  assembleias: Assembleia[];
};

type ApiBancadaResponse = {
  assembleia: Assembleia;
  totalCadastrados: number;
  deputados: DeputadoEstadual[];
};

type ApiPerfilDepEstadual = {
  uf: string;
  tse: PerfilTSE | null;
  almg: DadosAlmgDeputado | null;
  alesp: AlespDetalhe | null;
};

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function DeputadosExplorer({ assembleias }: Props) {
  const [regiao, setRegiao] = useState<Regiao | "Todas">("Todas");
  const [buscaUf, setBuscaUf] = useState("");
  const [assembleiaAtiva, setAssembleiaAtiva] = useState<Assembleia | null>(
    null
  );

  const [deputados, setDeputados] = useState<DeputadoEstadual[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [buscaDep, setBuscaDep] = useState("");
  const [partidoDep, setPartidoDep] = useState("Todos");
  const [depSelecionado, setDepSelecionado] =
    useState<DeputadoEstadual | null>(null);
  const [perfilDetalhe, setPerfilDetalhe] =
    useState<ApiPerfilDepEstadual | null>(null);
  const [carregandoPerfil, setCarregandoPerfil] = useState(false);

  const assembleiasFiltradas = useMemo(() => {
    const termo = normalizarTexto(buscaUf);
    return assembleias.filter((a) => {
      const info = getEstadoPorUf(a.uf);
      if (regiao !== "Todas" && info?.regiao !== regiao) return false;
      if (!termo) return true;
      return normalizarTexto(`${a.nome} ${a.uf} ${a.sigla}`).includes(termo);
    });
  }, [assembleias, regiao, buscaUf]);

  const carregarBancada = async (assembleia: Assembleia) => {
    setAssembleiaAtiva(assembleia);
    setBuscaDep("");
    setPartidoDep("Todos");
    setDepSelecionado(null);
    setPerfilDetalhe(null);
    setCarregando(true);
    setErro(null);

    try {
      const res = await fetch(`/api/dep-estaduais/${assembleia.uf}`);
      if (!res.ok) {
        throw new Error(`Erro ao carregar bancada (HTTP ${res.status})`);
      }
      const data: ApiBancadaResponse = await res.json();
      setDeputados(data.deputados);
    } catch (e) {
      setErro(
        e instanceof Error
          ? e.message
          : "Não foi possível carregar os deputados deste estado."
      );
      setDeputados([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (!depSelecionado || !assembleiaAtiva) {
      setPerfilDetalhe(null);
      setCarregandoPerfil(false);
      return;
    }

    const controller = new AbortController();
    setCarregandoPerfil(true);
    setPerfilDetalhe(null);

    fetch(
      `/api/dep-estaduais/${assembleiaAtiva.uf}/perfil?nome=${encodeURIComponent(
        depSelecionado.nome
      )}`,
      { signal: controller.signal }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ApiPerfilDepEstadual | null) => {
        if (!controller.signal.aborted) setPerfilDetalhe(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setPerfilDetalhe(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregandoPerfil(false);
      });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDepSelecionado(null);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      controller.abort();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [depSelecionado, assembleiaAtiva]);

  const partidosBancada = useMemo(() => {
    const set = new Set(deputados.map((d) => d.partido).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [deputados]);

  const deputadosFiltrados = useMemo(() => {
    const termo = normalizarTexto(buscaDep);
    return deputados.filter((d) => {
      if (partidoDep !== "Todos" && d.partido !== partidoDep) return false;
      if (!termo) return true;
      return normalizarTexto(
        `${d.nome} ${d.partido} ${d.municipio ?? ""}`
      ).includes(termo);
    });
  }, [deputados, buscaDep, partidoDep]);

  if (!assembleiaAtiva) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="relative md:col-span-7">
              <label htmlFor="busca-assembleia" className="sr-only">
                Buscar estado ou assembleia legislativa
              </label>
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="busca-assembleia"
                type="search"
                value={buscaUf}
                onChange={(e) => setBuscaUf(e.target.value)}
                placeholder="Filtrar estado ou sigla da Assembleia (ex: SP, ALESP, Minas)..."
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 md:col-span-5 md:justify-end">
              {(["Todas", ...REGIOES] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegiao(r)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    regiao === r
                      ? "bg-brand-navy text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {r === "Todas" ? "Todas" : r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {assembleiasFiltradas.map((a) => {
            const info = getEstadoPorUf(a.uf);
            return (
              <button
                key={a.uf}
                type="button"
                onClick={() => carregarBancada(a)}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand-blue/50 hover:shadow-md"
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-mint font-display text-sm font-extrabold text-brand-emerald transition-colors group-hover:bg-brand-emerald group-hover:text-white">
                      {a.uf}
                    </div>
                    <div>
                      <h2 className="font-bold text-brand-navy group-hover:text-brand-blue">
                        {a.nome}
                      </h2>
                      <p className="text-xs font-semibold text-brand-muted">
                        {a.sigla} • {info?.regiao ?? ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                      {a.vagas} vagas
                    </span>
                    {a.uf === "SP" && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        TSE + Folha ALESP
                      </span>
                    )}
                    {a.uf === "MG" && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        TSE + Verba ALMG
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex w-full items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-brand-blue">
                  <span>Consultar deputados de {a.uf}</span>
                  <Landmark className="h-4 w-4 text-slate-400 transition-colors group-hover:text-brand-blue" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const estadoAtivo = getEstadoPorUf(assembleiaAtiva.uf);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAssembleiaAtiva(null)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Trocar Estado
          </button>
          <div>
            <h2 className="text-lg font-extrabold text-brand-navy sm:text-xl">
              {assembleiaAtiva.nome} ({assembleiaAtiva.sigla})
            </h2>
            <p className="text-xs text-brand-muted">
              {assembleiaAtiva.vagas} cadeiras oficiais • {deputados.length}{" "}
              parlamentares listados • Integração TSE ao vivo
              {assembleiaAtiva.uf === "SP" ? " + Folha/Bio ALESP" : ""}
              {assembleiaAtiva.uf === "MG" ? " + Verba ALMG ao vivo" : ""}
            </p>
          </div>
        </div>

        <a
          href={assembleiaAtiva.portal}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-mint px-3.5 py-2 text-xs font-bold text-brand-emerald transition-colors hover:bg-emerald-100"
        >
          Portal Oficial ({assembleiaAtiva.sigla})
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <label htmlFor="busca-dep" className="sr-only">
              Buscar deputado estadual
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="busca-dep"
              type="search"
              value={buscaDep}
              onChange={(e) => setBuscaDep(e.target.value)}
              placeholder="Buscar parlamentar por nome ou partido..."
              className="w-full rounded-xl border border-slate-300 py-2.5 pr-4 pl-10 text-sm focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="filtro-partido-dep" className="sr-only">
              Filtrar por partido
            </label>
            <select
              id="filtro-partido-dep"
              value={partidoDep}
              onChange={(e) => setPartidoDep(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
            >
              <option value="Todos">
                Todos os partidos ({partidosBancada.length})
              </option>
              {partidosBancada.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end text-xs font-semibold text-brand-muted md:col-span-3">
            {deputadosFiltrados.length} resultados
          </div>
        </div>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-12 text-sm font-semibold text-brand-muted">
          <Loader2 className="h-5 w-5 animate-spin text-brand-blue" />
          Carregando bancada de {assembleiaAtiva.nome}...
        </div>
      ) : erro ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          <p className="font-bold">Erro ao carregar dados</p>
          <p className="mt-1">{erro}</p>
        </div>
      ) : deputadosFiltrados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Users className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-2 font-bold text-slate-800">
            Nenhum parlamentar encontrado com este filtro
          </p>
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {deputadosFiltrados.map((dep) => {
            const iniciais = dep.nome
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((p) => p[0])
              .join("")
              .toUpperCase();

            return (
              <article
                key={`${assembleiaAtiva.uf}-${dep.nome}`}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-brand-blue/40 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-navy font-display text-sm font-bold text-white">
                    {iniciais}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                        {dep.partido}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        {assembleiaAtiva.uf}
                      </span>
                    </div>
                    <h3 className="mt-1 truncate text-sm font-bold text-brand-navy">
                      {dep.nome}
                    </h3>
                    {dep.municipio && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-brand-muted">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {dep.municipio}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDepSelecionado(dep)}
                  className="mt-4 w-full rounded-xl bg-slate-900 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-blue"
                >
                  Abrir Perfil (8 abas + TSE)
                </button>
              </article>
            );
          })}
        </div>
      )}

      {depSelecionado && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-dep-titulo"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-xs sm:p-6"
          onClick={() => setDepSelecionado(null)}
        >
          <div
            className="my-4 w-full max-w-4xl overflow-hidden rounded-2xl bg-slate-50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-brand-navy to-brand-blue p-5 text-white sm:p-6">
              <button
                type="button"
                onClick={() => setDepSelecionado(null)}
                aria-label="Fechar perfil"
                className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col gap-4 pr-12 sm:flex-row sm:items-center">
                {perfilDetalhe?.tse?.fotoUrl && (
                  <img
                    src={perfilDetalhe.tse.fotoUrl}
                    alt={depSelecionado.nome}
                    className="h-20 w-20 shrink-0 rounded-2xl border-2 border-white/30 object-cover object-top"
                  />
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-200">
                      {depSelecionado.partido} • {assembleiaAtiva.uf} (
                      {assembleiaAtiva.sigla})
                    </span>
                    {carregandoPerfil ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-[11px]">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Consultando fontes oficiais...
                      </span>
                    ) : (
                      <>
                        {perfilDetalhe?.tse && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/25 px-2 py-0.5 text-[11px] font-bold text-emerald-100">
                            <CheckCircle2 className="h-3 w-3" />
                            TSE ao vivo
                          </span>
                        )}
                        {perfilDetalhe?.alesp && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-400/25 px-2 py-0.5 text-[11px] font-bold text-blue-100">
                            ALESP Folha/Bio
                          </span>
                        )}
                        {perfilDetalhe?.almg && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-400/25 px-2 py-0.5 text-[11px] font-bold text-blue-100">
                            ALMG Verbas ao vivo
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <h2
                    id="modal-dep-titulo"
                    className="mt-2 text-2xl font-extrabold text-white"
                  >
                    {depSelecionado.nome}
                  </h2>
                  <p className="mt-1 text-sm text-slate-200">
                    Deputado(a) Estadual • {assembleiaAtiva.nome} • Mandato
                    2023–2027
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <PerfilAbas
                abas={ABAS_DEPUTADO_ESTADUAL}
                entidadeNome={`${depSelecionado.nome} (${assembleiaAtiva.sigla})`}
                renderConteudoAba={(aba) => {
                  const alesp = perfilDetalhe?.alesp;
                  const almg = perfilDetalhe?.almg;
                  const tse = perfilDetalhe?.tse;

                  if (aba.id === "trajetoria") {
                    return (
                      <div className="space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold text-brand-muted uppercase">
                              Casa Legislativa
                            </p>
                            <p className="mt-1 font-bold text-brand-navy">
                              {assembleiaAtiva.sigla} — {assembleiaAtiva.nome}
                            </p>
                            <a
                              href={almg?.portalUrl ?? assembleiaAtiva.portal}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline"
                            >
                              Acessar portal oficial
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold text-brand-muted uppercase">
                              Partido & Base
                            </p>
                            <p className="mt-1 font-bold text-brand-navy">
                              {depSelecionado.partido}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-600">
                              {almg?.email ||
                                depSelecionado.municipio ||
                                assembleiaAtiva.nome}
                            </p>
                          </div>
                        </div>

                        {alesp?.biografia && (
                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-bold tracking-wide text-brand-emerald uppercase">
                              Biografia Oficial (ALESP)
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-slate-700">
                              {alesp.biografia}
                            </p>
                          </div>
                        )}

                        <PainelTrajetoriaTSE
                          perfil={tse ?? null}
                          carregando={carregandoPerfil}
                        />
                      </div>
                    );
                  }

                  if (aba.id === "eleicoes") {
                    return (
                      <PainelEleitoralTSE
                        perfil={tse ?? null}
                        carregando={carregandoPerfil}
                        entidadeNome={`${depSelecionado.nome} (${assembleiaAtiva.sigla})`}
                      />
                    );
                  }

                  if (aba.id === "custos") {
                    if (alesp?.folhas?.length) {
                      return (
                        <div className="space-y-3">
                          <p className="text-xs font-bold text-brand-navy">
                            Folha salarial publicada pela ALESP (
                            {alesp.folhas.length} meses conferidos)
                          </p>
                          <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                            {alesp.folhas.map((f) => (
                              <div
                                key={f.mes}
                                className="flex flex-col justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3.5 sm:flex-row sm:items-center"
                              >
                                <div>
                                  <p className="flex items-center gap-1.5 text-xs font-bold text-brand-navy">
                                    <Receipt className="h-3.5 w-3.5 text-brand-blue" />
                                    Mês {f.mes} — {f.nome_folha}
                                  </p>
                                  <p className="mt-0.5 text-xs text-slate-500">
                                    Bruto: {brl.format(Number(f.bruto))} •
                                    Tributos: {brl.format(Number(f.tributos))}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-extrabold text-brand-emerald">
                                    Líquido: {brl.format(Number(f.liquido))}
                                  </span>
                                  {f.fonte && (
                                    <a
                                      href={f.fonte}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs font-semibold text-brand-blue hover:underline"
                                    >
                                      Fonte
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    if (almg?.itensVerba?.length) {
                      return (
                        <div className="space-y-3">
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                            <p className="text-xs font-semibold text-emerald-900">
                              Verba Indenizatória ALMG — Referência{" "}
                              {almg.mesReferenciaVerba}
                            </p>
                            <p className="mt-1 text-xl font-extrabold text-brand-emerald">
                              {brl.format(almg.totalVerbaMes ?? 0)}
                            </p>
                          </div>
                          <div className="space-y-2">
                            {almg.itensVerba.map((v) => (
                              <div
                                key={v.categoria}
                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs"
                              >
                                <span className="font-semibold text-slate-800">
                                  {v.categoria}
                                </span>
                                <span className="font-bold text-brand-navy">
                                  {brl.format(v.valor)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700">
                        <p className="font-bold text-brand-navy">
                          Transparência salarial e verbas de gabinete por
                          Assembleia
                        </p>
                        <p className="mt-1 leading-relaxed">
                          Cada uma das 27 Casas Legislativas publica suas folhas
                          e verbas em portal próprio.{" "}
                          <strong>SP (ALESP)</strong> e{" "}
                          <strong>MG (ALMG)</strong> já estão integradas neste
                          portal como referência; para {assembleiaAtiva.sigla},
                          consulte diretamente o portal oficial:
                        </p>
                        <a
                          href={assembleiaAtiva.portal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 font-bold text-brand-blue hover:underline"
                        >
                          Abrir transparência na {assembleiaAtiva.sigla}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    );
                  }

                  if (
                    aba.id === "emendas" &&
                    alesp &&
                    alesp.totalEmendasRegistradas > 0
                  ) {
                    return (
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-brand-navy">
                          {alesp.totalEmendasRegistradas} registros de
                          emendas/pagamentos conferidos na ALESP/Sefaz-SP
                          (exibindo até {alesp.emendasAmostra.length} recentes)
                        </p>
                        <div className="max-h-96 space-y-2.5 overflow-y-auto pr-1">
                          {alesp.emendasAmostra.map((em, i) => {
                            const destinatario =
                              em.beneficiario_previsto ||
                              em.credor ||
                              em.favorecido;
                            const linkFonte = em.fonte_url || em.fonte;
                            const valorNum = Number(em.valor) || 0;
                            return (
                              <div
                                key={`${em.documento ?? em.codigo ?? i}-${i}`}
                                className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="font-bold text-brand-navy">
                                    Emenda:{" "}
                                    {String(
                                      em.codigo_emenda ?? em.codigo ?? "—"
                                    )}{" "}
                                    • Doc: {String(em.documento ?? "—")}
                                  </span>
                                  <span className="font-extrabold text-brand-emerald">
                                    {em.valor_destinado || brl.format(valorNum)}
                                  </span>
                                </div>
                                {destinatario && (
                                  <p className="mt-1 font-semibold text-slate-800">
                                    Destinatário: {String(destinatario)}
                                  </p>
                                )}
                                {em.finalidade && (
                                  <p className="mt-0.5 leading-relaxed text-slate-600">
                                    Finalidade: {String(em.finalidade)}
                                  </p>
                                )}
                                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                                  <span>
                                    Data: {String(em.data ?? "—")}
                                    {em.credor &&
                                    em.credor !== destinatario
                                      ? ` • Credor: ${String(em.credor)}`
                                      : ""}
                                  </span>
                                  {linkFonte &&
                                    /^https?:\/\//i.test(String(linkFonte)) && (
                                      <a
                                        href={String(linkFonte)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 font-semibold text-brand-blue hover:underline"
                                      >
                                        Fonte Sefaz-SP
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  if (aba.id === "controle" && estadoAtivo) {
                    return (
                      <PainelFiscalizacaoOficial
                        estado={estadoAtivo}
                        linkTse={tse?.linkOficialTse}
                        portalExtra={{
                          titulo: `Portal Oficial da ${assembleiaAtiva.sigla}`,
                          descricao: `Projetos de lei, sessões plenárias, despesas de gabinete e ouvidoria de ${assembleiaAtiva.nome}.`,
                          url: almg?.portalUrl ?? assembleiaAtiva.portal,
                        }}
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
