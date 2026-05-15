// Tech stack brief — a structured handoff doc for Claude Code.
// Lives at the top of the canvas. Light theme always (it's a doc).

function TechBrief() {
  return (
    <Frame theme="light" style={{ overflow: 'auto' }}>
      <div style={{ padding: '36px 48px', maxWidth: 980, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={20} />
            <span style={{ color: 'var(--fg-faint)' }}>/</span>
            <span className="mono" style={{ fontSize: 12, color: 'var(--fg-muted)' }}>handoff.md</span>
          </div>
          <span className="chip"><span className="chip-dot"></span> v0.1 · brief</span>
        </div>

        <h1 style={{ fontSize: 44, lineHeight: 1.05, letterSpacing: '-0.02em', fontWeight: 460, marginBottom: 8 }}>
          buildit · <span className="serif-it" style={{ color: 'var(--accent)' }}>tech stack & architecture</span>
        </h1>
        <p style={{ fontSize: 14.5, color: 'var(--fg-dim)', lineHeight: 1.6, maxWidth: 720 }}>
          Recommendations for the host app (buildit itself) and the runtime sandbox where user apps live. Tailored to your preferences: Next.js App Router, Tailwind, shadcn/ui, Supabase, Stripe, E2B sandboxes.
        </p>

        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {/* host app */}
          <Section title="Host app (buildit.app)" mark="A">
            <Pair k="Framework" v="Next.js 15 · App Router · React 19" />
            <Pair k="Styling" v="Tailwind v4 + shadcn/ui (radix primitives)" />
            <Pair k="Auth" v="Supabase Auth (email + OAuth: GitHub, Google)" />
            <Pair k="Database" v="Supabase Postgres + Row Level Security" />
            <Pair k="Payments" v="Stripe · subscriptions + metered credit packs" />
            <Pair k="Email" v="Resend (auth, billing, system mail)" />
            <Pair k="Realtime" v="Supabase realtime channels for build status" />
            <Pair k="Hosting" v="Vercel (Edge + Node runtimes mixed)" />
            <Pair k="Observability" v="Sentry · Axiom · PostHog product analytics" />
            <Pair k="Queue" v="Inngest for long-running agent jobs" />
          </Section>

          {/* sandbox */}
          <Section title="Sandbox runtime (user apps)" mark="B">
            <Pair k="Provider" v="E2B (Firecracker VMs)" />
            <Pair k="Lifecycle" v="One sandbox per project · 2h idle TTL · resume from snapshot" />
            <Pair k="Preview URL" v="*.e2b.app subdomains · proxy through buildit edge" />
            <Pair k="User DBs" v="Neon branching API (Postgres-per-project, free tier)" />
            <Pair k="Or Supabase" v="Management API · 1 free project per user OK to start; switch to Neon at scale" />
            <Pair k="Secrets" v="Per-sandbox env vars injected at boot" />
            <Pair k="File sync" v="E2B filesystem API; debounce + diff on save" />
            <Pair k="Logs" v="Tail container stdout/stderr → realtime stream" />
            <Pair k="Cold start" v="Pre-warm pool of 5 idle VMs to keep first-build &lt; 4s" />
          </Section>

          {/* agent */}
          <Section title="Agent loop" mark="C">
            <Pair k="Orchestrator" v="Vercel AI SDK + custom tool runtime" />
            <Pair k="Models" v="Claude Sonnet 4.5 (default), Opus, Haiku · GPT-5 · local Ollama" />
            <Pair k="Ollama" v="Detect daemon via /api/tags; stream OpenAI-compatible chat" />
            <Pair k="Modes" v="plan · build · iterate · debug (different system prompts + tool sets)" />
            <Pair k="Tools" v="fs.read · fs.write · shell.run · db.migrate · pkg.install · preview.reload" />
            <Pair k="Memory" v="Per-project conversation log + summarized milestones" />
            <Pair k="Plan output" v="Structured JSON: features[], tables[], integrations[], starterKitArgs" />
          </Section>

          {/* starter kit */}
          <Section title="Starter kit · create-buildit-app" mark="D">
            <Pair k="Distribution" v="npx create-buildit-app — published to npm" />
            <Pair k="Invocation" v="Internal; called by agent inside sandbox, never user-facing" />
            <Pair k="Args" v="--auth=supabase|none · --db=postgres|none · --payments=stripe|none" />
            <Pair k="More args" v="--email=resend · --analytics=posthog · --ui=shadcn (default)" />
            <Pair k="Templates" v="frontend-only · webapp-with-auth · saas-full-stack · marketing-page" />
            <Pair k="Output" v="Next.js project, README with .env keys, deploy.md, Dockerfile" />
            <Pair k="Implementation" v="Plop-style template engine; templates live in /packages/starter" />
          </Section>

          {/* credits */}
          <Section title="Credits & billing" mark="E">
            <Pair k="Unit" v="1 credit ≈ 1 agent step (one tool call + one model turn)" />
            <Pair k="Pricing" v="Hosted models pass through cost × 1.5 markup; local = free" />
            <Pair k="Plans" v="Hobby 100/mo · Pro $24/1.5k · Team $89/6k pooled" />
            <Pair k="Top-ups" v="Stripe payment links: 500/$8 · 1.5k/$22 · 5k/$65" />
            <Pair k="Tracking" v="credit_events table; aggregated to user_credits.current" />
            <Pair k="Limits" v="Soft warn @ 80% · hard stop @ 100% · resume on top-up via webhook" />
          </Section>

          {/* security */}
          <Section title="Security & data" mark="F">
            <Pair k="User secrets" v="Stored in Supabase Vault; decrypted only at sandbox boot" />
            <Pair k="Isolation" v="One Firecracker VM per project; no shared mounts" />
            <Pair k="Auth boundary" v="Supabase JWT; RLS policies on every table" />
            <Pair k="Stripe webhooks" v="Signed; replay-safe via event.id idempotency keys" />
            <Pair k="Backups" v="Daily Supabase snapshots; user app DBs are their responsibility" />
            <Pair k="Egress" v="Outbound HTTP allowed; rate-limited per sandbox" />
          </Section>
        </div>

        {/* repo structure */}
        <h2 style={{ marginTop: 36, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Suggested repo layout</h2>
        <pre className="mono" style={{ marginTop: 12, padding: 18, background: 'var(--code-bg)', color: 'var(--code-fg)', borderRadius: 12, fontSize: 12.5, lineHeight: 1.6, overflow: 'auto' }}>
{`buildit/
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
    └── neon/                 user-db provisioning helpers`}
        </pre>

        {/* flow */}
        <h2 style={{ marginTop: 32, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>End-to-end flow</h2>
        <ol style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['1', 'User describes idea on landing page → routed to /workspace/[id]'],
            ['2', 'Agent enters plan mode → asks 2-4 scoping questions (auth, db, integrations)'],
            ['3', 'Agent emits Plan JSON. UI renders the expandable plan bar above the input.'],
            ['4', 'User toggles features, clicks Build → POST /api/build with checked feature set'],
            ['5', 'Builder service calls create-buildit-app with flags, gets project files'],
            ['6', 'Files uploaded to E2B sandbox; npm install → next dev runs on internal port'],
            ['7', 'Preview URL streamed back; agent continues iterating in chat'],
            ['8', 'Each agent step decrements credits; soft-warn at 80%, hard-stop at 100%'],
          ].map(([n, t]) => (
            <li key={n} style={{ display: 'flex', gap: 14, fontSize: 13.5, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
              <span className="mono" style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--accent)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flex: 'none' }}>{n}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>

        {/* questions / risks */}
        <h2 style={{ marginTop: 32, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Open questions for Claude Code</h2>
        <ul style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Per-user Supabase project (management API) vs. shared Supabase + Neon branching for user data — recommended path is Neon for cost, but Supabase is simpler for v0.',
            'Should preview URLs be public-by-default or password-gated? Default to public + share toggle.',
            'How aggressive should pre-warming be? Tunable; start with 5 VMs in us-east, scale by hour.',
            'Plan JSON schema — define a Zod schema in packages/agent/plan.ts so the model output is validated before render.',
            'Ollama detection should be opt-in (toggle in settings) — querying localhost:11434 from a deployed app needs a local browser-side ping, not server-side.',
          ].map((t, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--fg-dim)', lineHeight: 1.55 }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--accent)', marginTop: 9, flex: 'none' }}></span>
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 36, padding: 18, background: 'var(--accent-faint)', border: '1px solid var(--accent-soft)', borderRadius: 12, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <Icon d={Icons.sparkle} size={18} stroke={2}/>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Designer's note → Claude Code</div>
            <p style={{ fontSize: 13, color: 'var(--fg-dim)', marginTop: 4, lineHeight: 1.55 }}>
              The screens to the right of this doc cover landing (3 hero variations), the plan-mode bar (3 variations), workspace, empty/loading states (3), dashboard, pricing, auth, and the model picker. Visual tokens live in <code className="mono" style={{ fontSize: 11.5, background: 'var(--bg-elev)', padding: '1px 6px', borderRadius: 4 }}>styles.css</code> — copy them into your shadcn theme. Brand mark is the wordmark in <code className="mono" style={{ fontSize: 11.5, background: 'var(--bg-elev)', padding: '1px 6px', borderRadius: 4 }}>Instrument Serif</code> italic on "it".
            </p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Section({ title, mark, children }) {
  return (
    <div style={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span className="mono" style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--accent)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{mark}</span>
        <h3 style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  );
}

function Pair({ k, v }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 10, alignItems: 'baseline' }}>
      <span style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</span>
      <span style={{ fontSize: 12.5, color: 'var(--fg-dim)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: v }} />
    </div>
  );
}

Object.assign(window, { TechBrief });
