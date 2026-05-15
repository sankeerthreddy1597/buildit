# Build plan: AI app builder (main app)

> Hand this file directly to Claude Code. It contains every implementation detail needed to build the main application — the Lovable-style product where users describe what they want to build and an AI agent scaffolds, builds, and previews it.

---

## Project overview

A web application where users type a prompt describing an app they want to build. The AI agent enters a **plan mode** first (asking clarifying questions), produces a structured plan, and only then allows the user to click **Build**. Once building, the agent scaffolds a project inside an E2B sandbox, runs a dev server, and streams the live preview URL into an iframe on the right side of the screen.

Users can choose their AI model (Claude or local Ollama). Credits are consumed per prompt. Pro users unlock GitHub integration and one-click publish via Vercel.

---

## Tech stack (locked)

| Layer | Choice | Version / notes |
|---|---|---|
| Framework | Next.js | **15.5** — App Router, React 19, Turbopack dev, Node.js middleware (stable in 15.5) |
| Styling | Tailwind CSS v4 | Ships with `create-next-app` by default |
| Database | Supabase (Postgres) | Use connection pooling URL with `prepare: false` |
| Auth | Supabase Auth via `@supabase/ssr` | **Do NOT use** the deprecated `@supabase/auth-helpers-nextjs` |
| ORM | Drizzle ORM + `drizzle-kit` | `drizzle-orm/postgres-js` driver, `dialect: 'postgresql'` |
| AI streaming | Vercel AI SDK v4 (`ai` package) | `useChat` from `@ai-sdk/react`, `streamText` on server |
| AI providers | `@ai-sdk/anthropic`, custom Ollama adapter | Unified provider interface |
| Sandbox | E2B (`e2b` npm package) | `sandbox.getHost(port)` for live preview URL |
| Background jobs | Inngest | Agent executor runs as Inngest step functions |
| Payments | Stripe | API version `2025-08-27.basil`, webhook at `/api/webhooks/stripe` |
| Deployment | Vercel | |

---

## Repository structure

```
/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx                  ← Landing page with prompt hero
│   ├── (app)/
│   │   ├── layout.tsx                ← Auth check, sidebar shell
│   │   ├── dashboard/page.tsx        ← Project list
│   │   ├── project/[id]/page.tsx     ← Chat + live preview split pane
│   │   └── settings/
│   │       ├── billing/page.tsx      ← Stripe customer portal redirect
│   │       └── profile/page.tsx
│   └── api/
│       ├── chat/route.ts             ← AI streaming endpoint
│       ├── plan/route.ts             ← Plan mode endpoint
│       ├── sandbox/
│       │   ├── create/route.ts       ← Spin up E2B sandbox
│       │   └── status/route.ts       ← Poll sandbox state
│       ├── projects/route.ts         ← CRUD for projects
│       ├── credits/route.ts          ← Deduct / read credits
│       ├── stripe/
│       │   ├── checkout/route.ts     ← Create checkout session
│       │   └── webhooks/route.ts     ← Stripe webhook handler
│       └── github/
│           ├── connect/route.ts      ← OAuth initiation (Pro)
│           └── push/route.ts         ← Push project to GitHub (Pro)
├── components/
│   ├── landing/
│   │   ├── PromptHero.tsx
│   │   └── FeatureScroll.tsx
│   ├── workspace/
│   │   ├── ChatPane.tsx
│   │   ├── PreviewPane.tsx           ← iframe with sandbox URL
│   │   ├── PlanCard.tsx              ← Structured plan display
│   │   └── ModelSelector.tsx
│   └── shared/
│       ├── CreditBadge.tsx
│       └── ProGate.tsx               ← Shows upgrade prompt for Pro features
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 ← createBrowserClient (client components)
│   │   └── server.ts                 ← createServerClient (server components / actions)
│   ├── db/
│   │   ├── index.ts                  ← Drizzle client
│   │   └── schema/
│   │       ├── users.ts
│   │       ├── projects.ts
│   │       ├── messages.ts
│   │       ├── credits.ts            ← Append-only credit ledger
│   │       └── sandboxes.ts
│   ├── ai/
│   │   ├── providers.ts              ← Model registry (Claude, Ollama)
│   │   ├── planner.ts                ← Plan mode agent logic
│   │   └── executor.ts               ← Build mode agent logic
│   ├── e2b/
│   │   └── sandbox.ts                ← E2B sandbox helpers
│   ├── stripe/
│   │   └── client.ts                 ← Stripe SDK init
│   └── github/
│       └── client.ts                 ← Octokit client (Pro only)
├── inngest/
│   ├── client.ts
│   └── functions/
│       └── build-project.ts          ← Long-running agent executor
├── proxy.ts                          ← Next.js 15.5 middleware (renamed from middleware.ts)
├── drizzle.config.ts
└── .env.local
```

