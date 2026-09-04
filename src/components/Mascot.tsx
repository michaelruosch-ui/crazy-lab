import type { CSSProperties } from 'react'
import type { MascotId } from '../domain'
import { DEFAULT_MASCOT_ID, getMascotEntry, MASCOT_CATALOG } from './mascotArt'
import './Mascot.css'

interface MascotProps {
  mascotId?: MascotId
  size?: 'small' | 'medium' | 'large'
  talking?: boolean
  selected?: boolean
}

const SIZE_PX = { small: 40, medium: 64, large: 96 } as const
const SPECIES_IMAGE = {
  bear: 'lila-laborbaer.jpg',
  marmot: 'marmot-master.jpg',
  raccoon: 'raccoon-master.jpg',
  wolf: 'wolf-master.jpg',
  bat: 'bat-master.jpg',
  owl: 'owl-master.jpg',
  frog: 'frog-master.jpg',
  spider: 'spider-master.jpg',
} as const
const PALETTE_HUE = { violet: 0, teal: 95, pink: 330, acid: 55, blood: 300, amber: 25 } as const

export function Mascot({
  mascotId = DEFAULT_MASCOT_ID,
  size = 'medium',
  talking = false,
  selected = false,
}: MascotProps) {
  const entry = getMascotEntry(mascotId)
  const catalogIndex = MASCOT_CATALOG.findIndex((candidate) => candidate.id === entry.id)
  const px = SIZE_PX[size]
  const style = {
    width: px,
    height: px,
    '--mascot-hue': `${PALETTE_HUE[entry.palette]}deg`,
    '--mascot-tilt': `${((catalogIndex % 5) - 2) * 0.7}deg`,
  } as CSSProperties

  return (
    <span
      className={`mascot mascot--${entry.palette} ${entry.gore ? 'mascot--spooky' : ''} ${talking ? 'mascot--talking' : ''} ${selected ? 'mascot--selected' : ''}`}
      style={style}
      role="img"
      aria-label={entry.name}
    >
      <img
        className="mascot__image"
        src={`${import.meta.env.BASE_URL}mascots/${SPECIES_IMAGE[entry.species]}`}
        alt=""
      />
    </span>
  )
}
