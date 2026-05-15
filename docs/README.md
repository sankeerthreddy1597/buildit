# Handoff: buildit

> An AI app-builder (Lovable-style) — landing page, plan-mode chat, live preview sandbox, credits/billing.

---

## About the design files

The files in `source/` are **design references created as a single React-in-HTML prototype**. They are *not* production code to copy directly — they exist to show intended look, layout, copy, and interactions. Your task is to **recreate these designs in a real Next.js codebase** following the architecture described in `ARCHITECTURE.md` and the conventions of your chosen UI library (shadcn/ui).

Open `source/buildit.html` in a browser to see all screens on a pan/zoom canvas. Pre-finalized variations live in `source/screens-*.jsx` if you ever want to revisit.

## Fidelity

**High-fidelity.** Final colors, typography, spacing, copy, and component behavior are all decided. Recreate pixel-perfectly using shadcn/ui primitives — match the exact tokens listed below.

---

## Visual system (finalized)

### Brand mark
The wordmark is `build` in the UI sans (system / SF / Geist), immediately followed by `it` in **Instrument Serif italic**, same line. A small filled square in the accent color sits to the left of the wordmark as a mark. See `source/shared.jsx` → `Logo`.

### Typography
- **UI sans** — system stack: `ui-sans-serif, system-ui, -apple-system, "SF Pro Display", "Segoe UI", sans-serif`. Weights 460 / 500 / 550 / 600.
- **Display serif** — `"Instrument Serif"` (Google Fonts). Italic variant used for accent words like *build*, *brewing*, *projects*, *coffee*. Slightly larger size than surrounding sans (10–15% bump) for optical balance.
- **Mono** — `"JetBrains Mono"`. Used for: code, tool-call names, credit counts, route paths, kbd shortcuts, all-caps section labels.
- **Hand** (optional) — `"Caveat"` for margin-note annotations on the landing hero only. Color: accent.

### Color tokens

Light theme:
```
--bg:            #f7f3ec   /* warm cream */
--bg-elev:       #ffffff
--bg-soft:       #efe9de
--fg:            #1a1612
--fg-dim:        #4a4137
--fg-muted:      #8a7e6c
--fg-faint:      #b4a896
--border:        #e2d8c4
--border-strong: #c9bca2
--accent:        #5a8a4a   /* forest green */
--accent-hover:  #4c7a3e
--accent-soft:   #d3e1c4
--accent-faint:  #ecf2e4
--ok:            #5a8a4a   /* same as accent — intentional */
--warn:          #c98b1e
--danger:        #b03830
```

Dark theme:
```
--bg:            #14110d
--bg-elev:       #1d1914
--bg-soft:       #1a1612
--fg:            #f0e8da
--fg-dim:        #c8bea8
--fg-muted:      #8a7e6c
--fg-faint:      #5a5043
--border:        #2a241d
--border-strong: #3a3229
--accent:        #82b06d   /* lifted green for dark */
--accent-hover:  #94c47e
--accent-soft:   #1f2a18
--accent-faint:  #161e10
```

Full token list with shadows, radii, and helpers is in `source/styles.css`.

### Spacing & radii
- Border radius scale: `4 · 6 · 8 · 10 · 12 · 14 · 18` (px). Pill = `999px`.
- Card radius: `14`. Button radius: `10`. Input radius: `9–12`. Chip radius: `999`.
- Shadow scale (warm-tinted): `--shadow-sm / -md / -lg` — see `styles.css`.

---

## Screens (finalized)

### 1 · Landing — editorial centered

`source/screens-landing.jsx` → `LandingA`

- **Top nav** (height 64, padding 0/40): logo left · text links center (`Showcase · Pricing · Docs · Changelog`) · `Sign in` ghost button + `Get started` primary button right.
- **Hero** (centered column, padding-top 130):
  - Eyebrow chip: green dot + "Now in public beta" + "Bring your own model →" (faded separator).
  - Headline, 96px / line-height 0.95 / letter-spacing -0.04em: three-line wordmark-style headline. The word "build" is Instrument Serif italic at 110px in accent green; everything else is the UI sans at weight 460. Use `text-wrap: pretty`.
  - Subhead, 18px / fg-dim / max-width 600 / center-aligned.
  - **Prompt input** (component, see below) — width 720, margin-top 44, with two `MarginNote` annotations to its right and below-left (Caveat font, accent color, hand-drawn arrow SVG).
  - **Suggestion chips** below the input — 4 chips with sparkle icon: "A read-it-later app with tags", "Internal CRM with Stripe billing", "Landing page for my podcast", "Pomodoro timer with leaderboard".
