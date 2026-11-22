import { AlertCircle } from "lucide-react";

type Props = {
  titulo?: string;
  mensagem: string;
  notaEditorial?: string;
};

export function AvisoFiscalizacao({
  titulo = "LEMBRETE: VOCÊ FISCALIZA",
  mensagem,
  notaEditorial,
}: Props) {
  return (
    <div
      role="note"
      className="flex flex-col gap-3 rounded-xl border border-orange-200 border-l-4 border-l-brand-alert bg-orange-50/90 p-4 sm:flex-row sm:items-start"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-alert text-white">
        <AlertCircle className="h-4 w-4" />
      </div>
      <div className="space-y-1 text-sm">
        <p className="font-bold tracking-tight text-slate-900">{titulo}</p>
        <p className="leading-relaxed text-slate-700">{mensagem}</p>
        {notaEditorial && (
          <p className="pt-0.5 text-xs font-medium text-orange-900/80">
            {notaEditorial}
          </p>
        )}
      </div>
    </div>
  );
}
