// Landing hero variations for buildit.
// Three approaches: editorial-centered, asymmetric-with-side-content,
// stacked-with-prompt-chips. All warm/cream theme.

const { useState: useS_L, useEffect: useE_L } = React;

function LandingNav({ theme = 'light' }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', zIndex: 5,
    }}>
      <Logo size={18} />
      <div style={{ display: 'flex', gap: 28, alignItems: 'center', fontSize: 13.5, color: 'var(--fg-dim)' }}>
        <a>Showcase</a>
        <a>Pricing</a>
        <a>Docs</a>
        <a>Changelog</a>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button className="btn btn-ghost" style={{ padding: '7px 12px', fontSize: 13 }}>Sign in</button>
        <button className="btn btn-primary" style={{ padding: '7px 14px', fontSize: 13 }}>Get started</button>
      </div>
    </div>
  );
}

function PromptInput({ tall = false, placeholder = "Describe the app you want to build…", showAttachments = true }) {
  return (
    <div style={{
      background: 'var(--bg-elev)',
      borderRadius: 18,
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-md)',
      padding: 18,
      width: '100%',
      position: 'relative',
    }}>
      <div style={{
        color: 'var(--fg-faint)', fontSize: 16, lineHeight: 1.5,
        minHeight: tall ? 84 : 56,
      }}>{placeholder}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {showAttachments && (
            <>
              <button style={{ width: 30, height: 30, borderRadius: 8, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={Icons.paperclip} size={15} />
              </button>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 8, color: 'var(--fg-muted)', fontSize: 12.5, border: '1px solid var(--border)' }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)' }}></span>
                Claude Sonnet 4.5
                <Icon d={Icons.chevDown} size={12} />
              </button>
            </>
          )}
        </div>
        <button style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--accent)', color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon d={Icons.arrowUp} size={16} stroke={2.2} /></button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VARIATION A — Editorial centered. Big serif headline, soft prompt below,