---

## Environment variables

```bash
# Supabase — use NEW key format (sb_publishable_xxx / sb_secret_xxx)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=    # replaces ANON key
SUPABASE_SECRET_KEY=                      # replaces SERVICE_ROLE key
DATABASE_URL=                             # Supabase connection pooler URL (Transaction mode)

# AI
ANTHROPIC_API_KEY=
# Ollama runs locally — no key needed, proxied through /api/chat

# E2B
E2B_API_KEY=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=                    # whsec_... from Stripe dashboard

# GitHub OAuth (Pro feature)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Auth setup (Supabase SSR)

Use `@supabase/supabase-js` and `@supabase/ssr`. **Never use `@supabase/auth-helpers-nextjs`** — it is deprecated and will break production.

### `lib/supabase/server.ts`

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

### `lib/supabase/client.ts`

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

### `proxy.ts` (Next.js 15.5 — file renamed from `middleware.ts`)

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — do NOT remove this
  const { data: { user } } = await supabase.auth.getUser()

  // Protect /dashboard and /project routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

**Important:** In Next.js 15.5, the file is `proxy.ts` (not `middleware.ts`). The export is named `proxy` (not `middleware`). The edge runtime is NOT supported in `proxy.ts` — it runs Node.js.

---

## Database schema (Drizzle)

### `drizzle.config.ts`

```ts
import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: './lib/db/schema',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
})
```

### `lib/db/index.ts`

```ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Transaction pool mode — disable prepare
const client = postgres(process.env.DATABASE_URL!, { prepare: false })
export const db = drizzle({ client })
```

### Schema tables

**`lib/db/schema/users.ts`**
```ts
import { pgTable, uuid, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const planEnum = pgEnum('plan', ['free', 'pro'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),              // Matches Supabase auth.users.id
  email: text('email').notNull().unique(),
  plan: planEnum('plan').default('free').notNull(),
  creditBalance: integer('credit_balance').default(50).notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  githubAccessToken: text('github_access_token'),  // Pro only — store encrypted
  createdAt: timestamp('created_at').defaultNow(),
})
```

**`lib/db/schema/projects.ts`**
```ts
import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const projectStatusEnum = pgEnum('project_status', [
  'planning', 'building', 'ready', 'error'
])

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  status: projectStatusEnum('status').default('planning').notNull(),
  plan: text('plan'),                       // JSON: structured plan from planner agent
  starterKitArgs: text('starter_kit_args'), // e.g. "--features auth,db"
  sandboxId: text('sandbox_id'),
  previewUrl: text('preview_url'),
  githubRepoUrl: text('github_repo_url'),   // Pro
  vercelDeployUrl: text('vercel_deploy_url'), // Pro
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

**`lib/db/schema/messages.ts`**
```ts
import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('message_role', ['user', 'assistant', 'system'])
export const modeEnum = pgEnum('message_mode', ['plan', 'build'])

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id),
  role: roleEnum('role').notNull(),
  content: text('content').notNull(),
  mode: modeEnum('mode').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
```

**`lib/db/schema/credits.ts`** (append-only ledger)
```ts
import { pgTable, uuid, integer, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const creditTypeEnum = pgEnum('credit_type', ['debit', 'credit'])

export const creditLedger = pgTable('credit_ledger', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  type: creditTypeEnum('type').notNull(),
  amount: integer('amount').notNull(),      // Always positive
  reason: text('reason').notNull(),         // 'prompt', 'subscription', 'manual'
  projectId: uuid('project_id'),
  createdAt: timestamp('created_at').defaultNow(),
})
```

