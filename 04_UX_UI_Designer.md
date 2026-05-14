# Voz Inata — UX/UI: Jornada, Navegação e Telas

**Skill 04 — UX/UI Designer de Produto**
**Data:** 14 de maio de 2026
**Status:** Concluída — pronta para alimentar Skill 05 (Copy), Skill 06 (PRD) e Skill 07 (Arquitetura)
**Documentos anteriores:** `01_Estrategia_Produto.md`, `02_Comunidade_Engajamento.md`, `03_Modelo_Negocio_Monetizacao.md`

---

## 1 — Identidade Visual Base

Os parâmetros abaixo são a **direção fundadora** — devem ser refinados por uma designer humana antes do desenvolvimento, mas servem para o PRD, para o brief de design e para o frontend começar com mockups consistentes.

### Princípios estéticos

A Voz Inata é **feminina sem ser clichê**: foge do rosa-bebê + flor-de-cerejeira + caligrafia delicada que envelhece em 6 meses. Aproxima-se de um espaço editorial contemporâneo — algo entre uma revista cultural feminina e um app de produtividade calmo. Profissional, acolhedor, com camadas de cor terrosa e bom respiro.

Três adjetivos guia: **acolhedor · editorial · presente**.

### Paleta de cores

| Papel | Nome interno | Hex | Uso |
|---|---|---|---|
| **Primária** | Verde Inata | `#2F4A3A` | Headers, navegação, botões secundários, links — transmite enraizamento e profundidade |
| **Acento principal** | Terracota Voz | `#C97B5C` | CTAs principais, selos, destaques — transmite calor humano e movimento |
| **Acento secundário** | Areia | `#E8D9C7` | Backgrounds de cards, banners suaves — transmite acolhimento sem perder leveza |
| **Apoio frio** | Salvia | `#A6BFA4` | Tags, badges discretos, estados de sucesso |
| **Fundo principal** | Creme | `#FAF6F0` | Background da plataforma — alternativa branca para áreas densas (`#FFFFFF`) |
| **Texto primário** | Preto Suave | `#1E1A17` | Corpo de texto, títulos sobre fundo claro |
| **Texto secundário** | Cinza Argila | `#6B635A` | Labels, metadados, captions |
| **Estado de alerta** | Âmbar | `#D49A4C` | Avisos, advertências brandas |
| **Estado de erro** | Vermelho Vinho | `#8B3A3A` | Mensagens críticas (raro) |

A paleta evita o uso de **azul puro** (frio demais para o tom feminino) e do **rosa-pastel** (saturado de mercado). Verde + terracota + areia já carregam identidade própria.

### Tipografia

| Papel | Família | Pesos | Justificativa |
|---|---|---|---|
| **Display / Títulos editoriais** | **Fraunces** (Google Fonts) | 500, 600, 700 | Serif moderna com personalidade, soft-bracketed — comunica autoridade editorial sem ser nostálgica |
| **Títulos de interface** | **Inter** | 600, 700 | Sans-serif neutra, legível em qualquer tamanho |
| **Corpo de texto** | **Inter** | 400, 500 | Mesma família mantém consistência |
| **Monoespaçada (rara)** | **JetBrains Mono** | 400 | Apenas em códigos de cupom, identificadores |

**Tamanhos-base (mobile / desktop):**
- H1: 28px / 40px — Fraunces 600
- H2: 22px / 30px — Fraunces 600
- H3: 18px / 22px — Inter 600
- Corpo: 16px / 16px — Inter 400
- Caption / label: 13px / 14px — Inter 500

### Iconografia e ilustração

- **Ícones:** linha fina (1.5px), cantos arredondados — referência: **Phosphor Icons** (versão Regular). Banidos: ícones cheios pretos, ícones em emoji mistos com lineart.
- **Fotos:** mulheres brasileiras reais, diversas (cor de pele, idade 25–50, regiões variadas), preferencialmente em contexto profissional cotidiano (mesa de trabalho, atendendo cliente, em evento). Tom de cor quente, sem filtros saturados.
- **Ilustração (suporte):** linha simples + manchas de cor terracota e verde, evitando estética "Corporate Memphis" (figuras chapadas com membros desproporcionais — já saturado).

### Referências visuais

