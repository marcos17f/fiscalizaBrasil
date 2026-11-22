"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ExternalLink,
  FileText,
  Landmark,
  Loader2,
  Receipt,
  Search,
  User,
  X,
} from "lucide-react";
import { ABAS_DEPUTADO_FEDERAL } from "@/lib/abas";
import { formatarDataBr } from "@/lib/formatters";
import { ESTADOS_BRASIL, getEstadoPorUf, normalizarTexto } from "@/lib/ufs";
import { PerfilAbas } from "@/components/ui/PerfilAbas";
import type {
  DeputadoFederal,
  DespesaCamara,
  EventoCamara,
  FrenteCamara,
  OrgaoCamara,
  ProposicaoCamara,
  VotacaoNominalCamara,
} from "@/types/politicos";

type Props = {
  deputados: DeputadoFederal[];
};

type ApiDetalheCamara = {
  perfil: {
    nomeCivil?: string;
    escolaridade?: string;
    municipioNascimento?: string;
    ufNascimento?: string;
    ultimoStatus?: {
      situacao?: string;
      condicaoEleitoral?: string;
      gabinete?: {
        predio?: string;
        sala?: string;
        andar?: string;
        telefone?: string;
        email?: string;
      };
    };
  } | null;
  despesas: DespesaCamara[];
  totalDespesasRecentes: number;
  proposicoes: ProposicaoCamara[];
  orgaos: OrgaoCamara[];
  eventos: EventoCamara[];
  frentes: FrenteCamara[];
  votacoesNominais: VotacaoNominalCamara[];
};

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function DeputadosFederaisExplorer({ deputados }: Props) {
  const [busca, setBusca] = useState("");
  const [ufFiltro, setUfFiltro] = useState("Todos");
  const [partidoFiltro, setPartidoFiltro] = useState("Todos");
  const [limiteExibicao, setLimiteExibicao] = useState(48);

  const [selecionado, setSelecionado] = useState<DeputadoFederal | null>(null);
  const [detalhe, setDetalhe] = useState<ApiDetalheCamara | null>(null);
  const [carregando, setCarregando] = useState(false);

  const partidos = useMemo(() => {
    return Array.from(
      new Set(deputados.map((d) => d.partido).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [deputados]);

  const filtrados = useMemo(() => {
    const termo = normalizarTexto(busca);
    return deputados.filter((d) => {
      if (ufFiltro !== "Todos" && d.uf !== ufFiltro) return false;
      if (partidoFiltro !== "Todos" && d.partido !== partidoFiltro) return false;
      if (!termo) return true;
      const estado = getEstadoPorUf(d.uf);
      return normalizarTexto(
        `${d.nome} ${d.uf} ${estado?.nome ?? ""} ${d.partido}`
      ).includes(termo);
    });
  }, [deputados, busca, ufFiltro, partidoFiltro]);

  const abrirDeputado = (dep: DeputadoFederal) => {
    setSelecionado(dep);
  };

  useEffect(() => {
    if (!selecionado) {
      setDetalhe(null);
      setCarregando(false);
      return;
    }

    const controller = new AbortController();
    setDetalhe(null);
    setCarregando(true);

    fetch(`/api/camara/deputados/${selecionado.id}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ApiDetalheCamara | null) => {
        if (!controller.signal.aborted) setDetalhe(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setDetalhe(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false);
      });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelecionado(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      controller.abort();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selecionado]);

  const visiveis = filtrados.slice(0, limiteExibicao);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-5">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setLimiteExibicao(48);
              }}
              placeholder="Buscar entre 513 deputados por nome, estado ou partido..."
              className="w-full rounded-xl border border-slate-300 py-2.5 pr-4 pl-10 text-sm focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={ufFiltro}
              onChange={(e) => {
                setUfFiltro(e.target.value);
                setLimiteExibicao(48);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-blue focus:outline-none"
            >
              <option value="Todos">Todos os estados (27)</option>
              {ESTADOS_BRASIL.map((e) => (
                <option key={e.uf} value={e.uf}>
                  {e.uf} — {e.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={partidoFiltro}
              onChange={(e) => {
                setPartidoFiltro(e.target.value);
                setLimiteExibicao(48);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-blue focus:outline-none"
            >
              <option value="Todos">Partidos ({partidos.length})</option>
              {partidos.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end text-xs font-semibold text-brand-muted md:col-span-2">
            {filtrados.length} de {deputados.length}
          </div>
        </div>
      </div>

      {visiveis.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <User className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-2 font-bold text-slate-800">
            Nenhum deputado federal encontrado
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visiveis.map((dep) => (
              <article
                key={dep.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-md"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={dep.foto}
                    alt={`Foto oficial de ${dep.nome}`}
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-full border-2 border-slate-200 object-cover object-top"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md bg-brand-navy px-2 py-0.5 text-[11px] font-bold text-white">
                        {dep.uf}
                      </span>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                        {dep.partido}
                      </span>
                    </div>
                    <h2 className="mt-1.5 truncate text-base font-bold text-brand-navy">
                      {dep.nome}
                    </h2>
                    <p className="truncate text-xs text-brand-muted">
                      {getEstadoPorUf(dep.uf)?.nome ?? dep.uf}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => abrirDeputado(dep)}
                  className="mt-4 w-full rounded-xl bg-brand-navy py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-blue"
                >
                  Abrir Ficha (Projetos, Votos & Gastos)
                </button>
              </article>
            ))}
          </div>

          {filtrados.length > limiteExibicao && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setLimiteExibicao((n) => n + 48)}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-brand-navy shadow-2xs transition-colors hover:bg-slate-100"
              >
                Carregar mais deputados ({filtrados.length - limiteExibicao}{" "}
                restantes)
              </button>
            </div>
          )}
        </>
      )}

      {selecionado && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-depfed-titulo"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-xs sm:p-6"
          onClick={() => setSelecionado(null)}
        >
          <div
            className="my-4 w-full max-w-4xl overflow-hidden rounded-2xl bg-slate-50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-brand-navy to-brand-blue p-5 text-white sm:p-6">
              <button
                type="button"
                onClick={() => setSelecionado(null)}
                aria-label="Fechar perfil"
                className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col gap-4 pr-12 sm:flex-row sm:items-center">
                <img
                  src={selecionado.foto}
                  alt={selecionado.nome}
                  className="h-20 w-20 shrink-0 rounded-2xl border-2 border-white object-cover object-top"
                />
                <div>
                  <span className="inline-block rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-200">
                    {selecionado.partido} • {selecionado.uf}
                  </span>
                  <h2
                    id="modal-depfed-titulo"
                    className="mt-1.5 text-2xl font-extrabold text-white"
                  >
                    {selecionado.nome}
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-200">
                    Deputado(a) Federal • Mandato 01/02/2023 até 31/01/2027
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <PerfilAbas
                abas={ABAS_DEPUTADO_FEDERAL}
                entidadeNome={`${selecionado.nome} (${selecionado.uf})`}
                renderConteudoAba={(aba) => {
                  if (
                    carregando &&
                    [
                      "trajetoria",
                      "projetos",
                      "votacoes",
                      "presenca",
                      "gastos",
                    ].includes(aba.id)
                  ) {
                    return (
                      <div className="flex items-center gap-2 p-6 text-sm text-brand-muted">
                        <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
                        Consultando API oficial da Câmara dos Deputados...
                      </div>
                    );
                  }

                  if (aba.id === "trajetoria") {
                    const p = detalhe?.perfil;
                    const gab = p?.ultimoStatus?.gabinete;
                    const orgaos = detalhe?.orgaos ?? [];
                    const frentes = detalhe?.frentes ?? [];
                    return (
                      <div className="space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold text-brand-muted uppercase">
                              Identificação Oficial
                            </p>
                            <p className="mt-1 font-bold text-brand-navy">
                              {p?.nomeCivil || selecionado.nome}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-600">
                              {p?.escolaridade
                                ? `Escolaridade: ${p.escolaridade}`
                                : "57ª Legislatura"}
                              {p?.municipioNascimento
                                ? ` • Natural de ${p.municipioNascimento}/${p.ufNascimento}`
                                : ""}
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold text-brand-muted uppercase">
                              Gabinete na Câmara
                            </p>
                            <p className="mt-1 text-xs font-semibold text-brand-navy">
                              {gab
                                ? `Anexo ${gab.predio ?? "—"}, Sala ${gab.sala ?? "—"} • Tel: ${gab.telefone ?? "—"}`
                                : selecionado.email ||
                                  "Contato institucional disponível na Câmara"}
                            </p>
                            <a
                              href={`https://www.camara.leg.br/deputados/${selecionado.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
                            >
                              Página Oficial na Câmara dos Deputados
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>

                        {orgaos.length > 0 && (
                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-brand-navy uppercase">
                              <Landmark className="h-3.5 w-3.5 text-brand-emerald" />
                              Comissões e Órgãos Recentes (API Câmara)
                            </p>
                            <div className="mt-2.5 flex flex-wrap gap-2">
                              {orgaos.slice(0, 8).map((org, idx) => (
                                <span
                                  key={`${org.idOrgao}-${idx}`}
                                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                                >
                                  <strong className="text-brand-navy">
                                    {org.siglaOrgao}
                                  </strong>{" "}
                                  • {org.titulo}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {frentes.length > 0 && (
                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-bold tracking-wide text-brand-navy uppercase">
                              Frentes Parlamentares ({frentes.length} exibidas)
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {frentes.slice(0, 8).map((fr) => (
                                <span
                                  key={fr.id}
                                  className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-900"
                                >
                                  {fr.titulo}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (aba.id === "projetos") {
                    const lista = detalhe?.proposicoes ?? [];
                    if (lista.length === 0) {
                      return (
                        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                          Nenhuma proposição recente retornada pela API da
                          Câmara.
                        </p>
                      );
                    }
                    return (
                      <div className="max-h-96 space-y-2.5 overflow-y-auto pr-1">
                        {lista.map((prop) => (
                          <div
                            key={prop.id}
                            className="rounded-xl border border-slate-200 bg-white p-4"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy">
                                <FileText className="h-3.5 w-3.5 text-brand-blue" />
                                {prop.siglaTipo} {prop.numero}/{prop.ano}
                              </span>
                              <a
                                href={`https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${prop.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline"
                              >
                                Tramitação <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                              {prop.ementa}
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  if (aba.id === "votacoes") {
                    const votos = detalhe?.votacoesNominais ?? [];
                    return (
                      <div className="space-y-3">
                        {votos.length > 0 ? (
                          <div className="max-h-96 space-y-2.5 overflow-y-auto pr-1">
                            {votos.map((v) => {
                              const lower = v.voto.toLowerCase();
                              const cor = lower.startsWith("sim")
                                ? "bg-emerald-100 text-emerald-900"
                                : lower.startsWith("não") ||
                                    lower.startsWith("nao")
                                  ? "bg-red-100 text-red-900"
                                  : "bg-slate-200 text-slate-800";
                              return (
                                <div
                                  key={v.idVotacao}
                                  className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="font-bold text-brand-navy">
                                      {v.proposicao} • {formatarDataBr(v.data)}
                                    </span>
                                    <span
                                      className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${cor}`}
                                    >
                                      Voto: {v.voto}
                                    </span>
                                  </div>
                                  <p className="mt-1 leading-relaxed text-slate-700">
                                    {v.descricao}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700">
                            <p className="font-semibold text-brand-navy">
                              Nenhuma votação nominal registrada para este
                              deputado nas últimas sessões consultadas.
                            </p>
                            <p className="mt-1 text-slate-600">
                              Confira o histórico completo de votações nominais
                              em plenário diretamente no portal oficial da
                              Câmara:
                            </p>
                          </div>
                        )}
                        <a
                          href={`https://www.camara.leg.br/deputados/${selecionado.id}/votacoes-nominais-plenario`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-navy"
                        >
                          Ver histórico completo de votações na Câmara
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    );
                  }

                  if (aba.id === "presenca") {
                    const eventos = detalhe?.eventos ?? [];
                    if (eventos.length === 0) {
                      return (
                        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                          Nenhum evento/sessão recente retornado pela API da
                          Câmara neste momento.
                        </p>
                      );
                    }
                    return (
                      <div className="max-h-96 space-y-2.5 overflow-y-auto pr-1">
                        {eventos.map((ev) => (
                          <div
                            key={ev.id}
                            className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 font-bold text-brand-navy">
                                <Calendar className="h-3.5 w-3.5 text-brand-emerald" />
                                {ev.descricaoTipo}
                              </span>
                              <span className="font-semibold text-brand-muted">
                                {formatarDataBr(ev.dataHoraInicio)}
                              </span>
                            </div>
                            <p className="mt-1 leading-relaxed text-slate-700">
                              {ev.descricao}
                            </p>
                            {ev.orgaos?.[0]?.sigla && (
                              <p className="mt-1 text-[11px] font-semibold text-brand-blue">
                                Órgão: {ev.orgaos[0].sigla}
                                {ev.situacao ? ` • ${ev.situacao}` : ""}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  }

                  if (aba.id === "gastos") {
                    const lista = detalhe?.despesas ?? [];
                    if (lista.length === 0) {
                      return (
                        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                          Nenhuma despesa recente retornada pela API da Câmara.
                        </p>
                      );
                    }
                    return (
                      <div className="space-y-4">
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                          <p className="text-xs font-semibold text-emerald-900">
                            Soma dos últimos {lista.length} lançamentos na Cota
                            Parlamentar (CEAP)
                          </p>
                          <p className="mt-1 text-xl font-extrabold text-brand-emerald">
                            {brl.format(detalhe?.totalDespesasRecentes ?? 0)}
                          </p>
                        </div>

                        <div className="max-h-96 space-y-2.5 overflow-y-auto pr-1">
                          {lista.map((d, idx) => (
                            <div
                              key={`${d.dataDocumento}-${d.nomeFornecedor}-${idx}`}
                              className="flex flex-col justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3.5 sm:flex-row sm:items-center"
                            >
                              <div className="min-w-0">
                                <p className="flex items-center gap-1.5 text-xs font-bold text-brand-navy">
                                  <Receipt className="h-3.5 w-3.5 shrink-0 text-brand-blue" />
                                  <span className="truncate">
                                    {d.tipoDespesa}
                                  </span>
                                </p>
                                <p className="mt-0.5 truncate text-xs text-slate-600">
                                  {d.nomeFornecedor} •{" "}
                                  {d.dataDocumento || `${d.mes}/${d.ano}`}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-3">
                                <span className="text-sm font-extrabold text-brand-navy">
                                  {brl.format(d.valorLiquido)}
                                </span>
                                {d.urlDocumento && (
                                  <a
                                    href={d.urlDocumento}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-semibold text-brand-blue hover:underline"
                                  >
                                    Nota
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (aba.id === "emendas") {
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700">
                        <p className="font-bold text-brand-navy">
                          Consulta oficial de Emendas Parlamentares —{" "}
                          {selecionado.nome}
                        </p>
                        <p className="mt-1 leading-relaxed">
                          Confira as emendas individuais e de bancada destinadas
                          por este parlamentar com valores empenhados,
                          liquidados e pagos no Portal da Transparência (CGU):
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a
                            href={`https://portaldatransparencia.gov.br/emendas/consulta?de=2023&ate=2026&autor=${encodeURIComponent(selecionado.nome)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-navy"
                          >
                            Consultar Emendas na CGU
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          <a
                            href={`https://www.camara.leg.br/deputados/${selecionado.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-bold text-brand-navy hover:bg-slate-100"
                          >
                            Ficha na Câmara
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
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
