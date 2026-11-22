import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import type { PaginaInstitucional } from "@/types/politicos";

type Props = {
  pagina: PaginaInstitucional;
  categoria: string;
  mostrarAviso?: boolean;
};

export function PaginaInstitucionalView({
  pagina,
  categoria,
  mostrarAviso = true,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-bold tracking-wider text-brand-emerald uppercase">
          {categoria}
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          {pagina.titulo}
        </h1>
      </div>

      {mostrarAviso && (
        <AvisoFiscalizacao
          mensagem="O Fiscaliza Brasil é um projeto privado e independente. Não julga e não emite opiniões político-partidárias — organiza dados públicos de fontes oficiais."
        />
      )}

      <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        {pagina.blocos.map((bloco, index) => {
          if (bloco.tipo === "h1" || bloco.tipo === "h2") {
            return (
              <h2
                key={index}
                className="pt-4 text-xl font-extrabold text-brand-navy first:pt-0 sm:text-2xl"
              >
                {bloco.texto}
              </h2>
            );
          }
          if (bloco.tipo === "h3" || bloco.tipo === "h4") {
            return (
              <h3
                key={index}
                className="pt-2 text-base font-bold text-brand-blue sm:text-lg"
              >
                {bloco.texto}
              </h3>
            );
          }
          if (bloco.tipo === "li") {
            return (
              <div
                key={index}
                className="flex items-start gap-2.5 pl-2 text-sm leading-relaxed text-slate-700"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-emerald" />
                <span>{bloco.texto}</span>
              </div>
            );
          }
          return (
            <p
              key={index}
              className="text-sm leading-relaxed text-slate-700 sm:text-[15px]"
            >
              {bloco.texto}
            </p>
          );
        })}
      </article>
    </div>
  );
}
