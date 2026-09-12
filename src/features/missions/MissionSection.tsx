import type { Mission } from '../../domain'
import { Button, MissionCard } from '../../components'
import './MissionSection.css'

interface MissionSectionProps {
  title: string
  missions: Mission[]
  savedMissionIds: ReadonlySet<string>
  onToggleSave: (missionId: string) => void
  onHide: (missionId: string) => void
}

export function MissionSection({
  title,
  missions,
  savedMissionIds,
  onToggleSave,
  onHide,
}: MissionSectionProps) {
  return (
    <details className="mission-section">
      <summary>
        <span>{title}</span>
        <span className="mission-section__count">{missions.length} Ideen</span>
      </summary>
      {missions.length === 0 ? (
        <p className="mission-section__empty">Bald gibt es hier neue Missionen.</p>
      ) : (
        <div className="mission-section__list">
          {missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              actions={
                <>
                  <Button variant="ghost" onClick={() => onToggleSave(mission.id)}>
                    {savedMissionIds.has(mission.id) ? '🗝️ Gemerkt' : '🗝️ Merken'}
                  </Button>
                  <Button variant="ghost" onClick={() => onHide(mission.id)}>
                    3 Tage verstecken
                  </Button>
                </>
              }
            />
          ))}
        </div>
      )}
    </details>
  )
}
