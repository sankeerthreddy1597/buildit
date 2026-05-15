import Link from 'next/link'
import { Logo } from '@/components/shared/logo'

const NAV_LINKS = [
  { label: 'Showcase', href: '/showcase' },
  { label: 'Pricing',  href: '/pricing'  },
  { label: 'Docs',     href: '/docs'     },
  { label: 'Changelog',href: '/changelog'},
]

export function LandingNav() {
  return (
    <nav
      className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between"
      style={{ height: 64, padding: '0 40px' }}
    >
      <Logo size={18} />

      <div className="flex items-center gap-7 text-fg-dim" style={{ fontSize: 13.5 }}>
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="transition-colors hover:text-fg"
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          href="/login"
          className="inline-flex items-center text-fg-dim transition-colors hover:text-fg"
          style={{ padding: '7px 12px', borderRadius: 10, fontSize: 13 }}
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="inline-flex items-center text-white transition-opacity hover:opacity-90"
          style={{
            padding: '7px 14px',
            borderRadius: 10,
            background: 'var(--brand)',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Get started
        </Link>
      </div>
    </nav>
  )
}
