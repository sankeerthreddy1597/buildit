'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/shared/logo'
import { Icon } from '@/components/shared/icons'

type Mode = 'signin' | 'signup'

interface AuthFormProps {
  mode: Mode
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const supabase = createClient()
  const isSignup = mode === 'signup'

  // ── OAuth ──────────────────────────────────────────────────────────────────

  const handleOAuth = async (provider: 'github' | 'google') => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  // ── Email / password ────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) { setError(error.message); setLoading(false); return }
      // Show "check your email" or redirect if email confirmation is disabled
      router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      router.push(next)
    }
  }

  return (
    <div
      className="absolute inset-0 grid"
      style={{ gridTemplateColumns: '1fr 1.1fr' }}
    >
      {/* ── Left brand panel ─────────────────────────────────────────────── */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-soft)', padding: 36 }}
      >
        <Logo size={18} />

        {/* Centered headline */}
        <div className="flex flex-1 items-center">
          <div>
            <div className="chip mb-5">
              <Icon name="sparkle" size={11} />
              {isSignup ? 'Free to start' : 'Welcome back'}
            </div>

            <h2
              className="text-fg font-normal"
              style={{ fontSize: 44, lineHeight: 1.05, letterSpacing: '-0.02em' }}
            >
              {isSignup ? (
                <>
                  Start building
                  <br />
                  something{' '}
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      color: 'var(--brand)',
                    }}
                  >
                    great.
                  </span>
                </>
              ) : (
                <>
                  Pick up
                  <br />
                  where you{' '}
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      color: 'var(--brand)',
                    }}
                  >
                    left
                  </span>{' '}
                  off.
                </>
              )}
            </h2>

            <p
              className="text-fg-dim mt-3.5"
              style={{ fontSize: 14, maxWidth: 360, lineHeight: 1.55 }}
            >
              {isSignup
                ? 'Your first 50 credits are free — no card required. Describe an app and watch it build.'
                : 'Your projects, sandboxes, and credits are waiting. Sign in to keep iterating.'}
            </p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="text-fg-muted" style={{ fontSize: 12 }}>
          <span className="text-fg-dim italic">
            &ldquo;I shipped my MVP in an afternoon — the plan mode was the unlock for me.&rdquo;
          </span>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="inline-flex items-center justify-center text-white font-semibold shrink-0"
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                background: '#3a6a8a',
                fontSize: 9,
              }}
            >
              M
            </span>
            <span>Maya R. · founder, Tracklist</span>
          </div>
        </div>
      </div>

      {/* ── Right form ───────────────────────────────────────────────────── */}
      <div
        className="flex flex-col justify-center"
        style={{ padding: 48 }}
      >
        <div style={{ maxWidth: 360, width: '100%', margin: '0 auto' }}>

          {/* Segmented toggle */}
          <div
            className="flex text-center font-medium mb-6"
            style={{
              background: 'var(--bg-soft)',
              borderRadius: 999,
              padding: 3,
              fontSize: 12.5,
            }}
          >
            <Link
              href={`/login${next !== '/dashboard' ? `?next=${encodeURIComponent(next)}` : ''}`}
              className="flex-1 transition-all"
              style={{
                padding: '7px 0',
                borderRadius: 999,
                background: !isSignup ? 'var(--bg-elev)' : 'transparent',
                color: !isSignup ? 'var(--fg)' : 'var(--fg-muted)',
                boxShadow: !isSignup ? 'var(--shadow-sm)' : 'none',
                textAlign: 'center',
              }}
            >
              Sign in
            </Link>
            <Link
              href={`/signup${next !== '/dashboard' ? `?next=${encodeURIComponent(next)}` : ''}`}
              className="flex-1 transition-all"
              style={{
                padding: '7px 0',
                borderRadius: 999,
                background: isSignup ? 'var(--bg-elev)' : 'transparent',
                color: isSignup ? 'var(--fg)' : 'var(--fg-muted)',
                boxShadow: isSignup ? 'var(--shadow-sm)' : 'none',
                textAlign: 'center',
              }}
            >
              Create account
            </Link>
          </div>

          {/* Title */}
          <h3
            className="text-fg font-semibold"
            style={{ fontSize: 22, letterSpacing: '-0.01em' }}
          >
            {isSignup ? 'Make something today.' : 'Sign in to buildit'}
          </h3>
          <p className="text-fg-muted mt-1" style={{ fontSize: 13 }}>
            {isSignup
              ? 'No credit card required for 50 free credits.'
              : 'Use the email you signed up with.'}
          </p>

          {/* OAuth buttons */}
          <div className="flex flex-col gap-2 mt-5">
            <button
              type="button"
              onClick={() => handleOAuth('github')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 text-fg-dim font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                border: '1px solid var(--bd-strong)',
                background: 'var(--bg-elev)',
                fontSize: 13.5,
              }}
            >
              <Icon name="github" size={15} />
              Continue with GitHub
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 text-fg-dim font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                border: '1px solid var(--bd-strong)',
                background: 'var(--bg-elev)',
                fontSize: 13.5,
              }}
            >
              <GoogleLogo />
              Continue with Google
            </button>
          </div>

          {/* OR divider */}
          <div className="flex items-center gap-2.5 my-5">
            <div className="flex-1 h-px" style={{ background: 'var(--bd)' }} />
            <span
              className="text-fg-muted uppercase"
              style={{ fontSize: 11, letterSpacing: '0.06em' }}
            >
              or
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--bd)' }} />
          </div>

          {/* Email / password form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            {isSignup && (
              <label className="block">
                <span className="text-fg-muted block mb-1" style={{ fontSize: 11.5 }}>Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jules Hart"
                  required={isSignup}
                  className="w-full text-fg bg-bg-elev placeholder:text-fg-faint outline-none transition-colors focus:ring-1 focus:ring-brand"
                  style={{
                    padding: '10px 12px',
                    border: '1px solid var(--bd)',
                    borderRadius: 9,
                    fontSize: 13.5,
                  }}
                />
              </label>
            )}

            <label className="block">
              <span className="text-fg-muted block mb-1" style={{ fontSize: 11.5 }}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full text-fg bg-bg-elev placeholder:text-fg-faint outline-none transition-colors focus:ring-1 focus:ring-brand"
                style={{
                  padding: '10px 12px',
                  border: '1px solid var(--bd)',
                  borderRadius: 9,
                  fontSize: 13.5,
                }}
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between mb-1">
                <span className="text-fg-muted" style={{ fontSize: 11.5 }}>Password</span>
                {!isSignup && (
                  <Link href="/forgot-password" className="text-brand" style={{ fontSize: 11.5 }}>
                    Forgot?
                  </Link>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full text-fg bg-bg-elev placeholder:text-fg-faint outline-none transition-colors focus:ring-1 focus:ring-brand"
                style={{
                  padding: '10px 12px',
                  border: '1px solid var(--bd)',
                  borderRadius: 9,
                  fontSize: 13.5,
                }}
              />
            </label>

            {/* Error message */}
            {error && (
              <p
                className="text-danger text-center"
                style={{ fontSize: 12.5 }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-medium transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed mt-1.5"
              style={{
                padding: '11px 16px',
                borderRadius: 10,
                background: 'var(--brand)',
                fontSize: 13.5,
              }}
            >
              {loading ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
              {!loading && <Icon name="arrowRight" size={13} />}
            </button>
          </form>

          {/* Legal */}
          <p
            className="text-fg-muted text-center mt-5"
            style={{ fontSize: 11.5 }}
          >
            By continuing you agree to our{' '}
            <Link href="/terms" className="text-fg-dim underline">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-fg-dim underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

// Multicolour Google "G" logo (inline SVG matching the design)
function GoogleLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22 12a10 10 0 0 0-.18-1.84H12v3.6h5.6a4.8 4.8 0 0 1-2.1 3.16v2.6h3.4A10 10 0 0 0 22 12Z" />
      <path fill="#34A853" d="M12 22a9.84 9.84 0 0 0 6.9-2.48l-3.4-2.6a6 6 0 0 1-8.9-3.12H3.1v2.7A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.6 13.8a6 6 0 0 1 0-3.6V7.5H3.1a10 10 0 0 0 0 9l3.5-2.7Z" />
      <path fill="#EA4335" d="M12 6a5.4 5.4 0 0 1 3.8 1.5l2.84-2.84A10 10 0 0 0 3.1 7.5L6.6 10.2A6 6 0 0 1 12 6Z" />
    </svg>
  )
}