// margin-note annotations like a notebook page.
// ─────────────────────────────────────────────────────────────
function LandingA({ theme = 'light' }) {
  return (
    <Frame theme={theme}>
      <div className="bg-noise" style={{ position: 'absolute', inset: 0 }}></div>
      <LandingNav theme={theme} />

      {/* hero */}
      <div style={{ position: 'absolute', inset: 0, paddingTop: 130, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="chip" style={{ marginBottom: 28 }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
            <span style={{ width:6, height:6, borderRadius:999, background:'var(--ok)' }}></span>
            <span>Now in public beta</span>
          </span>
          <span style={{ color: 'var(--fg-faint)' }}>·</span>
          <span style={{ color: 'var(--fg-muted)' }}>Bring your own model →</span>
        </div>

        <h1 style={{ fontSize: 96, lineHeight: 0.95, letterSpacing: '-0.04em', textAlign: 'center', maxWidth: 1000 }}>
          <span style={{ fontFamily: 'ui-sans-serif, system-ui', fontWeight: 460 }}>The fastest way</span><br/>
          <span style={{ fontFamily: 'ui-sans-serif, system-ui', fontWeight: 460, color: 'var(--fg-dim)' }}>to </span>
          <span className="serif-it" style={{ fontSize: 110, color: 'var(--accent)' }}>build</span>
          <span style={{ fontFamily: 'ui-sans-serif, system-ui', fontWeight: 460, color: 'var(--fg-dim)' }}> it.</span>
        </h1>

        <p style={{ marginTop: 28, fontSize: 18, color: 'var(--fg-dim)', maxWidth: 600, textAlign: 'center', lineHeight: 1.5 }}>
          Describe what you want. Answer a few questions.
          Watch a working app appear in a sandbox preview.
        </p>

        <div style={{ width: 720, marginTop: 44, position: 'relative' }}>
          <PromptInput tall placeholder="A habit tracker with email login, daily reminders, and a streak page…" />

          {/* margin notes */}
          <MarginNote dir="left" style={{ top: -10, right: -240, width: 230 }}>
            we'll ask you a few things first — auth? db? payments?
          </MarginNote>
          <MarginNote dir="right" style={{ bottom: -34, left: -250, width: 230, flexDirection: 'row-reverse' }}>
            <span style={{ textAlign: 'right' }}>preview boots in&nbsp;~4s on E2B</span>
          </MarginNote>
        </div>

        {/* suggestion chips */}
        <div style={{ display: 'flex', gap: 8, marginTop: 32, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 760 }}>
          {['A read-it-later app with tags', 'Internal CRM with Stripe billing', 'Landing page for my podcast', 'Pomodoro timer with leaderboard'].map((s,i) => (
            <button key={i} className="chip" style={{ padding: '7px 14px', fontSize: 12.5, cursor: 'pointer' }}>
              <Icon d={Icons.sparkle} size={11} /> {s}
            </button>
          ))}
        </div>
      </div>

      {/* peek of scroll content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, background: 'linear-gradient(180deg, transparent, var(--bg))', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', color: 'var(--fg-muted)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>How it works</span>
        <Icon d={Icons.chevDown} size={12} />
      </div>
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// VARIATION B — Asymmetric. Left side is content + headline; right
// side is a live "preview" card showing the result. Terminal feel.
// ─────────────────────────────────────────────────────────────
function LandingB({ theme = 'light' }) {
  return (
    <Frame theme={theme}>
      <LandingNav theme={theme} />
      <div className="bg-dot" style={{ position: 'absolute', inset: 0, opacity: .4 }}></div>

      <div style={{ position: 'absolute', inset: 0, paddingTop: 110, paddingLeft: 64, paddingRight: 64, display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 64, alignItems: 'center' }}>
        {/* left */}
        <div>
          <div className="mono" style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginBottom: 20, letterSpacing: '0.04em' }}>
            01 · DESCRIBE  →  02 · PLAN  →  03 · BUILD
          </div>
          <h1 style={{ fontSize: 82, lineHeight: 0.96, letterSpacing: '-0.035em' }}>
            <span style={{ fontWeight: 460 }}>Ship an app</span><br/>
            <span style={{ fontWeight: 460 }}>before your </span>
            <span className="serif-it" style={{ fontSize: 90, color: 'var(--accent)' }}>coffee</span>
            <span style={{ fontWeight: 460 }}> cools.</span>
          </h1>
          <p style={{ marginTop: 24, fontSize: 17, color: 'var(--fg-dim)', maxWidth: 480, lineHeight: 1.55 }}>
            buildit asks the right questions first — auth, database, payments — then scaffolds a real Next.js project and iterates with you in a live sandbox.
          </p>
          <div style={{ marginTop: 36, position: 'relative' }}>
            <PromptInput placeholder="A team standup tool with Slack login…" />
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 16, fontSize: 12, color: 'var(--fg-muted)', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon d={Icons.lock} size={13} /> SOC2 in progress</span>
            <span>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon d={Icons.github} size={13} /> Open source starter kit</span>
            <span>·</span>
            <span>No card required</span>
          </div>
        </div>

        {/* right — mock browser preview */}
        <div style={{ position: 'relative' }}>
          <div style={{
            background: 'var(--bg-elev)', borderRadius: 14, boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden', transform: 'rotate(1deg)', border: '1px solid var(--border)',
          }}>
            <div style={{ height: 36, background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 12 }}>
              <TrafficLights />
              <div className="mono" style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'var(--fg-muted)' }}>
                preview.buildit.app/standup-9f2e
              </div>
              <Icon d={Icons.refresh} size={13} />
            </div>
            {/* simulated app */}
            <div style={{ padding: 22, minHeight: 360 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 4 }}>Today · Wed May 14</div>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>Morning Standup</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <Avatar name="J" tone="a" size={26}/>
                  <Avatar name="M" tone="b" size={26}/>
                  <Avatar name="K" tone="c" size={26}/>
                  <Avatar name="+" tone="e" size={26}/>
                </div>
              </div>
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Jules', 'Shipping the export-to-PDF flow today', 'a'],
                  ['Maya', 'Stuck on the OAuth callback — pairing w/ Kim', 'b'],
                  ['Kim',  'Reviewing PR #214 then onboarding script', 'c'],
                ].map(([n,m,t],i)=>(
                  <div key={i} style={{ display: 'flex', gap: 10, padding: 10, border: '1px solid var(--border)', borderRadius: 10 }}>
                    <Avatar name={n} tone={t} size={28}/>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{n}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg-dim)' }}>{m}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 14, fontSize: 12.5, padding: '8px 12px', borderRadius: 8, background: 'var(--accent)', color: '#fff' }}>+ Add update</button>
            </div>
          </div>
          {/* floating annotation */}
          <div style={{ position: 'absolute', bottom: -32, left: 30, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="chip" style={{ background: 'var(--bg)', borderColor: 'var(--accent)' }}>
              <span className="chip-dot pulse-dot"></span>
              <span style={{ color: 'var(--accent)' }}>Live · running on E2B sandbox</span>
            </div>
            <span className="hand" style={{ fontSize: 17, color: 'var(--fg-muted)', transform: 'rotate(-3deg)' }}>↑ real sandboxed preview</span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// VARIATION C — Stacked centered with framework chips + community gallery
// peek. Familiar Lovable/v0 layout but warmer.
// ─────────────────────────────────────────────────────────────
function LandingC({ theme = 'light' }) {
  return (
    <Frame theme={theme}>
      <LandingNav theme={theme} />

      <div style={{ position: 'absolute', inset: 0, paddingTop: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
        <div className="chip" style={{ marginBottom: 24, background: 'var(--accent-faint)', borderColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
          <Icon d={Icons.sparkle} size={11} />
          <span>1,294 apps shipped this week</span>
          <Icon d={Icons.chevRight} size={11} />
        </div>

        <h1 style={{ fontSize: 76, lineHeight: 1, letterSpacing: '-0.035em', textAlign: 'center', fontWeight: 460, maxWidth: 980 }}>
          From a sentence to a <span className="serif-it" style={{ fontSize: 84, color: 'var(--accent)' }}>shipping</span> app.
        </h1>
        <p style={{ marginTop: 20, fontSize: 17, color: 'var(--fg-dim)', maxWidth: 540, textAlign: 'center', lineHeight: 1.5 }}>
          Describe it. We'll plan it with you, scaffold a real codebase, and let you watch it come together — live.
        </p>

        <div style={{ width: 680, marginTop: 36 }}>
          <PromptInput placeholder="Build me a budget tracker that syncs with Plaid…" tall />
        </div>

        {/* stack chips by category */}
        <div style={{ marginTop: 16, display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, color: 'var(--fg-muted)' }}>
          <span>Try:</span>
          {['Landing page', 'Internal tool', 'SaaS w/ auth', 'CRUD app', 'Marketplace'].map((s,i)=>(
            <button key={i} className="chip" style={{ padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}>{s}</button>
          ))}
        </div>

        {/* gallery row */}
        <div style={{ marginTop: 56, width: '100%', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 60px', marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Built with buildit</div>
            <a style={{ fontSize: 12.5, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>See all <Icon d={Icons.arrowRight} size={11} /></a>
          </div>
          <div style={{ display: 'flex', gap: 16, padding: '0 60px' }}>
            {[
              ['Quill', 'A markdown blog', 'a', '#fbeadb'],
              ['Tracklist', 'Music journal', 'b', '#e1e8f2'],
              ['Forage', 'Local recipe wiki', 'c', '#e5edd9'],
              ['Stash', 'Bookmark vault', 'd', '#eee1ed'],
              ['Bench', 'Workout log', 'f', '#fbf0d8'],
            ].map(([n,d,t,bg],i)=>(
              <div key={i} style={{
                flex: 1, minWidth: 0,
                background: 'var(--bg-elev)', border: '1px solid var(--border)',
                borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ height: 110, background: bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="serif" style={{ fontSize: 38, color: '#1a1612' }}>{n[0]}</span>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Avatar name={n} tone={t} size={18} />
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{n}</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 3 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

Object.assign(window, { LandingA, LandingB, LandingC, PromptInput, LandingNav });
