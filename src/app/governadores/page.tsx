import type { Metadata } from "next";
import governadoresData from "@/data/governadores.json";
import { PageHero } from "@/components/layout/PageHero";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import { GovernadoresExplorer } from "@/components/governadores/GovernadoresExplorer";
import type { Governador } from "@/types/politicos";

export const metadata: Metadata = {
  title: "Governadores",
  description:
    "Consulte os 27 governadores do Brasil com dados eleitorais do TSE, Plano de Governo PDF, finanças SICONFI, LRF e licitações recentes no PNCP.",
};

export default function GovernadoresPage() {
  const governadores = governadoresData as Governador[];

  return (
    <div>
      <PageHero
        categoria="Poder Executivo Estadual • 27 UFs"
        titulo="Governadores do Brasil"
        descricao="Acompanhe os chefes do Executivo nos 26 estados e no Distrito Federal. Filtre por nome, estado, região ou partido e abra o perfil completo com TSE, Plano de Governo PDF, SICONFI (RREO + LRF) e editais PNCP."
        breadcrumb="Governadores"
        metricas={[
          { valor: String(governadores.length), label: "Estados + DF" },
          { valor: "8 abas", label: "Transparência" },
          { valor: "Ao vivo", label: "TSE + SICONFI + PNCP", destaque: true },
        ]}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        <AvisoFiscalizacao
          mensagem="Identificação e mandatos em conferência editorial contínua. O balanço orçamentário, o indicador da Lei de Responsabilidade Fiscal (LRF), os bens declarados e os editais são consultados em fontes oficiais."
          notaEditorial="Fontes integradas: TSE DivulgaCandContas (2022/2026), SICONFI / Tesouro Nacional, PNCP e 27 TCEs."
        />
        <GovernadoresExplorer governadores={governadores} />
      </div>
    </div>
  );
}
