# buildit · Architecture brief

This is the developer-facing version of the on-canvas brief. Hand it to Claude Code alongside `README.md`.

---

## Host app (`apps/web` — buildit.app itself)

| Concern | Choice |
|---|---|
| Framework | Next.js 15 · App Router · React 19 |
| Styling | Tailwind v4 + shadcn/ui (radix primitives) |
| Auth | Supabase Auth — email + OAuth (GitHub, Google) |
| Database | Supabase Postgres + Row Level Security |
| Payments | Stripe — subscriptions + metered credit packs |
| Email | Resend (auth, billing, system mail) |
| Realtime | Supabase realtime channels for build status |
| Hosting | Vercel — mix Edge & Node runtimes |
| Observability | Sentry · Axiom logs · PostHog product analytics |
| Background jobs | Inngest — long-running agent jobs |

---

## Sandbox runtime (where user apps actually run)

| Concern | Choice |
|---|---|
| Provider | **E2B** (Firecracker VMs) |
| Lifecycle | One sandbox per project · 2h idle TTL · resume from snapshot |
| Preview URLs | `*.e2b.app` subdomains, proxied through a buildit edge route for auth/credits |
| User databases | **Neon** branching API (Postgres-per-project) — free tier, fast cold-start |
| Or fallback | Supabase Management API (1 free project per user). Start with this for v0, migrate to Neon at scale (cost) |
| Secrets | Per-sandbox env vars injected at boot from Supabase Vault |
| File sync | E2B filesystem API; debounce + diff on save |
| Logs | Tail container stdout/stderr → realtime stream over Supabase |
| Cold start | Keep a pre-warmed pool of ~5 idle VMs in us-east to keep first-build < 4s |

### Important
- Querying Ollama (`localhost:11434`) must happen **client-side** in the user's browser. Don't try it from server code.
- Preview URLs default to public + share toggle to gate; password-protect mode is a Pro feature.

---

## Agent loop (`packages/agent`)

| Concern | Choice |
|---|---|
| Orchestrator | Vercel AI SDK + custom tool runtime |
| Models | Claude Sonnet 4.5 default · Opus 4 · Haiku 4.5 · GPT-5 · o4-mini · local Ollama |
| Ollama protocol | OpenAI-compatible chat completions endpoint at `/v1/chat/completions` |
| Modes | `plan` · `build` · `iterate` · `debug` — different system prompts + tool sets |
| Tools | `fs.read` · `fs.write` · `shell.run` · `db.migrate` · `pkg.install` · `preview.reload` |
| Memory | Per-project conversation log + summarized milestones |
| Plan output | Structured JSON; **validate with Zod** before rendering |

### Plan JSON shape (proposed)
```ts
const PlanSchema = z.object({
  appType: z.enum(['frontend-only', 'webapp-with-auth', 'saas-full-stack', 'marketing-page']),
  pages: z.array(z.object({ id: z.string(), name: z.string(), required: z.boolean() })),
  data: z.array(z.object({ id: z.string(), name: z.string(), required: z.boolean() })),
  integrations: z.array(z.object({ id: z.string(), name: z.string(), required: z.boolean() })),
  starterKitArgs: z.array(z.string()), // e.g. ['--auth=supabase', '--db=postgres']
  estimateMinutes: z.number(),
  estimateCredits: z.number(),
});
```

The UI binds checkbox state to these arrays; **Build** sends the filtered plan to `POST /api/build`.

---

## Starter kit · `create-buildit-app`

Internal-only — never exposed to end users. The agent shells out to it inside the sandbox.

| Concern | Choice |
|---|---|
| Distribution | `npx create-buildit-app` — published to internal npm |
| Args | `--auth=supabase\|none` · `--db=postgres\|none` · `--payments=stripe\|none` · `--email=resend\|none` · `--analytics=posthog\|none` · `--ui=shadcn` |
| Templates | `frontend-only` · `webapp-with-auth` · `saas-full-stack` · `marketing-page` |
| Output | Next.js project, README with .env keys, deploy.md, Dockerfile |
| Implementation | Plop-style template engine; templates live in `packages/starter/templates/` |

---

## Credits & billing

| Concern | Choice |
|---|---|
| Unit | 1 credit ≈ 1 agent step (one tool call + one model turn) |
| Pricing math | Hosted model cost × 1.5 markup; local Ollama = free |
| Plans | Hobby 100/mo · Pro $24/1.5k · Team $89/6k pooled |
| Top-ups | Stripe payment links: 500/$8 · 1.5k/$22 · 5k/$65 |
| Tracking | `credit_events` table → aggregated to `user_credits.current` |
| Limits | Soft warn @ 80%, hard stop @ 100%, resume on top-up via Stripe webhook |

### Stripe schema
- Products: `pro_monthly`, `pro_annual`, `team_monthly`, `team_annual`, `topup_500`, `topup_1500`, `topup_5000`.
- Webhooks: idempotent on `event.id`, write to `stripe_events`, then dispatch to credit logic.

---

## Security & data

- User secrets in Supabase Vault; decrypted only at sandbox boot.
- One Firecracker VM per project, no shared mounts.
- Supabase JWT for auth boundary; RLS on every table.
- Stripe webhooks signed + replay-safe (event.id idempotency).
- Daily Supabase snapshots for buildit data; user app databases are the user's responsibility (link out to Neon dashboard).
- Outbound HTTP from sandboxes is allowed but rate-limited per sandbox.

---

## Suggested repo layout

```
buildit/
├── apps/
│   └── web/                  Next.js host app (chat, dashboard, billing, auth)
├── packages/
│   ├── starter/              create-buildit-app — template engine + flags
│   ├── agent/                tool runtime, plan parser, model router
│   ├── sandbox/              E2B client + lifecycle helpers
│   ├── db/                   Supabase types + RLS policies
│   └── ui/                   shadcn-based component library
├── services/
│   └── builder/              Inngest functions — long-running build jobs
└── infra/
    ├── stripe/               product+price seed scripts
    └── neon/                 user-db provisioning helpers
```

---

## End-to-end flow

1. User describes idea on landing page → routed to `/workspace/[id]`.
2. Agent enters **plan mode** → asks 2-4 scoping questions (auth, db, integrations).
3. Agent emits Plan JSON. UI renders the sectioned plan card above the input.
4. User toggles features, clicks **Build** → `POST /api/build` with checked feature set.
5. Builder service calls `create-buildit-app` with computed flags, gets project files.
6. Files uploaded to E2B sandbox; `npm install` → `next dev` runs on internal port.
7. Preview URL streamed back; agent continues iterating in chat.
8. Each agent step decrements credits; soft-warn at 80%, hard-stop at 100%.

---

## Open questions / things to decide early

- **Per-user Supabase project (management API) vs. Supabase + Neon branching for user data.** Recommendation: ship v0 with Neon for cost, but it's fine to start with Supabase project-per-user if Neon's API is unfamiliar.
- **Preview URL default visibility** — recommend public + share toggle.
- **Pre-warming aggressiveness** — start with 5 VMs in us-east, scale by hour-of-day after a week of data.
- **Plan JSON schema** — define in `packages/agent/plan.ts` first; model output must validate or the build button stays disabled.
- **Ollama detection is client-side only** — opt-in via Settings.
