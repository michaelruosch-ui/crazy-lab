import type { CSSProperties } from 'react'
import type { MascotId } from '../domain'
import { translateGeneratedText, useLanguage } from '../i18n'
import { DEFAULT_MASCOT_ID, getMascotEntry } from './mascotArt'
import './Mascot.css'

interface MascotProps {
  mascotId?: MascotId
  size?: 'small' | 'medium' | 'large'
  talking?: boolean
  selected?: boolean
}

const SIZE_PX = { small: 40, medium: 64, large: 96 } as const
const SPECIES_SPRITE = {
  bear: 'bear-wave-v2.png',
  marmot: 'marmot-wave-v2.png',
  raccoon: 'raccoon-wave-v2.png',
  wolf: 'wolf-wave-v2.png',
  bat: 'bat-wave-v2.png',
  owl: 'owl-wave-v2.png',
  frog: 'frog-wave-v2.png',
  spider: 'spider-wave-v2.png',
} as const
const PALETTE_HUE = { violet: 0, teal: 95, pink: 330, acid: 55, blood: 300, amber: 25 } as const

export function Mascot({
  mascotId = DEFAULT_MASCOT_ID,
  size = 'medium',
  talking = false,
  selected = false,
}: MascotProps) {
  const entry = getMascotEntry(mascotId)
  const { language } = useLanguage()
  const px = SIZE_PX[size]
  const style = {
    width: px,
    height: px,
    '--mascot-hue': `${PALETTE_HUE[entry.palette]}deg`,
  } as CSSProperties

  return (
    <span
      className={`mascot mascot--${entry.palette} ${talking ? 'mascot--talking' : ''} ${selected ? 'mascot--selected' : ''}`}
      style={style}
      role="img"
      aria-label={translateGeneratedText(entry.name, language)}
    >
      <img
        className="mascot__background"
        src={`${import.meta.env.BASE_URL}mascots/lab-background-v2.png`}
        alt=""
      />
      <span className="mascot__sprite-window" aria-hidden="true">
        <img
          className="mascot__sprite"
          src={`${import.meta.env.BASE_URL}mascots/${SPECIES_SPRITE[entry.species]}`}
          alt=""
        />
      </span>
    </span>
  )
}
