# Geek Music Awards — Site completo + login por e-mail

Este projeto junta o **visual completo** do Geek Music Awards (todas as
páginas: Início, Artistas, Revelações, Prodígios, Categorias, Evento, perfil
de cada artista) com o sistema de **login por e-mail** que impede a mesma
pessoa de votar várias vezes.

## Se você já tinha a versão anterior (demo simples) rodando

Você já configurou `.env` com `DATABASE_URL`, e-mail (Resend) e
`NEXTAUTH_SECRET` — ótimo, **não precisa refazer isso**. Só siga:

```bash
npm install                      # instala o lucide-react (ícones), que é novo
```

Depois, abra o `.env` e adicione uma linha nova no final:

```
TEAM_PASSWORD="GMW20262508"
```

(Essa é a senha da "Área da equipe" — o painel que mostra os votos reais.
Troque por uma senha sua se quiser.)

Depois rode de novo o seed (é seguro rodar de novo, ele atualiza em vez de
duplicar):

```bash
npm run prisma:seed
```

Isso vai popular o banco com os **26 artistas de verdade** (não mais os 4 de
teste) e as 3 categorias de voto. Depois:

```bash
npm run dev
```

Acesse `http://localhost:3000` — agora deve aparecer o site completo, com
header, hero, todos os artistas com foto, etc.

## O que mudou em relação à demo anterior

- Todas as páginas do site "bonito" foram portadas pra cá: `/`, `/artistas`,
  `/artistas/[slug]`, `/revelacoes`, `/prodigios`, `/categorias`, `/evento`
- O botão **VOTAR** agora abre um modal (categoria → confirmação), igual o
  site original — mas por trás, cada voto passa pela API `/api/vote`, que
  exige login e é protegida pelas regras que já tínhamos (rate limit,
  limite de votos, e agora **de verdade** amarrado ao e-mail do usuário)
- A **Área da equipe** (`/equipe`) agora mostra os números **reais** do
  banco de dados (não mais dados fictícios), com detalhamento por categoria,
  e o botão de zerar votos realmente apaga do banco

## O que ficou de fora (por enquanto)

- **Revelação de vencedores**: a seção "Quem levará o troféu?" não foi
  portada — precisaria de uma tabela nova no banco pra guardar quais
  vencedores foram revelados, editável pela equipe. Dá pra adicionar depois.
- **Configurações do evento editáveis**: data, local e transmissão do evento
  ainda são fixos no código (`src/data/gma-data.js`), não editáveis pela
  equipe em tempo real. Pra mudar, edite esse arquivo e reimplante o site.
- Fotos e biografias dos artistas continuam como dados fixos no código
  (`src/data/gma-data.js`), não no banco — evita inflar o Postgres com
  megabytes de base64 sem necessidade.

## Estrutura nova

```
src/
  data/
    gma-data.js          Artistas (com fotos), categorias, config do evento
  components/
    GmaHeader.tsx / GmaFooter.tsx    Navegação
    ArtistCard.tsx                    Card de artista (usado em várias páginas)
    ArtistProfile.tsx                 Perfil completo de um artista
    VoteProvider.tsx                  Contexto global do modal de voto
    TierArtistsList.tsx               Lista usada por Revelações/Prodígios
    ui.tsx                            Reveal (animação), CountdownBlock, GenreBadge
  app/
    page.tsx                          Início
    artistas/page.tsx                 Lista de artistas (100K+)
    artistas/[slug]/page.tsx          Perfil do artista
    revelacoes/page.tsx               Artistas com ≤30K inscritos
    prodigios/page.tsx                Artistas entre 30K e 100K
    categorias/page.tsx               Categorias da premiação (vitrine)
    evento/page.tsx                   Página do evento
    equipe/page.tsx                   Painel da equipe (senha + votos reais)
    api/team/votes/route.ts           Retorna os votos reais (protegido por senha)
    api/team/reset/route.ts           Zera todos os votos (protegido por senha)
```

---

## Setup do zero (caso esteja começando agora)

### 1. Instalar dependências

```bash
npm install
```

### 2. Banco de dados

```bash
cp .env.example .env
# edite .env e cole a DATABASE_URL do seu banco (Neon, Supabase, Railway...)

npx prisma migrate dev --name init
npm run prisma:seed   # cria os 26 artistas e as 3 categorias
```

### 3. Envio de e-mail (login por link mágico)

Você precisa de um servidor SMTP pra mandar o e-mail de login.

**Pra testar rápido (sem entregar e-mail de verdade):**
[Mailtrap](https://mailtrap.io) tem um "sandbox" grátis que captura os
e-mails num painel, sem realmente enviar.

**Pra produção:** [Resend](https://resend.com) tem plano grátis generoso.
Sem domínio próprio, você só consegue mandar e-mail pra você mesmo (a conta
que criou no Resend) — use `onboarding@resend.dev` como remetente. Com
domínio verificado, dá pra mandar pra qualquer pessoa.

```
EMAIL_SERVER_HOST="smtp.resend.com"
EMAIL_SERVER_PORT="465"
EMAIL_SERVER_USER="resend"
EMAIL_SERVER_PASSWORD="sua-api-key-aqui"
EMAIL_FROM="Geek Music Awards <onboarding@resend.dev>"
```

### 4. Chaves secretas

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Cole o resultado em `NEXTAUTH_SECRET`. Defina também `TEAM_PASSWORD` (senha
da Área da equipe) e `MAX_VOTES_PER_USER` (padrão: 3).

### 5. Rodar

```bash
npm run dev
```

## Indo pra produção

- Verifique um domínio no Resend pra poder mandar e-mail pra qualquer votante
- Hospede em [Vercel](https://vercel.com) (mais simples pra projetos Next.js)
- Troque `NEXTAUTH_URL` pro domínio real
- Troque `TEAM_PASSWORD` por uma senha só sua, forte
- O rate limiter em `src/lib/rateLimit.ts` é em memória — em produção com
  mais de uma instância, troque por Redis/Upstash

## Sobre dados pessoais (LGPD)

Esse sistema coleta e-mails reais de quem vota. Se for usar de verdade,
vale ter uma política de privacidade simples explicando isso.