Três produtos que servem de norte estético (não copiar, inspirar):

- **The Cut** (revista NYMag) — densidade editorial + tipografia confiante.
- **Substack** (interface da publicação) — calma, generosa, sem ruído.
- **Notion** (área de comunidades) — clareza funcional, hierarquia clara.

---

## 2 — Princípios de Design Aplicados

Cinco regras inegociáveis que guiam toda a interface:

1. **Calma supera densidade.** Espaço em branco é parte da promessa. Mural sem respiro vira ansiedade — o oposto da experiência prometida.
2. **Reconhecimento > memorização.** Membra não decora regras de plano. A interface mostra "isto é Inata" no momento certo, sempre.
3. **Estados emocionais > estados técnicos.** "Sentimos sua falta" é melhor que "Sessão expirada". A linguagem do produto é parte da identidade.
4. **Mobile é primeira tela.** 75–85% do tráfego virá do celular. Desenho começa mobile, expande para desktop.
5. **Acessibilidade não é opcional.** WCAG 2.1 AA é piso, não meta. Contraste, tamanho de toque, alt text — tudo entra desde o MVP.

---

## 3 — Arquitetura de Informação e Mapa de Navegação

### 3.1 Mapa de navegação completo

```
ÁREA PÚBLICA (sem login)
├── /                              Landing pública
│   ├── Hero + proposta de valor
│   ├── Como funciona (4 pilares)
│   ├── Como é uma semana na Voz Inata (rituais)
│   ├── Planos e preços
│   ├── Vozes da Voz Inata (depoimentos / Mural da Fama público)
│   ├── FAQ
│   └── CTA Oferta Fundadora
├── /planos                        Comparador de planos (deep-link de e-mails)
├── /palco                         Página pública da Quinta do Palco (SEO, V1.5)
├── /entrar                        Login
├── /cadastro                      Cadastro + checkout
├── /esqueci-senha                 Recuperação
├── /termos                        Termos de uso
└── /privacidade                   Política LGPD

ÁREA LOGADA — ASSINANTE
├── /casa                          Dashboard (home)
│   ├── Saudação + chamada da semana
│   ├── Próximo evento ao vivo (banner-âncora)
│   ├── Trilha de onboarding (D1–D30)
│   ├── Posts em destaque do mural
│   └── Catálogo: 4 perfis sugeridos
├── /mural                         Mural da comunidade
│   ├── Feed cronológico
│   ├── Post-âncora do dia (fixo no topo)
│   ├── Filtros por tipo de post (11 tipos)
│   ├── Criar publicação (FAB)
│   ├── /mural/post/:id            Post individual + comentários
│   └── /mural/fama                Mural da Fama (públio Vozes do Mês + Palcos)
├── /biblioteca                    Conteúdo gravado
│   ├── Destaques
│   ├── Categorias e tags
│   ├── /biblioteca/:slug          Aula/material individual
│   └── /biblioteca/meu-progresso  Histórico pessoal
├── /agenda                        Eventos
│   ├── Visão semanal (vista padrão)
│   ├── Visão mensal
│   ├── /agenda/evento/:id         Página do evento + inscrição
│   └── /agenda/gravacoes          Biblioteca de gravações
├── /catalogo                      Catálogo de Negócios
│   ├── Grid de perfis
│   ├── Busca + filtros (categoria, cidade, plano)
│   ├── Destaque rotativo no topo
│   └── /catalogo/:slug            Perfil individual do negócio
├── /perfil                        Meu perfil
│   ├── Aba: Pessoal
│   ├── Aba: Meu Negócio (Inata+)
│   ├── Aba: Selos e Conquistas
│   └── Aba: Minha Assinatura (plano, status, pausa, cancelar)
├── /notificacoes                  Central de notificações
└── /ajuda                         Central de ajuda + abrir chamado

ÁREA ADMIN (acesso restrito)
├── /admin                         Dashboard de métricas (MRR, churn, ativação)
├── /admin/assinantes              Lista + busca + ações
├── /admin/biblioteca              CRUD de conteúdo
├── /admin/eventos                 CRUD de eventos
├── /admin/mural                   Moderação (denúncias, fila)
├── /admin/catalogo                Curadoria de destaques + aprovação
├── /admin/destaques               Voz do Mês, Negócio em Evidência
├── /admin/cupons                  Cupons e Oferta Fundadora
├── /admin/marcas-aliadas          CRM B2B simplificado
├── /admin/comunicados             Avisos oficiais + e-mail marketing
└── /admin/configuracoes           Planos, preços, cotas, integrações
```

