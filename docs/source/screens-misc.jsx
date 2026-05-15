// Auxiliary screens: Project dashboard, Pricing & credits, Auth, Model picker

// ─────────────────────────────────────────────────────────────
// PROJECT DASHBOARD
// ─────────────────────────────────────────────────────────────
function Dashboard({ theme = 'light' }) {
  const projects = [
    { name: 'habit-streak', desc: 'Habit tracker · email login + reminders', updated: '2 min ago', status: 'live', credits: 124, color: '#fbeadb', mark: 'h', stack: ['Next', 'Supabase', 'Resend'] },
    { name: 'standup-bot', desc: 'Async standup w/ Slack notifications', updated: '3 hrs ago', status: 'live', credits: 312, color: '#e1e8f2', mark: 's', stack: ['Next', 'Supabase'] },
    { name: 'forage-wiki', desc: 'Local recipe wiki w/ photo upload', updated: 'yesterday', status: 'draft', credits: 41, color: '#e5edd9', mark: 'f', stack: ['Next', 'Supabase'] },
    { name: 'pomodoro-club', desc: 'Group pomodoro w/ live leaderboard', updated: '3 days ago', status: 'building', credits: 88, color: '#eee1ed', mark: 'p', stack: ['Next', 'Supabase'] },
    { name: 'landing-jan', desc: 'Marketing page for podcast launch', updated: '1 wk ago', status: 'live', credits: 22, color: '#fbf0d8', mark: 'l', stack: ['Next'] },
    { name: 'bench-log', desc: 'Workout log w/ progressive overload', updated: '2 wk ago', status: 'archived', credits: 156, color: '#efe4d8', mark: 'b', stack: ['Next', 'Supabase', 'Stripe'] },
  ];
  const statusColor = {
    live: 'var(--ok)', draft: 'var(--fg-muted)', building: 'var(--accent)', archived: 'var(--fg-faint)',
  };

  return (
    <Frame theme={theme}>
      {/* sidebar */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 220, borderRight: '1px solid var(--border)', padding: '18px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ padding: '4px 8px', marginBottom: 18 }}><Logo size={17} /></div>
        {[
          ['Projects', Icons.folder, true],
          ['Templates', Icons.layers, false],
          ['Models', Icons.bolt, false],
          ['Credits', Icons.zap, false],
          ['Settings', Icons.settings, false],
        ].map(([n, ic, active], i) => (
          <button key={i} style={{
            display: 'flex', alignItems: 'center', gap: 9, padding: '7px 9px', borderRadius: 8,
            background: active ? 'var(--bg-soft)' : 'transparent',
            color: active ? 'var(--fg)' : 'var(--fg-dim)',
            fontSize: 13, fontWeight: active ? 600 : 500,
          }}><Icon d={ic} size={14}/> {n}</button>
        ))}
        <div style={{ flex: 1 }}></div>
        {/* credit card */}
        <div style={{ padding: 12, background: 'var(--bg-soft)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>Credits</span>
            <span style={{ fontSize: 11, color: 'var(--accent)' }}>Pro</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>847<span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 400 }}> / 1,500</span></div>
          <div style={{ height: 5, background: 'var(--border)', borderRadius: 999, marginTop: 8, overflow: 'hidden' }}>
            <div style={{ width: '56%', height: '100%', background: 'var(--accent)', borderRadius: 999 }}></div>
          </div>
          <button style={{ marginTop: 10, width: '100%', textAlign: 'left', fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon d={Icons.plus} size={11} stroke={2.4}/> Buy more credits
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 4px', marginTop: 6 }}>
          <Avatar name="J" tone="a" size={26} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500 }}>Jules Hart</div>
            <div style={{ fontSize: 10.5, color: 'var(--fg-muted)' }}>jules@hartmail.io</div>
          </div>
          <button style={{ width: 22, height: 22, borderRadius: 5, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={Icons.chevDown} size={12}/></button>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 220, right: 0, top: 0, bottom: 0, overflow: 'hidden', padding: '28px 36px' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 6 }}>
          <h1 style={{ fontSize: 34, fontWeight: 460, letterSpacing: '-0.02em' }}>
            Your <span className="serif-it" style={{ color: 'var(--accent)' }}>projects</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <Icon d={Icons.search} size={13} />
              <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)' }}></span>
              <input placeholder="Search projects" style={{ paddingLeft: 30, padding: '6px 10px 6px 30px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12.5, width: 220 }}/>
              <span style={{ position: 'absolute', left: 10, top: 8, color: 'var(--fg-muted)' }}><Icon d={Icons.search} size={13}/></span>
            </div>
            <button className="btn btn-outline" style={{ padding: '7px 12px', fontSize: 12.5 }}>
              <Icon d={Icons.layers} size={13} /> From template
            </button>
            <button className="btn btn-primary" style={{ padding: '7px 14px', fontSize: 12.5 }}>
              <Icon d={Icons.plus} size={13} stroke={2.4} /> New project
            </button>
          </div>
        </div>
        <p style={{ fontSize: 13.5, color: 'var(--fg-muted)', marginBottom: 24 }}>{projects.length} projects · 4 live · 743 credits this month</p>

        {/* tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 22 }}>
          {['All', 'Live', 'Building', 'Drafts', 'Archived'].map((t, i) => (
            <button key={i} style={{
              padding: '8px 14px', fontSize: 13,
              color: i === 0 ? 'var(--fg)' : 'var(--fg-muted)',
              borderBottom: i === 0 ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1, fontWeight: i === 0 ? 600 : 500,
            }}>{t} {i === 0 && <span style={{ color: 'var(--fg-muted)', fontWeight: 400 }}>· {projects.length}</span>}</button>
          ))}
        </div>

        {/* grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {projects.map((p, i) => (
            <div key={i} style={{
              background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 14,
              overflow: 'hidden', boxShadow: 'var(--shadow-sm)', cursor: 'pointer',
              transition: 'all .15s',
              opacity: p.status === 'archived' ? 0.7 : 1,
            }}>
              {/* preview thumb */}
              <div style={{ height: 130, background: p.color, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border)' }}>
                <span className="serif" style={{ fontSize: 56, color: '#1a1612' }}>{p.mark}</span>
                <div style={{ position: 'absolute', top: 10, left: 10, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', background: 'rgba(255,255,255,0.85)', borderRadius: 999, fontSize: 10.5, fontWeight: 600, color: '#1a1612' }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: statusColor[p.status] }} className={p.status === 'building' ? 'pulse-dot' : ''}></span>
                  {p.status.toUpperCase()}
                </div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                  <button style={{ width: 22, height: 22, borderRadius: 5, color: 'var(--fg-muted)' }}><Icon d={Icons.more} size={13} /></button>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 3, marginBottom: 10, minHeight: 28 }}>{p.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {p.stack.map((s, j) => (
                      <span key={j} className="mono" style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--bg-soft)', color: 'var(--fg-muted)' }}>{s}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.updated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// PRICING / CREDITS
// ─────────────────────────────────────────────────────────────
function Pricing({ theme = 'light' }) {
  const tiers = [
    { name: 'Hobby', price: 0, sub: 'For trying things out', credits: 100, ctaLabel: 'Get started', features: [
      ['100 credits / month', true],
      ['Bring your own model (Ollama)', true],
      ['Public projects', true],
      ['1 active sandbox', true],
      ['Community support', true],
    ]},
    { name: 'Pro', price: 24, sub: 'For makers shipping seriously', credits: 1500, popular: true, ctaLabel: 'Start free trial', features: [
      ['1,500 credits / month', true],
      ['Claude Sonnet · Opus · GPT-5', true],
      ['Private projects', true],
      ['10 concurrent sandboxes', true],
      ['Custom domains', true],
      ['Priority queue', true],
    ]},
    { name: 'Team', price: 89, sub: 'For small teams iterating together', credits: 6000, ctaLabel: 'Contact us', features: [
      ['6,000 credits / month, pooled', true],
      ['Everything in Pro', true],
      ['Up to 5 seats', true],
      ['SSO + audit logs', true],
      ['Dedicated build queue', true],
      ['Slack support channel', true],
    ]},
  ];

  return (
    <Frame theme={theme}>
      <LandingNav theme={theme} />
      <div style={{ position: 'absolute', inset: 0, paddingTop: 100, paddingLeft: 40, paddingRight: 40, overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="chip" style={{ marginBottom: 16 }}>
            <Icon d={Icons.zap} size={11} stroke={2}/>
            <span>Credits, not seats. Cancel anytime.</span>
          </div>
          <h1 style={{ fontSize: 62, lineHeight: 1, fontWeight: 460, letterSpacing: '-0.03em' }}>
            Pay for what you <span className="serif-it" style={{ color: 'var(--accent)' }}>build</span>.
          </h1>
          <p style={{ marginTop: 14, fontSize: 16, color: 'var(--fg-dim)', maxWidth: 540, margin: '14px auto 0' }}>
            One credit ≈ one agent step. Toggle between Claude, OpenAI, and your own local Ollama models — credits only apply to hosted models.
          </p>
          {/* billing toggle */}
          <div style={{ marginTop: 20, display: 'inline-flex', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 999, padding: 3 }}>
            <button style={{ padding: '6px 14px', borderRadius: 999, background: 'var(--accent)', color: '#fff', fontSize: 12.5, fontWeight: 600 }}>Monthly</button>
            <button style={{ padding: '6px 14px', borderRadius: 999, color: 'var(--fg-muted)', fontSize: 12.5, fontWeight: 500 }}>Annual · save 20%</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, maxWidth: 1080, margin: '0 auto' }}>
          {tiers.map((t, i) => (
            <div key={i} style={{
              background: t.popular ? 'var(--fg)' : 'var(--bg-elev)',
              color: t.popular ? 'var(--bg)' : 'var(--fg)',
              border: t.popular ? 'none' : '1px solid var(--border)',
              borderRadius: 18, padding: 24,
              boxShadow: t.popular ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
              position: 'relative',
              transform: t.popular ? 'translateY(-8px)' : 'none',
            }}>
              {t.popular && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Most popular
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div className="serif-it" style={{ fontSize: 24, color: t.popular ? 'var(--accent)' : 'var(--accent)' }}>{t.name}</div>
                <span className="mono" style={{ fontSize: 10.5, opacity: 0.7 }}>{t.credits.toLocaleString()} credits/mo</span>
              </div>
              <p style={{ fontSize: 13, marginTop: 2, opacity: 0.7 }}>{t.sub}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 18 }}>
                <span style={{ fontSize: 44, fontWeight: 460, letterSpacing: '-0.03em' }}>${t.price}</span>
                <span style={{ fontSize: 13, opacity: 0.6 }}>/ month</span>
              </div>
              <button className={t.popular ? '' : 'btn btn-outline'} style={t.popular ? {
                width: '100%', padding: '10px 16px', borderRadius: 10,
                background: 'var(--accent)', color: '#fff', marginTop: 18, fontWeight: 600, fontSize: 13,
              } : { width: '100%', marginTop: 18, padding: '10px 16px', fontSize: 13, justifyContent: 'center' }}>
                {t.ctaLabel} <Icon d={Icons.arrowRight} size={13}/>
              </button>
              <div style={{ marginTop: 22, height: 1, background: t.popular ? 'rgba(255,255,255,0.12)' : 'var(--border)' }}></div>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {t.features.map(([f, on], j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 999, background: t.popular ? 'var(--accent)' : 'var(--accent-faint)', color: t.popular ? '#fff' : 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 2 }}>
                      <Icon d={Icons.check} size={9} stroke={3} />
                    </span>
                    <span style={{ opacity: 0.9 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* credit packs */}
        <div style={{ marginTop: 40, maxWidth: 1080, margin: '40px auto 0', background: 'var(--bg-elev)', border: '1px dashed var(--border-strong)', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon d={Icons.zap} size={14} fill="var(--accent)" stroke={0}/> Top up anytime
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 3 }}>Run out mid-build? Buy a credit pack — no plan upgrade required.</div>
          </div>
          {[
            ['500', '$8'],
            ['1,500', '$22'],
            ['5,000', '$65'],
          ].map(([c, p], i) => (
            <button key={i} style={{ padding: '10px 16px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--bg)', textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{c} credits</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{p}</div>
            </button>
          ))}
        </div>
      </div>
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// AUTH — sign in / sign up side by side in one artboard
// ─────────────────────────────────────────────────────────────
function AuthPanel({ mode = 'signin', theme = 'light' }) {
  const isSignup = mode === 'signup';
  return (
    <Frame theme={theme}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1.1fr' }}>
        {/* left brand panel */}
        <div style={{ background: 'var(--bg-soft)', position: 'relative', overflow: 'hidden', padding: 36, display: 'flex', flexDirection: 'column' }}>
          <Logo size={18} />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div>
              <div className="chip" style={{ marginBottom: 22 }}>
                <Icon d={Icons.sparkle} size={11}/> Welcome back
              </div>
              <h2 style={{ fontSize: 44, lineHeight: 1.05, fontWeight: 460, letterSpacing: '-0.02em' }}>
                Pick up<br/>where you <span className="serif-it" style={{ color: 'var(--accent)' }}>left</span> off.
              </h2>
              <p style={{ marginTop: 14, fontSize: 14, color: 'var(--fg-dim)', maxWidth: 360, lineHeight: 1.55 }}>
                Your projects, sandboxes, and credits are waiting. Sign in to keep iterating.
              </p>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
            "<span style={{ color: 'var(--fg-dim)' }}>I shipped my MVP in an afternoon — the plan mode was the unlock for me.</span>"
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar name="M" tone="b" size={22} />
              <span>Maya R. · founder, Tracklist</span>
            </div>
          </div>
        </div>

        {/* right form */}
        <div style={{ padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ maxWidth: 360, width: '100%', margin: '0 auto' }}>
            <div style={{ display: 'flex', background: 'var(--bg-soft)', borderRadius: 999, padding: 3, marginBottom: 24, fontSize: 12.5, fontWeight: 500 }}>
              <button style={{ flex: 1, padding: '7px 0', borderRadius: 999, background: !isSignup ? 'var(--bg-elev)' : 'transparent', color: !isSignup ? 'var(--fg)' : 'var(--fg-muted)', boxShadow: !isSignup ? 'var(--shadow-sm)' : 'none' }}>Sign in</button>
              <button style={{ flex: 1, padding: '7px 0', borderRadius: 999, background: isSignup ? 'var(--bg-elev)' : 'transparent', color: isSignup ? 'var(--fg)' : 'var(--fg-muted)', boxShadow: isSignup ? 'var(--shadow-sm)' : 'none' }}>Create account</button>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>
              {isSignup ? 'Make something today.' : 'Sign in to buildit'}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>
              {isSignup ? 'No credit card required for 100 free credits.' : 'Use the email you signed up with.'}
            </p>

            <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-outline" style={{ width: '100%', padding: '10px 16px', justifyContent: 'center', fontSize: 13.5 }}>
                <Icon d={Icons.github} size={15}/> Continue with GitHub
              </button>
              <button className="btn btn-outline" style={{ width: '100%', padding: '10px 16px', justifyContent: 'center', fontSize: 13.5 }}>
                <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22 12a10 10 0 0 0-.18-1.84H12v3.6h5.6a4.8 4.8 0 0 1-2.1 3.16v2.6h3.4A10 10 0 0 0 22 12Z"/><path fill="#34A853" d="M12 22a9.84 9.84 0 0 0 6.9-2.48l-3.4-2.6a6 6 0 0 1-8.9-3.12H3.1v2.7A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.6 13.8a6 6 0 0 1 0-3.6V7.5H3.1a10 10 0 0 0 0 9l3.5-2.7Z"/><path fill="#EA4335" d="M12 6a5.4 5.4 0 0 1 3.8 1.5l2.84-2.84A10 10 0 0 0 3.1 7.5L6.6 10.2A6 6 0 0 1 12 6Z"/></svg>
                Continue with Google
              </button>
            </div>

            <div style={{ margin: '20px 0 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
              <span style={{ fontSize: 11, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {isSignup && (
                <label style={{ display: 'block' }}>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginBottom: 5 }}>Name</div>
                  <input placeholder="Jules Hart" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 9, fontSize: 13.5, background: 'var(--bg-elev)' }}/>
                </label>
              )}
              <label style={{ display: 'block' }}>
                <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginBottom: 5 }}>Email</div>
                <input placeholder="you@hartmail.io" defaultValue={isSignup ? '' : 'jules@hartmail.io'} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 9, fontSize: 13.5, background: 'var(--bg-elev)' }}/>
              </label>
              <label style={{ display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>Password</span>
                  {!isSignup && <a style={{ fontSize: 11.5, color: 'var(--accent)' }}>Forgot?</a>}
                </div>
                <input type="password" defaultValue="••••••••••" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 9, fontSize: 13.5, background: 'var(--bg-elev)' }}/>
              </label>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px 16px', marginTop: 6, fontSize: 13.5 }}>
                {isSignup ? 'Create account' : 'Sign in'}
                <Icon d={Icons.arrowRight} size={13}/>
              </button>
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 22, textAlign: 'center' }}>
              By continuing you agree to our <a style={{ color: 'var(--fg-dim)', textDecoration: 'underline' }}>Terms</a> and <a style={{ color: 'var(--fg-dim)', textDecoration: 'underline' }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// MODEL PICKER — drop-in popover/menu
// ─────────────────────────────────────────────────────────────
function ModelPicker({ theme = 'light' }) {
  const sections = [
    { label: 'Anthropic · hosted', items: [
      { name: 'Claude Sonnet 4.5', meta: 'Best balance · default', cost: '1×', selected: true, badge: 'Recommended' },
      { name: 'Claude Opus 4', meta: 'Deepest reasoning', cost: '4×' },
      { name: 'Claude Haiku 4.5', meta: 'Fastest, cheapest', cost: '0.25×' },
    ]},
    { label: 'OpenAI · hosted', items: [
      { name: 'GPT-5', meta: 'Multimodal · general purpose', cost: '1.2×' },
      { name: 'o4-mini', meta: 'Reasoning focused', cost: '2×' },
    ]},
    { label: 'Local · Ollama', items: [
      { name: 'qwen2.5-coder:32b', meta: 'Detected at localhost:11434', cost: 'Free', local: true, online: true },
      { name: 'llama3.3:70b', meta: 'Detected · large download', cost: 'Free', local: true, online: true },
      { name: 'deepseek-coder-v2', meta: 'Not installed locally', cost: '—', local: true, online: false },
    ]},
  ];
  return (
    <Frame theme={theme} style={{ padding: 30, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      {/* placement: anchored to a faux input above */}
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* anchor input */}
        <div style={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, marginBottom: 8 }}>
          <div style={{ color: 'var(--fg-faint)', fontSize: 13, marginBottom: 6 }}>Describe what you want to build…</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 6, fontSize: 11.5, color: 'var(--accent)', border: '1px solid var(--accent)', background: 'var(--accent-faint)' }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--accent)' }}></span>
              Claude Sonnet 4.5 <Icon d={Icons.chevUp} size={10}/>
            </button>
          </div>
        </div>
        <div style={{ height: 8 }}></div>
        {/* popover */}
        <div style={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 12, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon d={Icons.search} size={13} />
            <input placeholder="Search models" style={{ flex: 1, fontSize: 12.5 }} />
            <span className="kbd">⌘K</span>
          </div>
          {sections.map((s, i) => (
            <div key={i}>
              <div style={{ padding: '8px 14px 4px', fontSize: 10.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{s.label}</span>
                {s.label.includes('Ollama') && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--ok)', textTransform: 'none', letterSpacing: 0 }}>
                    <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--ok)' }}></span>
                    Daemon running
                  </span>
                )}
              </div>
              {s.items.map((m, j) => (
                <button key={j} style={{
                  width: '100%', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 10,
                  background: m.selected ? 'var(--accent-faint)' : 'transparent',
                  textAlign: 'left',
                  opacity: m.online === false ? 0.55 : 1,
                }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: m.local ? 'var(--bg-soft)' : 'var(--fg)',
                    color: m.local ? 'var(--fg-dim)' : 'var(--bg)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', fontSize: 11,
                  }}>
                    {m.local ? <Icon d={Icons.monitor} size={13}/> : <Icon d={Icons.sparkle} size={13} stroke={2}/>}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</span>
                      {m.badge && <span style={{ fontSize: 10, color: 'var(--accent)', background: 'var(--accent-faint)', padding: '1px 6px', borderRadius: 4 }}>{m.badge}</span>}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{m.meta}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 11, color: m.cost === 'Free' ? 'var(--ok)' : 'var(--fg-muted)' }}>{m.cost}</span>
                  {m.selected && <Icon d={Icons.check} size={14} stroke={2.4} />}
                </button>
              ))}
              {i < sections.length - 1 && <div style={{ height: 1, background: 'var(--border)' }}></div>}
            </div>
          ))}
          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--fg-muted)' }}>
            <Icon d={Icons.sparkle} size={11} />
            Local models are <b style={{ color: 'var(--fg-dim)' }}>free</b> — they don't use credits.
            <span style={{ flex: 1 }}></span>
            <a style={{ color: 'var(--accent)' }}>Manage models →</a>
          </div>
        </div>
      </div>
    </Frame>
  );
}

Object.assign(window, { Dashboard, Pricing, AuthPanel, ModelPicker });
