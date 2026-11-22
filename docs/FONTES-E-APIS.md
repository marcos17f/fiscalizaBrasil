# Catálogo de Fontes Oficiais & APIs Internas — Fiscaliza Brasil

Este documento especifica todos os endpoints internos da aplicação (`/api/*`) e todas as fontes governamentais oficiais conectadas, incluindo nuances técnicas e limitações conhecidas.

---

## 1. Contratos das APIs Internas (Route Handlers)

Todas as rotas `GET` abaixo retornam `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` e validam parâmetros na entrada (retornando `400` ou `404` sem expor stack trace).

### 1.1 `GET /api/senadores/[codigo]`
Retorna ficha enriquecida do senador.
- **Fontes:** `senadores.json` + `senadores-emendas.json` + Senado Dados Abertos (`autorias`, `votacoes`, `comissoes`) + `CEAPS` (`2026` com fallback `2025`).
- **Payload:**
  ```json
  {
    "senador": { "codigo": "3830", "nome": "Davi Alcolumbre", "uf": "AP", "partido": "UNIÃO" },
    "resumoEmendas": { "quantidade": 23, "totalIndicado": 420000000, "totalPago": 310703950.48 },
    "emendas": [],
    "autorias": [],
    "votacoes": [],
    "comissoes": [],
    "ceaps": { "ano": 2026, "totalAno": 232000, "quantidadeLancamentos": 45, "porCategoria": [], "recentes": [] }
  }
  ```

### 1.2 `GET /api/camara/deputados/[id]`
Retorna ficha ao vivo do deputado federal na 57ª Legislatura.
- **Fontes:** Câmara API v2 (`/deputados/{id}`, `/despesas`, `/proposicoes`, `/orgaos`, `/eventos`, `/frentes`, `/votacoes` de Plenário).
- **Payload:** `{ perfil, despesas, totalDespesasRecentes, proposicoes, orgaos, eventos, frentes, votacoesNominais }`.

### 1.3 `GET /api/dep-estaduais/[uf]`
Retorna a bancada estadual da UF (ou detalhe ALESP quando `?nome=` é informado em SP).
- **Fontes:** `assembleias.json` + `deputados-estaduais.json` + `alesp-detalhes.json`.

### 1.4 `GET /api/dep-estaduais/[uf]/perfil?nome={nome}`
Retorna o perfil enriquecido sob demanda de um deputado estadual ou distrital.
- **Fontes:**
  - **27 UFs:** TSE DivulgaCandContas (cargo `7` para Estadual, cargo `8` para Distrital/DF; tenta 2022 e fallback 2026).
  - **SP:** `alesp-detalhes.json` (biografia oficial, 12 folhas salariais e amostra de emendas Sefaz-SP).
  - **MG:** API Dados Abertos ALMG (gabinete e verbas indenizatórias da competência mais recente).

### 1.5 `GET /api/governadores/[uf]?nome={nome}`
Retorna o perfil consolidado do governador e das finanças estaduais.
- **Fontes:** TSE (Eleições Gerais 2022 e 2026, cargo `3`) + SICONFI (`RREO-Anexo 01`, `RREO-Anexo 02`, `RGF-Anexo 01` LRF pelo código IBGE da UF) + PNCP (`esferaId=E`, últimos 35 dias).

### 1.6 `GET /api/prefeitos?uf={UF}&ibge={codigoIbge}&cidade={nome}`
Retorna o perfil consolidado da prefeitura em qualquer um dos **5.570 municípios**.
- **Fontes:** TSE 2024 (cargo `11`, eleição `2045202024`, prefeito + vice + bens + Plano PDF) + SICONFI (`RREO-Anexo 01`, `RREO-Anexo 02`, `RGF-Anexo 01` LRF) + PNCP (`codigoMunicipioIbge`, priorizando `esferaId=M`).

### 1.7 `GET /api/vereadores?uf={UF}&cidade={nome}&ibge={codigoIbge}`
Retorna a bancada eleita da Câmara Municipal + custo global da função Legislativa.
- **Fontes:** TSE 2024 (cargo `13`, filtrado estritamente por `descricaoTotalizacao.startsWith("eleit")`) + SICONFI (`RREO-Anexo 02`, conta `Legislativa`).

### 1.8 `GET /api/tse/candidato?ano={ano}&ue={ue}&eleicao={idEleicao}&id={idCandidato}`
Proxy server-side para carregar sob demanda o detalhe completo de qualquer candidato (usado ao abrir o modal de um vereador).

