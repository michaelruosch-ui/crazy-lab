import type { Mission } from '../../domain'
import { Badge, Button, MissionImage } from '../../components'
import './MissionDetailView.css'

const DIFFICULTY_LABELS: Record<Mission['difficulty'], string> = {
  leicht: 'Leicht',
  mittel: 'Mittel',
  schwer: 'Schwer',
}

const SAFETY_LABELS: Record<Mission['safetyLevel'], { label: string; tone: 'safety-green' | 'safety-yellow' | 'safety-red' }> = {
  gruen: { label: 'Sicher', tone: 'safety-green' },
  gelb: { label: 'Mit Vorsicht', tone: 'safety-yellow' },
  rot: { label: 'Nur mit Erwachsenen', tone: 'safety-red' },
}

interface MissionDetailViewProps {
  mission: Mission
  onStart: () => void
}

export function MissionDetailView({ mission, onStart }: MissionDetailViewProps) {
  const safety = SAFETY_LABELS[mission.safetyLevel]

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
              {material.quantity && <span className="mission-detail__quantity">{material.quantity}</span>}
              {material.optional && <Badge tone="acid">optional</Badge>}
            </li>
          ))}
        </ul>
      </section>

      <Button variant="primary" onClick={onStart}>
        Alles bereit für die Mission?
      </Button>
    </div>
  )
}
