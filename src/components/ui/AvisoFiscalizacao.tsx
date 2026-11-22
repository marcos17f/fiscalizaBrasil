import { ShieldCheck } from "lucide-react";

type Props = {
  titulo?: string;
  mensagem: string;
  notaEditorial?: string;
};

export function AvisoFiscalizacao({
  titulo = "COMPROMISSO EDITORIAL • VOCÊ FISCALIZA",
  mensagem,
  notaEditorial,
}: Props) {
  return (
    <div
      role="note"
      className="flex flex-col gap-3.5 rounded-2xl border border-amber-200/80 border-l-4 border-l-brand-alert bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-white p-4 shadow-2xs sm:flex-row sm:items-start sm:p-5"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 ring-1 ring-amber-200">
        <ShieldCheck className="h-4 w-4" />
      </div>
      <div className="space-y-1 text-sm">
        <p className="text-[11px] font-bold tracking-wider text-amber-900 uppercase">
          {titulo}
        </p>
        <p className="leading-relaxed text-slate-700">{mensagem}</p>
        {notaEditorial && (
          <p className="pt-0.5 text-xs font-medium text-amber-900/75">
            {notaEditorial}
          </p>
        )}
      </div>
    </div>
  );
}
