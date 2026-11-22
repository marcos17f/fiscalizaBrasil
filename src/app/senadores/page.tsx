import type { Metadata } from "next";
import senadoresData from "@/data/senadores.json";
import { PageHero } from "@/components/layout/PageHero";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import { SenadoresExplorer } from "@/components/senadores/SenadoresExplorer";
import type { Senador } from "@/types/politicos";

export const metadata: Metadata = {
  title: "Senadores",
  description:
    "Conheça os 81 senadores da República, filtre por estado ou partido e consulte projetos, votações nominais, cota CEAPS e emendas parlamentares.",
};

export default function SenadoresPage() {
  const senadores = senadoresData as Senador[];

  return (
    <div>
      <PageHero
        categoria="Senado Federal • União"
        titulo="Senadores em Exercício"
        descricao="Consulte os representantes do seu estado no Senado Federal. Abra qualquer perfil para acompanhar projetos de autoria, votações nominais em plenário, cota CEAPS e emendas traduzidas em linguagem simples."
        breadcrumb="Senadores"
        metricas={[
          { valor: String(senadores.length), label: "Senadores" },
          { valor: "6 abas", label: "Perfil completo" },
          { valor: "Ao vivo", label: "API Senado + CEAPS", destaque: true },
        ]}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        <AvisoFiscalizacao
          mensagem="Dados legislativos, votações nominais, comissões e despesas CEAPS consultados ao vivo nos Dados Abertos do Senado Federal, combinados com emendas parlamentares do Portal da Transparência (CGU)."
        />
        <SenadoresExplorer senadores={senadores} />
      </div>
    </div>
  );
}
