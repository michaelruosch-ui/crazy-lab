import type { ReactNode } from 'react'
import './Badge.css'

type BadgeTone =
  'teal' | 'violet' | 'pink' | 'acid' | 'safety-green' | 'safety-yellow' | 'safety-red'

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
}

export function Badge({ tone = 'teal', children }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}
