import type { MunicipioIBGE } from "@/types/politicos";

const cachePorUf = new Map<string, MunicipioIBGE[]>();

export async function buscarMunicipiosPorUf(
  uf: string,
  signal?: AbortSignal
): Promise<MunicipioIBGE[]> {
  const codigo = uf.toUpperCase().trim();
  if (!codigo) return [];

  const cached = cachePorUf.get(codigo);
  if (cached) return cached;

  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${encodeURIComponent(
    codigo
  )}/municipios?orderBy=nome`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Falha ao consultar IBGE (HTTP ${res.status})`);
  }

  const raw: Array<{ id: number; nome: string }> = await res.json();
  const municipios: MunicipioIBGE[] = raw.map((item) => ({
    id: item.id,
    nome: item.nome,
  }));

  cachePorUf.set(codigo, municipios);
  return municipios;
}
