"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Landmark,
  Loader2,
  Mail,
  MapPin,
  Receipt,
  Search,
  Users,
  X,
} from "lucide-react";
import { ABAS_DEPUTADO_ESTADUAL } from "@/lib/abas";
import { formatarMoeda } from "@/lib/formatters";
import { getEstadoPorUf, normalizarTexto, REGIOES } from "@/lib/ufs";
import { PerfilAbas } from "@/components/ui/PerfilAbas";
import { PainelEleitoralTSE } from "@/components/dados/PainelEleitoralTSE";
import { PainelFiscalizacaoOficial } from "@/components/dados/PainelFiscalizacaoOficial";
import { PainelTrajetoriaTSE } from "@/components/dados/PainelTrajetoriaTSE";
import type {
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

type ApiPerfilDeputadoResponse = {
  uf: string;
  nomeConsultado: string;
  tse: PerfilTSE | null;
  almg: DadosAlmgDeputado | null;
  fontesConsultadas: {
    tse: boolean;
    almg: boolean;
  };
};

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

  const [perfilOficial, setPerfilOficial] =
    useState<ApiPerfilDeputadoResponse | null>(null);
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

  useEffect(() => {
    if (!depSelecionado || !assembleiaAtiva) {
      setPerfilOficial(null);
      setCarregandoPerfil(false);
      return;
    }

    const controller = new AbortController();
    setCarregandoPerfil(true);
    setPerfilOficial(null);

    fetch(
      `/api/dep-estaduais/${encodeURIComponent(assembleiaAtiva.uf)}/perfil?nome=${encodeURIComponent(depSelecionado.nome)}`,
      { signal: controller.signal }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((json: ApiPerfilDeputadoResponse | null) => {
        if (!controller.signal.aborted) setPerfilOficial(json);
      })
      .catch(() => {
        if (!controller.signal.aborted) setPerfilOficial(null);
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

  // Tela 1: Seleção da Assembleia (27 UFs)
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
                placeholder="Filtrar estado ou sigla da Assembleia (ex: SP, MG, ALESP, ALMG)..."
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
            const temApiAssembleia = a.uf === "MG";
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
                    {temApiAssembleia && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        API ALMG ao vivo
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

  // Tela 2: Bancada do estado selecionado
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
              parlamentares listados
              {assembleiaAtiva.uf === "MG"
                ? " • Verbas indenizatórias ALMG ao vivo"
                : " • Dados eleitorais TSE ao vivo"}
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

      {/* Filtros da bancada */}
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

      {/* Estado de carregamento / erro / lista */}
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
                  Abrir Perfil (TSE
                  {assembleiaAtiva.uf === "MG" ? " + ALMG" : ""})
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal do Deputado */}
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
                {perfilOficial?.tse?.fotoUrl && (
                  <img
                    src={perfilOficial.tse.fotoUrl}
                    alt={`Foto oficial de ${depSelecionado.nome}`}
                    className="h-18 w-18 shrink-0 rounded-2xl border-2 border-white/30 object-cover object-top"
                  />
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-200">
                      {depSelecionado.partido} • {assembleiaAtiva.uf} (
                      {assembleiaAtiva.sigla})
                    </span>
                    {carregandoPerfil ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium text-slate-100">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Consultando fontes oficiais...
                      </span>
                    ) : (
                      perfilOficial && (
                        <>
                          {perfilOficial.fontesConsultadas.tse && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/25 px-2 py-0.5 text-[11px] font-bold text-emerald-100">
                              <CheckCircle2 className="h-3 w-3" />
                              TSE ao vivo
                            </span>
                          )}
                          {perfilOficial.fontesConsultadas.almg && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/25 px-2 py-0.5 text-[11px] font-bold text-sky-100">
                              <CheckCircle2 className="h-3 w-3" />
                              ALMG Verbas ao vivo
                            </span>
                          )}
                        </>
                      )
                    )}
                  </div>
                  <h2
                    id="modal-dep-titulo"
                    className="mt-2 text-2xl font-extrabold text-white"
                  >
                    {depSelecionado.nome}
                  </h2>
                  <p className="mt-1 text-sm text-slate-200">
                    Deputado(a){" "}
                    {assembleiaAtiva.uf === "DF" ? "Distrital" : "Estadual"} •{" "}
                    {assembleiaAtiva.nome} • Mandato 2023–2027
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <PerfilAbas
                abas={ABAS_DEPUTADO_ESTADUAL}
                entidadeNome={`${depSelecionado.nome} (${assembleiaAtiva.sigla})`}
                renderConteudoAba={(aba) => {
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
                              href={
                                perfilOficial?.almg?.portalUrl ??
                                assembleiaAtiva.portal
                              }
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
                              Partido & Gabinete
                            </p>
                            <p className="mt-1 font-bold text-brand-navy">
                              {depSelecionado.partido}
                              {perfilOficial?.almg?.situacao
                                ? ` • ${perfilOficial.almg.situacao}`
                                : ""}
                            </p>
                            {perfilOficial?.almg?.email ? (
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-600">
                                <Mail className="h-3 w-3 text-slate-400" />
                                {perfilOficial.almg.email}
                              </p>
                            ) : (
                              <p className="mt-0.5 text-xs text-slate-600">
                                Município de referência:{" "}
                                {depSelecionado.municipio ||
                                  assembleiaAtiva.nome}
                              </p>
                            )}
                          </div>
                        </div>

                        <PainelTrajetoriaTSE
                          perfil={perfilOficial?.tse ?? null}
                          carregando={carregandoPerfil}
                        />
                      </div>
                    );
                  }

                  if (aba.id === "custos") {
                    if (carregandoPerfil && assembleiaAtiva.uf === "MG") {
                      return (
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-brand-muted">
                          <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
                          Consultando verbas indenizatórias na API oficial da
                          ALMG...
                        </div>
                      );
                    }

                    const almg = perfilOficial?.almg;
                    if (almg && almg.itensVerba.length > 0) {
                      const maxVal = Math.max(
                        ...almg.itensVerba.map((i) => i.valor),
                        1
                      );
                      return (
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2.5 text-xs text-emerald-950">
                            <span className="font-semibold">
                              Fonte ao vivo: API Dados Abertos ALMG • Verba
                              Indenizatória ({almg.mesReferenciaVerba})
                            </span>
                            <span className="font-extrabold text-brand-navy">
                              Total no mês: {formatarMoeda(almg.totalVerbaMes)}
                            </span>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h4 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-brand-navy">
                              <Receipt className="h-4 w-4 text-brand-blue" />
                              Despesas reembolsadas por categoria (
                              {almg.mesReferenciaVerba})
                            </h4>
                            <div className="space-y-2.5">
                              {almg.itensVerba.map((item) => (
                                <div key={item.categoria} className="space-y-1">
                                  <div className="flex items-center justify-between gap-2 text-xs">
                                    <span className="font-medium text-slate-800">
                                      {item.categoria}
                                    </span>
                                    <span className="font-bold text-brand-navy">
                                      {formatarMoeda(item.valor)}
                                    </span>
                                  </div>
                                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                      className="h-full rounded-full bg-brand-emerald"
                                      style={{
                                        width: `${Math.max(4, Math.round((item.valor / maxVal) * 100))}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700">
                        <p className="font-bold text-brand-navy">
                          Integração de despesas legislativas por Assembleia
                        </p>
                        <p className="mt-1 leading-relaxed">
                          Diferente da Câmara Federal, não existe API nacional
                          única para verbas de gabinete das 27 Assembleias.{" "}
                          <strong>MG (ALMG)</strong> já está conectado ao vivo
                          neste protótipo como referência; as demais Casas
                          exigem conectores específicos por estado.
                        </p>
                        <a
                          href={assembleiaAtiva.portal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 font-bold text-brand-blue hover:underline"
                        >
                          Consultar transparência na {assembleiaAtiva.sigla}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    );
                  }

                  if (aba.id === "eleicoes") {
                    return (
                      <PainelEleitoralTSE
                        perfil={perfilOficial?.tse ?? null}
                        carregando={carregandoPerfil}
                        entidadeNome={`${depSelecionado.nome} (${assembleiaAtiva.uf})`}
                      />
                    );
                  }

                  if (aba.id === "controle") {
                    return (
                      <PainelFiscalizacaoOficial
                        estado={estadoAtivo}
                        linkTse={perfilOficial?.tse?.linkOficialTse}
                        portalExtra={{
                          titulo: `Portal Oficial da ${assembleiaAtiva.sigla}`,
                          descricao: `Projetos de lei, sessões plenárias, despesas de gabinete e ouvidoria de ${assembleiaAtiva.nome}.`,
                          url:
                            perfilOficial?.almg?.portalUrl ??
                            assembleiaAtiva.portal,
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