---

## AI layer

### Model provider registry — `lib/ai/providers.ts`

```ts
import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Ollama is OpenAI-compatible, proxied through /api/ollama on the backend
// so the browser never hits localhost:11434 directly
const ollama = createOpenAICompatible({
  name: 'ollama',
  baseURL: 'http://localhost:11434/v1',
})

export type ModelId = 'claude-sonnet-4-6' | 'claude-opus-4-6' | 'ollama/llama3'

export function getModel(modelId: ModelId) {
  if (modelId.startsWith('ollama/')) {
    return ollama(modelId.replace('ollama/', ''))
  }
  return anthropic(modelId)
}
```

### Plan mode — `app/api/plan/route.ts`

The planner asks clarifying questions and produces a structured JSON plan.

```ts
import { streamText } from 'ai'
import { getModel } from '@/lib/ai/providers'
import { createClient } from '@/lib/supabase/server'
import { deductCredits } from '@/lib/credits'

const PLANNER_SYSTEM = `
You are a planning assistant for an AI app builder. 
Given a user's app idea, ask clarifying questions to determine:
1. Is this frontend-only, or does it need backend/database?
2. Does it need authentication?
3. Does it need payments (Stripe)?
4. What is the primary user flow?

Once you have enough information, produce a structured plan in this exact JSON format:
{
  "appName": string,
  "description": string,
  "features": ["auth"|"db"|"stripe"|"github"],
  "userFlows": string[],
  "starterKitArgs": string,   // e.g. "--features auth,db"
  "estimatedCredits": number
}

Only output the JSON when the user confirms they are ready to build.
`

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { messages, projectId, modelId } = await req.json()

  const result = streamText({
    model: getModel(modelId ?? 'claude-sonnet-4-6'),
    system: PLANNER_SYSTEM,
    messages,
    onFinish: async ({ text }) => {
      // Save message to DB and deduct 1 credit per plan message
      await deductCredits(user.id, 1, 'plan_message', projectId)
    },
  })

  return result.toDataStreamResponse()
}
```

### Build mode — `inngest/functions/build-project.ts`

The executor runs as an Inngest step function to avoid serverless timeouts.

```ts
import { inngest } from '../client'
import { Sandbox } from 'e2b'
import { streamText } from 'ai'
import { getModel } from '@/lib/ai/providers'
import { db } from '@/lib/db'
import { projects, sandboxes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const buildProject = inngest.createFunction(
  { id: 'build-project' },
  { event: 'project/build.requested' },
  async ({ event, step }) => {
    const { projectId, userId, plan, modelId } = event.data

    // Step 1: Create E2B sandbox
    const sandbox = await step.run('create-sandbox', async () => {
      const sbx = await Sandbox.create({ timeoutMs: 3600000 }) // 1hr

      // Run the starter kit CLI
      await sbx.commands.run(
        `npx create-myapp@latest /home/user/project ${plan.starterKitArgs}`,
        { timeoutMs: 120000 }
      )

      // Start the dev server
      await sbx.commands.run(
        'cd /home/user/project && pnpm dev &',
        { background: true }
      )

      const previewUrl = `https://${sbx.getHost(3000)}`

      // Persist to DB
      await db.update(projects)
        .set({ sandboxId: sbx.sandboxId, previewUrl, status: 'building' })
        .where(eq(projects.id, projectId))

      return { sandboxId: sbx.sandboxId, previewUrl }
    })

    // Step 2: Agent writes files
    await step.run('agent-build', async () => {
      const sbx = await Sandbox.connect(sandbox.sandboxId)
      
      // Read AGENT_CONTEXT.md from the scaffolded project
      const context = await sbx.files.read('/home/user/project/AGENT_CONTEXT.md')

      const result = await streamText({
        model: getModel(modelId),
        system: `You are a full-stack developer. You have access to a Next.js project.
                 Project context:\n${context}\n
                 Write files using the write_file tool. Run commands using run_command.`,
        messages: [{ role: 'user', content: plan.description }],
        tools: {
          write_file: { /* writes to sbx.files.write */ },
          run_command: { /* runs in sbx.commands.run */ },
        },
        maxSteps: 20,
      })

      await db.update(projects)
        .set({ status: 'ready' })
        .where(eq(projects.id, projectId))
    })

    return { projectId, previewUrl: sandbox.previewUrl }
  }
)
```

---

## Live preview pane

The preview pane is an `<iframe>` pointed at `sandbox.getHost(3000)`.

```tsx
// components/workspace/PreviewPane.tsx
'use client'
import { useEffect, useState } from 'react'

