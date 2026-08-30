import type { Mission, RankedDrinkVariant } from '../../domain'
import { Badge, Button, MissionImage } from '../../components'
import './MissionDetailView.css'

const DIFFICULTY_LABELS: Record<Mission['difficulty'], string> = {
  leicht: 'Leicht',
  mittel: 'Mittel',
  schwer: 'Schwer',
}

const SAFETY_LABELS: Record<
  Mission['safetyLevel'],
  { label: string; tone: 'safety-green' | 'safety-yellow' | 'safety-red' }
> = {
  gruen: { label: 'Sicher', tone: 'safety-green' },
  gelb: { label: 'Mit Vorsicht', tone: 'safety-yellow' },
  rot: { label: 'Nur mit Erwachsenen', tone: 'safety-red' },
}

const TASTE_LABELS = {
  suess: 'Süss',
  sauer: 'Sauer',
  fruchtig: 'Fruchtig',
  cremig: 'Cremig',
  prickelnd: 'Prickelnd',
} as const

interface MissionDetailViewProps {
  mission: Mission
  onStart: () => void
  rankedVariants?: RankedDrinkVariant[]
  selectedVariant?: string
  onSelectVariant?: (name: string) => void
}

export function MissionDetailView({
  mission,
  onStart,
  rankedVariants,
  selectedVariant,
  onSelectVariant,
}: MissionDetailViewProps) {
  const safety = SAFETY_LABELS[mission.safetyLevel]
  const variants = rankedVariants ?? mission.drinkProfile?.variants ?? []

  return (
    <div className="mission-detail">
      <MissionImage placeholder={mission.imagePlaceholder} title={mission.title} />

      <h1>{mission.title}</h1>
      <p className="mission-detail__description">{mission.shortDescription}</p>

      <div className="mission-detail__badges">
        <Badge tone="teal">⏱ {mission.durationMinutes} Min.</Badge>
        <Badge tone="violet">{DIFFICULTY_LABELS[mission.difficulty]}</Badge>
        <Badge tone="pink">CHF {mission.estimatedCostChf.toFixed(2)}</Badge>
        <Badge tone={safety.tone}>{safety.label}</Badge>
      </div>

      {mission.safetyNotes.length > 0 && (
        <ul className="mission-detail__safety-notes">
          {mission.safetyNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}

      <section>
        <h2>Was du brauchst</h2>
        <ul className="mission-detail__materials">
          {mission.materials.map((material) => (
            <li key={material.id}>
              <span>{material.name}</span>
              {material.quantity && (
                <span className="mission-detail__quantity">{material.quantity}</span>
              )}
              {material.optional && <Badge tone="acid">optional</Badge>}
            </li>
          ))}
        </ul>
      </section>

      {mission.drinkProfile && (
        <section className="mission-detail__drink-profile">
          <h2>So wird dein Trank</h2>
          <div className="mission-detail__taste-badges">
            {mission.drinkProfile.tastes.map((taste) => (
              <Badge key={taste} tone="teal">
                {TASTE_LABELS[taste]}
              </Badge>
            ))}
            {mission.drinkProfile.appearance.map((appearance) => (
              <Badge key={appearance} tone="violet">
                {appearance}
              </Badge>
            ))}
          </div>
          <h3>Wähle deine Variante</h3>
          <ul className="mission-detail__variants">
            {variants.map((variant, index) => (
              <li key={variant.name}>
                <label>
                  {onSelectVariant && (
                    <input
                      type="radio"
                      name="drink-variant"
                      checked={selectedVariant === variant.name}
                      onChange={() => onSelectVariant(variant.name)}
                    />
                  )}
                  <span>
                    <strong>{variant.name}</strong>
                    {index === 0 && rankedVariants?.[0]?.ratingCount
                      ? ' · ⭐ Für dich empfohlen'
                      : ''}
                    <br />
                    {variant.description}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Button variant="primary" onClick={onStart}>
        Alles bereit für die Mission?
      </Button>
    </div>
  )
}
