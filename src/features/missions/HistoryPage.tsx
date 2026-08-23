import { Link } from 'react-router-dom'
import { DEFAULT_PROFILE, isCurrentlyHidden } from '../../domain'
import { missions } from '../../data'
import { MissionCard, Badge } from '../../components'
import { useHiddenMissions } from './useHiddenMissions'
import './HistoryPage.css'

export function HistoryPage() {
  const { history, loading } = useHiddenMissions(DEFAULT_PROFILE.id)
  const now = new Date()

  return (
    <div className="history-page">
      <h1>📜 Verlauf</h1>
      <p>
        Missionen, die du in den letzten 14 Tagen versteckt hast. Innerhalb der ersten 3 Tage
        bleiben sie ausgeblendet, danach tauchen sie automatisch wieder bei den Vorschlägen auf.
      </p>

      {loading && <p>Lade...</p>}

      {!loading && history.length === 0 && <p>Noch nichts im Verlauf.</p>}

      <div className="history-page__list">
        {history.map((entry) => {
          const mission = missions.find((m) => m.id === entry.missionId)
          if (!mission) return null
          const hidden = isCurrentlyHidden(entry, now)
          return (
            <MissionCard
              key={entry.id}
              mission={mission}
              actions={
                <Badge tone={hidden ? 'pink' : 'safety-green'}>
                  {hidden ? 'noch versteckt' : 'wieder sichtbar'}
                </Badge>
              }
            />
          )
        })}
      </div>

      <Link to="/" className="history-page__back">
        Zurück zur Startseite
      </Link>
    </div>
  )
}