export function PreviewPane({ previewUrl }: { previewUrl: string | null }) {
  if (!previewUrl) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Preview will appear here once the build starts
      </div>
    )
  }

  return (
    <iframe
      src={previewUrl}
      className="w-full h-full border-0"
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
  )
}
```

---

## Credits system

### Deducting credits atomically

```ts
// lib/credits.ts
import { db } from './db'
import { users, creditLedger } from './db/schema'
import { eq, sql } from 'drizzle-orm'

export async function deductCredits(
  userId: string,
  amount: number,
  reason: string,
  projectId?: string
) {
  return db.transaction(async (tx) => {
    // Optimistic deduction with floor at 0
    const [updated] = await tx
      .update(users)
      .set({ creditBalance: sql`GREATEST(credit_balance - ${amount}, 0)` })
      .where(eq(users.id, userId))
      .returning({ balance: users.creditBalance })

    // Append to ledger
    await tx.insert(creditLedger).values({
      userId, type: 'debit', amount, reason, projectId
    })

    return updated.balance
  })
}
```

### Webhook: top up credits on subscription renewal

```ts
// app/api/stripe/webhooks/route.ts
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { users, creditLedger } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Bad signature', { status: 400 })
  }

  switch (event.type) {
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      const [user] = await db.select()
        .from(users)
        .where(eq(users.stripeCustomerId, customerId))

      if (user) {
        const creditTopUp = 500 // Pro plan monthly credits
        await db.transaction(async (tx) => {
          await tx.update(users)
            .set({
              creditBalance: user.creditBalance + creditTopUp,
              plan: 'pro',
            })
            .where(eq(users.id, user.id))

          await tx.insert(creditLedger).values({
            userId: user.id,
            type: 'credit',
            amount: creditTopUp,
            reason: 'subscription',
          })
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await db.update(users)
        .set({ plan: 'free' })
        .where(eq(users.stripeSubscriptionId, sub.id))
      break
    }
  }

  return new Response('OK', { status: 200 })
}

// IMPORTANT: Stripe webhooks need raw body — disable body parsing
export const config = { api: { bodyParser: false } }
```

---

## GitHub integration (Pro only)

### Flow
1. User clicks "Connect GitHub" in settings (Pro gate check first)
2. Redirect to `https://github.com/login/oauth/authorize?client_id=...&scope=repo`
3. GitHub redirects to `/api/github/connect?code=...`
4. Exchange code for access token, store encrypted in `users.github_access_token`
5. When user publishes: call `/api/github/push` which creates a repo and pushes the scaffolded project

### `app/api/github/push/route.ts` (Pro gate pattern)

```ts
import { Octokit } from '@octokit/rest'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { users, projects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return new Response('Unauthorized', { status: 401 })

  // Pro gate
  const [dbUser] = await db.select().from(users).where(eq(users.id, authUser.id))
  if (dbUser.plan !== 'pro') {
    return new Response('Pro plan required', { status: 403 })
  }

  const { projectId } = await req.json()
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId))

  const octokit = new Octokit({ auth: dbUser.githubAccessToken })

  // Create repo
  const { data: repo } = await octokit.repos.createForAuthenticatedUser({
    name: project.name.toLowerCase().replace(/\s+/g, '-'),
    private: false,
    auto_init: false,
  })

  // TODO: Push files from E2B sandbox to the repo via git
  // Connect to sandbox, run: git remote add origin <repo.clone_url> && git push -u origin main

  await db.update(projects)
    .set({ githubRepoUrl: repo.html_url })
    .where(eq(projects.id, projectId))

  // Trigger Vercel deploy via Vercel API
  // POST https://api.vercel.com/v13/deployments with github repo details

  return Response.json({ repoUrl: repo.html_url })
}
```

---

## Landing page prompt hero

```tsx
// app/(marketing)/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LandingPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    // Create a new project with the initial prompt, then redirect
    const res = await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ initialPrompt: prompt }),
    })
    const { projectId } = await res.json()
    router.push(`/project/${projectId}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-medium mb-4 text-center">
        Describe the app you want to build
      </h1>
      <p className="text-muted-foreground mb-8 text-center max-w-lg">
        The AI plans first, asks questions, then builds and previews in seconds.
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="flex gap-2">
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="A task manager with auth and a Kanban board..."
            className="flex-1 rounded-xl border px-4 py-3 text-base"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-xl bg-foreground text-background px-6 py-3 font-medium"
          >
            Build
          </button>
        </div>
      </form>
      {/* Feature scroll sections below */}
    </main>
  )
}
```

---

## Workspace layout — chat + preview split

```tsx
// app/(app)/project/[id]/page.tsx
import { ChatPane } from '@/components/workspace/ChatPane'
import { PreviewPane } from '@/components/workspace/PreviewPane'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params   // Next.js 15 — params is now a Promise
  const [project] = await db.select().from(projects).where(eq(projects.id, id))

  return (
    <div className="flex h-screen">
      <div className="w-[420px] flex-shrink-0 border-r flex flex-col">
        <ChatPane projectId={id} initialStatus={project.status} />
      </div>
      <div className="flex-1">
        <PreviewPane previewUrl={project.previewUrl} />
      </div>
    </div>
  )
}
```

---

## Inngest setup

```ts
// inngest/client.ts
import { Inngest } from 'inngest'
export const inngest = new Inngest({ id: 'app-builder' })
```

```ts
// app/api/inngest/route.ts
import { serve } from 'inngest/next'
import { inngest } from '@/inngest/client'
import { buildProject } from '@/inngest/functions/build-project'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [buildProject],
})
```

---

## Model selector component

```tsx
// components/workspace/ModelSelector.tsx
'use client'
import { useState, useEffect } from 'react'

