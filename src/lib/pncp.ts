import type { ContratacaoPncp } from "@/types/politicos";

const PNCP_BASE = "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao";

type RawPncpItem = {
  numeroCompra?: string;
  anoCompra?: number;
  sequencialCompra?: number;
  objetoCompra?: string;
  valorTotalEstimado?: number | null;
  valorTotalHomologado?: number | null;
  dataPublicacaoPncp?: string;
  modalidadeNome?: string;
  orgaoEntidade?: {
    cnpj?: string;
    razaoSocial?: string;
    esferaId?: string;
  };
  unidadeOrgao?: {
    ufSigla?: string;
    municipioNome?: string;
  };
};

const cachePncp = new Map<string, { loadedAt: number; itens: ContratacaoPncp[] }>();

function formatarYyyymmdd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

export async function buscarContratacoesPncp(params: {
  uf: string;
  codigoMunicipioIbge?: number;
  esferaPreferida?: "E" | "M";
}): Promise<ContratacaoPncp[]> {
  const uf = params.uf.toUpperCase().trim();
  const key = `${uf}:${params.codigoMunicipioIbge ?? "UF"}:${params.esferaPreferida ?? "ALL"}`;
  const cached = cachePncp.get(key);
  if (cached && Date.now() - cached.loadedAt < 3_600_000) {
    return cached.itens;
  }

  const hoje = new Date();
  const inicio = new Date(hoje.getTime() - 35 * 24 * 60 * 60 * 1000);

  const qs = new URLSearchParams({
    dataInicial: formatarYyyymmdd(inicio),
    dataFinal: formatarYyyymmdd(hoje),
    codigoModalidadeContratacao: "6", // Pregão Eletrônico
    uf,
    pagina: "1",
    tamanhoPagina: "25",
  });

  if (params.codigoMunicipioIbge) {
    qs.set("codigoMunicipioIbge", String(params.codigoMunicipioIbge));
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${PNCP_BASE}?${qs.toString()}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    if (res.status === 204 || !res.ok) {
      cachePncp.set(key, { loadedAt: Date.now(), itens: [] });
      return [];
    }

    const json = (await res.json()) as { data?: RawPncpItem[] };
    const brutos = json.data ?? [];

    const filtrados = params.esferaPreferida
      ? brutos.filter(
          (i) => i.orgaoEntidade?.esferaId === params.esferaPreferida
        )
      : brutos;

    const baseLista = filtrados.length > 0 ? filtrados : brutos;

    const itens: ContratacaoPncp[] = baseLista.slice(0, 8).map((item, idx) => {
      const cnpj = (item.orgaoEntidade?.cnpj ?? "").replace(/\D/g, "");
      const ano = item.anoCompra ?? hoje.getFullYear();
      const seq = item.sequencialCompra ?? 1;
      const esferaId = item.orgaoEntidade?.esferaId;
      const esfera =
        esferaId === "M"
          ? "Municipal"
          : esferaId === "E"
            ? "Estadual"
            : esferaId === "F"
              ? "Federal"
              : "Pública";

      return {
        id: `${cnpj}-${ano}-${seq}-${idx}`,
        orgao: item.orgaoEntidade?.razaoSocial ?? "Órgão Público",
        esfera,
        uf: item.unidadeOrgao?.ufSigla ?? uf,
        municipio: item.unidadeOrgao?.municipioNome ?? null,
        modalidade: item.modalidadeNome ?? "Pregão Eletrônico",
        numeroCompra: item.numeroCompra ?? String(seq),
        anoCompra: ano,
        objeto: item.objetoCompra ?? "Objeto não informado",
        valorEstimado:
          typeof item.valorTotalHomologado === "number"
            ? item.valorTotalHomologado
            : typeof item.valorTotalEstimado === "number"
              ? item.valorTotalEstimado
              : null,
        dataPublicacao: item.dataPublicacaoPncp ?? "",
        linkPncp: cnpj
          ? `https://pncp.gov.br/app/editais/${cnpj}/${ano}/${seq}`
          : "https://pncp.gov.br/app/editais",
      };
    });

    cachePncp.set(key, { loadedAt: Date.now(), itens });
    return itens;
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}
