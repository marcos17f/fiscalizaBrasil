import type { AbaPerfil } from "@/types/politicos";

export const ABAS_SENADOR: readonly AbaPerfil[] = [
  {
    id: "trajetoria",
    numero: 1,
    titulo: "Trajetória",
    explicacao:
      "Identificação parlamentar, partido, bloco, período do mandato no Senado Federal, titularidade e canais oficiais de contato.",
    fonteSugerida: "Senado Federal — Dados Abertos",
  },
  {
    id: "emendas",
    numero: 2,
    titulo: "Emendas Parlamentares",
    explicacao:
      "Recursos indicados pelo senador desde 2019 com tradução em linguagem simples, valor total, valor pago, área (função) e recebedores.",
    fonteSugerida: "Portal da Transparência (CGU) — Emendas Parlamentares",
  },
  {
    id: "projetos",
    numero: 3,
    titulo: "Projetos & Atuação",
    explicacao:
      "Proposições legislativas, relatorias e participação em comissões permanentes ou CPIs no Senado Federal.",
    fonteSugerida: "Senado Federal — Atividade Legislativa",
  },
  {
    id: "votacoes",
    numero: 4,
    titulo: "Como Vota",
    explicacao:
      "Votações nominais em plenário no Senado Federal com registro de voto (Sim, Não, Abstenção ou Obstrução).",
    fonteSugerida: "Senado Federal — Votações Nominais",
  },
  {
    id: "custos",
    numero: 5,
    titulo: "Cota & Benefícios",
    explicacao:
      "CEAPS (Cota para Exercício da Atividade Parlamentar), subsídio, auxílio-moradia e estrutura de gabinete.",
    fonteSugerida: "Portal da Transparência do Senado Federal",
  },
  {
    id: "controle",
    numero: 6,
    titulo: "Fiscalização & Contato",
    explicacao:
      "Acesso direto à página oficial no Senado, e-mail de gabinete, Alô Senado e pedido via Lei de Acesso à Informação (LAI).",
    fonteSugerida: "Senado Federal / e-Cidadania",
  },
];

export const ABAS_DEPUTADO_FEDERAL: readonly AbaPerfil[] = [
  {
    id: "trajetoria",
    numero: 1,
    titulo: "Trajetória",
    explicacao:
      "Dados oficiais do parlamentar na 57ª Legislatura (01/02/2023 a 31/01/2027), partido, estado, gabinete e contato.",
    fonteSugerida: "Câmara dos Deputados — Dados Abertos API v2",
  },
  {
    id: "projetos",
    numero: 2,
    titulo: "Projetos",
    explicacao:
      "Projetos de lei e proposições de autoria do deputado conferidos diretamente na API oficial da Câmara dos Deputados.",
    fonteSugerida: "Câmara dos Deputados — /api/v2/proposicoes",
  },
  {
    id: "votacoes",
    numero: 3,
    titulo: "Votações",
    explicacao:
      "Apenas votações nominais do Plenário em que o voto individual é registrado (Sim, Não, Abstenção ou Obstrução).",
    fonteSugerida: "Câmara dos Deputados — /api/v2/votacoes",
  },
  {
    id: "presenca",
    numero: 4,
    titulo: "Presença",
    explicacao:
      "Participação em sessões deliberativas do Plenário e reuniões de comissões permanentes da Câmara.",
    fonteSugerida: "Câmara dos Deputados — Registro de Frequência",
  },
  {
    id: "gastos",
    numero: 5,
    titulo: "Salário e Gastos",
    explicacao:
      "Despesas reembolsadas pela Cota Parlamentar (CEAP) com fornecedor, categoria, data, valor líquido e nota fiscal oficial.",
    fonteSugerida: "Câmara dos Deputados — /api/v2/deputados/{id}/despesas",
  },
  {
    id: "emendas",
    numero: 6,
    titulo: "Emendas",
    explicacao:
      "Emendas individuais e de bancada destinadas pelo parlamentar com valores empenhados e pagos conforme CGU.",
    fonteSugerida: "Portal da Transparência (CGU) / Transferegov",
  },
];

