// Workspace (chat + live E2B preview), empty/loading states (3 variations),
// project dashboard, model picker.

// ─────────────────────────────────────────────────────────────
// Workspace — split layout. Chat left, sandbox preview right.
// ─────────────────────────────────────────────────────────────
function Workspace({ theme = 'light' }) {
  const messages = [
    { who: 'user', text: 'A habit tracker with email login, daily reminders, and a streak page.' },
    { who: 'agent', text: 'Got it. A few quick questions first:', tools: false },
    { who: 'agent', text: 'Reminders — email, push, or both?', tools: false, soft: true },
    { who: 'user', text: 'Email is fine. Web + mobile responsive. Private only.' },
    { who: 'agent', plan: true },
    { who: 'user', text: 'Build it.' },
    { who: 'agent', tools: [
      { name: 'create-app', meta: 'next-app · supabase · resend', state: 'done', ms: '2.1s' },
      { name: 'install-deps', meta: '142 packages', state: 'done', ms: '18.4s' },
      { name: 'scaffold-routes', meta: '6 pages', state: 'done', ms: '0.8s' },
      { name: 'apply-schema', meta: 'habits, completions, users', state: 'running' },
    ]},
  ];

  return (
    <Frame theme={theme}>
      {/* topbar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 52,
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 14px',
        background: 'var(--bg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Logo size={16} />
          <span style={{ color: 'var(--fg-faint)' }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>habit-streak</span>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--fg-muted)', padding: '3px 7px', borderRadius: 6, border: '1px solid var(--border)' }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--ok)' }}></span>
            <span className="mono">main</span>
          </button>
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12.5 }}>
            <Icon d={Icons.history} size={13} /> History
          </button>
          <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12.5 }}>
            <Icon d={Icons.github} size={13} /> Connect repo
          </button>
          <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 12.5 }}>
            <Icon d={Icons.external} size={12} /> Share
          </button>
          <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 12.5 }}>
            <Icon d={Icons.zap} size={13} fill="currentColor" /> Deploy
          </button>
          <Avatar name="J" tone="a" size={28} />
        </div>
      </div>

      {/* split */}
      <div style={{ position: 'absolute', top: 52, left: 0, right: 0, bottom: 0, display: 'grid', gridTemplateColumns: '420px 1fr' }}>
        {/* LEFT — chat */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon d={Icons.sparkle} size={13} stroke={2} />
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>Conversation</div>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--fg-muted)' }}>· 4 turns</span>
            <div style={{ flex: 1 }}></div>
            <button style={{ width: 22, height: 22, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)' }}><Icon d={Icons.more} size={14} /></button>
          </div>

          <div style={{ flex: 1, overflow: 'hidden', padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m,i) => {
              if (m.who === 'user') {
                return (
                  <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '85%', background: 'var(--accent-faint)', border: '1px solid var(--accent-soft)', color: 'var(--fg)', padding: '8px 12px', borderRadius: '12px 12px 4px 12px', fontSize: 12.5 }}>{m.text}</div>
                );
              }
              if (m.plan) {
                return (
                  <div key={i} style={{ display: 'flex', gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 2 }}>
                      <Icon d={Icons.sparkle} size={11} stroke={2} />
                    </div>
                    <div style={{ flex: 1, background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 12, padding: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <Icon d={Icons.layers} size={12} />
                        <span style={{ fontSize: 12, fontWeight: 600 }}>Build plan</span>
                        <span style={{ flex: 1 }}></span>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--fg-muted)' }}>5/7 features</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--fg-dim)', lineHeight: 1.5 }}>
                        Email auth · Habits CRUD · Streak calc · Email reminders · Mobile responsive
                      </div>
                      <button className="btn btn-primary" style={{ padding: '5px 12px', fontSize: 11.5, marginTop: 8 }}>
                        <Icon d={Icons.zap} size={11} fill="currentColor" /> Build
                      </button>
                    </div>
                  </div>
                );
              }
              if (m.tools) {
                return (
                  <div key={i} style={{ display: 'flex', gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 2 }}>
                      <Icon d={Icons.sparkle} size={11} stroke={2} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: 12.5, color: 'var(--fg-dim)' }}>Bootstrapping your app on E2B…</div>
                      {m.tools.map((t,j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8 }}>
                          <span style={{ width: 14, height: 14, borderRadius: 4, background: t.state === 'done' ? 'var(--ok)' : 'transparent', border: t.state === 'done' ? 'none' : '1.5px solid var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flex: 'none', position: 'relative' }}>
                            {t.state === 'done' && <Icon d={Icons.check} size={9} stroke={3} />}
                            {t.state === 'running' && <span style={{ position: 'absolute', inset: 1, borderRadius: 3, border: '1.5px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }}></span>}
                          </span>
                          <span className="mono" style={{ fontSize: 11.5, color: 'var(--fg)' }}>{t.name}</span>
                          <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>· {t.meta}</span>
                          <span style={{ flex: 1 }}></span>
                          <span className="mono" style={{ fontSize: 10.5, color: 'var(--fg-muted)' }}>{t.ms || '...'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} style={{ display: 'flex', gap: 8, paddingLeft: m.soft ? 30 : 0 }}>
                  {!m.soft && <div style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 2 }}>
                    <Icon d={Icons.sparkle} size={11} stroke={2} />
                  </div>}
                  <div style={{ fontSize: 12.5, color: m.soft ? 'var(--fg-muted)' : 'var(--fg-dim)', lineHeight: 1.55 }}>{m.text}</div>
                </div>
              );
            })}
          </div>

          {/* input */}
          <div style={{ padding: 14 }}>
            <div style={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 12, padding: 10, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ color: 'var(--fg-faint)', fontSize: 13, padding: '4px 4px 8px' }}>Tweak the design or ask for a new feature…</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button style={{ width: 26, height: 26, borderRadius: 7, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={Icons.paperclip} size={13} /></button>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, fontSize: 11, color: 'var(--fg-muted)', border: '1px solid var(--border)' }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--accent)' }}></span>
                  Claude Sonnet 4.5 <Icon d={Icons.chevDown} size={10} />
                </button>
                <div style={{ flex: 1 }}></div>
                <span className="mono" style={{ fontSize: 10, color: 'var(--fg-muted)' }}>847 credits</span>
                <button style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--accent)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={Icons.arrowUp} size={13} stroke={2.4} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — preview */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-soft)' }}>
          {/* preview toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 14px', gap: 8, borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            <div style={{ display: 'flex', background: 'var(--bg-soft)', borderRadius: 7, padding: 2 }}>
              {[
                ['Preview', Icons.eye, true],
                ['Code', Icons.code, false],
                ['Database', Icons.database, false],
                ['Logs', Icons.refresh, false],
              ].map(([label, ic, active], i) => (
                <button key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 10px', borderRadius: 5,
                  background: active ? 'var(--bg-elev)' : 'transparent',
                  color: active ? 'var(--fg)' : 'var(--fg-muted)',
                  fontSize: 12, fontWeight: 500,
                  boxShadow: active ? 'var(--shadow-sm)' : 'none',
                }}><Icon d={ic} size={12}/> {label}</button>
              ))}
            </div>
            <div style={{ flex: 1 }}></div>
            {/* device picker */}
            <div style={{ display: 'flex', background: 'var(--bg-soft)', borderRadius: 7, padding: 2 }}>
              {[Icons.monitor, Icons.phone].map((ic,i) => (
                <button key={i} style={{ width: 28, height: 26, borderRadius: 5, background: i === 0 ? 'var(--bg-elev)' : 'transparent', color: i === 0 ? 'var(--fg)' : 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: i === 0 ? 'var(--shadow-sm)' : 'none' }}><Icon d={ic} size={13} /></button>
              ))}
            </div>
            <button style={{ width: 28, height: 26, borderRadius: 7, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={Icons.refresh} size={13} /></button>
            <button style={{ width: 28, height: 26, borderRadius: 7, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={Icons.external} size={13} /></button>
            <div className="mono" style={{ fontSize: 11, padding: '5px 10px', background: 'var(--bg-soft)', borderRadius: 7, color: 'var(--fg-muted)' }}>habit-streak-9f2e.e2b.app</div>
          </div>

          {/* preview frame */}
          <div style={{ flex: 1, padding: 20, display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
            <div style={{ flex: 1, maxWidth: 900, background: '#fff', borderRadius: 14, boxShadow: 'var(--shadow-lg)', overflow: 'hidden', position: 'relative' }}>
              {/* simulated rendered app — light, regardless of theme */}
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', color: '#1a1612', fontFamily: 'ui-sans-serif, system-ui' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #ece5d3' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: '#c45a26' }}></span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>habit-streak</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#6b5d4f' }}>
                    <span>Today</span><span>History</span><span>Settings</span>
                  </div>
                  <div style={{ width: 28, height: 28, borderRadius: 999, background: '#c45a26', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>J</div>
                </div>
                <div style={{ padding: '24px 28px' }}>
                  <div style={{ fontSize: 12, color: '#8a7e6c' }}>Wednesday, May 14</div>
                  <h2 style={{ fontSize: 28, fontWeight: 460, marginTop: 4, fontFamily: '"Instrument Serif", serif' }}>
                    <span>Good morning, </span><span style={{ fontStyle: 'italic', color: '#c45a26' }}>Jules.</span>
                  </h2>
                  <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: '#8a7e6c' }}><b style={{ color: '#1a1612' }}>14 day</b> streak</span>
                    <span style={{ fontSize: 12, color: '#8a7e6c' }}><b style={{ color: '#1a1612' }}>3 of 5</b> habits today</span>
                  </div>
                  {/* habits */}
                  <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      ['Read 20 minutes', true, '🔥 14d', '#fff5e6'],
                      ['Drink water', true, '🔥 22d', '#e8f0e4'],
                      ['No phone before noon', true, '🔥 7d', '#f0ebe2'],
                      ['Stretch / yoga', false, '— day 0', '#fff'],
                      ['Journal entry', false, '🔥 3d', '#fff'],
                    ].map(([n,done,streak,bg], i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: bg, border: '1px solid #ece5d3' }}>
                        <span style={{ width: 20, height: 20, borderRadius: 999, background: done ? '#c45a26' : 'transparent', border: done ? 'none' : '1.5px solid #c9bca2', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flex: 'none' }}>
                          {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>}
                        </span>
                        <span style={{ fontSize: 14, flex: 1, textDecoration: done ? 'line-through' : 'none', color: done ? '#8a7e6c' : '#1a1612' }}>{n}</span>
                        <span style={{ fontSize: 11.5, color: '#8a7e6c' }}>{streak}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* live badge */}
              <div style={{ position: 'absolute', top: 12, left: 12, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: 'rgba(196,90,38,0.1)', color: '#c45a26' }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: '#c45a26' }} className="pulse-dot"></span>
                LIVE
              </div>
            </div>
          </div>
          {/* footer status */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '6px 14px', gap: 12, fontSize: 11, color: 'var(--fg-muted)', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--ok)' }}></span>
              Sandbox: us-east · 142 MB / 1 GB · ttl 2h
            </span>
            <span>·</span>
            <span>Last build: 38s ago · ✓ 0 errors</span>
            <span style={{ flex: 1 }}></span>
            <span className="mono">cmd+k</span><span>commands</span>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty / loading state variations
// ─────────────────────────────────────────────────────────────

// A. Build-in-progress with streaming task list (most informational)
function EmptyA({ theme = 'light' }) {
  const tasks = [
    ['Bootstrapping starter kit', 'done', '1.2s'],
    ['Installing 142 dependencies', 'done', '18.6s'],
    ['Generating schema · 3 tables', 'done', '0.8s'],
    ['Wiring Supabase auth', 'running', null],
    ['Scaffolding pages', 'queued', null],
    ['Configuring Resend', 'queued', null],
  ];
  return (
    <Frame theme={theme}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--accent)' }} className="pulse-dot"></span>
          <span className="mono" style={{ fontSize: 11.5, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>building</span>
        </div>
        <h2 style={{ fontSize: 38, lineHeight: 1.1, fontWeight: 460, textAlign: 'center', maxWidth: 560 }}>
          <span className="serif-it" style={{ color: 'var(--accent)' }}>Brewing</span> your app…
        </h2>
        <p style={{ marginTop: 10, fontSize: 14, color: 'var(--fg-muted)', maxWidth: 440, textAlign: 'center' }}>
          This usually takes about 90 seconds. We'll show the preview as soon as the first page is reachable.
        </p>
        <div style={{ marginTop: 32, width: 480, background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, boxShadow: 'var(--shadow-md)' }}>
          {tasks.map(([n, state, t], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ width: 16, height: 16, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {state === 'done' && <span style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--ok)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={Icons.check} size={9} stroke={3}/></span>}
                {state === 'running' && <span style={{ width: 14, height: 14, borderRadius: 999, border: '2px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin .8s linear infinite' }}></span>}
                {state === 'queued' && <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--border-strong)' }}></span>}
              </span>
              <span style={{ fontSize: 13, color: state === 'queued' ? 'var(--fg-muted)' : 'var(--fg)', flex: 1 }}>{n}</span>
              {t && <span className="mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{t}</span>}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, fontSize: 12, color: 'var(--fg-muted)' }}>
          Did you know? <span className="serif-it" style={{ color: 'var(--accent)' }}>You can iterate while we build</span> — just keep chatting.
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Frame>
  );
}

// B. Skeleton — sandbox warming up. Preview pane with shimmer blocks.
function EmptyB({ theme = 'light' }) {
  return (
    <Frame theme={theme}>
      <div style={{ position: 'absolute', inset: 0, padding: 28, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span className="chip" style={{ background: 'var(--accent-faint)', borderColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)' }} className="pulse-dot"></span>
            Sandbox warming up
          </span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>e2b-vm-9f2e · cold-start · ~4s remaining</span>
        </div>

        {/* skeleton page */}
        <div style={{ flex: 1, background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, overflow: 'hidden' }}>
          {/* nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div className="shimmer" style={{ width: 96, height: 22, borderRadius: 6 }}></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div className="shimmer" style={{ width: 52, height: 14, borderRadius: 4 }}></div>
              <div className="shimmer" style={{ width: 52, height: 14, borderRadius: 4 }}></div>
              <div className="shimmer" style={{ width: 52, height: 14, borderRadius: 4 }}></div>
            </div>
            <div className="shimmer" style={{ width: 28, height: 28, borderRadius: 999 }}></div>
          </div>
          {/* hero */}
          <div className="shimmer" style={{ width: '40%', height: 14, borderRadius: 4, marginBottom: 12 }}></div>
          <div className="shimmer" style={{ width: '78%', height: 38, borderRadius: 6, marginBottom: 8 }}></div>
          <div className="shimmer" style={{ width: '60%', height: 38, borderRadius: 6 }}></div>
          {/* cards */}
          <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ background: 'var(--bg-soft)', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="shimmer" style={{ width: 28, height: 28, borderRadius: 7 }}></div>
                <div className="shimmer" style={{ width: '80%', height: 14, borderRadius: 4 }}></div>
                <div className="shimmer" style={{ width: '60%', height: 12, borderRadius: 4 }}></div>
                <div className="shimmer" style={{ width: '90%', height: 10, borderRadius: 4 }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* status footer */}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--fg-muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--warn)' }}></span>
            Allocating firecracker VM…
          </span>
          <span>·</span>
          <span className="mono">npm install · 47/142</span>
          <div style={{ flex: 1 }}></div>
          <button style={{ fontSize: 12, color: 'var(--fg-dim)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>View build log <Icon d={Icons.arrowRight} size={11}/></button>
        </div>
      </div>
    </Frame>
  );
}

// C. Empty preview before any build — illustrated placeholder
function EmptyC({ theme = 'light' }) {
  return (
    <Frame theme={theme}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 460 }}>
          {/* stacked paper illustration (pure CSS) */}
          <div style={{ position: 'relative', width: 200, height: 140, marginBottom: 32 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-elev)', border: '1px solid var(--border-strong)', borderRadius: 10, transform: 'rotate(-6deg) translate(-12px, 6px)', boxShadow: 'var(--shadow-sm)' }}></div>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-elev)', border: '1px solid var(--border-strong)', borderRadius: 10, transform: 'rotate(3deg) translate(6px, -3px)', boxShadow: 'var(--shadow-sm)' }}></div>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-elev)', border: '1px solid var(--border-strong)', borderRadius: 10, boxShadow: 'var(--shadow-md)', padding: 14, display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div style={{ width: '40%', height: 7, background: 'var(--accent)', borderRadius: 3 }}></div>
              <div style={{ width: '80%', height: 6, background: 'var(--border-strong)', borderRadius: 3 }}></div>
              <div style={{ width: '70%', height: 6, background: 'var(--border-strong)', borderRadius: 3 }}></div>
              <div style={{ width: '55%', height: 6, background: 'var(--border-strong)', borderRadius: 3, marginTop: 4 }}></div>
              <div style={{ position: 'absolute', bottom: 12, right: 12, width: 22, height: 22, borderRadius: 5, background: 'var(--accent-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={Icons.zap} size={11} fill="var(--accent)" stroke={0} />
              </div>
            </div>
          </div>
          <h2 style={{ fontSize: 30, lineHeight: 1.15, fontWeight: 460, textAlign: 'center' }}>
            Your <span className="serif-it" style={{ color: 'var(--accent)' }}>blank canvas</span>.
          </h2>
          <p style={{ marginTop: 8, fontSize: 14, color: 'var(--fg-muted)', textAlign: 'center', lineHeight: 1.5 }}>
            Describe what you want to build. We'll ask a few questions, then scaffold a real Next.js project you can iterate on.
          </p>
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
            {['Start with auth + Postgres', 'Frontend-only landing page', 'Full SaaS w/ Stripe billing'].map((s,i) => (
              <button key={i} style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-elev)', fontSize: 13, color: 'var(--fg-dim)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon d={Icons.sparkle} size={12} stroke={2} />
                <span style={{ flex: 1 }}>{s}</span>
                <Icon d={Icons.arrowRight} size={12} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

Object.assign(window, { Workspace, EmptyA, EmptyB, EmptyC });
