import { useState } from 'react'
import type { Mission } from '../../domain'
import type {
  AdjustmentTag,
  CompletionRating,
  DifficultyFeedback,
  MascotId,
  StampId,
} from '../../domain'
import { ADJUSTMENT_LABELS, ADJUSTMENT_TAGS, DEFAULT_PROFILE, STAMPS } from '../../domain'
import { Button, StampAnimation } from '../../components'
import './CompletionForm.css'
import type { FormEvent } from 'react'

interface CompletionFormProps {
  mission: Mission
  onSubmit: (rating: CompletionRating) => void
  submitting?: boolean
  mascotId?: MascotId
  drinkVariant?: string
}

const DIFFICULTY_OPTIONS: { value: DifficultyFeedback; label: string }[] = [
  { value: 'zu_einfach', label: 'Zu einfach' },
  { value: 'genau_richtig', label: 'Genau richtig' },
  { value: 'zu_schwierig', label: 'Zu schwierig' },
]

export function CompletionForm({
  mission,
  onSubmit,
  submitting = false,
  mascotId = DEFAULT_PROFILE.mascotVariant,
  drinkVariant,
}: CompletionFormProps) {
  const isDrink =
    mission.primaryCategory === 'getraenk' || mission.secondaryCategories.includes('getraenk')

  const [result, setResult] = useState<1 | 2 | 3 | 4 | 5>(5)
  const [taste, setTaste] = useState<1 | 2 | 3 | 4 | 5>(5)
  const [appearance, setAppearance] = useState<1 | 2 | 3 | 4 | 5>(5)
  const [scariness, setScariness] = useState<1 | 2 | 3 | 4 | 5>(5)
  const [decoration, setDecoration] = useState<1 | 2 | 3 | 4 | 5>(5)
  const [difficultyFeedback, setDifficultyFeedback] = useState<DifficultyFeedback>('genau_richtig')
  const [wouldRepeat, setWouldRepeat] = useState(true)
  const [wouldRecommend, setWouldRecommend] = useState(true)
  const [adjustments, setAdjustments] = useState<Set<AdjustmentTag>>(new Set())
  const [freeText, setFreeText] = useState('')
  const [inventionName, setInventionName] = useState('')
  const [stamp, setStamp] = useState<StampId>('geheimnisvoll')
  const [animatingStamp, setAnimatingStamp] = useState<StampId | null>(null)

  function toggleAdjustment(tag: AdjustmentTag) {
    setAdjustments((current) => {
      const next = new Set(current)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit({
      result,
      taste: isDrink ? taste : undefined,
      appearance: isDrink ? appearance : undefined,
      scariness: isDrink ? scariness : undefined,
      decoration: isDrink ? decoration : undefined,
      drinkVariant: isDrink ? drinkVariant : undefined,
      difficultyFeedback,
      wouldRepeat,
      wouldRecommend,
      adjustments: Array.from(adjustments),
      freeText: freeText.trim() || undefined,
      inventionName: inventionName.trim() || undefined,
      stamp,
    })
  }

  return (
    <>
      <form className="completion-form" onSubmit={handleSubmit}>
        <h1>Mission geschafft!</h1>
        <p>{mission.completionQuestion}</p>

        <fieldset>
          <legend>Ergebnis</legend>
          <StarPicker value={result} onChange={setResult} name="result" />
        </fieldset>

        {isDrink && (
          <div className="completion-form__drink-rating">
            {drinkVariant && (
              <p>
                Bewertete Variante: <strong>{drinkVariant}</strong>
              </p>
            )}
            <fieldset>
              <legend>Geschmack</legend>
              <StarPicker value={taste} onChange={setTaste} name="Geschmack" />
            </fieldset>
            <fieldset>
              <legend>Optik</legend>
              <StarPicker value={appearance} onChange={setAppearance} name="Optik" />
            </fieldset>
            <fieldset>
              <legend>Gruseligkeit</legend>
              <StarPicker value={scariness} onChange={setScariness} name="Gruseligkeit" />
            </fieldset>
            <fieldset>
              <legend>Dekoration</legend>
              <StarPicker value={decoration} onChange={setDecoration} name="Dekoration" />
            </fieldset>
          </div>
        )}

        <fieldset>
          <legend>Wie war die Schwierigkeit?</legend>
          <div className="completion-form__pill-row">
            {DIFFICULTY_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`pill ${difficultyFeedback === option.value ? 'pill--active' : ''}`}
                onClick={() => setDifficultyFeedback(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="completion-form__toggles">
          <label className="completion-form__checkbox">
            <input
              type="checkbox"
              checked={wouldRepeat}
              onChange={(e) => setWouldRepeat(e.target.checked)}
            />
            Nochmal machen
          </label>
          <label className="completion-form__checkbox">
            <input
              type="checkbox"
              checked={wouldRecommend}
              onChange={(e) => setWouldRecommend(e.target.checked)}
            />
            Weiterempfehlen
          </label>
        </fieldset>

        <fieldset>
          <legend>Anpassungswünsche</legend>
          <div className="completion-form__pill-row">
            {ADJUSTMENT_TAGS.map((tag) => (
              <button
                type="button"
                key={tag}
                className={`pill ${adjustments.has(tag) ? 'pill--active' : ''}`}
                onClick={() => toggleAdjustment(tag)}
              >
                {ADJUSTMENT_LABELS[tag]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <label htmlFor="inventionName">Name deiner Erfindung</label>
          </legend>
          <input
            id="inventionName"
            type="text"
            value={inventionName}
            onChange={(e) => setInventionName(e.target.value)}
            placeholder="z. B. Elenas Schattentrank"
          />
        </fieldset>

        <fieldset>
          <legend>
            <label htmlFor="freeText">Was möchtest du noch festhalten?</label>
          </legend>
          <textarea
            id="freeText"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            rows={3}
            placeholder="Freitext..."
          />
        </fieldset>

        <fieldset>
          <legend>Wähle einen Stempel</legend>
          <div className="completion-form__stamp-row">
            {STAMPS.map((s) => (
              <button
                type="button"
                key={s.id}
                className={`stamp ${stamp === s.id ? 'stamp--active' : ''}`}
                onClick={() => {
                  setStamp(s.id)
                  setAnimatingStamp(s.id)
                }}
                aria-label={s.label}
                title={s.label}
              >
                {s.emoji}
              </button>
            ))}
          </div>
        </fieldset>

        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Wird gespeichert...' : 'Im Labortagebuch speichern'}
        </Button>
      </form>

      {animatingStamp && (
        <StampAnimation
          stamp={animatingStamp}
          mascotId={mascotId}
          onDone={() => setAnimatingStamp(null)}
        />
      )}
    </>
  )
}

function StarPicker({
  value,
  onChange,
  name,
}: {
  value: 1 | 2 | 3 | 4 | 5
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void
  name: string
}) {
  return (
    <div className="star-picker" role="radiogroup" aria-label={name}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          role="radio"
          aria-checked={value === n}
          className={`star ${n <= value ? 'star--filled' : ''}`}
          onClick={() => onChange(n as 1 | 2 | 3 | 4 | 5)}
        >
          ★
        </button>
      ))}
    </div>
  )
}
