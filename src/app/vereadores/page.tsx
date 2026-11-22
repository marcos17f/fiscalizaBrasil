import type { Metadata } from "next";
import { AvisoFiscalizacao } from "@/components/ui/AvisoFiscalizacao";
import { VereadoresExplorer } from "@/components/municipios/VereadoresExplorer";

export const metadata: Metadata = {
  title: "Vereadores",
  description:
    "Pesquise vereadores por estado e município com integração ao vivo na API de localidades do IBGE e arquitetura preparada para a base TSE.",
};

export default function VereadoresPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-2">
        <p className="text-xs font-bold tracking-wider text-brand-emerald uppercase">
          Câmaras Municipais • ~58 mil vereadores no Brasil
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          Vereadores
        </h1>
        <p className="max-w-2xl text-sm text-brand-muted sm:text-base">
          Escolha seu estado e sua cidade para localizar a Câmara Municipal.
          Todos os 27 estados estão padronizados corretamente e integrados à API
          oficial do IBGE.
        </p>
      </div>

      <AvisoFiscalizacao
        mensagem="Integração ao vivo com IBGE e TSE DivulgaCandContas (Eleições Municipais 2024): ao escolher qualquer uma das 5.570 cidades, a Câmara Municipal é carregada sob demanda sem pesar no celular, com perfil individual em 8 abas."
      />

      <VereadoresExplorer />
    </div>
  );
}
