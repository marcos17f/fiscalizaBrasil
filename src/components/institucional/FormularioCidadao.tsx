"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import { ESTADOS_BRASIL } from "@/lib/ufs";

type Props = {
  canal: "participe" | "denuncias" | "contato";
  titulo: string;
  descricao: string;
  opcoesAssunto?: readonly string[];
  textoBotao: string;
};

export function FormularioCidadao({
  canal,
  titulo,
  descricao,
  opcoesAssunto,
  textoBotao,
}: Props) {
  const uid = useId();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [uf, setUf] = useState("");
  const [assunto, setAssunto] = useState(opcoesAssunto?.[0] ?? "");
  const [mensagem, setMensagem] = useState("");
  const [aceite, setAceite] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [protocolo, setProtocolo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canal,
          nome,
          email,
          whatsapp,
          uf,
          assunto,
          mensagem,
          aceitePrivacidade: aceite,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || "Não foi possível enviar sua mensagem.");
      } else {
        setProtocolo(data.protocolo);
        setNome("");
        setEmail("");
        setWhatsapp("");
        setUf("");
        setAssunto(opcoesAssunto?.[0] ?? "");
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
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-9">
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

      {protocolo ? (
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
                  {protocolo}
                </strong>
              </p>
              <button
                type="button"
                onClick={() => setProtocolo(null)}
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
                className="w-full rounded-xl border border-slate-300 bg-slate-50/40 px-3.5 py-2.5 text-sm transition-colors focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
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
                className="w-full rounded-xl border border-slate-300 bg-slate-50/40 px-3.5 py-2.5 text-sm transition-colors focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
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
                className="w-full rounded-xl border border-slate-300 bg-slate-50/40 px-3.5 py-2.5 text-sm transition-colors focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
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
                className="w-full rounded-xl border border-slate-300 bg-slate-50/40 px-3.5 py-2.5 text-sm transition-colors focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
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
                className="w-full rounded-xl border border-slate-300 bg-slate-50/40 px-3.5 py-2.5 text-sm transition-colors focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
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
                className="w-full rounded-xl border border-slate-300 bg-slate-50/40 px-3.5 py-2.5 text-sm transition-colors focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
              />
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
              placeholder="Se possível, informe datas, local e links de fontes oficiais. Evite dados pessoais sensíveis de terceiros."
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
            className="inline-flex items-center gap-2 rounded-xl bg-brand-emerald px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-emerald-dark disabled:opacity-60"
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
