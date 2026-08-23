import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './BackLink.css'

interface BackLinkProps {
  to: string
  children: ReactNode
}

/**
 * Zurück-Navigation, die bewusst am unteren Bildschirmrand platziert wird (mit
 * Sicherheitsabstand zur Home-Indicator-Zone via `env(safe-area-inset-bottom)`), statt oben am
 * Bildschirm - dort ist sie auf einem Handy mit einer Hand kaum erreichbar.
 */
export function BackLink({ to, children }: BackLinkProps) {
  return (
    <div className="back-link-area">
      <Link to={to} className="back-link">
        {children}
      </Link>
    </div>
  )
}