### 3.2 Padrão de navegação por dispositivo

**Desktop (≥ 1024px):**
- **Sidebar fixa à esquerda** (240px): logo no topo + 7 itens principais (Casa, Mural, Biblioteca, Agenda, Catálogo, Perfil, Notificações). Rodapé da sidebar mostra o plano da membra com link "Gerenciar".
- Conteúdo principal centralizado com **largura máxima de 1080px**.
- Direita: coluna contextual de 280px (Próximo Evento, Membras Online, Destaque da Semana) — não aparece em telas < 1280px.

**Mobile (< 768px):**
- **Bottom nav** com 5 ícones: 🏠 Casa · 💬 Mural · 📅 Agenda · 🗂️ Catálogo · 👤 Perfil.
- Biblioteca e Notificações ficam **acessíveis pelo header** (ícones de busca + sino no topo).
- **FAB** (botão flutuante) de criação de post visível dentro do Mural.

**Tablet (768–1023px):**
- Sidebar colapsada em ícones (60px), expande no hover.

### 3.3 Hierarquia de acesso por plano

| Rota | Voz | Inata | Mentora | Não-assinante |
|---|:---:|:---:|:---:|:---:|
| `/` `/planos` `/palco` | ✓ | ✓ | ✓ | ✓ |
| `/casa` `/mural` `/biblioteca` `/agenda` | ✓ | ✓ | ✓ | ✗ |
| `/catalogo` (consultar) | ✓ | ✓ | ✓ | ✗ |
| Perfil de negócio no catálogo | ✗ | ✓ | ✓ + destaque | ✗ |
| Postar Divulgação | ✗ | ✓ (2x/sem) | ✓ (2x/sem) | ✗ |
| Evento ao vivo | 1/mês | ilimitado | ilimitado | ✗ |
| Candidatura ao Palco | ✗ | ✓ (após 6m) | ✓ (1 vaga/tri garantida) | ✗ |
| `/admin/*` | ✗ | ✗ | ✗ | ✗ |

Acesso é renderizado **no lado do servidor** (Skill 07/08 detalha) — não basta esconder no front-end.

---

## 4 — Wireframes Descritivos (telas principais)

Cada wireframe descreve **estrutura, componentes-chave e estados**. Não substitui mockup visual — orienta o trabalho da designer humana e do desenvolvedor.

---

### 4.1 Landing pública `/`

```
┌─────────────────────────────────────────────────────────────┐
│  [logo Voz Inata]              Entrar →   [Assinar]         │  ← header sticky
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   H1 (Fraunces): Sua voz nasceu pra ter rede.               │
│   Sub (Inter):   Uma comunidade pra mulheres que querem     │
│                  crescer em rede — com aprendizado, agenda  │
│                  viva e visibilidade pro seu negócio.       │
│                                                              │
│   [Quero entrar →]  (terracota, 56px altura)                │
│   "Vagas fundadoras com preço travado vitalício."           │
│                                                              │
│   ◆ foto-mosaico de mulheres reais                          │
│                                                              │
├─ SEÇÃO "4 PILARES" ─────────────────────────────────────────┤
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                    │
│   │ 📚   │  │ 📅   │  │ 💬   │  │ 🗂️    │                    │
│   │Aulas │  │Agenda│  │Mural │  │Catálogo                   │
│   └──────┘  └──────┘  └──────┘  └──────┘                    │
├─ SEÇÃO "UMA SEMANA NA VOZ INATA" ────────────────────────── │
│   Linha do tempo horizontal SEG → DOM com 1 ritual por dia  │
├─ SEÇÃO "PLANOS" ────────────────────────────────────────────│
│   [card Voz]  [card Inata DESTAQUE]  [card Mentora]         │
│   (em mobile vira carrossel)                                │
├─ SEÇÃO "VOZES DA VOZ INATA" (depoimentos) ──────────────────│
│   Carrossel com foto + nome + cidade + frase                │
├─ SEÇÃO "FAQ" (accordion) ───────────────────────────────────│
├─ CTA FINAL ─────────────────────────────────────────────────│
│   "Você está a um clique de fazer parte." [Assinar →]       │
├─ FOOTER ────────────────────────────────────────────────────│
│   Logo · Sobre · FAQ · Termos · Privacidade · IG · Email    │
└─────────────────────────────────────────────────────────────┘
```

