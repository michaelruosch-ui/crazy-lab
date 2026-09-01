import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { STAMPS, type DiaryStatus, type MissionCategory } from '../../domain'
import { BackLink, MissionImage } from '../../components'
import { useDiaryEntries } from './useDiaryEntries'
import { useActiveProfileId } from '../profile'
import './DiaryPage.css'

const STATUS_LABELS: Record<DiaryStatus, string> = {
  erfolgreich: 'Erfolgreich',
  fehlgeschlagen: 'Nicht geklappt',
  pausiert: 'Pausiert',
  favorisiert: 'Favorit',
}
const CATEGORY_LABELS: Record<MissionCategory, string> = {
  getraenk: 'Getränke',
  basteln: 'Basteln',
  experiment: 'Experimente',
  foto: 'Fotos',
  schwestern: 'Schwestern',
}

export function DiaryPage() {
  const { activeProfileId } = useActiveProfileId()
  const { entries, loading } = useDiaryEntries(activeProfileId)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<MissionCategory | 'alle'>('alle')
  const [status, setStatus] = useState<DiaryStatus | 'alle'>('alle')
  const filteredEntries = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('de-CH')
    return entries.filter(
      (entry) =>
        (category === 'alle' || entry.missionSnapshot.primaryCategory === category) &&
        (status === 'alle' || entry.status === status) &&
        (!query ||
          entry.missionSnapshot.title.toLocaleLowerCase('de-CH').includes(query) ||
          entry.rating.inventionName?.toLocaleLowerCase('de-CH').includes(query) ||
          entry.rating.freeText?.toLocaleLowerCase('de-CH').includes(query)),
    )
  }, [category, entries, search, status])

  return (
    <div className="diary-page">
      <h1>Geheimnisvolles Labortagebuch</h1>
      <section className="diary-page__filters" aria-label="Tagebuch filtern">
        <label>
          Suchen
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mission oder Notiz"
          />
        </label>
        <label>
          Kategorie
          <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
            <option value="alle">Alle Kategorien</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            <option value="alle">Alle Status</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </section>
      {loading && <p>Lade Einträge...</p>}
      {!loading && entries.length === 0 && (
        <p>Noch keine Einträge. Schliesse deine erste Mission ab, um sie hier zu sehen.</p>
      )}
      {!loading && entries.length > 0 && filteredEntries.length === 0 && (
        <p>Keine Einträge passen zu diesen Filtern.</p>
      )}
      <ul className="diary-page__list">
        {filteredEntries.map((entry) => {
          const stamp = STAMPS.find((item) => item.id === entry.rating.stamp)
          const cover = entry.rating.photoDataUrls?.[0]
          return (
            <li key={entry.id}>
              <Link to={`/diary/${entry.id}`} className="diary-page__entry">
                <div className="diary-page__cover">
                  {cover ? (
                    <img src={cover} alt="" />
                  ) : (
                    <MissionImage
                      placeholder={entry.missionSnapshot.imagePlaceholder}
                      title={entry.missionSnapshot.title}
                    />
                  )}
                  <span className="diary-page__stamp">{stamp?.emoji}</span>
                </div>
                <div className="diary-page__entry-body">
                  <h2>{entry.missionSnapshot.title}</h2>
                  <p>
                    {STATUS_LABELS[entry.status]} · Ergebnis {entry.rating.result}/5
                    {entry.rating.inventionName ? ` · „${entry.rating.inventionName}“` : ''}
                    {entry.rating.wouldRepeat ? ' · 🔁 nochmal' : ''}
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
      <BackLink to="/">← Zurück zur Startseite</BackLink>
    </div>
  )
}
