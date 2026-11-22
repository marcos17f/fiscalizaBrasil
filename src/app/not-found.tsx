import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-brand-navy">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h1 className="mt-4 text-2xl font-extrabold text-brand-navy">
        Página não encontrada
      </h1>
      <p className="mt-2 text-sm text-brand-muted">
        A seção solicitada não existe ou foi movida. Volte para a página inicial
        para consultar os representantes públicos.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-blue"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao início
      </Link>
    </div>
  );
}