- **Scroll affordance** at the bottom: gradient fade + "How it works ↓".

#### PromptInput component (reused on landing + workspace)
- White card, border, shadow-md, radius 18, padding 18.
- Placeholder text (16px fg-faint, min-height 56–84).
- Footer row: `Attach` icon button · model picker pill (green dot + "Claude Sonnet 4.5" + chev-down) · spacer · 36×36 primary button with ↑ icon, accent background.

---

### 2 · Plan mode — sectioned grid

`source/screens-plan.jsx` → `PlanB`

The plan card sits **above the chat input** in the workspace. When collapsed it's a single pill; when expanded (shown here):

- Card: bg-elev / border / shadow-md / radius 14.
- **Header row** (padding 14/16, border-bottom):
  - Left: pulsing accent dot + bold "Plan ready · review before building" + sub-row of summary stats (`4 pages · 3 tables · 2 integrations · est. ~6 min · ~38 credits`).
  - Right: ghost "Starter args" button (code icon) + primary "Build → ↵" button with a kbd-style return key inside.
- **Three-column section grid** (split by 1px vertical borders):
  - **Pages** (monitor icon) — `Sign in / sign up`, `Dashboard (today's habits)`, `Habit detail + history`, `Settings & notifications`.
  - **Data model** (database icon) — `users, habits, completions tables` (•req), `categories`, `shared_habits` (off).
  - **Integrations** (bolt icon) — `Supabase auth` (•req), `Resend (daily email)`, `Stripe (premium tier)` (off).
  - Each item is a checkbox row: 16×16 square (accent fill when on), 12.5px name (strikethrough when off), tiny `•req` mono tag for required items.
- Below the card: footnote with sparkle icon — "You can keep iterating after the first build — uncheck anything to defer it."

#### State / behavior
- Toggling a checkbox is local UI state; on **Build**, POST the checked feature set + plan JSON to `/api/build`.
- Required items are not interactive.
- The plan JSON shape lives in `packages/agent/plan.ts` (Zod-validated) — see `ARCHITECTURE.md`.

---

### 3 · Workspace — chat + live preview

`source/screens-workspace.jsx` → `Workspace`

Two-pane split: **420px chat | flex preview**.

#### Topbar (height 52)
- Logo / `habit-streak` (project name, click to rename) / `main` branch pill.
- Right: History button · Connect repo button (github icon) · Share outline button · primary `Deploy` button · user avatar.

#### Chat pane (left)
- Section header: sparkle icon + "Conversation · 4 turns" + kebab.
- Message stream (gap 12, padding 14):
  - **User messages**: aligned right, max-width 85%, accent-faint background, accent-soft border, radius `12 12 4 12`.
  - **Agent messages**: 22px accent avatar with sparkle, fg-dim 12.5px text. Sub-replies indent under the same avatar (no second avatar).
  - **Inline plan card** (when agent emits a plan): nested card with `Build plan` header, condensed feature list (one line), small primary `Build` button.
  - **Tool-call blocks**: card per tool with checkbox icon (filled green when done, accent ring when running, gray dot when queued) + mono tool name + meta + ms timing on the right. Spin animation on running.
- Input dock (padding 14): standard PromptInput-shaped block with placeholder "Tweak the design or ask for a new feature…", model pill, credits counter on the right (`847 credits` mono), 28×28 primary send button.

#### Preview pane (right) — background bg-soft
- Toolbar (padding 8/14, border-bottom):
  - Segmented tab control: `Preview · Code · Database · Logs` (eye / code / database / refresh icons). Active tab gets bg-elev background + shadow-sm.
  - Device toggle: desktop / mobile icons.
  - Refresh + external-link buttons.
  - URL pill (mono): `habit-streak-9f2e.e2b.app`.
