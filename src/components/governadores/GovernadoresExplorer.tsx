"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Search,
  User,
  X,
} from "lucide-react";
import { ABAS_GOVERNADOR } from "@/lib/abas";
import { getEstadoPorUf, normalizarTexto, REGIOES } from "@/lib/ufs";
import { PerfilAbas } from "@/components/ui/PerfilAbas";
import { PainelContratacoesPncp } from "@/components/dados/PainelContratacoesPncp";
import { PainelEleitoralTSE } from "@/components/dados/PainelEleitoralTSE";
import { PainelFiscalSiconfi } from "@/components/dados/PainelFiscalSiconfi";
import { PainelFiscalizacaoOficial } from "@/components/dados/PainelFiscalizacaoOficial";
import { PainelTrajetoriaTSE } from "@/components/dados/PainelTrajetoriaTSE";
import type {
  ContratacaoPncp,
  Governador,
  PerfilTSE,
  Regiao,
  ResumoFiscalSiconfi,
} from "@/types/politicos";

type Props = {
  governadores: Governador[];
};

type ApiGovernadorResponse = {
  uf: string;
  estado: string;
  codigoIbge: number;
  tse: {
    eleicao2022: PerfilTSE | null;
    eleicao2026: PerfilTSE | null;
  };
  siconfi: ResumoFiscalSiconfi | null;
  contratacoesPncp: ContratacaoPncp[];
  fontesConsultadas: {
    tse2022: boolean;
    tse2026: boolean;
    siconfi: boolean;
    pncp?: boolean;
  };
};

