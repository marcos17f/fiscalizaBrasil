# Fiscaliza Brasil — Portal Completo em Next.js 15 + TypeScript

Reconstrução completa de `fiscalizabrasil.org` em **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4**, eliminando o gargalo original de ~8 MB de scripts inline por página e integrando **todas as 6 esferas políticas + 8 páginas institucionais** com carregamento sob demanda.

## Cobertura Completa do Portal

### 6 Esferas Políticas
1. **Senadores (`/senadores`)**: 81 senadores em exercício + histórico de emendas parlamentares traduzidas em linguagem simples (`/api/senadores/[codigo]`), com recebedores, status de pagamento e canais de fiscalização.
2. **Deputados Federais (`/deputados-federais`)**: 513 deputados em exercício integrados ao vivo à **API v2 da Câmara** (`/api/camara/deputados/[id]`) — perfil, comissões, projetos de lei, presença em eventos/sessões e despesas CEAP.
3. **Deputados Estaduais (`/dep-estaduais`)**: 27 Assembleias Legislativas (1.067 parlamentares) carregadas sob demanda por UF, combinando **TSE ao vivo** + **Folhas, Biografias e Emendas da ALESP (SP)** + **Verbas Indenizatórias ao vivo da ALMG (MG)**.
4. **Governadores (`/governadores`)**: 27 governadores com **TSE ao vivo (2022/2026)**, vice, bens, Plano de Governo PDF, **Balanço Orçamentário SICONFI (RREO)** e links dos 27 TCEs.
5. **Prefeitos (`/prefeitos`)**: todos os **5.570 municípios** via **IBGE + TSE 2024** (prefeito, vice, bens declarados, histórico e Plano de Governo PDF) + **SICONFI RREO** (receitas, empenhado/liquidado/pago e top áreas).
6. **Vereadores (`/vereadores`)**: todos os **~58 mil vereadores eleitos (TSE 2024)** consultados sob demanda por estado e município, com perfil completo em 8 abas.

### 8 Páginas Institucionais & Participação
- `/sobre-o-fiscaliza-brasil` · `/politica-explicada` · `/participe` · `/denuncias` · `/quem-apoia-o-fiscaliza-brasil` · `/quem-patrocina-o-fiscaliza-brasil` · `/contato` · `/privacidade` (LGPD)
- Formulários cidadãos com validação e geração de protocolo em `/api/contato`.

## Como rodar e verificar

```bash
npm install
npm run dev
```

```bash
npm run typecheck
npm run build
```
