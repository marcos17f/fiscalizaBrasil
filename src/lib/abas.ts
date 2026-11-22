import type { AbaPerfil } from "@/types/politicos";

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
    fonteSugerida: "TSE (Plano de Governo), Portal da Transparência Estadual e PPA",
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
    fonteSugerida: "SICONFI (Transferências Correntes), Portal da Transparência (CGU) e Transferegov",
  },
  {
    id: "custos",
    numero: 5,
    titulo: "Quanto custa & Finanças",
    explicacao:
      "O subsídio e as despesas pessoais do governador separados das despesas gerais da administração. Previsto, empenhado, liquidado e pago são fases distintas.",
    fonteSugerida: "SICONFI / Tesouro Nacional (RREO ao vivo) e Portal da Transparência Estadual",
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
      "Chapa, vice, bens declarados, histórico de candidaturas e contas de campanha apresentados por eleição, conforme registros da Justiça Eleitoral.",
    fonteSugerida: "TSE DivulgaCandContas (API oficial ao vivo)",
  },
  {
    id: "controle",
    numero: 8,
    titulo: "Fiscalização e Controle",
    explicacao:
      "Contas anuais do governo, relatórios fiscais e auditorias com órgão, exercício e situação. Parecer prévio do TCE e julgamento pela Assembleia são atos distintos.",
    fonteSugerida: "Tribunal de Contas do Estado (TCE), Portal da Transparência e Fala.BR",
  },
];

export const ABAS_DEPUTADO_ESTADUAL: readonly AbaPerfil[] = [
  {
    id: "trajetoria",
    numero: 1,
    titulo: "Trajetória",
    explicacao:
      "Partido, base eleitoral, mandatos anteriores, formação e dados oficiais de gabinete na Assembleia Legislativa.",
    fonteSugerida: "TSE DivulgaCandContas e Portal da Assembleia Legislativa",
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
      "Subsídio mensal, verba indenizatória de gabinete e quadro de assessores conforme transparência da Casa.",
    fonteSugerida: "Portal da Transparência da Assembleia Legislativa (ALMG ao vivo)",
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
      "Situação eleitoral, bens declarados, histórico de candidaturas e teto de gastos de campanha.",
    fonteSugerida: "TSE DivulgaCandContas (API oficial ao vivo)",
  },
  {
    id: "controle",
    numero: 8,
    titulo: "Fiscalização e controle",
    explicacao:
      "Links diretos para ouvidoria, pedido de acesso à informação (LAI), Tribunal de Contas e acompanhamento oficial.",
    fonteSugerida: "Assembleia Legislativa, TCE Estadual e Fala.BR",
  },
];

export const ABAS_PREFEITO: readonly AbaPerfil[] = [
  {
    id: "trajetoria",
    numero: 1,
    titulo: "Trajetória & Mandato",
    explicacao:
      "Prefeito(a), vice-prefeito(a), partido, coligação, formação e canais oficiais registrados na Justiça Eleitoral.",
    fonteSugerida: "TSE DivulgaCandContas (Eleições 2024 ao vivo)",
  },
  {
    id: "projetos",
    numero: 2,
    titulo: "Projetos & Gestão",
    explicacao:
      "Plano de governo oficial registrado no TSE, obras públicas, entregas de gestão e convênios municipais.",
    fonteSugerida: "TSE (Plano de Governo PDF) e Portal da Transparência Municipal",
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
    titulo: "Emendas & Repasses",
    explicacao:
      "Recursos recebidos via transferências correntes, emendas federais e estaduais com valor empenhado e pago.",
    fonteSugerida: "SICONFI (Tesouro Nacional ao vivo) e Portal da Transparência (CGU)",
  },
  {
    id: "financas",
    numero: 5,
    titulo: "Arrecadação, Gastos & Caixa",
    explicacao:
      "Receitas realizadas, despesas empenhadas, liquidadas e pagas e distribuição por função (Saúde, Educação, Urbanismo).",
    fonteSugerida: "SICONFI / Tesouro Nacional (RREO ao vivo)",
  },
  {
    id: "agenda",
    numero: 6,
    titulo: "Agenda & Missões",
    explicacao:
      "Compromissos oficiais, viagens e substituições documentadas em fonte pública.",
    fonteSugerida: "Gabinete do Prefeito / Portal da Prefeitura",
  },
  {
    id: "eleicoes",
    numero: 7,
    titulo: "Eleições & Bens",
    explicacao:
      "Resultado eleitoral 2024, declaração de bens, teto de campanha, histórico eleitoral e prestação de contas.",
    fonteSugerida: "TSE DivulgaCandContas (API oficial ao vivo)",
  },
  {
    id: "fiscalizacao",
    numero: 8,
    titulo: "Fiscalização & Contato",
    explicacao:
      "Ouvidoria municipal, e-SIC (LAI), Portal da Transparência Federal e Tribunal de Contas do Estado.",
    fonteSugerida: "TCE/TCM Estadual, Portal da Transparência (CGU) e Fala.BR",
  },
];

export const ABAS_VEREADOR: readonly AbaPerfil[] = [
  {
    id: "trajetoria",
    numero: 1,
    titulo: "Trajetória",
    explicacao:
      "Nome completo, partido, coligação, formação, ocupação profissional, reeleição e canais oficiais registrados no TSE.",
    fonteSugerida: "TSE DivulgaCandContas (Eleições 2024 ao vivo)",
  },
  {
    id: "o-que-faz",
    numero: 2,
    titulo: "O que faz",
    explicacao:
      "Projetos de lei municipal, requerimentos, indicações de melhorias de bairro e atuação em comissões da Câmara.",
    fonteSugerida: "SAPL / Portal da Câmara Municipal",
  },
  {
    id: "como-vota",
    numero: 3,
    titulo: "Como vota",
    explicacao:
      "Posicionamento em votações nominais relevantes na Câmara (orçamento, impostos, plano diretor e vetos do prefeito).",
    fonteSugerida: "Atas e Sessões da Câmara Municipal",
  },
  {
    id: "emendas",
    numero: 4,
    titulo: "Emendas Impositivas",
    explicacao:
      "Destinação de emendas impositivas municipais (quando previstas na Lei Orgânica) por área e entidade beneficiada.",
    fonteSugerida: "Portal da Transparência Municipal / Câmara Municipal",
  },
  {
    id: "custos",
    numero: 5,
    titulo: "Quanto custa & Gabinete",
    explicacao:
      "Subsídio mensal do vereador, verba de gabinete, diárias e quadro de assessores parlamentares.",
    fonteSugerida: "Portal da Transparência da Câmara Municipal e TCE",
  },
  {
    id: "presenca",
    numero: 6,
    titulo: "Presença",
    explicacao:
      "Frequência nas sessões ordinárias, extraordinárias e audiências públicas da Câmara Municipal.",
    fonteSugerida: "Folha de Presença da Câmara Municipal",
  },
  {
    id: "eleicoes",
    numero: 7,
    titulo: "Eleições & Bens",
    explicacao:
      "Tipo de eleição (QP ou média), bens declarados à Justiça Eleitoral, histórico de candidaturas e contas de campanha.",
    fonteSugerida: "TSE DivulgaCandContas (API oficial ao vivo)",
  },
  {
    id: "controle",
    numero: 8,
    titulo: "Fiscalização e Controle",
    explicacao:
      "Links diretos para conferir a prestação de contas no TSE, Tribunal de Contas do Estado e pedidos de informação (LAI).",
    fonteSugerida: "TSE DivulgaCandContas, TCE Estadual e Fala.BR",
  },
];