function AvatarGovernador({
  foto,
  nome,
  uf,
  tamanho = "md",
}: {
  foto: string;
  nome: string;
  uf: string;
  tamanho?: "md" | "lg";
}) {
  const [erroImagem, setErroImagem] = useState(false);

  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const dimensao =
    tamanho === "lg"
      ? "h-20 w-20 rounded-2xl text-xl"
      : "h-16 w-16 rounded-full text-base";

  if (!foto || erroImagem) {
    return (
      <div
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center border-2 border-slate-200 bg-brand-blue font-display font-bold text-white ${dimensao}`}
      >
        {iniciais || uf}
      </div>
    );
  }

  return (
    <img
      src={foto}
      alt={`Foto oficial de ${nome} (${uf})`}
      loading="lazy"
      onError={() => setErroImagem(true)}
      className={`shrink-0 border-2 border-slate-200 object-cover object-top ${dimensao}`}
    />
  );
}

export function GovernadoresExplorer({ governadores }: Props) {
  const [busca, setBusca] = useState("");
  const [regiaoSelecionada, setRegiaoSelecionada] = useState<Regiao | "Todas">(
    "Todas"
  );
  const [partidoSelecionado, setPartidoSelecionado] = useState<string>("Todos");
  const [selecionado, setSelecionado] = useState<Governador | null>(null);

  const [dadosOficiais, setDadosOficiais] =
    useState<ApiGovernadorResponse | null>(null);
  const [carregandoDados, setCarregandoDados] = useState(false);

  const partidos = useMemo(() => {
    const unicos = Array.from(new Set(governadores.map((g) => g.partido)));
    return unicos.sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [governadores]);

  const filtrados = useMemo(() => {
    const termo = normalizarTexto(busca);
    return governadores.filter((gov) => {
      const estado = getEstadoPorUf(gov.uf);
      if (
        regiaoSelecionada !== "Todas" &&
        estado?.regiao !== regiaoSelecionada
      ) {
        return false;
      }
      if (
        partidoSelecionado !== "Todos" &&
        gov.partido !== partidoSelecionado
      ) {
        return false;
      }
      if (!termo) return true;

      const alvo = normalizarTexto(
        `${gov.nome} ${gov.uf} ${estado?.nome ?? ""} ${gov.partido} ${gov.status}`
      );
      return alvo.includes(termo);
    });
  }, [governadores, busca, regiaoSelecionada, partidoSelecionado]);

  useEffect(() => {
    if (!selecionado) {
      setDadosOficiais(null);
      setCarregandoDados(false);
      return;
    }

    const controller = new AbortController();
    setCarregandoDados(true);
    setDadosOficiais(null);

    fetch(
      `/api/governadores/${encodeURIComponent(selecionado.uf)}?nome=${encodeURIComponent(selecionado.nome)}`,
      { signal: controller.signal }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((json: ApiGovernadorResponse | null) => {
        if (!controller.signal.aborted) {
          setDadosOficiais(json);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setDadosOficiais(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCarregandoDados(false);
        }
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

  const limparFiltros = () => {
    setBusca("");
    setRegiaoSelecionada("Todas");
    setPartidoSelecionado("Todos");
  };

  const perfilTsePrincipal =
    dadosOficiais?.tse.eleicao2022 ?? dadosOficiais?.tse.eleicao2026 ?? null;
  const perfilTseSecundario =
    dadosOficiais?.tse.eleicao2022 && dadosOficiais?.tse.eleicao2026
      ? dadosOficiais.tse.eleicao2026
      : null;

  return (
    <div className="space-y-6">
      {/* Barra de filtros */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <label htmlFor="busca-governador" className="sr-only">
              Buscar governador por nome, estado ou partido
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="busca-governador"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, estado (ex: SP, Bahia) ou partido..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="filtro-partido" className="sr-only">
              Filtrar por partido
            </label>
            <select
              id="filtro-partido"
              value={partidoSelecionado}
              onChange={(e) => setPartidoSelecionado(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
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

          <div className="flex items-center justify-between gap-2 md:col-span-3 md:justify-end">
            <span className="text-xs font-semibold text-brand-muted">
              Exibindo{" "}
              <strong className="text-brand-navy">{filtrados.length}</strong> de{" "}
              {governadores.length}
            </span>
            {(busca ||
              regiaoSelecionada !== "Todas" ||
              partidoSelecionado !== "Todos") && (
              <button
                type="button"
                onClick={limparFiltros}
                className="text-xs font-semibold text-brand-blue hover:underline"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Pills de região */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(["Todas", ...REGIOES] as const).map((regiao) => {
            const ativa = regiaoSelecionada === regiao;
            return (
              <button
                key={regiao}
                type="button"
                onClick={() => setRegiaoSelecionada(regiao)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  ativa
                    ? "bg-brand-navy text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {regiao === "Todas" ? "Todas as regiões" : regiao}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Governadores */}
      {filtrados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <User className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-2 font-bold text-slate-800">
            Nenhum governador encontrado
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Tente outro termo de busca ou limpe os filtros selecionados.
          </p>
          <button
            type="button"
            onClick={limparFiltros}
            className="mt-4 rounded-xl bg-brand-blue px-4 py-2 text-xs font-bold text-white hover:bg-brand-navy"
          >
            Mostrar todos os 27 estados
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((gov) => {
            const estado = getEstadoPorUf(gov.uf);
            return (
              <article
                key={gov.uf}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <AvatarGovernador
                      foto={gov.foto}
                      nome={gov.nome}
                      uf={gov.uf}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md bg-brand-navy px-2 py-0.5 text-[11px] font-bold text-white">
                          {gov.uf}
                        </span>
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                          {gov.partido}
                        </span>
                      </div>
                      <h2 className="mt-1.5 truncate text-base font-bold text-brand-navy">
                        {gov.nome}
                      </h2>
                      <p className="text-xs text-brand-muted">
                        {estado?.nome ?? gov.uf} • {estado?.regiao ?? ""}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span>
                        Mandato: <strong>{gov.de}</strong> até{" "}
                        <strong>{gov.ate}</strong>
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span>
                        {gov.local} • {gov.status}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelecionado(gov)}
                  className="mt-4 w-full rounded-xl bg-brand-navy py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-blue"
                >
                  Ver Perfil Completo (TSE + SICONFI)
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de Perfil */}
      {selecionado && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-gov-titulo"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-xs sm:p-6"
          onClick={() => setSelecionado(null)}
        >
          <div
            className="my-4 w-full max-w-4xl overflow-hidden rounded-2xl bg-slate-50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do modal */}
            <div className="relative bg-gradient-to-r from-brand-navy to-brand-blue p-5 text-white sm:p-6">
              <button
                type="button"
                onClick={() => setSelecionado(null)}
                aria-label="Fechar perfil"
                className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col gap-4 pr-12 sm:flex-row sm:items-center">
                <AvatarGovernador
                  foto={selecionado.foto || perfilTsePrincipal?.fotoUrl || ""}
                  nome={selecionado.nome}
                  uf={selecionado.uf}
                  tamanho="lg"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-200">
                      {selecionado.partido} • {selecionado.uf}
                    </span>
                    <span className="rounded-md bg-white/15 px-2.5 py-0.5 text-xs font-medium text-slate-100">
                      {selecionado.status}
                    </span>
                    {carregandoDados ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium text-slate-100">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Consultando TSE + SICONFI...
                      </span>
                    ) : (
                      dadosOficiais && (
                        <>
                          {(dadosOficiais.fontesConsultadas.tse2022 ||
                            dadosOficiais.fontesConsultadas.tse2026) && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/25 px-2 py-0.5 text-[11px] font-bold text-emerald-100">
                              <CheckCircle2 className="h-3 w-3" />
                              TSE ao vivo
                            </span>
                          )}
                          {dadosOficiais.fontesConsultadas.siconfi && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/25 px-2 py-0.5 text-[11px] font-bold text-sky-100">
                              <CheckCircle2 className="h-3 w-3" />
                              SICONFI RREO
                            </span>
                          )}
                        </>
                      )
                    )}
                  </div>
                  <h2
                    id="modal-gov-titulo"
                    className="mt-2 text-2xl font-extrabold text-white"
                  >
                    {selecionado.nome}
                  </h2>
                  <p className="mt-1 text-sm text-slate-200">
                    Governador(a) de{" "}
                    {getEstadoPorUf(selecionado.uf)?.nome ?? selecionado.uf} •
                    Mandato de {selecionado.de} até {selecionado.ate}
                  </p>
                </div>
              </div>
            </div>

            {/* Corpo do modal */}
            <div className="p-4 sm:p-6">
              <PerfilAbas
                abas={ABAS_GOVERNADOR}
                entidadeNome={`${selecionado.nome} (${selecionado.uf})`}
                renderConteudoAba={(aba) => {
                  const estado = getEstadoPorUf(selecionado.uf);

                  if (aba.id === "trajetoria") {
                    return (
                      <div className="space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold text-brand-muted uppercase">
                              Cargo & Estado
                            </p>
                            <p className="mt-1 font-bold text-brand-navy">
                              Governador(a) — {estado?.nome ?? selecionado.uf} (
                              {selecionado.uf})
                            </p>
                            <p className="mt-0.5 text-xs text-slate-600">
                              Capital: {estado?.capital ?? "—"} • Região{" "}
                              {estado?.regiao ?? "—"}
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-muted uppercase">
                              <Building2 className="h-3.5 w-3.5" />
                              Mandato & Sede
                            </p>
                            <p className="mt-1 font-bold text-brand-navy">
                              {selecionado.de} até {selecionado.ate}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-600">
                              {selecionado.local} • {selecionado.obs}
                            </p>
                          </div>
                        </div>

                        <PainelTrajetoriaTSE
                          perfil={perfilTsePrincipal}
                          carregando={carregandoDados}
                        />
                      </div>
                    );
                  }

                  if (aba.id === "o-que-faz") {
                    return (
                      <div className="space-y-3">
                        {perfilTsePrincipal?.planoDeGovernoUrl && (
                          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-white p-4">
                            <div className="flex items-center gap-2.5">
                              <FileText className="h-5 w-5 text-brand-emerald" />
                              <div>
                                <p className="text-sm font-bold text-brand-navy">
                                  Plano de Governo protocolado no TSE (
                                  {perfilTsePrincipal.ano})
                                </p>
                                <p className="text-xs text-slate-600">
                                  Documento oficial com as propostas registradas
                                  pela chapa eleita.
                                </p>
                              </div>
                            </div>
                            <a
                              href={perfilTsePrincipal.planoDeGovernoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-emerald px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-emerald-dark"
                            >
                              Baixar PDF oficial
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        )}
                        <PainelContratacoesPncp
                          contratacoes={dadosOficiais?.contratacoesPncp ?? []}
                          carregando={carregandoDados}
                          titulo={estado?.nome ?? selecionado.uf}
                        />
                        {estado && (
                          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700">
                            <p className="font-bold text-brand-navy">
                              Acompanhamento de obras, contratos e programas de{" "}
                              {estado.nome}
                            </p>
                            <p className="mt-1 leading-relaxed">
                              Cada estado publica obras e execução de programas
                              em portal próprio. Consulte a execução detalhada
                              no Portal da Transparência estadual:
                            </p>
                            <a
                              href={estado.transparenciaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 font-bold text-brand-blue hover:underline"
                            >
                              Abrir Portal da Transparência ({estado.uf})
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (aba.id === "emendas") {
                    return (
                      <PainelFiscalSiconfi
                        siconfi={dadosOficiais?.siconfi ?? null}
                        carregando={carregandoDados}
                        modo="repasses"
                        entidadeNome={`Governo de ${estado?.nome ?? selecionado.uf}`}
                        codigoIbge={estado?.codigoIbge}
                      />
                    );
                  }

                  if (aba.id === "custos") {
                    return (
                      <PainelFiscalSiconfi
                        siconfi={dadosOficiais?.siconfi ?? null}
                        carregando={carregandoDados}
                        modo="completo"
                        entidadeNome={`Governo de ${estado?.nome ?? selecionado.uf}`}
                        codigoIbge={estado?.codigoIbge}
                      />
                    );
                  }

                  if (aba.id === "eleicoes") {
                    return (
                      <PainelEleitoralTSE
                        perfil={perfilTsePrincipal}
                        perfilSecundario={perfilTseSecundario}
                        carregando={carregandoDados}
                        entidadeNome={`${selecionado.nome} (${selecionado.uf})`}
                      />
                    );
                  }

                  if (aba.id === "controle") {
                    return (
                      <PainelFiscalizacaoOficial
                        estado={estado}
                        linkTse={perfilTsePrincipal?.linkOficialTse}
                        codigoIbge={estado?.codigoIbge}
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
