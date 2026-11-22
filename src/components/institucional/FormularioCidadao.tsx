"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  CheckCircle2,
  FileText,
  Film,
  Image as ImageIcon,
  Link2,
  Loader2,
  Paperclip,
  Send,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import { ESTADOS_BRASIL } from "@/lib/ufs";

const MAX_ARQUIVOS = 5;
const MAX_MB = 10;
const ACCEPT_ATTR =
  ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png,.webp,.mp4,.mov,.webm";

type Props = {
  canal: "participe" | "denuncias" | "contato";
  titulo: string;
  descricao: string;
  opcoesAssunto?: readonly string[];
  assuntoSelecionado?: string;
  permitirAnexos?: boolean;
  textoBotao: string;
  formId?: string;
};

type ReciboProtocolo = {
  protocolo: string;
  totalAnexos: number;
  linkFonte: string | null;
};

function formatarTamanho(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function IconeArquivo({ arquivo }: { arquivo: File }) {
  if (arquivo.type.startsWith("image/")) {
    return <ImageIcon className="h-4 w-4 shrink-0 text-brand-emerald" />;
  }
  if (arquivo.type.startsWith("video/")) {
    return <Film className="h-4 w-4 shrink-0 text-brand-blue" />;
  }
  return <FileText className="h-4 w-4 shrink-0 text-brand-navy" />;
}

export function FormularioCidadao({
  canal,
  titulo,
  descricao,
  opcoesAssunto,
  assuntoSelecionado,
  permitirAnexos = false,
  textoBotao,
  formId,
}: Props) {
  const uid = useId();
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [uf, setUf] = useState("");
  const [assunto, setAssunto] = useState(
    assuntoSelecionado ?? opcoesAssunto?.[0] ?? ""
  );
  const [linkFonte, setLinkFonte] = useState("");
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [arrastando, setArrastando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [aceite, setAceite] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [recibo, setRecibo] = useState<ReciboProtocolo | null>(null);

  useEffect(() => {
    if (assuntoSelecionado) {
      setAssunto(assuntoSelecionado);
    }
  }, [assuntoSelecionado]);

  const adicionarArquivos = (lista: FileList | null) => {
    if (!lista || lista.length === 0) return;
    setErro(null);

    const novos = Array.from(lista);
    const validos: File[] = [];

    for (const file of novos) {
      if (file.size > MAX_MB * 1024 * 1024) {
        setErro(
          `O arquivo "${file.name}" excede o limite de ${MAX_MB} MB por anexo.`
        );
        continue;
      }
      validos.push(file);
    }

    setArquivos((prev) => {
      const combinado = [...prev, ...validos];
      if (combinado.length > MAX_ARQUIVOS) {
        setErro(`Você pode anexar no máximo ${MAX_ARQUIVOS} arquivos por envio.`);
        return combinado.slice(0, MAX_ARQUIVOS);
      }
      return combinado;
    });
  };

  const removerArquivo = (idx: number) => {
    setArquivos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      let res: Response;
      if (permitirAnexos) {
        const fd = new FormData();
        fd.append("canal", canal);
        fd.append("nome", nome);
        fd.append("email", email);
        fd.append("whatsapp", whatsapp);
        fd.append("uf", uf);
        fd.append("assunto", assunto);
        fd.append("linkFonte", linkFonte);
        fd.append("mensagem", mensagem);
        fd.append("aceitePrivacidade", String(aceite));
        for (const arq of arquivos) {
          fd.append("anexos", arq);
        }
        res = await fetch("/api/contato", { method: "POST", body: fd });
      } else {
        res = await fetch("/api/contato", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            canal,
            nome,
            email,
            whatsapp,
            uf,
            assunto,
            linkFonte,
            mensagem,
            aceitePrivacidade: aceite,
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || "Não foi possível enviar sua mensagem.");
      } else {
        setRecibo({
          protocolo: data.protocolo,
          totalAnexos: Array.isArray(data.anexos) ? data.anexos.length : 0,
          linkFonte: data.linkFonte ?? null,
        });
        setNome("");
        setEmail("");
        setWhatsapp("");
        setUf("");
        setAssunto(assuntoSelecionado ?? opcoesAssunto?.[0] ?? "");
        setLinkFonte("");
        setArquivos([]);
        setMensagem("");
        setAceite(false);
      }
    } catch {
      setErro("Erro de conexão ao enviar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section
      id={formId}
      className="scroll-mt-32 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-9"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-brand-emerald uppercase">
            Canal Cidadão • Protocolo imediato
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-brand-navy sm:text-2xl">
            {titulo}
          </h2>
          <p className="mt-1 text-sm text-brand-muted">{descricao}</p>
        </div>
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-mint text-brand-emerald sm:flex">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>

      {recibo ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6">
          <div className="flex items-start gap-3.5">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-emerald" />
            <div>
              <p className="font-bold text-emerald-950">
                Registro recebido com sucesso!
              </p>
              <p className="mt-1.5 text-sm text-emerald-900">
                Seu número de protocolo:{" "}
                <strong className="tabular-nums rounded-lg border border-emerald-200 bg-white px-2.5 py-1 font-mono text-brand-navy">
                  {recibo.protocolo}
                </strong>
              </p>
              {(recibo.totalAnexos > 0 || recibo.linkFonte) && (
                <p className="mt-2 text-xs font-medium text-emerald-900">
                  {recibo.totalAnexos > 0
                    ? `${recibo.totalAnexos} ${recibo.totalAnexos === 1 ? "arquivo validado e anexado" : "arquivos validados e anexados"}`
                    : ""}
                  {recibo.totalAnexos > 0 && recibo.linkFonte ? " • " : ""}
                  {recibo.linkFonte ? "Link oficial registrado" : ""}
                </p>
              )}
              <button
                type="button"
                onClick={() => setRecibo(null)}
                className="mt-4 inline-flex items-center rounded-lg bg-brand-emerald px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-emerald-dark"
              >
                Enviar outro registro
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`${uid}-nome`}
                className="mb-1.5 block text-xs font-bold text-brand-navy"
              >
                Nome *
              </label>
              <input
                id={`${uid}-nome`}
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50/40 px-3.5 py-2.5 text-base transition-colors focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:outline-none sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor={`${uid}-email`}
                className="mb-1.5 block text-xs font-bold text-brand-navy"
              >
                E-mail *
              </label>
              <input
                id={`${uid}-email`}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50/40 px-3.5 py-2.5 text-base transition-colors focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:outline-none sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor={`${uid}-whats`}
                className="mb-1.5 block text-xs font-bold text-brand-navy"
              >
                WhatsApp com DDD (opcional)
              </label>
              <input
                id={`${uid}-whats`}
                type="tel"
                inputMode="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 99999-9999"
                className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50/40 px-3.5 py-2.5 text-base transition-colors focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:outline-none sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor={`${uid}-uf`}
                className="mb-1.5 block text-xs font-bold text-brand-navy"
              >
                Estado (opcional)
              </label>
              <select
                id={`${uid}-uf`}
                value={uf}
                onChange={(e) => setUf(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50/40 px-3.5 py-2.5 text-base transition-colors focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:outline-none sm:text-sm"
              >
                <option value="">Selecione</option>
                {ESTADOS_BRASIL.map((e) => (
                  <option key={e.uf} value={e.uf}>
                    {e.uf} — {e.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {opcoesAssunto && opcoesAssunto.length > 0 ? (
            <div>
              <label
                htmlFor={`${uid}-assunto`}
                className="mb-1.5 block text-xs font-bold text-brand-navy"
              >
                Categoria / Assunto *
              </label>
              <select
                id={`${uid}-assunto`}
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/40 px-3.5 py-2.5 text-sm font-medium text-brand-navy transition-colors focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
              >
                {opcoesAssunto.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label
                htmlFor={`${uid}-assunto`}
                className="mb-1.5 block text-xs font-bold text-brand-navy"
              >
                Assunto *
              </label>
              <input
                id={`${uid}-assunto`}
                type="text"
                required
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50/40 px-3.5 py-2.5 text-base transition-colors focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:outline-none sm:text-sm"
              />
            </div>
          )}

          {/* Campo de Link / Fonte Oficial */}
          {permitirAnexos && (
            <div>
              <label
                htmlFor={`${uid}-link`}
                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-navy"
              >
                <Link2 className="h-3.5 w-3.5 text-brand-emerald" />
                Link de edital, diário oficial, prestação de contas ou vídeo
                (opcional)
              </label>
              <input
                id={`${uid}-link`}
                type="url"
                value={linkFonte}
                onChange={(e) => setLinkFonte(e.target.value)}
                placeholder="https://..."
                className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50/40 px-3.5 py-2.5 text-base transition-colors focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:outline-none sm:text-sm"
              />
            </div>
          )}

          {/* Campo de Upload / Anexar Documentos, Fotos e Vídeos */}
          {permitirAnexos && (
            <div>
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-navy">
                <Paperclip className="h-3.5 w-3.5 text-brand-emerald" />
                Anexar Documentos (PDF/DOC/XLS), Fotos de Obras ou Vídeos
                (opcional)
              </span>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setArrastando(true);
                }}
                onDragLeave={() => setArrastando(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setArrastando(false);
                  adicionarArquivos(e.dataTransfer.files);
                }}
                onClick={() => inputFileRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    inputFileRef.current?.click();
                  }
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-colors ${
                  arrastando
                    ? "border-brand-emerald bg-brand-mint/70"
                    : "border-slate-300 bg-slate-50/60 hover:border-brand-blue/60 hover:bg-blue-50/30"
                }`}
              >
                <input
                  ref={inputFileRef}
                  type="file"
                  multiple
                  accept={ACCEPT_ATTR}
                  onChange={(e) => {
                    adicionarArquivos(e.target.files);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-blue shadow-2xs ring-1 ring-slate-200">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <p className="mt-2.5 text-xs font-bold text-brand-navy sm:text-sm">
                  Clique para selecionar ou arraste seus arquivos aqui
                </p>
                <p className="mt-1 text-[11px] text-brand-muted">
                  PDF, DOC, XLS, JPG, PNG, WEBP, MP4, MOV ou WEBM • Até{" "}
                  {MAX_ARQUIVOS} arquivos ({MAX_MB} MB cada)
                </p>
              </div>

              {arquivos.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {arquivos.map((arq, idx) => (
                    <li
                      key={`${arq.name}-${arq.size}-${idx}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <IconeArquivo arquivo={arq} />
                        <span className="truncate font-semibold text-brand-navy">
                          {arq.name}
                        </span>
                        <span className="tabular-nums shrink-0 text-[11px] text-brand-muted">
                          ({formatarTamanho(arq.size)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removerArquivo(idx)}
                        aria-label={`Remover ${arq.name}`}
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor={`${uid}-msg`}
              className="mb-1.5 block text-xs font-bold text-brand-navy"
            >
              Mensagem / Detalhes *
            </label>
            <textarea
              id={`${uid}-msg`}
              rows={5}
              required
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Se possível, informe cidade, datas, local e contexto dos documentos ou fotos enviados. Evite dados pessoais sensíveis de terceiros."
              className="w-full rounded-xl border border-slate-300 bg-slate-50/40 px-3.5 py-2.5 text-sm transition-colors focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={aceite}
              onChange={(e) => setAceite(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-emerald focus:ring-brand-emerald"
            />
            <span>
              Concordo que meus dados sejam usados para análise e resposta deste
              registro, conforme a{" "}
              <Link
                href="/privacidade"
                className="font-semibold text-brand-blue hover:underline"
              >
                Política de Privacidade (LGPD)
              </Link>
              .
            </span>
          </label>

          {erro && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brand-emerald px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-emerald-dark disabled:opacity-60 sm:w-auto"
          >
            {enviando ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {textoBotao}
          </button>
        </form>
      )}
    </section>
  );
}
