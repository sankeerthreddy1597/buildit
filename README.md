# buildit

An AI-powered app builder. Describe what you want to build — the AI plans first, asks clarifying questions, then scaffolds, builds, and live-previews your app inside a sandboxed environment.

## What it does

1. **Plan mode** — Type a prompt on the landing page. The AI asks 2–4 scoping questions (auth, database, integrations), then produces a structured plan with pages, data models, and integrations listed as toggleable checkboxes.
2. **Build mode** — Click **Build**. The agent scaffolds a Next.js project inside an [E2B](https://e2b.dev) Firecracker sandbox, installs dependencies, and starts the dev server. The live preview URL streams into an iframe on the right.
3. **Iterate** — Keep chatting in the left pane to tweak the design, fix bugs, or add features. Each agent step deducts credits.

## Features

- **AI plan mode** — structured plan card with pages, data model, and integrations before any code is written
- **Live preview** — sandboxed dev server with a shareable `*.e2b.app` URL, visible the moment the first page is reachable
- **Model choice** — Claude Sonnet / Opus via Anthropic API, or a local Ollama model (free, no credits used)
- **Credit system** — 1 credit per agent step; Free plan ships with 50 credits, Pro with 1,500/month
- **Stripe billing** — subscription tiers (Hobby free · Pro $24/mo · Team $89/mo) and one-off credit top-ups
- **GitHub integration** *(Pro)* — connect your GitHub account and push the scaffolded project to a new repo
- **One-click deploy** *(Pro)* — deploy to Vercel directly from the workspace
- **Auth** — email + GitHub + Google OAuth via Supabase

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16, App Router, React 19, Turbopack |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (Postgres) + Drizzle ORM |
| Auth | Supabase Auth via `@supabase/ssr` |
| AI streaming | Vercel AI SDK v4 |
| AI providers | Anthropic (`claude-sonnet-4-6`, `claude-opus-4-6`), Ollama |
| Sandbox | E2B (Firecracker VMs) |
| Background jobs | Inngest |
| Payments | Stripe |
| Deployment | Vercel |

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.local` and fill in your keys (see the file for the full list):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
DATABASE_URL=
ANTHROPIC_API_KEY=
E2B_API_KEY=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Project structure

```
app/
  (marketing)/          Landing page
  (app)/
    dashboard/          Project list
    project/[id]/       Chat + live preview workspace
    settings/           Billing and profile
  api/                  Route handlers (chat, plan, sandbox, stripe, github)
components/
  landing/              PromptHero, FeatureScroll
  workspace/            ChatPane, PreviewPane, PlanCard, ModelSelector
  shared/               CreditBadge, ProGate
lib/
  supabase/             Browser + server Supabase clients
  db/schema/            Drizzle schema (users, projects, messages, credits, sandboxes)
  ai/                   Model registry, planner agent, executor agent
  e2b/                  Sandbox helpers
  stripe/               Stripe client
inngest/                Long-running build job (Inngest step functions)
```

## Design

Design tokens, component specs, and screen designs live in `docs/`. Open `docs/source/buildit.html` in a browser to view all screens on an interactive canvas.
