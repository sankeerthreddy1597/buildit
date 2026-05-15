'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Logo } from '@/components/shared/logo'
import { Icon } from '@/components/shared/icons'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export interface SidebarUser {
  name: string
  email: string
  credits: number
  plan: 'free' | 'pro'
}

const NAV_ITEMS = [
  { label: 'Projects',  href: '/dashboard', icon: 'layers'   as const },
  { label: 'Settings',  href: '/settings',  icon: 'settings' as const },
]

export function AppSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside
      className="flex flex-col shrink-0 border-r"
      style={{ width: 220, borderColor: 'var(--bd)', background: 'var(--bg-elev)' }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px' }}>
        <Logo size={16} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5">
        {NAV_ITEMS.map(({ label, href, icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg transition-colors mb-0.5',
                active
                  ? 'bg-bg-soft text-fg'
                  : 'text-fg-muted hover:text-fg hover:bg-bg-soft'
              )}
              style={{ padding: '7px 10px', fontSize: 13.5 }}
            >
              <Icon name={icon} size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Credits bar */}
      <div style={{ padding: '0 16px 12px' }}>
        <div
          className="rounded-lg p-3"
          style={{ background: 'var(--bg-soft)', border: '1px solid var(--bd)' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-fg-muted" style={{ fontSize: 11.5 }}>Credits</span>
            <span
              className="text-fg-dim font-medium"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}
            >
              {user.credits.toLocaleString()}
            </span>
          </div>
          {/* Progress bar */}
          <div
            className="rounded-full overflow-hidden"
            style={{ height: 4, background: 'var(--bd-strong)' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                background: 'var(--brand)',
                width: `${Math.min(100, (user.credits / (user.plan === 'pro' ? 1500 : 50)) * 100)}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-fg-faint" style={{ fontSize: 10.5 }}>
              {user.plan === 'pro' ? '1,500 / mo' : '50 free'}
            </span>
            {user.plan === 'free' && (
              <Link
                href="/settings/billing"
                className="text-brand transition-opacity hover:opacity-80"
                style={{ fontSize: 10.5, fontWeight: 500 }}
              >
                Upgrade →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* User row */}
      <div
        className="flex items-center gap-2.5"
        style={{ padding: '12px 16px', borderTop: '1px solid var(--bd)' }}
      >
        <span
          className="inline-flex items-center justify-center shrink-0 text-white font-semibold"
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: 'var(--brand)',
            fontSize: 11,
          }}
        >
          {user.name[0].toUpperCase()}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-fg truncate" style={{ fontSize: 12.5, fontWeight: 500 }}>
            {user.name}
          </div>
          <div className="text-fg-muted truncate" style={{ fontSize: 11 }}>
            {user.plan === 'pro' ? 'Pro plan' : 'Free plan'}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-fg-faint hover:text-fg-muted transition-colors cursor-pointer"
          title="Log out"
        >
          <Icon name="logout" size={14} />
        </button>
      </div>
    </aside>
  )
}