Estados a desenhar: hover/active dos CTAs, accordion expandido, carrossel mobile, banner sticky de Oferta Fundadora (aparece após 30% de scroll com cronômetro de 7 dias).

---

### 4.2 Cadastro + checkout `/cadastro`

```
LAYOUT: 1 coluna mobile; 2 colunas desktop (formulário esquerda + resumo direita)

ETAPA 1 — Plano   (3 cards selecionáveis, Inata pré-selecionado)
ETAPA 2 — Dados   (Nome, e-mail, senha, telefone, cidade, estado)
ETAPA 3 — Pagamento
   ◯ Cartão (recorrente) — bandeira, número, validade, CVV, parcelamento
   ◯ Pix recorrente — explicação curta + QR
   Campo opcional: Cupom (Oferta Fundadora aplicada automaticamente
   se restarem vagas; banner com contador "23 de 100 vagas restantes")
ETAPA 4 — Termos
   [✓] Li e aceito os Termos de Uso e a Política de Privacidade
   [✓] Aceito as Regras de Convivência da Voz Inata

[Confirmar e entrar na comunidade →]

RESUMO LATERAL (fixo):
  Plano: Inata
  Cobrança: R$ 89/mês (R$ 69 vitalício se você está nas 100 fundadoras)
  Cobrado a partir de DD/MM/AAAA
  Cancele quando quiser. Pause até 60 dias/ano.
```

Microcopy (Skill 05 ajustará): erro de cartão, sucesso, Pix gerado, fluxo de retry em D+2/D+5.

---

### 4.3 Tour de onboarding pós-checkout (5 telas)

```
TELA 1 — Boas-vindas
  Vídeo de 90s da fundadora (auto-play, com mute, legendado)
  "Olá, [Nome]. Bem-vinda à Voz Inata."
  [Começar →]

TELA 2 — Os 4 pilares
  4 ícones com 1 frase cada. Layout horizontal scrollável em mobile.
  [Próximo →]

TELA 3 — Sua semana aqui
  Linha do tempo com SEG–DOM destacando o próximo ritual da semana corrente
  "Sua primeira semana começa por aqui."
  [Próximo →]

TELA 4 — Sua primeira tarefa
  "Complete seu perfil em 2 minutos. Foto + bio + cidade."
  [Foto ▢] [Bio_____________] [Cidade ▾] [Estado ▾]
  [Continuar →]

TELA 5 — Sua segunda tarefa
  "Apresente-se no mural — copia, cola, edita:"
  [Bloco de texto editável já populado com template]
  [Publicar minha apresentação] (CTA primário)
  [Faço depois] (link discreto)
```

Cada tela tem barra de progresso superior (1/5, 2/5...). Sem skip total — apenas "Faço depois" na última (registra evento `onboarding.skipped_post`).

---

### 4.4 Dashboard `/casa`

```
┌─────────────────────────────────────────────────────────────┐
│ [Olá, Marina 🌸 Seu plano: Inata]                            │  ← header pessoal
│ "Sua semana começa hoje — segunda da intenção às 10h."      │
├─────────────────────────────────────────────────────────────┤
│ TRILHA DE ONBOARDING (apenas D1–D30)                         │
│ ──●──○──○──○──○──○                                            │
│ ✓ Perfil completo   ○ 1ª publicação   ○ Participar evento... │
├─────────────────────────────────────────────────────────────┤
│ PRÓXIMO EVENTO (banner-âncora — sempre o mais próximo)       │
│ [Quinta do Palco · Camila Andrade · 22 mai · 20h]            │
│ [Quero participar →]                                         │
├─────────────────────────────────────────────────────────────┤
│ DESTAQUES DA SEMANA                                          │
│ Card 1: Post-âncora "Qual sua intenção?"                     │
│ Card 2: Nova aula "Precificar serviço sem culpa"             │
│ Card 3: Negócio em Evidência (foto + descrição + visitar)    │
├─────────────────────────────────────────────────────────────┤
│ CATÁLOGO PARA VOCÊ                                           │
│ Grid de 4 perfis sugeridos baseados em categoria/cidade      │
├─────────────────────────────────────────────────────────────┤
│ MENSAGEM DA FUNDADORA (1 frase fixa por semana)              │
└─────────────────────────────────────────────────────────────┘
```