export const ABAS_GOVERNADOR: readonly AbaPerfil[] = [
  {
    id: "trajetoria",
    numero: 1,
    titulo: "Trajetória",
    explicacao:
      "Biografia, formação, partido, eleição, posse, vice-governador e contatos institucionais. A identificação exibida no cabeçalho pertence ao cadastro e passa por conferência em fonte oficial.",
    fonteSugerida: "TSE DivulgaCandContas e Portal Oficial do Governo Estadual",
  },
  {
    id: "o-que-faz",
    numero: 2,
    titulo: "O que faz",
    explicacao:
      "Programas, obras e serviços devem informar local, prazo, orçamento e situação da execução. Anúncio, contratação e entrega são etapas diferentes.",
    fonteSugerida: "Portal da Transparência Estadual e Plano Plurianual (PPA)",
  },
  {
    id: "decisoes",
    numero: 3,
    titulo: "Decisões",
    explicacao:
      "Sanções, vetos e decretos devem ter número oficial, data e documento de origem, explicando os efeitos para a população e para as contas públicas.",
    fonteSugerida: "Diário Oficial do Estado e Casa Civil",
  },
  {
    id: "emendas",
    numero: 4,
    titulo: "Mapa das Emendas / Recursos",
    explicacao:
      "Repasses recebidos da União e enviados aos municípios separados por origem, destino e fase da despesa.",
    fonteSugerida: "Portal da Transparência Federal (CGU) e Transferegov",
  },
  {
    id: "custos",
    numero: 5,
    titulo: "Quanto custa & Benefícios",
    explicacao:
      "O subsídio e as despesas pessoais do governador separados das despesas gerais da administração. Previsto, empenhado, liquidado e pago são fases distintas.",
    fonteSugerida: "SICONFI / Tesouro Nacional e Portal da Transparência Estadual",
  },
  {
    id: "agenda",
    numero: 6,
    titulo: "Presença / Agenda",
    explicacao:
      "Compromissos públicos, audiências, viagens e substituições pelo vice apresentados com data e fonte da agenda oficial.",
    fonteSugerida: "Agenda Oficial do Palácio do Governo",
  },
  {
    id: "eleicoes",
    numero: 7,
    titulo: "Eleições",
    explicacao:
      "Chapa, vice, votos, bens declarados e contas de campanha apresentados por eleição, conforme registros da Justiça Eleitoral.",
    fonteSugerida: "Dados Abertos do TSE (Tribunal Superior Eleitoral)",
  },
  {
    id: "controle",
    numero: 8,
    titulo: "Fiscalização e Controle",
    explicacao:
      "Contas anuais do governo, relatórios fiscais e auditorias com órgão, exercício e situação. Parecer prévio do TCE e julgamento pela Assembleia são atos distintos.",
    fonteSugerida: "Tribunal de Contas do Estado (TCE) e Assembleia Legislativa",
  },
];

export const ABAS_DEPUTADO_ESTADUAL: readonly AbaPerfil[] = [
  {
    id: "trajetoria",
    numero: 1,
    titulo: "Trajetória",
    explicacao:
      "Partido, biografia oficial da Assembleia, base eleitoral, mandatos anteriores e link de identificação no TSE.",
    fonteSugerida: "Portal da Assembleia Legislativa e TSE",
  },
  {
    id: "o-que-faz",
    numero: 2,
    titulo: "O que faz",
    explicacao:
      "Projetos de lei, requerimentos, indicações e comissões permanentes ou temporárias em que o parlamentar atua.",
    fonteSugerida: "Sistema de Processo Legislativo da Assembleia",
  },
  {
    id: "como-vota",
    numero: 3,
    titulo: "Como vota",
    explicacao:
      "Registro nominal de votos em plenário com data, ementa simplificada e resultado da votação.",
    fonteSugerida: "Atas e Votações Nominais da Assembleia Legislativa",
  },
  {
    id: "emendas",
    numero: 4,
    titulo: "Mapa das Emendas",
    explicacao:
      "Destinação de emendas parlamentares por município, área (saúde, educação, infraestrutura) e estágio de execução.",
    fonteSugerida: "Portal da Transparência Estadual / Secretaria da Fazenda",
  },
  {
    id: "custos",
    numero: 5,
    titulo: "Quanto custa & Benefícios",
    explicacao:
      "Subsídio mensal publicado na folha da Assembleia (bruto, tributos e líquido) e verba indenizatória de gabinete.",
    fonteSugerida: "Folha de Pagamento Oficial da Assembleia Legislativa",
  },
  {
    id: "presenca",
    numero: 6,
    titulo: "Presença",
    explicacao:
      "Frequência em sessões plenárias e reuniões de comissões, distinguindo faltas justificadas e não justificadas.",
    fonteSugerida: "Registro de Frequência da Assembleia Legislativa",
  },
  {
    id: "eleicoes",
    numero: 7,
    titulo: "Eleições",
    explicacao:
      "Votação obtida, bens declarados, financiamento de campanha e prestação de contas eleitorais.",
    fonteSugerida: "Dados Abertos do TSE",
  },
  {
    id: "controle",
    numero: 8,
    titulo: "Fiscalização e controle",
    explicacao:
      "Links diretos para ouvidoria, pedido de acesso à informação (LAI) e acompanhamento oficial.",
    fonteSugerida: "e-SIC / Ouvidoria da Assembleia",
  },
];

