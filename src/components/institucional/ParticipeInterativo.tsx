"use client";

import { useState } from "react";
import {
  Camera,
  CheckCircle2,
  FileText,
  MessageSquarePlus,
  Video,
} from "lucide-react";
import { FormularioCidadao } from "@/components/institucional/FormularioCidadao";

const OPCOES_PARTICIPE = [
  "Documentos & Links (editais, diários oficiais ou contas)",
  "Fotos de Obras (placas, prazos e situação no local)",
  "Vídeos & Relatos de interesse público",
  "Sugestões & Correções de informações",
  "Colaborar com o projeto",
  "Outro assunto",
] as const;

const CARDS_PARTICIPE = [
  {
    titulo: "Documentos & Links",
    desc: "Indique editais, diários oficiais ou prestações de contas para verificação.",
    assunto: OPCOES_PARTICIPE[0],
    icone: FileText,
  },
  {
    titulo: "Fotos de Obras",
    desc: "Registre placas de obras públicas, prazos e situação real no local.",
    assunto: OPCOES_PARTICIPE[1],
    icone: Camera,
  },
  {
    titulo: "Vídeos & Relatos",
    desc: "Compartilhe registros objetivos de interesse público da sua cidade.",
    assunto: OPCOES_PARTICIPE[2],
    icone: Video,
  },
  {
    titulo: "Sugestões & Correções",
    desc: "Aponte melhorias, novos temas ou atualizações de cadastro.",
    assunto: OPCOES_PARTICIPE[3],
    icone: MessageSquarePlus,
  },
] as const;

export function ParticipeInterativo() {
  const [assuntoAtivo, setAssuntoAtivo] = useState<string>(OPCOES_PARTICIPE[0]);

  const selecionarCard = (assunto: string) => {
    setAssuntoAtivo(assunto);
    const el = document.getElementById("formulario-participe");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS_PARTICIPE.map((item) => {
          const Icone = item.icone;
          const ativo = assuntoAtivo === item.assunto;
          return (
            <button
              key={item.titulo}
              type="button"
              onClick={() => selecionarCard(item.assunto)}
              className={`card-elevated group flex flex-col justify-between rounded-2xl border p-5 text-left transition-all ${
                ativo
                  ? "border-brand-emerald bg-brand-mint/50 ring-2 ring-brand-emerald/20"
                  : "border-slate-200/90 bg-white hover:-translate-y-0.5 hover:border-brand-blue/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      ativo
                        ? "bg-brand-emerald text-white"
                        : "bg-brand-mint text-brand-emerald group-hover:bg-brand-emerald group-hover:text-white"
                    }`}
                  >
                    <Icone className="h-5 w-5" />
                  </div>
                  {ativo && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                      <CheckCircle2 className="h-3 w-3" />
                      Selecionado
                    </span>
                  )}
                </div>
                <h2 className="mt-3.5 text-sm font-bold text-brand-navy">
                  {item.titulo}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {item.desc}
                </p>
              </div>
              <span className="mt-4 text-[11px] font-bold text-brand-blue">
                Anexar neste canal ↓
              </span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto max-w-4xl">
        <FormularioCidadao
          formId="formulario-participe"
          canal="participe"
          titulo="Participe do Fiscaliza Brasil"
          descricao="Selecione a categoria, cole links oficiais ou anexe documentos, fotos de obras e vídeos para verificação da nossa equipe."
          opcoesAssunto={OPCOES_PARTICIPE}
          assuntoSelecionado={assuntoAtivo}
          permitirAnexos
          textoBotao="Enviar participação com anexos"
        />
      </div>
    </div>
  );
}
