"use client";

import {
  Briefcase,
  ExternalLink,
  Globe,
  GraduationCap,
  Loader2,
  UserCheck,
} from "lucide-react";
import { formatarDataBr } from "@/lib/formatters";
import type { PerfilTSE } from "@/types/politicos";

type Props = {
  perfil: PerfilTSE | null;
  carregando: boolean;
};

export function PainelTrajetoriaTSE({ perfil, carregando }: Props) {
  if (carregando) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-brand-muted">
        <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
        Carregando dados biográficos e chapa oficial no TSE...
      </div>
    );
  }

  if (!perfil) return null;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-brand-muted uppercase">
            <UserCheck className="h-3.5 w-3.5 text-brand-emerald" />
            Identificação Oficial (TSE {perfil.ano})
          </p>
          <p className="mt-1 text-sm font-bold text-brand-navy">
            {perfil.nomeCompleto}
          </p>
          <p className="mt-0.5 text-xs text-slate-600">
            Nascimento: {formatarDataBr(perfil.dataNascimento)}
            {perfil.naturalidade ? ` • Natural de ${perfil.naturalidade}` : ""}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-brand-muted uppercase">
            <GraduationCap className="h-3.5 w-3.5 text-brand-blue" />
            Formação & Ocupação
          </p>
          <p className="mt-1 text-sm font-bold text-brand-navy">
            {perfil.grauInstrucao ?? "Não informado"}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-600">
            <Briefcase className="h-3 w-3 shrink-0 text-slate-400" />
            {perfil.ocupacao ?? "Ocupação não informada"}
          </p>
        </div>
      </div>

      {/* Vice (Governador / Prefeito) */}
      {perfil.vices.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-bold tracking-wide text-brand-muted uppercase">
            Vice na Chapa Eleita ({perfil.ano})
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            {perfil.vices.map((vice) => (
              <div
                key={`${vice.nomeCompleto}-${vice.partido}`}
                className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2"
              >
                {vice.fotoUrl && (
                  <img
                    src={vice.fotoUrl}
                    alt={`Foto de ${vice.nomeUrna}`}
                    loading="lazy"
                    className="h-10 w-10 rounded-full border border-slate-200 object-cover object-top"
                  />
                )}
                <div>
                  <p className="text-sm font-bold text-brand-navy">
                    {vice.nomeUrna}
                  </p>
                  <p className="text-xs text-slate-600">
                    {vice.nomeCompleto} • <strong>{vice.partido}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coligação e Sites oficiais */}
      {(perfil.composicaoColigacao || perfil.sites.length > 0) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {perfil.composicaoColigacao && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] font-bold tracking-wide text-brand-muted uppercase">
                Coligação ({perfil.coligacao})
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-700">
                {perfil.composicaoColigacao}
              </p>
            </div>
          )}

          {perfil.sites.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-brand-muted uppercase">
                <Globe className="h-3.5 w-3.5 text-brand-emerald" />
                Canais Registrados no TSE
              </p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {perfil.sites.slice(0, 4).map((url) => {
                  let label = url;
                  try {
                    label = new URL(url).hostname.replace(/^www\./, "");
                  } catch {
                    // manter texto
                  }
                  return (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-brand-blue hover:bg-blue-50"
                    >
                      {label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