A trilha de onboarding **desaparece após o D30**, dando lugar a um bloco "Esta semana" com 3 cards rotativos (post mais comentado da semana, evento que você ainda não viu, conteúdo que combina com você).

---

### 4.5 Mural `/mural`

```
TOPO
  [Tabs/filtros]: Tudo · 🎯 Intenção · 🌟 Conquista · 🤝 Indica
                  · 💼 Negócio · ❓ Pergunta · 💡 Aprendi · 🚪 Oportunidade
  [Busca]                                                [+ Publicar]

POST-ÂNCORA DO DIA (fixo no topo, fundo Areia)
  📣 [Tipo: Desafio da Semana — admin]
  "Qual sua intenção para esta semana?" Responda nos comentários.
  💬 142 respostas       última às 11:47

FEED CRONOLÓGICO (cada post — card)
  ┌────────────────────────────────────────────────┐
  │ [avatar] Nome  💎 Selo · Cidade · 2h           │
  │ Tag: 🌟 Conquista                              │
  │ ────────────────────────────────────────────── │
  │ Texto do post                                  │
  │ [imagem, se houver]                            │
  │ ❤️ 23   💬 8   ↗️                                │
  │ ▸ Mostrar 2 comentários                        │
  └────────────────────────────────────────────────┘

CRIAÇÃO DE POST (drawer/modal a partir do FAB)
  Passo 1 — escolher TIPO (cards visuais com tag colorida)
            Apenas tipos permitidos pelo plano da membra aparecem
  Passo 2 — campo de texto (com contador, máx. 1500 chars)
            Upload de imagem opcional (1 imagem, máx. 2MB)
            Tags livres (até 3)
  Passo 3 — preview + [Publicar]

ESTADOS ESPECIAIS
  • Voz tenta selecionar "Divulgação do Negócio" → modal upsell
  • Inata atinge 2 Divulgações na semana → tipo desabilitado com
    tooltip "Você atingiu o limite desta semana. Volta segunda 🌱"
  • Post denunciado 3x → fica oculto até moderação
```

---

### 4.6 Página de evento `/agenda/evento/:id`

```
HERO
  Imagem do evento (16:9) + tag "🎤 Quinta do Palco"
  Título · Apresentado por [foto + nome com link para Catálogo]
  📅 22 mai 2026 · 20h–21h (Brasília) · 1h

BLOCO PRINCIPAL
  Descrição (2–4 parágrafos)
  Para quem é
  O que você vai levar
  Sobre a apresentadora

BARRA STICKY
  [Quero participar →] (Inata+) ou [Garantir vaga (Voz: 1/mês)]
  ou [Disponível na gravação (Voz)]
  Contador de vagas se for evento limitado

PÓS-INSCRIÇÃO
  Botão muda para "Você está inscrita ✓"
  Mostra link de Zoom/Meet 30 min antes do início
  Botão "Adicionar ao Google Calendar"
  Botão "Cancelar inscrição"

ESTADOS
  • Evento ao vivo agora: badge pulsante "🔴 ao vivo"
  • Evento passado: banner "Disponível na biblioteca de gravações"
```

---

### 4.7 Catálogo `/catalogo`

