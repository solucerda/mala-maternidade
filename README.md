# Mala da Maternidade

Site de checklist da mala da maternidade (bebê + mãe), com cadastro de usuárias, painel
administrativo e blog. Stack: **Next.js** + **Supabase** (banco de dados + autenticação),
feito pra rodar na **Vercel** com o código no **GitHub**.

---

## 1. Criar o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto novo (escolha a região mais
   próxima do Brasil, ex: São Paulo/`sa-east-1` se disponível).
2. No menu lateral, vá em **SQL Editor** → **New query**.
3. Copie todo o conteúdo do arquivo `sql/schema.sql` deste projeto, cole no editor e clique em
   **Run**. Isso cria todas as tabelas, permissões de segurança (RLS) e já insere os itens
   iniciais do checklist.
4. Vá em **Authentication → Providers** e habilite o **Google**:
   - Você vai precisar criar credenciais OAuth no [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
     (tipo "Web application").
   - Em "Authorized redirect URIs", cole a URL de callback que o próprio Supabase mostra na
     tela do provider Google (algo como `https://SEU-PROJETO.supabase.co/auth/v1/callback`).
   - Cole o Client ID e Client Secret gerados no Google de volta na tela do Supabase e salve.
5. Vá em **Project Settings → API** e anote:
   - **Project URL**
   - **anon public key**

## 2. Rodar o projeto localmente (opcional, pra visualizar antes de publicar)

```bash
npm install
cp .env.local.example .env.local
# edite o .env.local com a URL e a anon key do seu projeto Supabase
npm run dev
```

Acesse `http://localhost:3000`.

## 3. Tornar sua conta administradora

1. Crie sua conta normalmente pelo site (`/cadastro`) ou pelo login com Google.
2. No Supabase, vá em **Table Editor → profiles**, encontre a linha com seu `id`/email e mude a
   coluna `role` de `user` para `admin`.
3. Agora, ao entrar no site, o link **"Ir para o painel administrativo"** aparece na sua página
   `/conta`, e você acessa `/admin` pra gerenciar itens do checklist e posts do blog.

## 4. Subir pro GitHub

```bash
git init
git add .
git commit -m "Primeira versão do site Mala da Maternidade"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/mala-maternidade.git
git push -u origin main
```

## 5. Publicar na Vercel

1. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório
   que você acabou de subir no GitHub.
2. Na tela de configuração, adicione as **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` → coloque a URL que a Vercel vai gerar (ex: `https://mala-maternidade.vercel.app`), e depois de publicar, atualize essa variável se trocar de domínio.
3. Clique em **Deploy**. Em poucos minutos o site estará no ar num link `.vercel.app`.
4. Depois de comprar seu domínio, vá em **Project Settings → Domains** na Vercel e siga as
   instruções pra apontar o domínio pra lá (é só configurar alguns registros DNS onde você
   comprou o domínio).

## 6. Sobre o painel administrativo (o "sem tocar em código" que você pediu)

Tudo que fica em `/admin` é uma interface visual: formulários pra adicionar, editar e excluir
itens do checklist (incluindo o link de afiliado) e posts do blog. Depois do site publicado,
você nunca mais precisa abrir o código pra fazer essas mudanças — só entrar logada como admin.

## 7. Sobre monetização (próximos passos, fora do escopo deste código)

- **Links de afiliado**: já há um campo pronto em cada item (preenchido pelo painel admin).
- **Google AdSense**: depois que o site tiver conteúdo e tráfego, crie uma conta no AdSense e
  adicione o script fornecido por eles no arquivo `app/layout.js`.
- **Newsletter**: para capturar e-mails para campanhas, integre um serviço como Brevo ou
  Mailchimp — normalmente basta adicionar um formulário deles ou usar a API deles a partir de
  uma nova rota em `app/api/`.

## 8. Estrutura do projeto

```
app/                   → páginas do site (Next.js App Router)
  admin/                → painel administrativo (protegido, só para role=admin)
  blog/                 → listagem e posts individuais
  checklist/[mala]/     → checklist do bebê ou da mãe
  cadastro, login/      → autenticação
  conta/                → dashboard da usuária
components/            → componentes reutilizáveis (formulários, header, footer)
lib/supabase/          → configuração de conexão com o Supabase
middleware.js          → protege rotas /admin e /conta, exige login
sql/schema.sql         → script para criar as tabelas no Supabase
```

## 9. Sobre a VPS que você já tem

Como você optou por Vercel + Supabase por enquanto, a VPS fica livre pra outros usos (ou como
plano B no futuro). Se um dia quiser migrar para lá, o Next.js também roda em VPS normalmente
(via `npm run build` + `npm run start` com um gerenciador de processos como PM2 + Nginx como
proxy reverso) — me avise quando chegar nesse ponto que eu monto o passo a passo.
