import type { EstadoInfo, Regiao } from "@/types/politicos";

export const ESTADOS_BRASIL: readonly EstadoInfo[] = [
  { uf: "AC", codigoIbge: 12, nome: "Acre", capital: "Rio Branco", regiao: "Norte", tceSigla: "TCE-AC", tceUrl: "https://tceac.tc.br", transparenciaUrl: "https://transparencia.ac.gov.br" },
  { uf: "AL", codigoIbge: 27, nome: "Alagoas", capital: "Maceió", regiao: "Nordeste", tceSigla: "TCE-AL", tceUrl: "https://www.tceal.tc.br", transparenciaUrl: "https://transparencia.al.gov.br" },
  { uf: "AP", codigoIbge: 16, nome: "Amapá", capital: "Macapá", regiao: "Norte", tceSigla: "TCE-AP", tceUrl: "https://www.tce.ap.gov.br", transparenciaUrl: "https://www.transparencia.ap.gov.br" },
  { uf: "AM", codigoIbge: 13, nome: "Amazonas", capital: "Manaus", regiao: "Norte", tceSigla: "TCE-AM", tceUrl: "https://www2.tce.am.gov.br", transparenciaUrl: "https://www.transparencia.am.gov.br" },
  { uf: "BA", codigoIbge: 29, nome: "Bahia", capital: "Salvador", regiao: "Nordeste", tceSigla: "TCE-BA / TCM-BA", tceUrl: "https://www.tce.ba.gov.br", transparenciaUrl: "https://www.transparencia.ba.gov.br" },
  { uf: "CE", codigoIbge: 23, nome: "Ceará", capital: "Fortaleza", regiao: "Nordeste", tceSigla: "TCE-CE", tceUrl: "https://www.tce.ce.gov.br", transparenciaUrl: "https://cearatransparente.ce.gov.br" },
  { uf: "DF", codigoIbge: 53, nome: "Distrito Federal", capital: "Brasília", regiao: "Centro-Oeste", tceSigla: "TCDF", tceUrl: "https://www.tc.df.gov.br", transparenciaUrl: "https://www.transparencia.df.gov.br" },
  { uf: "ES", codigoIbge: 32, nome: "Espírito Santo", capital: "Vitória", regiao: "Sudeste", tceSigla: "TCE-ES", tceUrl: "https://www.tcees.tc.br", transparenciaUrl: "https://transparencia.es.gov.br" },
  { uf: "GO", codigoIbge: 52, nome: "Goiás", capital: "Goiânia", regiao: "Centro-Oeste", tceSigla: "TCE-GO / TCM-GO", tceUrl: "https://portal.tce.go.gov.br", transparenciaUrl: "https://transparencia.go.gov.br" },
  { uf: "MA", codigoIbge: 21, nome: "Maranhão", capital: "São Luís", regiao: "Nordeste", tceSigla: "TCE-MA", tceUrl: "https://www.tce.ma.gov.br", transparenciaUrl: "https://www.transparencia.ma.gov.br" },
  { uf: "MT", codigoIbge: 51, nome: "Mato Grosso", capital: "Cuiabá", regiao: "Centro-Oeste", tceSigla: "TCE-MT", tceUrl: "https://www.tce.mt.gov.br", transparenciaUrl: "https://transparencia.mt.gov.br" },
  { uf: "MS", codigoIbge: 50, nome: "Mato Grosso do Sul", capital: "Campo Grande", regiao: "Centro-Oeste", tceSigla: "TCE-MS", tceUrl: "https://www.tce.ms.gov.br", transparenciaUrl: "https://www.transparencia.ms.gov.br" },
  { uf: "MG", codigoIbge: 31, nome: "Minas Gerais", capital: "Belo Horizonte", regiao: "Sudeste", tceSigla: "TCE-MG", tceUrl: "https://www.tce.mg.gov.br", transparenciaUrl: "https://www.transparencia.mg.gov.br" },
  { uf: "PA", codigoIbge: 15, nome: "Pará", capital: "Belém", regiao: "Norte", tceSigla: "TCE-PA / TCM-PA", tceUrl: "https://www.tcepa.tc.br", transparenciaUrl: "https://www.sistemas.pa.gov.br/portaltransparencia" },
  { uf: "PB", codigoIbge: 25, nome: "Paraíba", capital: "João Pessoa", regiao: "Nordeste", tceSigla: "TCE-PB", tceUrl: "https://tce.pb.gov.br", transparenciaUrl: "https://transparencia.pb.gov.br" },
  { uf: "PR", codigoIbge: 41, nome: "Paraná", capital: "Curitiba", regiao: "Sul", tceSigla: "TCE-PR", tceUrl: "https://www1.tce.pr.gov.br", transparenciaUrl: "https://www.transparencia.pr.gov.br" },
  { uf: "PE", codigoIbge: 26, nome: "Pernambuco", capital: "Recife", regiao: "Nordeste", tceSigla: "TCE-PE", tceUrl: "https://www.tcepe.tc.br", transparenciaUrl: "https://www.transparencia.pe.gov.br" },
  { uf: "PI", codigoIbge: 22, nome: "Piauí", capital: "Teresina", regiao: "Nordeste", tceSigla: "TCE-PI", tceUrl: "https://www.tcepi.tc.br", transparenciaUrl: "https://transparencia2.pi.gov.br" },
  { uf: "RJ", codigoIbge: 33, nome: "Rio de Janeiro", capital: "Rio de Janeiro", regiao: "Sudeste", tceSigla: "TCE-RJ", tceUrl: "https://www.tcerj.tc.br", transparenciaUrl: "https://www.transparencia.rj.gov.br" },
  { uf: "RN", codigoIbge: 24, nome: "Rio Grande do Norte", capital: "Natal", regiao: "Nordeste", tceSigla: "TCE-RN", tceUrl: "https://www.tce.rn.gov.br", transparenciaUrl: "https://www.transparencia.rn.gov.br" },
  { uf: "RS", codigoIbge: 43, nome: "Rio Grande do Sul", capital: "Porto Alegre", regiao: "Sul", tceSigla: "TCE-RS", tceUrl: "https://portal.tce.rs.gov.br", transparenciaUrl: "https://transparencia.rs.gov.br" },
  { uf: "RO", codigoIbge: 11, nome: "Rondônia", capital: "Porto Velho", regiao: "Norte", tceSigla: "TCE-RO", tceUrl: "https://tcero.tc.br", transparenciaUrl: "https://transparencia.ro.gov.br" },
  { uf: "RR", codigoIbge: 14, nome: "Roraima", capital: "Boa Vista", regiao: "Norte", tceSigla: "TCE-RR", tceUrl: "https://tcerr.tc.br", transparenciaUrl: "https://transparencia.rr.gov.br" },
  { uf: "SC", codigoIbge: 42, nome: "Santa Catarina", capital: "Florianópolis", regiao: "Sul", tceSigla: "TCE-SC", tceUrl: "https://www.tcesc.tc.br", transparenciaUrl: "https://www.transparencia.sc.gov.br" },
  { uf: "SP", codigoIbge: 35, nome: "São Paulo", capital: "São Paulo", regiao: "Sudeste", tceSigla: "TCE-SP", tceUrl: "https://www.tce.sp.gov.br", transparenciaUrl: "https://www.transparencia.sp.gov.br" },
  { uf: "SE", codigoIbge: 28, nome: "Sergipe", capital: "Aracaju", regiao: "Nordeste", tceSigla: "TCE-SE", tceUrl: "https://www.tce.se.gov.br", transparenciaUrl: "https://www.transparencia.se.gov.br" },
  { uf: "TO", codigoIbge: 17, nome: "Tocantins", capital: "Palmas", regiao: "Norte", tceSigla: "TCE-TO", tceUrl: "https://www.tceto.tc.br", transparenciaUrl: "https://www.transparencia.to.gov.br" },
] as const;

export const REGIOES: readonly Regiao[] = [
  "Norte",
  "Nordeste",
  "Centro-Oeste",
  "Sudeste",
  "Sul",
] as const;

const estadoMap = new Map<string, EstadoInfo>(
  ESTADOS_BRASIL.map((e) => [e.uf, e])
);

export function getEstadoPorUf(uf: string): EstadoInfo | undefined {
  return estadoMap.get(uf.toUpperCase());
}

export function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}
