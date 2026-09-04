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

const KNOWLEDGE_CARDS: Record<Mission['primaryCategory'], { title: string; text: string }> = {
  getraenk: {
    title: 'Geschmack und Farben',
    text: 'Nase, Augen und Zunge forschen gemeinsam. Farbe und Duft können sogar verändern, wie süss oder fruchtig etwas wirkt.',
  },
  basteln: {
    title: 'Kreative Erfindungen',
    text: 'Stabile Formen entstehen durch Falten, Stützen und gute Verbindungen. Teste erst klein und verbessere deine Idee Schritt für Schritt.',
  },
  experiment: {
    title: 'Wissenschaft entdecken',
    text: 'Eine Vermutung ist keine falsche Antwort. Forschende beobachten genau, vergleichen und ändern ihre Erklärung, wenn sie etwas Neues entdecken.',
  },
  foto: {
    title: 'Licht und Fotografie',
    text: 'Licht, Abstand und Blickwinkel bestimmen, was auf einem Foto gross, geheimnisvoll oder magisch wirkt.',
  },
  schwestern: {
    title: 'Team-Zauber',
    text: 'Gute Teams teilen Aufgaben, hören einander zu und verbinden verschiedene Ideen zu einer gemeinsamen Erfindung.',
  },
}

interface MissionDetailViewProps {
  mission: Mission
  onStart: () => void
  rankedVariants?: RankedDrinkVariant[]
  selectedVariant?: string
  onSelectVariant?: (name: string) => void
  onAddToShoppingList?: () => void
  shoppingMessage?: string
  hypothesis?: string
  onHypothesisChange?: (value: string) => void
}

export function MissionDetailView({
  mission,
  onStart,
  rankedVariants,
  selectedVariant,
  onSelectVariant,
  onAddToShoppingList,
  shoppingMessage,
  hypothesis = '',
  onHypothesisChange,
}: MissionDetailViewProps) {
  const safety = SAFETY_LABELS[mission.safetyLevel]
  const variants = rankedVariants ?? mission.drinkProfile?.variants ?? []
  const knowledge = KNOWLEDGE_CARDS[mission.primaryCategory]

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

      <details className="mission-detail__all-steps">
        <summary>👀 Alle {mission.steps.length} Schritte vorher anschauen</summary>
        <ol>
          {mission.steps.map((step) => (
            <li key={step.id}>{step.text}</li>
          ))}
        </ol>
      </details>

      <aside className="mission-detail__knowledge">
        <h2>✨ Wissenskarte: {knowledge.title}</h2>
        <p>{knowledge.text}</p>
      </aside>

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

      {mission.experimentProfile && (
        <section className="mission-detail__special-profile">
          <h2>🔬 Deine Forschungsfrage</h2>
          <p>{mission.experimentProfile.researchQuestion}</p>
          <p>
            <strong>Erst vermuten, dann beobachten, zuletzt erklären.</strong>
          </p>
          <label>
            Meine Vermutung vor dem Start
            <textarea
              rows={3}
              value={hypothesis}
              onChange={(event) => onHypothesisChange?.(event.target.value)}
              placeholder={mission.experimentProfile.hypothesisPrompt}
            />
          </label>
          {mission.experimentProfile.durationDays && (
            <Badge tone="acid">
              Läuft {mission.experimentProfile.durationDays} Tag
              {mission.experimentProfile.durationDays === 1 ? '' : 'e'}
            </Badge>
          )}
        </section>
      )}

      {mission.photoProfile && (
        <section className="mission-detail__special-profile">
          <h2>📷 Foto-Tipps</h2>
          <ul>
            {mission.photoProfile.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <p>
            Am Schluss kannst du mehrere Bilder auswählen, einen Rahmen und einen Effekt festlegen.
          </p>
        </section>
      )}

      {mission.sisterProfile && (
        <section className="mission-detail__special-profile">
          <h2>🤫 Geheime Teilaufgaben</h2>
          <p>Öffnet immer nur den eigenen Auftrag und schliesst ihn danach wieder.</p>
          <details>
            <summary>Elenas Geheimauftrag</summary>
            <p>{mission.sisterProfile.secretTaskElena}</p>
          </details>
          <details>
            <summary>Geheimauftrag der Schwester</summary>
            <p>{mission.sisterProfile.secretTaskSister}</p>
          </details>
          {mission.sisterProfile.timeChallengeSeconds && (
            <Badge tone="pink">
              ⏱ Zeit-Challenge: {Math.round(mission.sisterProfile.timeChallengeSeconds / 60)} Min.
            </Badge>
          )}
          <p>
            <strong>Gemeinsames Finale:</strong> {mission.sisterProfile.jointFinish}
          </p>
        </section>
      )}

      <Button variant="primary" onClick={onStart}>
        Alles bereit für die Mission?
      </Button>
      {onAddToShoppingList && (
        <Button variant="secondary" onClick={onAddToShoppingList}>
          🛒 Materialien auf Einkaufsliste
        </Button>
      )}
      {shoppingMessage && <p role="status">{shoppingMessage}</p>}
    </div>
  )
}
