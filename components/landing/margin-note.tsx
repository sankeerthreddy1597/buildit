import { cn } from '@/lib/utils'

interface MarginNoteProps {
  children: React.ReactNode
  /** Which side the arrow points toward */
  dir?: 'left' | 'right'
  className?: string
  style?: React.CSSProperties
}

const ARROW = {
  left:  'M2 30 Q 18 26 32 14 M28 18 L 32 14 L 28 10',
  right: 'M58 30 Q 42 26 28 14 M32 18 L 28 14 L 32 10',
}

export function MarginNote({ children, dir = 'right', className, style }: MarginNoteProps) {
  return (
    <div
      className={cn('absolute flex items-start gap-1', className)}
      style={style}
    >
      <span
        className="leading-tight"
        style={{
          fontFamily: 'var(--font-hand)',
          fontSize: 19,
          color: 'var(--brand)',
          transform: 'rotate(-4deg)',
          display: 'block',
        }}
      >
        {children}
      </span>
      <svg
        width="60"
        height="40"
        viewBox="0 0 60 40"
        style={{ color: 'var(--brand)', opacity: 0.8, flexShrink: 0 }}
      >
        <path
          d={ARROW[dir]}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