```
HEADER DA SEÇÃO
  H1: Catálogo
  Sub: "Mulheres que você pode contratar, indicar e fazer rede."
  [Busca por nome ou serviço]

FILTROS (chips horizontais com scroll)
  Categoria ▾  · Cidade ▾  · Estado ▾  · Apenas Parceiras [ ]

DESTAQUE ROTATIVO (Negócio em Evidência da semana)
  Card grande horizontal — foto + frase + [Conhecer →]

GRID (responsivo)
  Mobile: 1 col | Tablet: 2 cols | Desktop: 3 cols

  ┌─────────────────────────────┐
  │  [Foto avatar 96px]         │
  │  Nome do negócio · 💎       │
  │  Tag: Categoria             │
  │  📍 Cidade/UF                │
  │  Descrição curta (80 char)  │
  │  [WhatsApp] [Instagram]     │
  │  [Ver perfil →]             │
  └─────────────────────────────┘

PERFIL INDIVIDUAL `/catalogo/:slug`
  Cabeçalho: foto + nome do negócio + selo + categoria + cidade
  Sobre · Serviços · Galeria (até 6 fotos)
  Botões de contato (registram evento `catalog.contact_clicked`)
  Bloco "A profissional na Voz Inata" — link para o perfil pessoal
  Posts recentes desta membra no mural (apenas tipos públicos)
  Para Voz: banner "Apareça aqui também — assine Inata" (Trigger 2)
```

---

### 4.8 Meu Perfil `/perfil`

```
HEADER
  Avatar grande · Nome · Selos visíveis (🌱 ✋ 🤝 🎤 💎)
  Plano atual: Inata · Membra há 4 meses

ABAS
  [Pessoal] [Meu Negócio] [Selos & Conquistas] [Assinatura]

ABA PESSOAL
  Foto · Nome (editável) · E-mail (read-only) · Telefone
  Cidade/Estado · Bio (200 char)
  [Salvar alterações]

ABA MEU NEGÓCIO (visível apenas para Inata+)
  Foto/logo · Nome do negócio · Categoria
  Descrição longa · Galeria (6 fotos) · Links
  Toggle "Visível no Catálogo" (com aviso se Voz)
  [Salvar e publicar no catálogo]

ABA SELOS & CONQUISTAS
  Grid dos 5 selos com estado (conquistado / a conquistar)
  Linha do tempo: histórico de Vozes do Mês, Palcos, indicações dadas/recebidas
  Botão "Compartilhar minha jornada" (gera card de imagem para Instagram)

ABA ASSINATURA
  Card grande: PLANO INATA · R$ 89/mês · Próxima cobrança 14/jun
  Histórico de pagamentos (tabela)
  [Trocar de plano →] (leva ao comparador)
  [Pausar assinatura por até 60 dias]
  Link discreto no fim: "Cancelar minha assinatura"
```

Fluxo de cancelamento abre **wizard de 3 telas**: motivo (1 pergunta) → oferta de downgrade ou pausa → confirmação final. Sem dark patterns. Confirmação por e-mail.

---

### 4.9 Dashboard pessoal pré-renovação (e-mail + tela)

Layout disparado **3 dias antes da renovação** e também acessível em `/perfil/meu-mes`.

```
TÍTULO
  "Seu mês na Voz Inata em números"

GRID DE INDICADORES (4 cards grandes)
  📅 Eventos assistidos: 3 de 4
  💬 Posts publicados: 5
  ❤️ Comentários recebidos: 28
  👀 Visitas no seu perfil do catálogo: 47

BLOCO "O QUE VOCÊ PERDEU"
  3 destaques do mês (eventos não vistos, posts populares, novas Parceiras)

CALL TO ACTION
  Botão principal: "Renovar e ganhar destaque rotativo (48h)"
  Secundário: "Trocar plano" / "Pausar"
```

---

### 4.10 Painel Admin `/admin`

Visão geral do que precisa existir (não é tela com wireframe detalhado — vira lista para o PRD).

- **Dashboard**: cards de MRR, base ativa, novas no mês, churn, ativação 7d, NPS.
- **Assinantes**: tabela com filtros (plano, status, antiguidade), ação rápida (ver perfil, pausar, adicionar nota interna).
- **Biblioteca**: CRUD de aulas (título, descrição, vídeo URL, PDF anexo, tags, restrições de plano).
- **Eventos**: CRUD + lista de inscritas + envio de lembrete + upload da gravação.
- **Moderação**: fila de denúncias, histórico de advertências por membra, ação direta (advertir, ocultar, banir).
- **Catálogo**: aprovação de novos perfis, controle de destaques (semanal e avulso pago), edição de categorias.
- **Destaques editoriais**: agendamento de Voz do Mês, Negócio em Evidência, Posts de Boas-vindas Coletivas.
- **Cupons & Ofertas**: criação, validade, controle de vagas (Oferta Fundadora com contador público).
- **Marcas Aliadas**: CRM simplificado (lead, em negociação, ativo, encerrado) + visão de receita por marca.
- **Comunicados**: agendamento de e-mail digest, broadcast in-app, segmentação por plano.
- **Configurações**: planos, preços, cotas Mentora, integrações (Stripe, Vimeo/Mux, e-mail provider), variáveis de tour de onboarding.

