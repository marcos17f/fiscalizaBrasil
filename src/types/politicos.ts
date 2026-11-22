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

export type FolhaAlesp = {
  mes: string;
  nome_folha: string;
  bruto: string;
  tributos: string;
  liquido: string;
  fonte: string;
};

export type EmendaAlesp = {
  codigo?: string;
  codigo_emenda?: string;
  data?: string;
  documento?: string;
  empenho?: string;
  credor?: string;
  cnpj?: string;
  beneficiario_previsto?: string;
  favorecido?: string;
  valor?: string | number;
  valor_destinado?: string;
  finalidade?: string;
  tipo_despesa?: string;
  municipio?: string;
  objeto?: string;
  fonte?: string;
  fonte_url?: string;
  [key: string]: unknown;
};

export type AlespDetalhe = {
  nomeOriginal: string;
  codigoAlesp: string;
  biografia: string;
  fonteIdentidade: string;
  perfilId: string;
  folhas: FolhaAlesp[];
  totalEmendasRegistradas: number;
  emendasAmostra: EmendaAlesp[];
};

export type Senador = {
  codigo: string;
  nome: string;
  nomeCompleto: string;
  partido: string;
  uf: string;
  foto: string;
  paginaOficial: string;
  email: string;
  bloco: string;
  mandatoInicio: string;
  mandatoFim: string;
  titularidade: string;
};

export type EmendaSenador = {
  codigo: string;
  ano: number;
  tipoBadge: string;
  tipoCor?: string;
  tipoOriginal: string;
  valorTotal: number;
  valorPago: number;
  finalidadeOriginal: string;
  finalidadeSimples: string;
  funcao: string;
  dataIndicacao?: string;
  recebedores?: Array<{
    nome: string;
    uf?: string;
    valor?: number;
    status?: string;
    isPendente?: boolean;
  }>;
};

export type AutoriaSenador = {
  codigo: string;
  identificacao: string;
  sigla: string;
  numero: string;
  ano: string;
  ementa: string;
  data: string;
  linkOficial: string;
};

export type VotacaoSenador = {
  codigoSessaoVotacao: string;
  data: string;
  materia: string;
  ementa: string;
  descricaoVotacao: string;
  resultado: string;
  voto: string;
};

export type ComissaoSenador = {
  sigla: string;
  nome: string;
  participacao: string;
  dataInicio: string;
  ativa: boolean;
};

export type DespesaCeapsSenador = {
  id: number;
  ano: number;
  mes: number;
  tipoDespesa: string;
  fornecedor: string;
  data: string;
  detalhamento: string;
  valorReembolsado: number;
};

export type ResumoCeapsSenador = {
  ano: number;
  totalAno: number;
  quantidadeLancamentos: number;
  porCategoria: Array<{ categoria: string; valor: number }>;
  recentes: DespesaCeapsSenador[];
};

export type DeputadoFederal = {
  id: number;
  nome: string;
  partido: string;
  uf: string;
  foto: string;
  email: string;
  idLegislatura: number;
};

export type DespesaCamara = {
  ano: number;
  mes: number;
  tipoDespesa: string;
  nomeFornecedor: string;
  valorLiquido: number;
  valorDocumento: number;
  dataDocumento: string | null;
  urlDocumento: string | null;
};

export type ProposicaoCamara = {
  id: number;
  siglaTipo: string;
  numero: number;
  ano: number;
  ementa: string;
};

export type OrgaoCamara = {
  idOrgao: number;
  siglaOrgao: string;
  nomeOrgao: string;
  titulo: string;
  dataInicio?: string | null;
  dataFim?: string | null;
};

export type EventoCamara = {
  id: number;
  dataHoraInicio: string;
  descricaoTipo: string;
  descricao: string;
  situacao?: string;
  orgaos?: Array<{ sigla?: string; nome?: string }>;
};

export type FrenteCamara = {
  id: number;
  titulo: string;
};

export type VotacaoNominalCamara = {
  idVotacao: string;
  data: string;
  proposicao: string;
  descricao: string;
  voto: string;
  aprovacao: number | null;
};

export type ContratacaoPncp = {
  id: string;
  orgao: string;
  esfera: string;
  uf: string;
  municipio: string | null;
  modalidade: string;
  numeroCompra: string;
  anoCompra: number;
  objeto: string;
  valorEstimado: number | null;
  dataPublicacao: string;
  linkPncp: string;
};

export type IndicadorLrfSiconfi = {
  exercicio: number;
  periodo: number;
  despesaPessoalTotal: number | null;
  percentualRcl: number | null;
  limiteMaximo: number;
  limitePrudencial: number;
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

export type BlocoInstitucional = {
  tipo: "h1" | "h2" | "h3" | "h4" | "p" | "li";
  texto: string;
};

export type PaginaInstitucional = {
  slug: string;
  titulo: string;
  blocos: BlocoInstitucional[];
};

// Tipos de integrações oficiais ao vivo (TSE, SICONFI, ALMG)
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
  fotoUrl: string;
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
  despesaLegislativa: number | null;
  percentualLegislativa: number | null;
  funcoesPrincipais: FuncaoDespesaSiconfi[];
  lrfPessoal?: IndicadorLrfSiconfi | null;
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
