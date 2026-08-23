import { useEffect, useRef } from 'react'
import type { MascotId } from '../domain'
import { DEFAULT_MASCOT_ID, drawMascot, getMascotEntry } from './mascotArt'
import './Mascot.css'

interface MascotProps {
  mascotId?: MascotId
  size?: 'small' | 'medium' | 'large'
  talking?: boolean
}

const SIZE_PX: Record<NonNullable<MascotProps['size']>, number> = {
  small: 40,
  medium: 64,
  large: 96,
}

export function Mascot({ mascotId = DEFAULT_MASCOT_ID, size = 'medium', talking = false }: MascotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = 240 * dpr
    canvas.height = 240 * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawMascot(ctx, mascotId)
  }, [mascotId])

  const px = SIZE_PX[size]

  return (
    <canvas
      ref={canvasRef}
      className={`mascot ${talking ? 'mascot--talking' : ''}`}
      style={{ width: px, height: px }}
      role="img"
      aria-label={getMascotEntry(mascotId).name}
    />
  )
}
