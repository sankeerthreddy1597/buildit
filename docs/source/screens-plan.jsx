// Plan mode variations.
// Spec: an expandable bar above the input. Collapsed: shows plan title +
// build button. Expanded: feature checklist; toggling features rebuilds
// the plan. Press Build → agent starts.

function ChatPreface() {
  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14, padding: '20px 24px' }}>
      {/* user message */}
      <div style={{ alignSelf: 'flex-end', maxWidth: '70%', background: 'var(--accent-faint)', color: 'var(--fg)', padding: '10px 14px', borderRadius: '14px 14px 4px 14px', fontSize: 13.5, border: '1px solid var(--accent-soft)' }}>
        A habit tracker — email login, daily reminders, and a streak page. Should sync across devices.
      </div>
      {/* agent message */}
      <div style={{ display: 'flex', gap: 10, maxWidth: '85%' }}>
        <div style={{ width: 24, height: 24, borderRadius: 999, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 2 }}>
          <Icon d={Icons.sparkle} size={12} stroke={2} />
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--fg-dim)', lineHeight: 1.55 }}>
          Got it. A few questions before we plan:<br/>
          → Web-only or also mobile-friendly?<br/>
          → Should habits be shareable with friends, or private only?<br/>
          → How are reminders delivered — email, push, or both?
        </div>
      </div>
      {/* user reply */}
      <div style={{ alignSelf: 'flex-end', maxWidth: '60%', background: 'var(--accent-faint)', color: 'var(--fg)', padding: '10px 14px', borderRadius: '14px 14px 4px 14px', fontSize: 13.5, border: '1px solid var(--accent-soft)' }}>
        Web + mobile responsive. Private only. Email reminders.
      </div>
      <div style={{ display: 'flex', gap: 10, maxWidth: '85%' }}>
        <div style={{ width: 24, height: 24, borderRadius: 999, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 2 }}>
          <Icon d={Icons.sparkle} size={12} stroke={2} />
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--fg-dim)', lineHeight: 1.55 }}>
          Perfect — here's the plan. Review the features you want, uncheck anything you'd like to skip, then hit <b style={{ color: 'var(--fg)' }}>Build</b>.
        </div>
      </div>
    </div>
  );
}

function MiniInput({ placeholder = "Ask for changes or add more requirements…" }) {
  return (
    <div style={{ margin: '0 24px 22px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 14, padding: 12, display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--shadow-sm)' }}>
      <Icon d={Icons.paperclip} size={15} />
      <div style={{ flex: 1, color: 'var(--fg-faint)', fontSize: 13.5 }}>{placeholder}</div>
      <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 7, fontSize: 12, color: 'var(--fg-muted)', border: '1px solid var(--border)' }}>
        <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--accent)' }}></span> Claude
      </button>
      <button style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--accent)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon d={Icons.arrowUp} size={14} stroke={2.2} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VARIATION A — Folded note paper that unfolds above the input.