export const ABAS_PREFEITO: readonly AbaPerfil[] = [
  {
    id: "trajetoria",
    numero: 1,
    titulo: "Trajetória & Mandato",
    explicacao:
      "Prefeito(a), vice-prefeito(a), partido, coligação, data de posse e canais oficiais da Prefeitura.",
    fonteSugerida: "TSE Eleições Municipais e Portal da Prefeitura",
  },
  {
    id: "projetos",
    numero: 2,
    titulo: "Projetos & Gestão",
    explicacao:
      "Obras públicas, entregas de gestão, convênios e metas do plano de governo registrado no TSE.",
    fonteSugerida: "TSE (Plano de Governo) e Portal da Transparência Municipal",
  },
  {
    id: "sancoes",
    numero: 3,
    titulo: "Sanções & Vetos",
    explicacao:
      "Leis sancionadas, vetos e decretos municipais relevantes publicados no Diário Oficial.",
    fonteSugerida: "Diário Oficial do Município",
  },
  {
    id: "emendas",
    numero: 4,
    titulo: "Emendas Recebidas",
    explicacao:
      "Recursos recebidos via emendas federais e estaduais com valor empenhado e pago.",
    fonteSugerida: "Portal da Transparência (CGU) e Transferegov",
  },
  {
    id: "financas",
    numero: 5,
    titulo: "Arrecadação, Gastos & Caixa",
    explicacao:
      "Receitas, despesas por função (saúde, educação, obras) e limites da Lei de Responsabilidade Fiscal.",
    fonteSugerida: "SICONFI (Tesouro Nacional) e Portal da Transparência Municipal",
  },
  {
    id: "agenda",
    numero: 6,
    titulo: "Agenda & Missões",
    explicacao:
      "Compromissos oficiais, viagens e substituições documentadas em fonte pública.",
    fonteSugerida: "Gabinete do Prefeito",
  },
  {
    id: "eleicoes",
    numero: 7,
    titulo: "Eleições & TCE/TCM",
    explicacao:
      "Resultado eleitoral, declaração de bens, prestação de contas de campanha e pareceres do Tribunal de Contas.",
    fonteSugerida: "TSE e Tribunal de Contas (TCE/TCM)",
  },
  {
    id: "fiscalizacao",
    numero: 8,
    titulo: "Fiscalização & Contato",
    explicacao:
      "Ouvidoria municipal, e-SIC (LAI), Ministério Público e Tribunal de Contas do Estado.",
    fonteSugerida: "Ouvidoria Municipal e Fala.BR",
  },
];

export const ABAS_VEREADOR: readonly AbaPerfil[] = [
  {
    id: "trajetoria",
    numero: 1,
    titulo: "Trajetória",
    explicacao:
      "Identificação parlamentar, partido, coligação, escolaridade, ocupação e situação eleitoral nas Eleições Municipais 2024.",
    fonteSugerida: "TSE DivulgaCandContas e Câmara Municipal",
  },
  {
    id: "projetos",
    numero: 2,
    titulo: "Projetos & Leis",
    explicacao:
      "Projetos de lei ordinária, requerimentos, indicações e moções apresentados na Câmara Municipal.",
    fonteSugerida: "SAPL / Portal Legislativo da Câmara Municipal",
  },
  {
    id: "votacoes",
    numero: 3,
    titulo: "Como Vota",
    explicacao:
      "Votações nominais em sessões plenárias municipais sobre orçamento (LOA/LDO), IPTU, plano diretor e leis locais.",
    fonteSugerida: "Atas e Sessões Plenárias da Câmara Municipal",
  },
  {
    id: "emendas",
    numero: 4,
    titulo: "Emendas Impositivas",
    explicacao:
      "Recursos indicados pelo vereador no orçamento municipal para saúde, educação, bairros e entidades locais.",
    fonteSugerida: "Portal da Transparência Municipal",
  },
  {
    id: "custos",
    numero: 5,
    titulo: "Subsídio & Gabinete",
    explicacao:
      "Remuneração mensal, diárias, verbas de gabinete e equipe de assessores conforme transparência da Câmara.",
    fonteSugerida: "Portal da Transparência da Câmara Municipal",
  },
  {
    id: "presenca",
    numero: 6,
    titulo: "Presença",
    explicacao:
      "Frequência em sessões ordinárias, extraordinárias e reuniões de comissões permanentes.",
    fonteSugerida: "Registro de Presença da Câmara Municipal",
  },
  {
    id: "eleicoes",
    numero: 7,
    titulo: "Eleições & Bens (TSE)",
    explicacao:
      "Declaração de bens, gastos de campanha, histórico de candidaturas e link oficial na Justiça Eleitoral.",
    fonteSugerida: "TSE DivulgaCandContas (2024)",
  },
  {
    id: "controle",
    numero: 8,
    titulo: "Fiscalização & Controle",
    explicacao:
      "Canais oficiais para acompanhar contas públicas no Tribunal de Contas (TCE/TCM) e pedidos de acesso à informação (LAI).",
    fonteSugerida: "Tribunal de Contas (TCE/TCM) e Fala.BR",
  },
];