### 1.9 `POST /api/contato`
Recebe formulários de `/participe`, `/denuncias` e `/contato` e retorna protocolo (`FB-YYYY-XXXXXX`).
- **Formatos aceitos:** `application/json` e `multipart/form-data`.
- **Regras de segurança de upload:**
  - Máximo de **5 arquivos** por envio.
  - Limite de **10 MB** por arquivo.
  - Extensões permitidas (allowlist): `pdf, doc, docx, xls, xlsx, csv, txt, jpg, jpeg, png, webp, mp4, mov, webm`.
  - Validação de URL (`http://` ou `https://`), e-mail, comprimento mínimo da mensagem e aceite explícito LGPD.

---

## 2. Fontes Governamentais Oficiais — Detalhes Técnicos & Cuidados

| Fonte | URL Base | Autenticação | Cuidados Técnicos Descobertos nos Testes |
| :--- | :--- | :--- | :--- |
| **TSE DivulgaCandContas** | `https://divulgacandcontas.tse.jus.br/divulga/rest/v1` | Livre | Bloqueia CORS e retorna `403` para `User-Agent` não padrão; sempre consumir via BFF com `User-Agent` de navegador. Filtrar eleitos por `^eleit` (nunca `includes("eleit")`, pois casa `"Não eleito"`). IDs de eleição: `2040602022` (2022), `2045202024` (2024), `20322002026` (2026). |
| **SICONFI (Tesouro Nacional)** | `https://apidatalake.tesouro.gov.br/ords/siconfi/tt` | Livre | Respeitar ~1 req/s por IP; usar código IBGE de 2 dígitos para UF e 7 dígitos para município. No `RREO-Anexo 02`, filtrar apenas as 28 funções oficiais de 1º nível (Portaria MOG nº 42/1999) para não somar subfunções `FUxx`. |
| **Senado Federal (Legis)** | `https://legis.senado.leg.br/dadosabertos` | Livre | Campos XML-to-JSON podem retornar objeto único ou array quando há 1 item — sempre normalizar com `toArray()`. |
| **Senado Federal (CEAPS)** | `https://adm.senado.gov.br/adm-dadosabertos/api/v1` | Livre | Endpoint anual retorna todos os 81 senadores (~9 MB); mantemos cache em memória indexado por `codSenador` (TTL 1h) com deduplicação de requisições em voo (`promiseCeapsEmVoo`). |
| **Câmara dos Deputados** | `https://dadosabertos.camara.leg.br/api/v2` | Livre | Votações nominais exigem checar `/votacoes/{id}/votos` (votações simbólicas retornam array vazio); mantemos cache global das últimas votações nominais em Plenário (`idOrgao=180`). |
| **PNCP (Licitações)** | `https://pncp.gov.br/api/consulta/v1` | Livre | Datas exigem formato `yyyyMMdd`; quando sem resultados retorna HTTP `204 No Content` (tratar antes de `.json()`). Limite máximo `tamanhoPagina=50`. |
| **IBGE Localidades** | `https://servicodados.ibge.gov.br/api/v1/localidades` | Livre | CORS habilitado; cache em memória por UF no cliente. |
| **ALMG (Minas Gerais)** | `https://dadosabertos.almg.gov.br/ws` | Livre | JSON limpo e rápido (`?formato=json`) para deputados e verbas indenizatórias mensais. |

---

## 3. Limitações Reais do Ecossistema Público Brasileiro (Transparência de Escopo)

1. **Assembleias Legislativas (27 UFs):** não existe API nacional unificada para projetos, votações nominais e verbas estaduais. Hoje **SP (ALESP)** e **MG (ALMG)** possuem dados estaduais detalhados integrados; as demais 25 Casas exigem conectores individuais (ou curadoria editorial) além do TSE já integrado.
2. **Câmaras Municipais (5.570 cidades):** não existe base nacional de projetos, presença ou votações nominais para os ~58 mil vereadores. O portal cobre 100% dos municípios com **TSE 2024** + **orçamento da Função Legislativa no SICONFI** + links oficiais dos TCEs.
3. **Emendas Federais por Autor (CGU):** a API detalhada do Portal da Transparência exige chave gratuita cadastrada por e-mail; no protótipo fornecemos o link filtrado por autor/localidade e a estrutura pronta para consumo autenticado em produção.