// Warm paper color, 'tactile' feel. Build button is part of the note.
// ─────────────────────────────────────────────────────────────
function PlanA({ theme = 'light' }) {
  const features = [
    { id: 1, name: 'Email + password sign in', meta: 'Auth · Supabase', on: true, locked: true },
    { id: 2, name: 'Habit CRUD + categories', meta: 'Data model', on: true },
    { id: 3, name: 'Streak calculation & history', meta: 'Core feature', on: true },
    { id: 4, name: 'Daily email reminders', meta: 'Resend integration', on: true },
    { id: 5, name: 'Mobile-responsive UI', meta: 'shadcn/ui', on: true },
    { id: 6, name: 'Public profile pages', meta: 'Out of scope per chat', on: false, dim: true },
    { id: 7, name: 'Friend feed / social', meta: 'Out of scope per chat', on: false, dim: true },
  ];
  return (
    <Frame theme={theme} style={{ display: 'flex', flexDirection: 'column' }}>
      <ChatPreface />
      <div style={{ padding: '0 24px 8px' }}>
        <div className="note-paper-warm" style={{ borderRadius: 16, overflow: 'hidden' }}>
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid rgba(196,90,38,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Icon d={Icons.layers} size={14} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Build plan</div>
                <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>5 of 7 features · Full-stack · Next.js + Supabase</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>~38 credits</span>
              <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }}>
                <Icon d={Icons.chevUp} size={13} /> Collapse
              </button>
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
                <Icon d={Icons.zap} size={13} fill="currentColor" /> Build
              </button>
            </div>
          </div>
          {/* checklist */}
          <div style={{ padding: '10px 8px 12px' }}>
            {features.map(f => (
              <div key={f.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10,
                opacity: f.dim ? 0.55 : 1,
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 5,
                  border: '1.5px solid ' + (f.on ? 'var(--accent)' : 'var(--border-strong)'),
                  background: f.on ? 'var(--accent)' : 'transparent',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flex: 'none',
                }}>{f.on && <Icon d={Icons.check} size={12} stroke={2.6} />}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, textDecoration: f.on ? 'none' : 'line-through' }}>{f.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{f.meta}</div>
                </div>
                {f.locked && <span className="mono" style={{ fontSize: 10, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon d={Icons.lock} size={10}/> required</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <MiniInput />
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// VARIATION B — Sectioned plan card. Features grouped by area:
// Pages, Data, Integrations. Compact, scanable.
// ─────────────────────────────────────────────────────────────
function PlanB({ theme = 'light' }) {
  const sections = [
    { title: 'Pages', icon: Icons.monitor, items: [
      ['Sign in / sign up', true], ['Dashboard (today\'s habits)', true],
      ['Habit detail + history', true], ['Settings & notifications', true],
    ]},
    { title: 'Data model', icon: Icons.database, items: [
      ['users, habits, completions tables', true, 'required'],
      ['categories', true], ['shared_habits', false],
    ]},
    { title: 'Integrations', icon: Icons.bolt, items: [
      ['Supabase auth', true, 'required'],
      ['Resend (daily email)', true],
      ['Stripe (premium tier)', false],
    ]},
  ];
  return (
    <Frame theme={theme} style={{ display: 'flex', flexDirection: 'column' }}>
      <ChatPreface />
      <div style={{ padding: '0 24px 8px' }}>
        <div style={{ background: 'var(--bg-elev)', borderRadius: 14, border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--accent)' }} className="pulse-dot"></span>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Plan ready · review before building</div>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 3, marginLeft: 16 }}>4 pages · 3 tables · 2 integrations · est. ~6 min · ~38 credits</div>
            </div>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, fontSize: 12, color: 'var(--fg-muted)' }}>
              <Icon d={Icons.code} size={13} /> Starter args
            </button>
            <button className="btn btn-primary" style={{ marginLeft: 8, padding: '8px 18px', fontSize: 13 }}>
              Build → <span className="kbd" style={{ background: 'rgba(255,255,255,0.2)', color:'#fff', border: 0, padding: '1px 5px' }}>↵</span>
            </button>
          </div>
          {/* sections grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
            {sections.map((s,i) => (
              <div key={s.title} style={{ padding: '14px 16px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  <Icon d={s.icon} size={12} /> {s.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {s.items.map(([name, on, tag], j) => (
                    <label key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <span style={{
                        width: 16, height: 16, borderRadius: 4,
                        border: '1.5px solid ' + (on ? 'var(--accent)' : 'var(--border-strong)'),
                        background: on ? 'var(--accent)' : 'transparent',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flex: 'none',
                      }}>{on && <Icon d={Icons.check} size={10} stroke={2.8} />}</span>
                      <span style={{ fontSize: 12.5, flex: 1, color: on ? 'var(--fg)' : 'var(--fg-muted)', textDecoration: on ? 'none' : 'line-through' }}>{name}</span>
                      {tag === 'required' && <span className="mono" style={{ fontSize: 9, color: 'var(--fg-muted)' }}>•req</span>}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon d={Icons.sparkle} size={11} /> You can keep iterating after the first build — uncheck anything to defer it.
        </div>
      </div>
      <MiniInput />
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// VARIATION C — Collapsed pill above input. Single line summary
// with chips per feature; click to expand into editable list.
// (Show collapsed state to demo the compact form.)
// ─────────────────────────────────────────────────────────────
function PlanC({ theme = 'light' }) {
  return (
    <Frame theme={theme} style={{ display: 'flex', flexDirection: 'column' }}>
      <ChatPreface />
      <div style={{ padding: '0 24px 8px' }}>
        {/* expanded inline */}
        <div style={{ background: 'var(--bg-elev)', borderRadius: 14, border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon d={Icons.chevDown} size={14} />
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>Plan · click chips to toggle</div>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--fg-muted)' }}>5 features · 38 credits</span>
            <div style={{ flex: 1 }}></div>
            <button className="btn btn-primary" style={{ padding: '7px 16px', fontSize: 12.5 }}>
              <Icon d={Icons.zap} size={12} fill="currentColor" /> Build now
            </button>
          </div>
          {/* feature chips */}
          <div style={{ padding: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[
              ['Email auth', true, true],
              ['Habits CRUD', true],
              ['Streak page', true],
              ['Daily email reminders', true],
              ['Responsive mobile', true],
              ['Public profile', false],
              ['Social feed', false],
              ['+ Add feature', null],
            ].map(([name, on, locked], i) => (
              <button key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 12px', borderRadius: 999,
                border: '1px solid ' + (on ? 'var(--accent)' : on === false ? 'var(--border)' : 'var(--border-strong)'),
                background: on ? 'var(--accent-faint)' : 'transparent',
                color: on ? 'var(--accent)' : on === false ? 'var(--fg-muted)' : 'var(--fg-dim)',
                fontSize: 12.5, fontWeight: 500,
                textDecoration: on === false ? 'line-through' : 'none',
                opacity: on === false ? 0.7 : 1,
                cursor: 'pointer',
              }}>
                {on === true && <Icon d={Icons.check} size={11} stroke={2.5} />}
                {on === false && <Icon d={Icons.x} size={11} stroke={2.2} />}
                {on === null && <Icon d={Icons.plus} size={11} stroke={2.2} />}
                {name}
                {locked && <Icon d={Icons.lock} size={10} />}
              </button>
            ))}
          </div>
          {/* footnote — what we'll skip */}
          <div style={{ padding: '10px 14px', borderTop: '1px dashed var(--border)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-soft)' }}>
            <span style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>
              <b style={{ color: 'var(--fg-dim)' }}>Stack:</b> Next.js · Tailwind · shadcn/ui · Supabase · Resend
            </span>
            <span style={{ flex: 1 }}></span>
            <button style={{ fontSize: 11.5, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon d={Icons.settings} size={11} /> Change stack
            </button>
          </div>
        </div>
      </div>
      <MiniInput />
    </Frame>
  );
}

Object.assign(window, { PlanA, PlanB, PlanC });