- Preview frame: white card, radius 14, shadow-lg, max-width 900, padding 20 around it. The rendered user-app is always shown in *its own* light theme regardless of buildit's theme — it's a sandboxed page, not part of the host UI.
- "LIVE" badge top-left of the preview (accent, pulse dot).
- Footer status bar (padding 6/14, top-border): green dot + `Sandbox: us-east · 142 MB / 1 GB · ttl 2h` · `Last build: 38s ago · ✓ 0 errors` · `cmd+k commands`.

---

### 4 · Build in progress — streaming task list

`source/screens-workspace.jsx` → `EmptyA`

Shown in the **right preview pane** while the first build runs.

- Centered column, padding 40.
- Top: pulsing accent dot + uppercase mono "BUILDING".
- Headline: "**Brewing** your app…" — *Brewing* in Instrument Serif italic, accent color.
- Subhead: "This usually takes about 90 seconds. We'll show the preview as soon as the first page is reachable."
- **Task card** (width 480, bg-elev, border, shadow-md, radius 12, padding 14): one row per task, divided by border-bottom (none on last).
  - Status indicator (16×16): filled green check for done · spinning accent ring for running · small gray dot for queued.
  - Task name (13px, muted when queued).
  - Mono duration (`1.2s`, `18.6s`, …) right-aligned, only on completed tasks.
- Footer line: italic accent fun-fact ("You can iterate while we build — just keep chatting.").

#### Default task list (replace with real telemetry)
```
✓ Bootstrapping starter kit         1.2s
✓ Installing 142 dependencies      18.6s
✓ Generating schema · 3 tables      0.8s
⟳ Wiring Supabase auth                –
∘ Scaffolding pages                   –
∘ Configuring Resend                  –
```

---

### 5 · Project dashboard

`source/screens-misc.jsx` → `Dashboard`

- **Left sidebar (220px)**: logo, nav (Projects active · Templates · Models · Credits · Settings), credit usage card with progress bar + "Buy more credits" link, user row at bottom.
- **Main**:
  - Page title with italic "projects" accent + meta line.
  - Filter row: search input · "From template" outline button · "+ New project" primary button.
  - Tab bar: All (active, underline accent) · Live · Building · Drafts · Archived.
  - 3-column grid of project cards:
    - Thumbnail (height 130, soft per-project color, big serif initial).
    - Status pill top-left of thumb (`LIVE / DRAFT / BUILDING / ARCHIVED`) with status dot (green / muted / pulsing accent / faint).
    - Body: name + kebab · description (12px muted) · stack chips (`Next`, `Supabase`, `Resend`) on the left, relative time on the right.

---

### 6 · Pricing & credits

`source/screens-misc.jsx` → `Pricing`

- Landing nav reused.
- Centered hero: chip ("Credits, not seats. Cancel anytime.") · 62px headline ("Pay for what you **build**.") · subhead · monthly/annual toggle (segmented).
- 3 tier cards in a grid — `Hobby (free) · Pro ($24, popular, dark card, lifted) · Team ($89)`:
  - Italic accent tier name + mono credit count.
  - Sub + price ($N / month).
  - Primary CTA per card.
  - Divider + check-list of features (small accent circle with check).
- Below: dashed-border "Top up anytime" panel with 3 credit-pack buttons (`500/$8 · 1,500/$22 · 5,000/$65`).

---

### 7 · Auth — sign in & sign up

`source/screens-misc.jsx` → `AuthPanel` (prop `mode: 'signin' | 'signup'`)

Split layout (1fr / 1.1fr):
- **Left brand panel** (bg-soft): logo top · centered chip + 44px headline ("Pick up where you **left** off." — "left" italic accent) · subhead · testimonial pull-quote at the bottom with avatar.
- **Right form** (centered, max-width 360):
  - Segmented toggle "Sign in / Create account" at top.
  - H3 title + sub.
  - Two OAuth buttons: `Continue with GitHub` (gh icon) · `Continue with Google` (multicolor G).
  - "OR" divider.
  - Form fields (Name if signup) · Email · Password (Forgot? link on the right of the password label in signin mode).
  - Primary submit button.
  - Legal footer.