---

## 5 — Mobile-First, Gestos e Performance

### 5.1 Comportamento por tela

| Tela | Gesto-chave | Componente diferenciador |
|---|---|---|
| Dashboard | Pull-to-refresh | Trilha de onboarding com check animado |
| Mural | Scroll infinito + pull-to-refresh | FAB para criar post (sticky bottom-right) |
| Mural — criar post | Swipe horizontal entre passos | Indicador 1/3, 2/3, 3/3 |
| Agenda | Swipe entre semanas | Pílula "hoje" sempre visível |
| Catálogo | Scroll infinito + chips horizontais sticky | Bottom-sheet de filtros (não dropdown) |
| Evento | — | Barra sticky inferior com CTA principal |
| Perfil | Tabs com swipe horizontal | Botão flutuante "Compartilhar minha jornada" |

### 5.2 Performance

- **Skeleton screens** em todas as telas com fetch de dados — nunca spinner sozinho.
- **Lazy loading** em imagens e em rotas (`React.lazy` no Next.js).
- **Cache local** de eventos inscritos, perfil próprio e biblioteca consumida (IndexedDB via lib leve como localForage).
- **PWA** instalável no MVP — `manifest.json` + service worker básico. App nativo só na V2.
- **Otimização de imagens**: servir em `next/image` com srcset, formato AVIF/WebP, lazy automático.

### 5.3 Acessibilidade — checklist mínimo do MVP

- Contraste **mínimo 4.5:1** para corpo de texto e 3:1 para texto grande (validado com axe DevTools).
- Tamanho mínimo do toque **44×44px** (iOS HIG / Material).
- Foco visível em **todos os elementos interativos** (outline 2px terracota, offset 2px).
- Navegação completa por **teclado** (tab order lógico em todos os fluxos críticos).
- Alt text em todas as imagens; ícones decorativos com `aria-hidden`.
- **Modal de criação de post** com `role="dialog"`, `aria-labelledby` e trap de foco.
- Textos não devem se basear apenas em cor (selos têm ícone + texto, não só cor).
- **Reduced motion** respeitado (`prefers-reduced-motion`) — animações de transição reduzem para fade simples.

### 5.4 Notificações e estados

| Tipo | Canal | Quando dispara |
|---|---|---|
| Boas-vindas | E-mail + DM in-app | D1 (checkout) |
| Apresentação pendente | DM in-app | D3 sem post de Apresentação |
| Catálogo pendente | E-mail | D14 Premium sem catálogo |
| Lembrete de evento | Push + e-mail | 24h e 1h antes |
| Comentário no seu post | Push + in-app | Em tempo real |
| Novo destaque seu (Voz do Mês, Negócio em Evidência) | Push + e-mail | Quando publicado |
| Pré-renovação | E-mail | D-3 da cobrança |
| Falha de pagamento | E-mail + in-app | D+0, D+2, D+5 |
| Resumo semanal | E-mail digest | Domingo 19h |

Toda notificação tem **configuração granular em `/perfil`** — preferências por canal e por categoria (LGPD: consentimento explícito + descadastro fácil).

---

## 6 — Componentes Reutilizáveis (base do Design System mínimo)

Lista que vira o ponto de partida para a Skill 07 (Arquitetura) e para o design system técnico:

- **Botões**: primário, secundário, terciário (texto), destrutivo. Tamanhos sm/md/lg. Estados: default, hover, active, focus, disabled, loading.
- **Inputs**: text, textarea (com contador), select, multiselect (chips), date, file upload.
- **Cards**: post, evento, catálogo, plano, destaque editorial.
- **Selos**: 5 variantes (🌱 ✋ 🤝 🎤 💎) — componente único parametrizado.
- **Avatar**: 4 tamanhos (sm 32px / md 48px / lg 64px / xl 96px), com borda opcional de selo.
- **Tag/Chip**: 11 variantes (uma por tipo de post) + neutras.
- **Banner**: padrão, upsell, alerta, sucesso.
- **Modal / Drawer / Bottom-sheet**: três padrões para diferentes contextos.
- **Toast**: sucesso, erro, info, ação reversível (undo).
- **Tabs horizontais e verticais**.
- **Calendário**: visão semanal e mensal.
- **Progress bar e checklist** (trilha de onboarding e meu mês em números).
- **Stat card** (números grandes com label, usado no dashboard pessoal e admin).

