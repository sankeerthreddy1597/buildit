import { cn } from '@/lib/utils'

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 18, className }: LogoProps) {
  return (
    <span
      className={cn('inline-flex items-baseline', className)}
      style={{ gap: 6, fontSize: size, lineHeight: 1, color: 'var(--fg)' }}
    >
      {/* brand mark — filled square */}
      <span
        style={{
          width: size * 0.4,
          height: size * 0.4,
          background: 'var(--brand)',
          borderRadius: 3,
          alignSelf: 'center',
          flexShrink: 0,
        }}
      />
      {/* "build" — UI sans */}
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 560, letterSpacing: '-0.02em' }}>
        build
      </span>
      {/* "it" — Instrument Serif italic, brand color */}
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: size * 1.1,
          color: 'var(--brand)',
          marginLeft: -2,
          lineHeight: 1,
        }}
      >
        it
      </span>
    </span>
  )
}
