import type { MascotVariant } from '../domain'
import './Mascot.css'

interface MascotProps {
  variant?: MascotVariant
  size?: 'small' | 'medium' | 'large'
  talking?: boolean
}

const VARIANT_LABELS: Record<MascotVariant, string> = {
  geist: 'Das Geist-Maskottchen',
  vampir: 'Das Vampir-Maskottchen',
  kobold: 'Das Kobold-Maskottchen',
}

export function Mascot({ variant = 'geist', size = 'medium', talking = false }: MascotProps) {
  return (
    <div
      className={`mascot mascot--${size} mascot--${variant} ${talking ? 'mascot--talking' : ''}`}
      role="img"
      aria-label={VARIANT_LABELS[variant]}
    >
      <div className="mascot__horn mascot__horn--left" />
      <div className="mascot__horn mascot__horn--right" />
      <div className="mascot__body">
        <div className="mascot__eye mascot__eye--left" />
        <div className="mascot__eye mascot__eye--right" />
        <div className="mascot__mouth">
          <span className="mascot__tooth" />
          <span className="mascot__tooth" />
          <span className="mascot__tooth" />
        </div>
      </div>
    </div>
  )
}