---

### 8 · Model picker

`source/screens-misc.jsx` → `ModelPicker`

Popover anchored to the model-pill in the prompt input.
- Search bar at the top with ⌘K kbd shortcut.
- 3 sections:
  - **Anthropic · hosted** — Claude Sonnet 4.5 (selected, badge "Recommended", cost `1×`) · Opus 4 (cost `4×`) · Haiku 4.5 (cost `0.25×`).
  - **OpenAI · hosted** — GPT-5 (cost `1.2×`) · o4-mini (cost `2×`).
  - **Local · Ollama** — header shows "Daemon running" green dot if detected. Models: `qwen2.5-coder:32b` (online, free) · `llama3.3:70b` (online, free) · `deepseek-coder-v2` (not installed, dim, em-dash cost).
- Footer note: "Local models are **free** — they don't use credits." + "Manage models →" link.

#### Detection
The Ollama section is opt-in via Settings. When enabled, the browser pings `http://localhost:11434/api/tags` from client-side JS (CORS-friendly for Ollama defaults). Display the daemon status accordingly. Never call this from the server.

---

## Components to build (suggested shadcn breakdown)

- `<Logo size />`
- `<PromptInput value onSubmit attachments modelPill credits />`
- `<PlanCard plan onToggle onBuild />` (header + 3-col grid)
- `<TaskList tasks />` (status icon + name + duration)
- `<ProjectCard name desc status stack updated thumb />`
- `<ModelPickerPopover models onPick />`
- `<TierCard tier popular />`
- `<MarginNote dir>...children</MarginNote>` (landing-only)

Most of the rest is composition of shadcn primitives (`Button`, `Card`, `Input`, `Tabs`, `DropdownMenu`, `Checkbox`, `Avatar`, `Badge`).

---

## Animations

- **Pulse dot** — building/live indicators. `pulse-dot` keyframes: 100% → 140% scale, 1 → 0.6 opacity, 1.6s ease-in-out infinite.
- **Spinner ring** — running tool/task. 2px accent ring with transparent top, 0.8s linear infinite rotate.
- **Shimmer** — skeleton states. Linear-gradient sweep, 2s infinite.
- **Typing dots** — agent thinking. 3 dots, 1.4s blink, 0.2s stagger.

All keyframes are in `source/styles.css`.

---

## Files in `source/`

- `buildit.html` — page shell with font imports + script tags
- `styles.css` — all design tokens, base resets, animations
- `app.jsx` — canvas composition + Tweaks panel wiring
- `shared.jsx` — `Logo`, `Icon`/`Icons`, `Avatar`, `MarginNote`, `Block`, `TrafficLights`, `Frame`
- `screens-brief.jsx` — the architecture brief artboard
- `screens-landing.jsx` — `LandingA` (final) + `LandingB`/`LandingC` (rejected variations, kept for reference)
- `screens-plan.jsx` — `PlanB` (final) + `PlanA`/`PlanC`
- `screens-workspace.jsx` — `Workspace` + `EmptyA` (final) + `EmptyB`/`EmptyC`
- `screens-misc.jsx` — `Dashboard`, `Pricing`, `AuthPanel`, `ModelPicker`
- `design-canvas.jsx` / `tweaks-panel.jsx` — host scaffolding (you can ignore these)

---

## Next steps for Claude Code

1. Read `ARCHITECTURE.md` for the full tech stack + repo layout.
2. Scaffold `apps/web` with `create-next-app` + shadcn init.
3. Port the color tokens from `styles.css` into `app/globals.css` as Tailwind CSS variables.
4. Build the component library in `packages/ui` starting with `Logo`, `PromptInput`, `PlanCard`, `TaskList` (these are the highest-leverage shared pieces).
5. Build screens in this order: **landing → auth → dashboard → workspace (chat) → workspace (preview pane wired to E2B) → plan-mode integration → pricing/billing → model picker**.
6. Wire the agent loop **after** the workspace shell renders (mock data first, real model second).
