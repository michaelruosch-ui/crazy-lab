import { Link } from 'react-router-dom'
import { DEFAULT_PROFILE, STAMPS } from '../../domain'
import { useDiaryEntries } from './useDiaryEntries'
import './DiaryPage.css'

const STATUS_LABELS = {
  erfolgreich: 'Erfolgreich',
  fehlgeschlagen: 'Fehlgeschlagen',
  pausiert: 'Pausiert',
  favorisiert: 'Favorisiert',
}

export function DiaryPage() {
  const { entries, loading } = useDiaryEntries(DEFAULT_PROFILE.id)

  return (
    <div className="diary-page">
      <h1>Geheimnisvolles Labortagebuch</h1>

      {loading && <p>Lade Einträge...</p>}

      {!loading && entries.length === 0 && (
        <p>Noch keine Einträge. Schliesse deine erste Mission ab, um sie hier zu sehen.</p>
      )}

      <ul className="diary-page__list">
        {entries.map((entry) => {
          const stamp = STAMPS.find((s) => s.id === entry.rating.stamp)
          return (
            <li key={entry.id}>
              <Link to={`/diary/${entry.id}`} className="diary-page__entry">
                <span className="diary-page__stamp">{stamp?.emoji}</span>
                <div className="diary-page__entry-body">
                  <h2>{entry.missionSnapshot.title}</h2>
                  <p>
                    {STATUS_LABELS[entry.status]} · Ergebnis {entry.rating.result}/5
                    {entry.rating.inventionName ? ` · "${entry.rating.inventionName}"` : ''}
                    {entry.rating.wouldRepeat ? ' · 🔁 nochmal machen' : ''}
                  </p>
                  <p className="diary-page__timestamp">
                    {new Date(entry.completedAt).toLocaleString('de-CH')}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      <Link to="/" className="diary-page__back">
        Zurück zur Startseite
      </Link>
    </div>
  )
}
