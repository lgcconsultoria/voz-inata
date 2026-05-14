# Voz Inata

> Comunidade digital feminina por assinatura mensal — aprendizado, agenda viva, visibilidade de negócios e pertencimento, em um único espaço curado.

Esta é a primeira versão (MVP esqueleto) da plataforma **Voz Inata**, construída com Next.js 14, TypeScript e Tailwind CSS.

## Status

Esta versão entrega o **mínimo navegável** para validar identidade visual, navegação e estrutura:

- ✅ Landing pública com 4 pilares, semana da comunidade, comparativo de planos e CTA
- ✅ Fluxo de Login (`/entrar`) e Cadastro (`/cadastro`)
- ✅ Dashboard inicial (`/casa`) com saudação, próximo evento e destaques
- ⏳ Integração com Supabase, Stripe e Resend — próximas etapas
- ⏳ Mural, Biblioteca, Agenda, Catálogo, Perfil — próximas etapas

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript 5 |
| Estilo | Tailwind CSS 3 (paleta customizada da Skill 04) |
| Auth + DB + Storage | Supabase (Postgres + RLS) — a integrar |
| Pagamentos | Stripe com abstração de gateway — a integrar |
| E-mail transacional | Resend — a integrar |
| Hosting | Vercel + Supabase Cloud |

## Como rodar localmente

```bash
# 1. instale as dependências
npm install

# 2. copie as variáveis de ambiente
cp .env.example .env.local

# 3. inicie em modo dev
npm run dev
```

Abra http://localhost:3000.

## Estrutura

```
app/
  page.tsx              Landing pública
  entrar/page.tsx       Login
  cadastro/page.tsx     Cadastro + checkout
  casa/page.tsx         Dashboard inicial
  layout.tsx            Layout raiz (fonts, providers)
  globals.css           Tokens de design e estilos base
components/
  ui/                   Componentes base (button, card, input)
  marketing/            Componentes da landing
lib/
  utils.ts              Helpers (cn etc.)
```

## Documentação estratégica

Este repositório também versiona a documentação estratégica do produto (Skills 01–08), nos arquivos `01_Estrategia_Produto.md` a `08_Banco_Dados.md` na raiz do projeto.

Sequência:

1. **01** — Estratégia de Produto (planos, personas, MVP, riscos)
2. **02** — Comunidade & Engajamento (rituais, onboarding, retenção)
3. **03** — Modelo de Negócio (preços, métricas, projeções)
4. **04** — UX/UI (identidade visual, navegação, telas)
5. **07** — Arquitetura de Software (stack, fluxos)
6. **08** — Banco de Dados (schema, RLS, triggers)

## Próximos passos

- Conectar Supabase Auth (`/entrar` e `/cadastro`)
- Implementar Mural e Catálogo
- Integrar Stripe (com camada de abstração `PaymentProvider`)
- Configurar Vercel + deploy preview
- Aplicar acessibilidade WCAG 2.1 AA em todas as telas

## Licença

Proprietário. Todos os direitos reservados.
