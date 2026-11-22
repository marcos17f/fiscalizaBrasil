"use client";

import { ExternalLink, ShieldCheck } from "lucide-react";
import type { EstadoInfo } from "@/types/politicos";

type Props = {
  estado?: EstadoInfo;
  linkTse?: string | null;
  portalExtra?: { titulo: string; descricao: string; url: string } | null;
  codigoIbge?: number;
};

export function PainelFiscalizacaoOficial({
  estado,
  linkTse,
  portalExtra,
  codigoIbge,
}: Props) {
  const links: Array<{ titulo: string; descricao: string; url: string }> = [];

  if (linkTse) {
    links.push({
      titulo: "TSE DivulgaCandContas",
      descricao:
        "Prestação de contas eleitorais, doadores, fornecedores e certidões oficiais.",
      url: linkTse,
    });
  }

  if (portalExtra) {
    links.push(portalExtra);
  }

  if (estado) {
    links.push({
      titulo: `Tribunal de Contas (${estado.tceSigla})`,
      descricao: `Pareceres de contas anuais, auditorias e fiscalização de ${estado.nome}.`,
      url: estado.tceUrl,
    });
    links.push({
      titulo: `Portal da Transparência de ${estado.nome}`,
      descricao: "Receitas, despesas, licitações e contratos estaduais.",
      url: estado.transparenciaUrl,
    });
  }

  links.push({
    titulo: "Portal da Transparência Federal (CGU)",
    descricao: codigoIbge
      ? "Repasses da União, convênios e recursos federais enviados para esta localidade."
      : "Recursos federais transferidos, emendas parlamentares e convênios.",
    url: codigoIbge
      ? `https://portaldatransparencia.gov.br/localidades/${codigoIbge}`
      : "https://portaldatransparencia.gov.br/transferencias",
  });

  links.push({
    titulo: "Fala.BR — Pedido de Informação (LAI)",
    descricao:
      "Canal oficial da CGU para registrar pedidos de acesso à informação e denúncias.",
    url: "https://falabr.cgu.gov.br/",
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-brand-emerald uppercase">
        <ShieldCheck className="h-4 w-4" />
        Canais Oficiais de Controle Social e Auditoria
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((item) => (
          <a
            key={item.titulo}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-brand-blue/50 hover:shadow-sm"
          >
            <div>
              <p className="flex items-center justify-between gap-2 text-sm font-bold text-brand-navy group-hover:text-brand-blue">
                {item.titulo}
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-brand-blue" />
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {item.descricao}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
