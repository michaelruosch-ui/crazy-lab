import type { MascotId } from '../domain'
import { MASCOT_CATALOG, SPECIES_LABEL, type MascotSpecies } from './mascotArt'
import { Mascot } from './Mascot'
import './MascotPicker.css'

interface MascotPickerProps {
  value: MascotId
  onChange: (mascotId: MascotId) => void
}

export function MascotPicker({ value, onChange }: MascotPickerProps) {
  const bySpecies = new Map<MascotSpecies, typeof MASCOT_CATALOG>()
  for (const entry of MASCOT_CATALOG) {
    const list = bySpecies.get(entry.species) ?? []
    list.push(entry)
    bySpecies.set(entry.species, list)
  }

  return (
    <div className="mascot-picker" role="radiogroup" aria-label="Maskottchen auswählen">
      <p className="mascot-picker__hint">
        Scroll durch alle {MASCOT_CATALOG.length} Entwürfe und tippe deinen Favoriten an.
      </p>
      {[...bySpecies.entries()].map(([species, entries]) => (
        <div key={species} className="mascot-picker__group">
          <h3 className="mascot-picker__species">{SPECIES_LABEL[species]}</h3>
          <div className="mascot-picker__grid">
            {entries.map((entry) => (
              <button
                type="button"
                key={entry.id}
                role="radio"
                aria-checked={value === entry.id}
                className={`mascot-picker__tile ${value === entry.id ? 'mascot-picker__tile--selected' : ''}`}
                onClick={() => onChange(entry.id)}
              >
                <Mascot mascotId={entry.id} size="medium" selected={value === entry.id} />
                <span>{entry.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
