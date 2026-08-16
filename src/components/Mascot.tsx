import './Mascot.css'

interface MascotProps {
  size?: 'small' | 'medium' | 'large'
  talking?: boolean
}

export function Mascot({ size = 'medium', talking = false }: MascotProps) {
  return (
    <div
      className={`mascot mascot--${size} ${talking ? 'mascot--talking' : ''}`}
      role="img"
      aria-label="Das Labor-Maskottchen"
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
