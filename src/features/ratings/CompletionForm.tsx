import { useState } from 'react'
import type { Mission } from '../../domain'
import type { AdjustmentTag, CompletionRating, DifficultyFeedback, StampId } from '../../domain'
import { ADJUSTMENT_LABELS, ADJUSTMENT_TAGS, STAMPS } from '../../domain'
import { Button } from '../../components'
import './CompletionForm.css'
import type { FormEvent } from 'react'

interface CompletionFormProps {
  mission: Mission
  onSubmit: (rating: CompletionRating) => void
  submitting?: boolean
}

const DIFFICULTY_OPTIONS: { value: DifficultyFeedback; label: string }[] = [
  { value: 'zu_einfach', label: 'Zu einfach' },
  { value: 'genau_richtig', label: 'Genau richtig' },
  { value: 'zu_schwierig', label: 'Zu schwierig' },
]

export function CompletionForm({ mission, onSubmit, submitting = false }: CompletionFormProps) {
  const isDrink = mission.primaryCategory === 'getraenk' || mission.secondaryCategories.includes('getraenk')

  const [result, setResult] = useState<1 | 2 | 3 | 4 | 5>(5)
  const [taste, setTaste] = useState<1 | 2 | 3 | 4 | 5>(5)
  const [difficultyFeedback, setDifficultyFeedback] = useState<DifficultyFeedback>('genau_richtig')
  const [wouldRepeat, setWouldRepeat] = useState(true)
  const [wouldRecommend, setWouldRecommend] = useState(true)
  const [adjustments, setAdjustments] = useState<Set<AdjustmentTag>>(new Set())
  const [freeText, setFreeText] = useState('')
  const [inventionName, setInventionName] = useState('')
  const [stamp, setStamp] = useState<StampId>('geheimnisvoll')

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
    <form className="completion-form" onSubmit={handleSubmit}>
      <h1>Mission geschafft!</h1>
      <p>{mission.completionQuestion}</p>

      <fieldset>
        <legend>Ergebnis</legend>
        <StarPicker value={result} onChange={setResult} name="result" />
      </fieldset>

      {isDrink && (
        <fieldset>
          <legend>Geschmack</legend>
          <StarPicker value={taste} onChange={setTaste} name="taste" />
        </fieldset>
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
          <input type="checkbox" checked={wouldRepeat} onChange={(e) => setWouldRepeat(e.target.checked)} />
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
              onClick={() => setStamp(s.id)}
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
