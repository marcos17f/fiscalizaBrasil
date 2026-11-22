# Fiscaliza Brasil — Protótipo Next.js 15 + Fontes Oficiais ao Vivo

Protótipo demonstrativo construído a partir da análise técnica de `fiscalizabrasil.org`, utilizando **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4** com **integração ao vivo a APIs oficiais do governo brasileiro**.

## Fontes oficiais integradas ao vivo
1. **TSE DivulgaCandContas** (server-side proxy em `/api/prefeitos`, `/api/vereadores`, `/api/tse/candidato`, `/api/governadores/[uf]` e `/api/dep-estaduais/[uf]/perfil`):
   - Prefeitos e Vices eleitos (2024) em todos os **5.570 municípios** (foto, partido, coligação, bens declarados, histórico eleitoral, redes sociais e **Plano de Governo em PDF**).
   - Vereadores eleitos (2024) por município (~58 mil parlamentares) sob demanda, com modal completo em **8 abas**.
   - Governadores (2022 e 2026) e Deputados Estaduais/Distritais (2022/2026).
2. **SICONFI / Secretaria do Tesouro Nacional** (`RREO-Anexo 01` e `RREO-Anexo 02`):
   - Balanço Orçamentário real (Receita Prevista vs Realizada, Impostos Próprios vs Transferências Correntes, Despesa Empenhada vs Liquidada vs Paga) e Top Áreas de Gasto (Saúde, Educação, Segurança, Urbanismo, etc.) para **27 Estados** e **5.570 Municípios**.
3. **IBGE Localidades**: listagem oficial de municípios por UF.
4. **ALMG Dados Abertos (Minas Gerais)**: demonstração real de integração estadual de **Verbas Indenizatórias** e gabinete parlamentar para deputados de MG.
5. **Canais oficiais de controle**: links profundos para TCE/TCM de cada UF, Portal da Transparência estadual, CGU por localidade (`codigoIbge`), DivulgaCandContas e Fala.BR (LAI).

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Verificação técnica

```bash
npm run typecheck
npm run build
```