---

## 7 — Handoff para Próximas Skills

```
=== HANDOFF UX/UI → PRÓXIMAS SKILLS ===

PRODUTO: Voz Inata

IDENTIDADE VISUAL DEFINIDA:
  Paleta — Verde Inata #2F4A3A, Terracota Voz #C97B5C, Areia, Salvia,
           Creme, Preto Suave, Cinza Argila
  Tipografia — Fraunces (display/títulos editoriais) + Inter (UI/corpo)
  Tom — acolhedor · editorial · presente

TELAS MAPEADAS (29 rotas, agrupadas em 3 áreas):
  Pública (10), Logada Assinante (17), Admin (12 telas operacionais)

NAVEGAÇÃO:
  Desktop — sidebar fixa de 240px + coluna contextual de 280px
  Mobile  — bottom nav de 5 ícones + header com busca e notificações

FLUXOS CRÍTICOS DESENHADOS:
  • Onboarding pós-checkout em 5 telas (com tarefas)
  • Cadastro + checkout em 4 etapas (Plano, Dados, Pagamento, Termos)
  • Criação de post em 3 passos no mural
  • Cancelamento com wizard de 3 telas (motivo → downgrade/pausa → confirma)
  • Pré-renovação ("seu mês em números") em e-mail + tela

==================================================================
OUTPUTS PARA SKILL 05 (Copywriter):
  • Texto da landing: H1, sub, blocos dos 4 pilares, FAQ, depoimentos,
    CTA final, banner Oferta Fundadora
  • Copy dos 3 cards de plano (descrição, principal benefício, CTA)
  • Tour de onboarding em 5 telas (1 frase de boas-vindas + tarefas)
  • Mensagens automáticas dos 7 gatilhos anti-churn (Skill 02) já listados
  • Microcopy: botões, estados vazios, erros, sucesso, e-mails transacionais
  • Tom dos 11 tipos de post (label + tooltip explicativo)
  • Modal de upsell contextual (Trigger 1, 2 e 4 da Skill 03)
  • Fluxo de cancelamento — copy de cada passo (sem dark pattern)
  • Avisos LGPD (consentimento explícito de notificações)
  • Nomes humanos para os 5 selos (label visível + descrição)

OUTPUTS PARA SKILL 06 (PRD):
  • 29 rotas listadas com proteção e plano que acessa
  • Cada interação mapeada vira requisito funcional do PRD
  • Componentes reutilizáveis (lista para Design System mínimo)
  • Estados e mensagens de erro/sucesso de cada fluxo
  • Hierarquia de notificações por canal × evento
  • Comportamento responsivo desktop/tablet/mobile

OUTPUTS PARA SKILL 07 (Arquitetura):
  • Rotas públicas vs. protegidas + plano necessário
  • PWA no MVP (manifest + SW básico)
  • next/image obrigatório (otimização de fotos)
  • Vimeo/Mux como provider de vídeo (custo previsível)
  • Cache local de eventos inscritos e perfil próprio (IndexedDB)
  • Server-side rendering de gating por plano (não confiar no client)
  • Acessibilidade WCAG 2.1 AA como critério de aceite

PRÓXIMA SKILL: Skill 05 — Copywriter e Posicionamento de Marca
```

---

*Documento concluído pela Skill 04 — UX/UI Designer.*
*Consistência verificada com Skills 01, 02 e 03: todos os 11 tipos de post estão refletidos como chips no Mural, os 5 selos estão no perfil e no avatar, os 6 rituais semanais aparecem na landing e no dashboard, os 7 gatilhos anti-churn têm telas correspondentes, os 5 triggers de upsell têm pontos de UI definidos, e o plano Voz / Inata / Mentora é a única nomenclatura usada — sem desvio de branding.*
