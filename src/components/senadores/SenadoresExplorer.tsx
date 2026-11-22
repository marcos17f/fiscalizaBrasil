"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  Landmark,
  Loader2,
  Mail,
  Receipt,
  Search,
  User,
  Vote,
  X,
} from "lucide-react";
import { ABAS_SENADOR } from "@/lib/abas";
import { formatarDataBr } from "@/lib/formatters";
import { ESTADOS_BRASIL, getEstadoPorUf, normalizarTexto, REGIOES } from "@/lib/ufs";
import { PerfilAbas } from "@/components/ui/PerfilAbas";
import { PainelFiscalizacaoOficial } from "@/components/dados/PainelFiscalizacaoOficial";
import type {
  AutoriaSenador,
  ComissaoSenador,
  EmendaSenador,
  Regiao,
  ResumoCeapsSenador,
  Senador,
  VotacaoSenador,
} from "@/types/politicos";

type Props = {
  senadores: Senador[];
};

type ApiSenadorDetalhe = {
  senador: Senador;
  resumoEmendas: {
    quantidade: number;
    totalIndicado: number;
    totalPago: number;
  };
  emendas: EmendaSenador[];
  autorias: AutoriaSenador[];
  votacoes: VotacaoSenador[];
  comissoes: ComissaoSenador[];
  ceaps: ResumoCeapsSenador | null;
};

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function AvatarSenador({
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
  const [erro, setErro] = useState(false);
  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  const dim =
    tamanho === "lg"
      ? "h-20 w-20 rounded-2xl text-xl"
      : "h-16 w-16 rounded-full text-base";

  if (!foto || erro) {
    return (
      <div
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center border-2 border-slate-200 bg-brand-blue font-display font-bold text-white ${dim}`}
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
      onError={() => setErro(true)}
      className={`shrink-0 border-2 border-slate-200 object-cover object-top ${dim}`}
    />
  );
}

export function SenadoresExplorer({ senadores }: Props) {
  const [busca, setBusca] = useState("");
  const [ufFiltro, setUfFiltro] = useState("Todos");
  const [partidoFiltro, setPartidoFiltro] = useState("Todos");
  const [regiao, setRegiao] = useState<Regiao | "Todas">("Todas");

  const [selecionado, setSelecionado] = useState<Senador | null>(null);
  const [detalhe, setDetalhe] = useState<ApiSenadorDetalhe | null>(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [anoEmenda, setAnoEmenda] = useState("Todos");

  const partidos = useMemo(() => {
    return Array.from(new Set(senadores.map((s) => s.partido).filter(Boolean))).sort(
      (a, b) => a.localeCompare(b, "pt-BR")
    );
  }, [senadores]);

  const filtrados = useMemo(() => {
    const termo = normalizarTexto(busca);
    return senadores.filter((s) => {
      const estado = getEstadoPorUf(s.uf);
      if (regiao !== "Todas" && estado?.regiao !== regiao) return false;
      if (ufFiltro !== "Todos" && s.uf !== ufFiltro) return false;
      if (partidoFiltro !== "Todos" && s.partido !== partidoFiltro) return false;
      if (!termo) return true;
      return normalizarTexto(
        `${s.nome} ${s.nomeCompleto} ${s.uf} ${estado?.nome ?? ""} ${s.partido}`
      ).includes(termo);
    });
  }, [senadores, busca, ufFiltro, partidoFiltro, regiao]);

  const abrirSenador = (sen: Senador) => {
    setSelecionado(sen);
    setAnoEmenda("Todos");
  };

  useEffect(() => {
    if (!selecionado) {
      setDetalhe(null);
      setCarregandoDetalhe(false);
      return;
    }

    const controller = new AbortController();
    setDetalhe(null);
    setCarregandoDetalhe(true);

    fetch(`/api/senadores/${encodeURIComponent(selecionado.codigo)}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ApiSenadorDetalhe | null) => {
        if (!controller.signal.aborted) setDetalhe(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setDetalhe(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregandoDetalhe(false);
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

  const anosEmendas = useMemo(() => {
    if (!detalhe?.emendas.length) return [];
    return Array.from(new Set(detalhe.emendas.map((e) => String(e.ano)))).sort(
      (a, b) => Number(b) - Number(a)
    );
  }, [detalhe]);

  const emendasFiltradas = useMemo(() => {
    if (!detalhe) return [];
    if (anoEmenda === "Todos") return detalhe.emendas;
    return detalhe.emendas.filter((e) => String(e.ano) === anoEmenda);
  }, [detalhe, anoEmenda]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-5">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar senador por nome, estado ou partido..."
              className="w-full rounded-xl border border-slate-300 py-2.5 pr-4 pl-10 text-sm focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={ufFiltro}
              onChange={(e) => setUfFiltro(e.target.value)}
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
              onChange={(e) => setPartidoFiltro(e.target.value)}
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
            {filtrados.length} de {senadores.length}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
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
              {r === "Todas" ? "Todas as regiões" : r}
            </button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <User className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-2 font-bold text-slate-800">
            Nenhum senador encontrado
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((sen) => (
            <article
              key={sen.codigo}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-md"
            >
              <div className="flex items-start gap-3.5">
                <AvatarSenador foto={sen.foto} nome={sen.nome} uf={sen.uf} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md bg-brand-navy px-2 py-0.5 text-[11px] font-bold text-white">
                      {sen.uf}
                    </span>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                      {sen.partido || "S/Partido"}
                    </span>
                  </div>
                  <h2 className="mt-1.5 truncate text-base font-bold text-brand-navy">
                    {sen.nome}
                  </h2>
                  <p className="truncate text-xs text-brand-muted">
                    {getEstadoPorUf(sen.uf)?.nome ?? sen.uf} • {sen.titularidade}
                  </p>
                  {sen.bloco && (
                    <p className="mt-1 truncate text-[11px] text-slate-500">
                      Bloco: {sen.bloco}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => abrirSenador(sen)}
                className="mt-4 w-full rounded-xl bg-brand-navy py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-blue"
              >
                Ver Perfil & Emendas
              </button>
            </article>
          ))}
        </div>
      )}

      {selecionado && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-sen-titulo"
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
                <AvatarSenador
                  foto={selecionado.foto}
                  nome={selecionado.nome}
                  uf={selecionado.uf}
                  tamanho="lg"
                />
                <div>
                  <span className="inline-block rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-200">
                    {selecionado.partido} • {selecionado.uf}
                  </span>
                  <h2
                    id="modal-sen-titulo"
                    className="mt-1.5 text-2xl font-extrabold text-white"
                  >
                    {selecionado.nome}
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-200">
                    {selecionado.nomeCompleto}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <PerfilAbas
                abas={ABAS_SENADOR}
                entidadeNome={`${selecionado.nome} (${selecionado.uf})`}
                renderConteudoAba={(aba) => {
                  if (aba.id === "trajetoria") {
                    const comissoesAtivas = (detalhe?.comissoes ?? []).filter(
                      (c) => c.ativa
                    );
                    return (
                      <div className="space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold text-brand-muted uppercase">
                              Mandato no Senado
                            </p>
                            <p className="mt-1 font-bold text-brand-navy">
                              {selecionado.mandatoInicio || "—"} até{" "}
                              {selecionado.mandatoFim || "—"}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-600">
                              Participação: {selecionado.titularidade}
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold text-brand-muted uppercase">
                              Contato Oficial
                            </p>
                            {selecionado.email && (
                              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-brand-navy">
                                <Mail className="h-3.5 w-3.5 text-brand-emerald" />
                                {selecionado.email}
                              </p>
                            )}
                            {selecionado.paginaOficial && (
                              <a
                                href={selecionado.paginaOficial}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
                              >
                                Perfil Oficial no Senado Federal
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>

                        {comissoesAtivas.length > 0 && (
                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-brand-navy uppercase">
                              <Landmark className="h-3.5 w-3.5 text-brand-emerald" />
                              Comissões em Atividade (Senado ao vivo)
                            </p>
                            <div className="mt-2.5 flex flex-wrap gap-2">
                              {comissoesAtivas.slice(0, 8).map((com, idx) => (
                                <span
                                  key={`${com.sigla}-${idx}`}
                                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                                >
                                  <strong className="text-brand-navy">
                                    {com.sigla}
                                  </strong>{" "}
                                  • {com.participacao}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (aba.id === "emendas") {
                    if (carregandoDetalhe) {
                      return (
                        <div className="flex items-center gap-2 p-6 text-sm text-brand-muted">
                          <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
                          Carregando emendas parlamentares...
                        </div>
                      );
                    }
                    if (!detalhe || detalhe.emendas.length === 0) {
                      return (
                        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                          Nenhuma emenda encontrada no cadastro histórico atual
                          para este senador.
                        </p>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                            <p className="text-xs text-brand-muted">
                              Emendas registradas
                            </p>
                            <p className="mt-1 text-lg font-extrabold text-brand-navy">
                              {detalhe.resumoEmendas.quantidade}
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                            <p className="text-xs text-brand-muted">
                              Total indicado
                            </p>
                            <p className="mt-1 text-lg font-extrabold text-brand-blue">
                              {brl.format(detalhe.resumoEmendas.totalIndicado)}
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-emerald-50/70 p-3.5">
                            <p className="text-xs text-emerald-900">
                              Total pago
                            </p>
                            <p className="mt-1 text-lg font-extrabold text-brand-emerald">
                              {brl.format(detalhe.resumoEmendas.totalPago)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {["Todos", ...anosEmendas].map((ano) => (
                            <button
                              key={ano}
                              type="button"
                              onClick={() => setAnoEmenda(ano)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                anoEmenda === ano
                                  ? "bg-brand-navy text-white"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              {ano}
                            </button>
                          ))}
                        </div>

                        <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
                          {emendasFiltradas.slice(0, 30).map((em) => (
                            <div
                              key={em.codigo}
                              className="rounded-xl border border-slate-200 bg-white p-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-md bg-brand-navy px-2 py-0.5 text-[11px] font-bold text-white">
                                    {em.ano}
                                  </span>
                                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-800">
                                    {em.tipoBadge}
                                  </span>
                                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                                    {em.funcao}
                                  </span>
                                </div>
                                <span className="text-xs font-bold text-brand-navy">
                                  {brl.format(em.valorTotal)}
                                </span>
                              </div>
                              <p className="mt-2 text-sm font-semibold text-slate-900">
                                {em.finalidadeSimples}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                Original: {em.finalidadeOriginal} • Pago:{" "}
                                <strong className="text-brand-emerald">
                                  {brl.format(em.valorPago)}
                                </strong>
                                {em.dataIndicacao
                                  ? ` • Indicação: ${em.dataIndicacao}`
                                  : ""}
                              </p>
                              {em.recebedores && em.recebedores.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2">
                                  {em.recebedores.slice(0, 3).map((rec, i) => (
                                    <span
                                      key={`${em.codigo}-rec-${i}`}
                                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                                        rec.isPendente
                                          ? "bg-amber-50 text-amber-900"
                                          : "bg-slate-100 text-slate-700"
                                      }`}
                                    >
                                      {rec.nome}
                                      {rec.uf ? ` (${rec.uf})` : ""}
                                      {rec.status ? ` — ${rec.status}` : ""}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (aba.id === "projetos") {
                    if (carregandoDetalhe) {
                      return (
                        <div className="flex items-center gap-2 p-6 text-sm text-brand-muted">
                          <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
                          Consultando matérias de autoria na API do Senado...
                        </div>
                      );
                    }
                    const autorias = detalhe?.autorias ?? [];
                    if (autorias.length === 0) {
                      return (
                        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                          Nenhuma autoria recente (2025/2026) retornada pela API
                          do Senado para este parlamentar.
                        </p>
                      );
                    }
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2 text-xs font-semibold text-emerald-950">
                          <CheckCircle2 className="h-4 w-4 text-brand-emerald" />
                          Fonte ao vivo: Dados Abertos do Senado ({autorias.length}{" "}
                          proposições recentes)
                        </div>
                        <div className="max-h-96 space-y-2.5 overflow-y-auto pr-1">
                          {autorias.map((aut) => (
                            <div
                              key={aut.codigo}
                              className="rounded-xl border border-slate-200 bg-white p-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy">
                                  <FileText className="h-3.5 w-3.5 text-brand-blue" />
                                  {aut.identificacao}
                                </span>
                                <div className="flex items-center gap-3 text-xs">
                                  <span className="text-brand-muted">
                                    {formatarDataBr(aut.data)}
                                  </span>
                                  <a
                                    href={aut.linkOficial}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 font-semibold text-brand-blue hover:underline"
                                  >
                                    Tramitação
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              </div>
                              <p className="mt-1.5 text-xs leading-relaxed text-slate-700 sm:text-sm">
                                {aut.ementa}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (aba.id === "votacoes") {
                    if (carregandoDetalhe) {
                      return (
                        <div className="flex items-center gap-2 p-6 text-sm text-brand-muted">
                          <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
                          Consultando votações nominais no Senado Federal...
                        </div>
                      );
                    }
                    const votacoes = detalhe?.votacoes ?? [];
                    if (votacoes.length === 0) {
                      return (
                        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                          Nenhuma votação nominal recente retornada pela API do
                          Senado.
                        </p>
                      );
                    }
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2 text-xs font-semibold text-emerald-950">
                          <Vote className="h-4 w-4 text-brand-emerald" />
                          Fonte ao vivo: Votações Nominais em Plenário (
                          {votacoes.length} registros recentes)
                        </div>
                        <div className="max-h-96 space-y-2.5 overflow-y-auto pr-1">
                          {votacoes.map((v, idx) => {
                            const votoLower = v.voto.toLowerCase();
                            const badgeCor = votoLower.startsWith("sim")
                              ? "bg-emerald-100 text-emerald-900"
                              : votoLower.startsWith("não") ||
                                  votoLower.startsWith("nao")
                                ? "bg-red-100 text-red-900"
                                : "bg-slate-200 text-slate-800";
                            return (
                              <div
                                key={`${v.codigoSessaoVotacao}-${idx}`}
                                className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="font-bold text-brand-navy">
                                    {v.materia} • {formatarDataBr(v.data)}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${badgeCor}`}
                                    >
                                      Voto: {v.voto}
                                    </span>
                                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-800">
                                      {v.resultado}
                                    </span>
                                  </div>
                                </div>
                                {v.descricaoVotacao && (
                                  <p className="mt-1 font-medium text-slate-800">
                                    {v.descricaoVotacao}
                                  </p>
                                )}
                                {v.ementa && (
                                  <p className="mt-0.5 line-clamp-2 text-slate-500">
                                    {v.ementa}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  if (aba.id === "custos") {
                    if (carregandoDetalhe) {
                      return (
                        <div className="flex items-center gap-2 p-6 text-sm text-brand-muted">
                          <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
                          Consultando Cota Parlamentar (CEAPS) no Portal do
                          Senado...
                        </div>
                      );
                    }
                    const ceaps = detalhe?.ceaps;
                    if (!ceaps) {
                      return (
                        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                          Nenhum reembolso CEAPS localizado para este senador no
                          exercício atual.
                        </p>
                      );
                    }
                    const maxCat = Math.max(
                      ...ceaps.porCategoria.map((c) => c.valor),
                      1
                    );
                    return (
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                          <div>
                            <p className="text-xs font-semibold text-emerald-900">
                              CEAPS {ceaps.ano} — Cota Parlamentar do Senado (ao
                              vivo)
                            </p>
                            <p className="mt-0.5 text-xl font-extrabold text-brand-emerald">
                              {brl.format(ceaps.totalAno)}
                            </p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-navy">
                            {ceaps.quantidadeLancamentos} notas/recibos no ano
                          </span>
                        </div>

                        {ceaps.porCategoria.length > 0 && (
                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="mb-2.5 text-xs font-bold text-brand-navy uppercase">
                              Gastos por categoria ({ceaps.ano})
                            </p>
                            <div className="space-y-2">
                              {ceaps.porCategoria.map((cat) => (
                                <div key={cat.categoria} className="space-y-1">
                                  <div className="flex justify-between gap-2 text-xs">
                                    <span className="truncate font-medium text-slate-700">
                                      {cat.categoria}
                                    </span>
                                    <span className="shrink-0 font-bold text-brand-navy">
                                      {brl.format(cat.valor)}
                                    </span>
                                  </div>
                                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                      className="h-full rounded-full bg-brand-blue"
                                      style={{
                                        width: `${Math.max(4, Math.round((cat.valor / maxCat) * 100))}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                          {ceaps.recentes.map((d) => (
                            <div
                              key={d.id}
                              className="flex flex-col justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 text-xs sm:flex-row sm:items-center"
                            >
                              <div className="min-w-0">
                                <p className="flex items-center gap-1.5 font-bold text-brand-navy">
                                  <Receipt className="h-3.5 w-3.5 shrink-0 text-brand-blue" />
                                  <span className="truncate">
                                    {d.fornecedor}
                                  </span>
                                </p>
                                <p className="mt-0.5 truncate text-slate-500">
                                  {d.tipoDespesa} • {formatarDataBr(d.data)}
                                </p>
                              </div>
                              <span className="shrink-0 font-extrabold text-brand-navy">
                                {brl.format(d.valorReembolsado)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (aba.id === "controle") {
                    const estadoSen = getEstadoPorUf(selecionado.uf);
                    return (
                      <PainelFiscalizacaoOficial
                        estado={estadoSen}
                        codigoIbge={estadoSen?.codigoIbge}
                        portalExtra={
                          selecionado.paginaOficial
                            ? {
                                titulo: "Perfil Oficial no Senado Federal",
                                descricao:
                                  "Proposições, discursos, votações, CEAPS e comissões direto no Portal do Senado.",
                                url: selecionado.paginaOficial,
                              }
                            : {
                                titulo: "Portal da Transparência do Senado",
                                descricao:
                                  "Acompanhe atividades legislativas, votações e cotas parlamentares no Senado.",
                                url: "https://www12.senado.leg.br/transparencia",
                              }
                        }
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
