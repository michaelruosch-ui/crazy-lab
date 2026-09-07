import type { MascotId } from '../domain'
import { translateGeneratedText, useLanguage, type TranslationKey } from '../i18n'
import { MASCOT_CATALOG, type MascotSpecies } from './mascotArt'
import { Mascot } from './Mascot'
import './MascotPicker.css'

interface MascotPickerProps {
  value: MascotId
  onChange: (mascotId: MascotId) => void
}

export function MascotPicker({ value, onChange }: MascotPickerProps) {
  const { language, t } = useLanguage()
  const speciesKeys: Record<MascotSpecies, TranslationKey> = {
    bear: 'speciesBear',
    marmot: 'speciesMarmot',
    raccoon: 'speciesRaccoon',
    wolf: 'speciesWolf',
    bat: 'speciesBat',
    owl: 'speciesOwl',
    frog: 'speciesFrog',
    spider: 'speciesSpider',
  }
  const bySpecies = new Map<MascotSpecies, typeof MASCOT_CATALOG>()
  for (const entry of MASCOT_CATALOG) {
    const list = bySpecies.get(entry.species) ?? []
    list.push(entry)
    bySpecies.set(entry.species, list)
  }

  return (
    <div className="mascot-picker" role="radiogroup" aria-label={t('chooseMascot')}>
      <p className="mascot-picker__hint">{t('mascotPickerHint')}</p>
      {[...bySpecies.entries()].map(([species, entries]) => (
        <div key={species} className="mascot-picker__group">
          <h3 className="mascot-picker__species">{t(speciesKeys[species])}</h3>
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
                <span>{translateGeneratedText(entry.name, language)}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