const CLOUD_MODELS = [
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { id: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
]

export function ModelSelector({ onSelect }: { onSelect: (id: string) => void }) {
  const [ollamaModels, setOllamaModels] = useState<string[]>([])

  useEffect(() => {
    // Check if Ollama is available locally via backend proxy
    fetch('/api/ollama/models')
      .then(r => r.json())
      .then(data => setOllamaModels(data.models ?? []))
      .catch(() => {})
  }, [])

  return (
    <select onChange={e => onSelect(e.target.value)} className="rounded border px-2 py-1 text-sm">
      <optgroup label="Cloud">
        {CLOUD_MODELS.map(m => (
          <option key={m.id} value={m.id}>{m.label}</option>
        ))}
      </optgroup>
      {ollamaModels.length > 0 && (
        <optgroup label="Local (Ollama)">
          {ollamaModels.map(m => (
            <option key={m} value={`ollama/${m}`}>{m}</option>
          ))}
        </optgroup>
      )}
    </select>
  )
}
```

---

## Key implementation notes for Claude Code

1. **Next.js 15.5 breaking changes:**
   - `middleware.ts` → `proxy.ts`, export `proxy` not `middleware`
   - `params` in page/layout is now `Promise<{...}>` — always `await params`
   - GET route handlers are no longer cached by default

2. **Supabase auth:** Always use `getClaims()` for protecting server routes (local JWT verification). Use `getUser()` only when you need fresh data from the Auth server.

3. **Drizzle + Supabase pooler:** Always set `{ prepare: false }` on the postgres client because Supabase uses Transaction pool mode.

4. **Stripe webhook:** The route must receive the raw request body. Do NOT parse it as JSON before calling `stripe.webhooks.constructEvent`.

5. **E2B preview URL:** Use `sandbox.getHost(3000)` — this returns a hostname (not a full URL). Prefix with `https://` to get the iframe src.

6. **Credit deduction:** Always use a Postgres transaction when deducting credits to prevent race conditions.

7. **Pro gate pattern:** Check `user.plan === 'pro'` server-side in every Pro route handler. Never trust client-side plan checks.

8. **Inngest timeout:** Vercel serverless functions time out at 60s max. Any build that runs longer MUST go through Inngest step functions.