// Shared building blocks for buildit screens.
// All components attach to window so they're accessible from sibling
// <script type="text/babel"> files.

const { useState, useEffect, useRef } = React;

// ---------- brand ----------
function Logo({ size = 18, color, dotColor }) {
  const c = color || 'currentColor';
  const d = dotColor || 'var(--accent)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, color: c, fontSize: size, lineHeight: 1 }}>
      <span style={{ width: size * 0.4, height: size * 0.4, background: d, borderRadius: 3, alignSelf: 'center', flex: 'none' }}></span>
      <span style={{ fontFamily: 'ui-sans-serif, system-ui', fontWeight: 560, letterSpacing: '-0.02em' }}>build</span>
      <span className="serif-it" style={{ fontSize: size * 1.1, lineHeight: 1, color: d, marginLeft: -2 }}>it</span>
    </span>
  );
}

// ---------- icons ----------
const Icon = ({ d, size = 16, stroke = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);
const Icons = {
  arrowUp: 'M12 19V5M5 12l7-7 7 7',
  arrowRight: 'M5 12h14M13 5l7 7-7 7',
  send: 'M22 2 11 13M22 2 15 22l-4-9-9-4 20-7Z',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 12l5 5L20 7',
  x: 'M18 6 6 18M6 6l12 12',
  chevDown: 'M6 9l6 6 6-6',
  chevUp: 'M18 15l-6-6-6 6',
  chevRight: 'M9 6l6 6-6 6',
  sparkle: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1',
  bolt: 'm13 2-8 12h6l-1 8 8-12h-6l1-8Z',
  code: 'M8 6 2 12l6 6M16 6l6 6-6 6M14 4l-4 16',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z',
  monitor: 'M2 4h20v14H2zM8 22h8M12 18v4',
  phone: 'M7 2h10v20H7zM12 18h.01',
  search: 'm21 21-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z',
  layers: 'm2 7 10-5 10 5-10 5L2 7Zm0 5 10 5 10-5M2 17l10 5 10-5',
  zap: 'M13 2 3 14h7l-1 8 11-12h-7l1-8Z',
  user: 'M20 21a8 8 0 1 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8.91a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.16.66.42.87.74A1.65 1.65 0 0 0 21 9.6h.09a2 2 0 0 1 0 4H21a1.65 1.65 0 0 0-1.51 1Z',
  refresh: 'M3 12a9 9 0 0 1 15.5-6.4L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.4L3 16M3 21v-5h5',
  copy: 'M9 9h10v10H9zM5 15H3V3h12v2',
  external: 'M15 3h6v6M14 10l7-7M19 14v6H5V5h6',
  github: 'M12 1a11 11 0 0 0-3.5 21.5c.55.1.75-.24.75-.53v-2c-3 .65-3.65-1.4-3.65-1.4-.5-1.25-1.2-1.6-1.2-1.6-1-.7.08-.7.08-.7 1.1.1 1.65 1.15 1.65 1.15 1 1.65 2.6 1.2 3.25.9.1-.7.4-1.2.7-1.5-2.4-.25-4.95-1.2-4.95-5.4 0-1.2.4-2.15 1.15-2.95-.1-.25-.5-1.4.1-2.95 0 0 .95-.3 3.05 1.1a10.5 10.5 0 0 1 5.55 0c2.1-1.4 3.05-1.1 3.05-1.1.6 1.55.2 2.7.1 2.95.75.8 1.15 1.75 1.15 2.95 0 4.2-2.55 5.15-5 5.4.4.35.75 1 .75 2v3c0 .3.2.65.75.55A11 11 0 0 0 12 1Z',
  paperclip: 'M21 12l-9 9a6 6 0 0 1-8.5-8.5l9-9a4 4 0 0 1 5.66 5.66l-9 9a2 2 0 0 1-2.83-2.83l8-8',
  stop: 'M6 6h12v12H6z',
  play: 'M6 4l14 8-14 8V4Z',
  pause: 'M6 4h4v16H6zM14 4h4v16h-4z',
  database: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6"/></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></>,
  sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z',
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  trash: 'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
  star: 'M12 2l3 7 7.5.5L17 14.5l1.5 7.5L12 18l-6.5 4 1.5-7.5L1.5 9.5 9 9z',
  history: 'M12 8v4l3 2M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5',
  command: 'M9 6V3a3 3 0 0 0-3 3h3Zm0 0v12m0-12h6m0 0V3a3 3 0 0 1 3 3h-3Zm0 0v12m0 0v3a3 3 0 0 0 3-3h-3Zm0 0H9m0 0v3a3 3 0 0 1-3-3h3Z',
};

// ---------- avatar ----------
function Avatar({ name = 'A', tone = 'a', size = 28 }) {
  const palettes = {
    a: ['#c45a26','#fff'], b: ['#3a6a8a','#fff'], c: ['#5a8a4a','#fff'],
    d: ['#7a4a8a','#fff'], e: ['#2a241d','#f0e8da'], f: ['#c98b1e','#fff'],
  };
  const [bg, fg] = palettes[tone] || palettes.a;
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, background: bg, color: fg,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.42, fontWeight: 600, letterSpacing: '-0.02em', flex: 'none'
    }}>{name.slice(0,1).toUpperCase()}</div>
  );
}

// ---------- a "phantom" handwritten annotation (margin note) ----------
function MarginNote({ children, dir = 'right', style = {} }) {
  // dir: 'right' (arrow points to left) / 'left' (arrow points to right)
  const arrowPath = dir === 'right'
    ? 'M2 30 Q 18 26 32 14 M28 18 L 32 14 L 28 10'
    : 'M58 30 Q 42 26 28 14 M32 18 L 28 14 L 32 10';
  return (
    <div style={{ position: 'absolute', display: 'flex', alignItems: 'flex-start', gap: 4, ...style }}>
      <span className="hand" style={{ fontSize: 19, color: 'var(--accent)', lineHeight: 1.1, transform: 'rotate(-4deg)' }}>
        {children}
      </span>
      <svg width="60" height="40" viewBox="0 0 60 40" style={{ color: 'var(--accent)', opacity: .8, flex: 'none' }}>
        <path d={arrowPath} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ---------- generic placeholder block ----------
function Block({ w = '100%', h = 12, r = 4, c = 'var(--border)' }) {
  return <div style={{ width: w, height: h, background: c, borderRadius: r }}></div>;
}

// ---------- traffic lights / window chrome ----------
function TrafficLights({ light = false }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <span style={{ width: 11, height: 11, borderRadius: 999, background: '#ff5f57' }}></span>
      <span style={{ width: 11, height: 11, borderRadius: 999, background: '#febc2e' }}></span>
      <span style={{ width: 11, height: 11, borderRadius: 999, background: '#28c840' }}></span>
    </div>
  );
}

// Frame wrapper to use inside DCArtboard — applies theme class + base styles.
function Frame({ theme, children, style }) {
  const cls = `frame theme-${theme || 'light'}`;
  return <div className={cls} style={style}>{children}</div>;
}

Object.assign(window, { Logo, Icon, Icons, Avatar, MarginNote, Block, TrafficLights, Frame });
