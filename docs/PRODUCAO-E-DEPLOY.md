# Guia de Produção, Segurança, LGPD & Deploy — Fiscaliza Brasil

Este documento orienta a publicação imediata da versão atual (Vercel) e o plano de evolução para operação em larga escala com banco de dados próprio.

---

## 1. Deploy Imediato na Vercel (Protótipo / MVP Público)

O projeto é 100% compatível com deploy zero-config na **Vercel** (Node.js runtime para os Route Handlers):

1. Subir o repositório para GitHub / GitLab / Bitbucket (`.next` e `tsconfig.tsbuildinfo` já estão no `.gitignore`).
2. Importar o projeto na Vercel:
   - **Framework Preset:** `Next.js`
   - **Build Command:** `npm run build`
   - **Node Version:** `20.x`
3. Configurar o domínio personalizado (`fiscalizabrasil.org` e `www.fiscalizabrasil.org`) com HTTPS automático e redirecionamento 301 para a raiz canônica.
4. *(Opcional)* Se o cliente optar por manter o blog/institucional no WordPress temporariamente, publicar este portal em subdomínio (`painel.fiscalizabrasil.org` ou `dados.fiscalizabrasil.org`) ou usar *reverse proxy* por rota.

---

## 2. Checklist de Evolução para Produção de Alto Tráfego

Hoje o portal consulta TSE, SICONFI, Senado, Câmara, PNCP e ALMG sob demanda com cache HTTP (`s-maxage=3600`). Para suportar picos de audiência (ex.: período eleitoral ou matéria viral) sem depender da disponibilidade em tempo real dos portais do governo, recomenda-se:

### 2.1 Banco de Dados & ETL (PostgreSQL)
- **Persistência recomendada:** PostgreSQL gerenciado (Supabase, Neon ou RDS) com Drizzle ORM ou Prisma.
- **Rotinas agendadas (Cron / GitHub Actions / Worker):**
  - **TSE Dados Abertos (CSVs oficiais):** carga completa dos 5.570 prefeitos, ~58 mil vereadores, 1.059 deputados estaduais e 27 governadores (atualização semestral ou pós-eleições suplementares).
  - **SICONFI (RREO + RGF):** sincronização bimestral/quadrimestral em lote respeitando 1 req/s, eliminando latência nas consultas municipais.
  - **Câmara & Senado:** sincronização diária de projetos, votações, CEAP e CEAPS (evitando baixar o arquivo anual completo da CEAPS em serverless cold start).
  - **CGU Portal da Transparência:** cadastrar chave gratuita (`chave-api-dados` via env `CGU_API_KEY`) para exibir emendas federais por autor e convênios diretamente dentro das abas.

### 2.2 Persistência de Formulários & Anexos (`/participe`, `/denuncias`, `/contato`)
Atualmente `POST /api/contato` valida os dados, extensões e tamanhos dos arquivos e gera protocolo imediatamente. Em produção:
- Gravar registros na tabela `protocolos_cidadaos` (PostgreSQL).
- Salvar anexos validados em **Object Storage privado** (Cloudflare R2, AWS S3 ou Supabase Storage) com nomes aleatórios (UUID), nunca no filesystem local.
- Adicionar verificação **Cloudflare Turnstile** (anti-spam invisível) e **Rate Limiting** por IP (ex.: Upstash Redis — máx. 5 envios/hora por IP).
- Disparar e-mail transacional de confirmação com o número de protocolo (ex.: Resend / Amazon SES).

### 2.3 Variáveis de Ambiente Previstas (`.env.example` para Produção)

```env
# Banco de dados (Fase Produção)
DATABASE_URL="postgresql://user:pass@host:5432/fiscaliza_brasil"

# APIs Governamentais autenticadas
CGU_API_KEY="sua-chave-gratuita-portal-da-transparencia"

# Armazenamento de anexos (/participe e /denuncias)
STORAGE_ENDPOINT="https://..."
STORAGE_BUCKET="fiscaliza-anexos"
STORAGE_ACCESS_KEY_ID=""
STORAGE_SECRET_ACCESS_KEY=""

# Anti-spam & Observabilidade
NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
TURNSTILE_SECRET_KEY=""
SENTRY_DSN=""
```

---

## 3. Segurança & LGPD (Checklist Obrigatório)

- **Segredos:** zero credencial no código-fonte ou no repositório Git; variáveis sem prefixo `NEXT_PUBLIC_` permanecem estritamente no servidor.
- **Headers HTTP de segurança:** configurar em `next.config.ts` para produção (`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, CSP).
- **Uploads seguros:** manter allowlist estrita de extensões, limite de tamanho (10 MB), bucket privado sem execução de scripts e validação de magic bytes antes de persistir em produção.
- **LGPD (Lei nº 13.709/2018):**
  - Coleta mínima nos formulários cidadãos, consentimento explícito obrigatório e Política de Privacidade acessível em `/privacidade`.
  - Nunca publicar dados pessoais sensíveis de terceiros enviados em relatos (passam por triagem editorial).
  - Definir política de retenção e canal de exclusão de dados do titular via `/contato`.

---

## 4. Observabilidade & Operação

- **Logs estruturados:** registrar latência e status das APIs governamentais externas (TSE, SICONFI, PNCP, Senado, Câmara) para identificar rapidamente quedas ou mudanças de schema.
- **Monitoramento de erros:** integrar Sentry (front e route handlers) e Core Web Vitals (Vercel Analytics / Speed Insights).
- **Smoke test automatizado:** manter pipeline CI rodando `npm run typecheck && npm run build` a cada Pull Request e teste periódico das rotas críticas.
