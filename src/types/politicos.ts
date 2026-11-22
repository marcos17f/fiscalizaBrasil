export type Regiao = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";

export type EstadoInfo = {
  uf: string;
  codigoIbge: number;
  nome: string;
  capital: string;
  regiao: Regiao;
  tceSigla: string;
  tceUrl: string;
  transparenciaUrl: string;
};

export type Governador = {
  nome: string;
  uf: string;
  partido: string;
  de: string;
  ate: string;
  status: string;
  obs: string;
  foto: string;
  estado: string;
  local: string;
  email: string;
  tel: string;
};

export type Assembleia = {
  uf: string;
  nome: string;
  sigla: string;
  vagas: number;
  portal: string;
};

export type DeputadoEstadual = {
  nome: string;
  partido: string;
  municipio?: string;
};

export type MunicipioIBGE = {
  id: number;
  nome: string;
};

export type AbaPerfil = {
  id: string;
  numero: number;
  titulo: string;
  explicacao: string;
  fonteSugerida: string;
};

export type BemDeclaradoTSE = {
  ordem: number;
  tipo: string;
  descricao: string;
  valor: number;
};

export type ViceTSE = {
  nomeUrna: string;
  nomeCompleto: string;
  partido: string;
  fotoUrl: string | null;
};

export type EleicaoAnteriorTSE = {
  ano: number;
  cargo: string;
  partido: string;
  situacaoTotalizacao: string;
  local: string;
};

export type PerfilTSE = {
  id: number;
  ano: number;
  eleicaoId: number;
  ueCodigo: string;
  nomeUrna: string;
  nomeCompleto: string;
  numero: number;
  cargo: string;
  partidoSigla: string;
  partidoNome: string | null;
  coligacao: string | null;
  composicaoColigacao: string | null;
  situacaoCandidatura: string | null;
  totalizacao: string | null;
  reeleicao: boolean;
  fotoUrl: string | null;
  ocupacao: string | null;
  grauInstrucao: string | null;
  dataNascimento: string | null;
  naturalidade: string | null;
  totalDeBens: number;
  bens: BemDeclaradoTSE[];
  vices: ViceTSE[];
  sites: string[];
  gastoCampanha1T: number | null;
  planoDeGovernoUrl: string | null;
  eleicoesAnteriores: EleicaoAnteriorTSE[];
  linkOficialTse: string;
};

export type VereadorEleitoTSE = {
  id: number;
  ano: number;
  eleicaoId: number;
  ueCodigo: string;
  nomeUrna: string;
  nomeCompleto: string;
  numero: number;
  partidoSigla: string;
  coligacao: string | null;
  totalizacao: string;
  reeleicao: boolean;
  fotoUrl: string;
};

export type FuncaoDespesaSiconfi = {
  funcao: string;
  empenhado: number;
  liquidado: number;
  percentual: number;
};

export type ResumoFiscalSiconfi = {
  idEnte: number;
  instituicao: string;
  uf: string;
  esfera: "E" | "M";
  exercicio: number;
  periodo: number;
  populacao: number | null;
  receitaPrevistaAtualizada: number | null;
  receitaRealizada: number | null;
  receitaPercentual: number | null;
  receitaTributaria: number | null;
  transferenciasCorrentes: number | null;
  despesaDotacaoAtualizada: number | null;
  despesaEmpenhada: number | null;
  despesaLiquidada: number | null;
  despesaPaga: number | null;
  funcoesPrincipais: FuncaoDespesaSiconfi[];
};

export type ItemVerbaAlmg = {
  categoria: string;
  valor: number;
};

export type DadosAlmgDeputado = {
  idAlmg: number;
  nome: string;
  situacao: string;
  atividadeProfissional: string | null;
  email: string | null;
  naturalidade: string | null;
  mesReferenciaVerba: string | null;
  totalVerbaMes: number | null;
  itensVerba: ItemVerbaAlmg[];
  portalUrl: string;
};
