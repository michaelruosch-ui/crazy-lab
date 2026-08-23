import { useEffect, useMemo, type CSSProperties } from 'react'
import type { MascotId, StampId } from '../domain'
import { STAMPS } from '../domain'
import { PALETTES, getMascotEntry } from './mascotArt'
import './StampAnimation.css'

interface StampAnimationProps {
  stamp: StampId
  mascotId: MascotId
  onDone: () => void
}

const ANIMATION_DURATION_MS = 1900

const PALM_CENTER = { x: 37, y: 43, rx: 33, ry: 23 }
const FUR_TUFT_COUNT = 16

function buildFurTufts() {
  return Array.from({ length: FUR_TUFT_COUNT }, (_, i) => {
    const a = (i / FUR_TUFT_COUNT) * Math.PI * 2
    const left = PALM_CENTER.x + Math.cos(a) * PALM_CENTER.rx * 0.92
    const top = PALM_CENTER.y + Math.sin(a) * PALM_CENTER.ry * 0.92
    const rotateDeg = (a * 180) / Math.PI + 90
    return { key: i, left, top, rotateDeg }
  })
}

const FUR_TUFTS = buildFurTufts()

/**
 * Zeigt einmalig eine Animation, bei der eine zum gewählten Maskottchen passende Pranke
 * (Farbe/Fell aus der Palette, Blut nur bei "blutigen" Maskottchen) den gewählten Stempel aufs
 * Labortagebuch-Blatt drückt. Ruft `onDone` nach Ablauf der Animation auf.
 */
export function StampAnimation({ stamp, mascotId, onDone }: StampAnimationProps) {
  const stampEmoji = STAMPS.find((s) => s.id === stamp)?.emoji ?? '🔮'
  const entry = useMemo(() => getMascotEntry(mascotId), [mascotId])
  const palette = PALETTES[entry.palette]

  useEffect(() => {
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = setTimeout(onDone, prefersReducedMotion ? 0 : ANIMATION_DURATION_MS)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="stamp-animation-backdrop" role="presentation" onClick={onDone}>
      <div
        className="stamp-animation"
        style={
          {
            '--fur-body': palette.body,
            '--fur-light': palette.light,
            '--fur-dark': palette.dark,
          } as CSSProperties
        }
      >
        <div className="stamp-animation__stage">
          <div className="stamp-animation__rig-anchor">
            <div className="stamp-animation__rig">
              <div className="stamp-animation__stamp-block">
                <div className="stamp-animation__stamp-face">{stampEmoji}</div>
              </div>
              <div className="stamp-animation__paw">
                <div className="stamp-animation__cuff" />
                <div className="stamp-animation__thumb" />
                <div className="stamp-animation__finger stamp-animation__finger--1" />
                <div className="stamp-animation__finger stamp-animation__finger--2" />
                <div className="stamp-animation__finger stamp-animation__finger--3" />
                <div className="stamp-animation__finger stamp-animation__finger--4" />
                <div className="stamp-animation__palm" />
                {entry.gore && (
                  <>
                    <div className="stamp-animation__blood stamp-animation__blood--1" />
                    <div className="stamp-animation__blood stamp-animation__blood--2" />
                  </>
                )}
                {FUR_TUFTS.map((tuft) => (
                  <span
                    key={tuft.key}
                    className="stamp-animation__fur-tuft"
                    style={{
                      left: tuft.left,
                      top: tuft.top,
                      transform: `translate(-50%, -100%) rotate(${tuft.rotateDeg}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="stamp-animation__ink-ring" />
          <div className="stamp-animation__page">
            <div className="stamp-animation__mark">{stampEmoji}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
