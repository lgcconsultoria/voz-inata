# Setup Supabase — passo a passo

Você só precisa fazer **2 coisas no dashboard** e o cadastro/login passam a funcionar de verdade.

---

## 1. Aplicar as migrations (5 minutos)

1. Abre o dashboard do seu projeto: https://supabase.com/dashboard/project/vdwgjopopvxxysbmajpf
2. Menu lateral → **SQL Editor**
3. Clica em **New query**
4. Para cada arquivo abaixo (na ordem): abre, **copia tudo**, cola no SQL Editor, clica em **Run**.

```
supabase/migrations/0001_init.sql           ← enums + 27 tabelas
supabase/migrations/0002_functions.sql      ← triggers (regras de negócio)
supabase/migrations/0003_rls.sql            ← Row Level Security
supabase/migrations/0004_indexes_search.sql ← índices + full-text search
supabase/migrations/0005_seed.sql           ← cupons da Oferta Fundadora
```

Confirma em **Table Editor** que apareceram as 27 tabelas (profiles, subscriptions, posts, businesses, events, etc).

---

## 2. Configurar o Auth para teste rápido (1 minuto)

Para conseguir testar sem precisar abrir e-mail toda hora:

1. Menu lateral → **Authentication** → **Providers**
2. Em **Email**, desliga **"Confirm email"** *(você reativa depois, em produção)*
3. **Save**

Pronto. Agora ao se cadastrar você entra direto na comunidade, sem confirmação por e-mail.

---

## 3. Reiniciar o servidor de dev

No Terminal onde o `npm run dev` está rodando:

```
Ctrl + C    (para o servidor)
npm run dev (sobe de novo, agora lendo o .env.local)
```

---

## 4. Testar o cadastro real

1. Abre **http://localhost:3000/cadastro**
2. Escolhe um plano (Voz / Inata / Mentora)
3. Preenche seus dados reais (e-mail, senha 8+ chars, cidade, etc.)
4. Aceita os termos → **Confirmar e entrar na comunidade**
5. Você vai cair direto em `/casa` com **seu nome real** na saudação e o plano escolhido aparecendo

Depois disso:

- Volta no dashboard do Supabase → **Authentication → Users** → você vai ver seu usuário
- **Table Editor → profiles** → vai ver seu perfil criado automaticamente pela trigger `handle_new_user`
- **Table Editor → badges** → seu selo "🌱 recem_chegada" foi atribuído na hora

---

## 5. Logout e re-login

- Clica em **Sair** no header (ou navega para `/sair`) → volta para a landing
- Vai em `/entrar` e faz login com o mesmo e-mail + senha → cai em `/casa` de novo

---

## 6. Promover seu usuário a admin (opcional, quando quiser ver o painel admin futuro)

No **SQL Editor**, rode:

```sql
UPDATE profiles
   SET role = 'admin', current_plan = 'mentora'
 WHERE id = (SELECT id FROM auth.users WHERE email = 'SEU_EMAIL_AQUI');
```

---

## O que essa fase entrega tecnicamente

- **Supabase Auth** completo no fluxo (signup, login, logout, refresh de sessão via cookies httpOnly)
- **Server Actions** para signIn/signUp (validação no servidor, sem expor lógica no cliente)
- **middleware.ts** protege todas as rotas autenticadas (`/casa`, `/mural`, `/biblioteca`, `/agenda`, `/catalogo`, `/perfil`) — redireciona pra `/entrar` quem não está logado
- **Trigger handle_new_user** cria o profile + selo automaticamente no signup
- **RLS** ativo em todas as tabelas — usuárias só veem dados próprios + dados públicos da comunidade
- Dashboard `/casa` mostra seu **nome real e plano real** vindo do banco

## Próximos passos depois disso funcionar

Quando tudo isto estiver rodando com cadastros reais aparecendo no Supabase:

- **Mural funcional** — criar/listar posts reais, com as 11 categorias e os limites por plano funcionando
- **Catálogo de negócios** — Inata/Mentora preenchem o perfil de negócio e ele aparece no grid
- **Agenda RSVP** — inscrição em eventos persistindo em `event_rsvps`
- **Stripe Checkout** — cobrança recorrente real com a Oferta Fundadora ativa
