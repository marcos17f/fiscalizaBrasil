# Fiscaliza Brasil — Portal Nacional de Informação e Fiscalização Cidadã

> *"Seu voto escolhe. A informação esclarece. Você fiscaliza."*

Reconstrução completa e modular do portal **Fiscaliza Brasil** em **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4**, com integração ao vivo às principais APIs oficiais de dados públicos do Brasil, design system editorial responsivo (mobile-first) e carregamento sob demanda.

---

## Diagnóstico do Legado vs. Nova Arquitetura

| Indicador | Site Original (WordPress) | Nova Plataforma (Next.js 15) |
| :--- | :--- | :--- |
| **Peso da Home** | **~8,13 MB** (HTML + scripts inline globais da ALESP em todas as páginas) | **~108 kB** First Load JS (`~98,7%` menor) |
| **Carregamento por esfera** | Injeção global no navegador com `if (pathname)` | Sob demanda por UF, município e parlamentar via BFF (`/api/*`) |
| **Emendas de Senadores** | Truncado por limite de tamanho do editor WordPress | Servido via `/api/senadores/[codigo]` com filtros por ano + recebedores |
| **Prefeitos e Vereadores** | Formulário sem base conectada e siglas duplicadas | **5.570 municípios** conectados ao vivo (**IBGE + TSE 2024 + SICONFI + PNCP**) |
| **Manutenibilidade** | Plugins fragmentados e JS duplicado | 100% TypeScript estrito, componentes reutilizáveis (`PerfilAbas`, `PageHero`) |

---

## Cobertura Completa do Portal (15 Páginas + 9 APIs)

### 6 Esferas Políticas
| Rota | Esfera | Fontes Oficiais Integradas |
| :--- | :--- | :--- |
| [`/senadores`](src/app/senadores/page.tsx) | **81 Senadores** | Senado Dados Abertos (autorias, comissões, votações nominais) + **CEAPS** ao vivo + Emendas CGU |
| [`/deputados-federais`](src/app/deputados-federais/page.tsx) | **513 Dep. Federais** | Câmara API v2 ao vivo (perfil, comissões, frentes, projetos, presença, votações, **CEAP**) + CGU |
| [`/dep-estaduais`](src/app/dep-estaduais/page.tsx) | **27 Assembleias (1.067)** | TSE ao vivo (27 UFs) + **ALESP (SP)** (biografia, 12 folhas, emendas) + **ALMG (MG)** (verbas ao vivo) |
| [`/governadores`](src/app/governadores/page.tsx) | **27 Governadores** | TSE (2022/2026 + Plano PDF) + **SICONFI** (RREO + LRF Pessoal) + **PNCP** (editais) + 27 TCEs |
| [`/prefeitos`](src/app/prefeitos/page.tsx) | **5.570 Prefeitos** | IBGE + **TSE 2024** (prefeito, vice, bens, Plano PDF) + **SICONFI** (RREO + LRF) + **PNCP** |
| [`/vereadores`](src/app/vereadores/page.tsx) | **~58 mil Vereadores** | IBGE + **TSE 2024** (lista de eleitos + ficha individual em 8 abas) + **SICONFI** (Função Legislativa) |

### 8 Páginas Institucionais & Participação Cidadã
- `/sobre-o-fiscaliza-brasil` — Missão, independência editorial e pilares.
- `/politica-explicada` — Guia visual dos 3 níveis de governo e 6 cargos + índice lateral.
- `/participe` — 4 canais interativos (**Documentos & Links**, **Fotos de Obras**, **Vídeos & Relatos**, **Sugestões**) com upload real (até 5 arquivos, 10 MB/cada) e geração de protocolo.
- `/denuncias` — Canal de relatos de interesse público com orientação LGPD, link Fala.BR/CGU, upload de evidências e protocolo imediato.
- `/quem-apoia-o-fiscaliza-brasil` — Modalidades de apoio cidadão independente.
- `/quem-patrocina-o-fiscaliza-brasil` — Regras de patrocínio institucional e blindagem editorial.
- `/contato` — Atendimento, correção de dados com fonte oficial e imprensa.
- `/privacidade` — Política de Privacidade completa (LGPD — Lei nº 13.709/2018).

---

## Como Rodar Localmente

**Pré-requisitos:** Node.js 20+ e npm 10+.

```bash
# 1. Instalar dependências
npm install

# 2. Subir em modo desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Comandos de Verificação

```bash
# Verificação estrita de tipos TypeScript
npm run typecheck

# Build otimizado de produção
npm run build

# Executar build de produção localmente
npm run start
```

---

## Documentação Técnica Completa

Toda a documentação de engenharia, contratos de API e guia de produção está organizada em `docs/`:

- **[docs/ARQUITETURA.md](docs/ARQUITETURA.md)** — Diagramas de arquitetura, ADRs (decisões técnicas), estrutura de pastas, estratégia de cache e Design System responsivo.
- **[docs/FONTES-E-APIS.md](docs/FONTES-E-APIS.md)** — Catálogo completo das 9 APIs internas (`/api/*`), endpoints governamentais oficiais consumidos, limitações reais e mapa de cobertura.
- **[docs/PRODUCAO-E-DEPLOY.md](docs/PRODUCAO-E-DEPLOY.md)** — Roadmap de produção (PostgreSQL, ETL TSE/SICONFI, Storage S3/R2, chave CGU), segurança, LGPD e deploy na Vercel.
