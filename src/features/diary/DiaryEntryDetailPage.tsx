import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ADJUSTMENT_LABELS, STAMPS } from '../../domain'
import type { DiaryEntry } from '../../domain'
import { BackLink, Badge, Button, MissionImage } from '../../components'
import { indexedDbDiaryRepository } from '../../storage/diaryRepository'
import './DiaryEntryDetailPage.css'

const DIFFICULTY_LABELS = {
  zu_einfach: 'Zu einfach',
  genau_richtig: 'Genau richtig',
  zu_schwierig: 'Zu schwierig',
}

const STATUS_LABELS = {
  erfolgreich: 'Erfolgreich',
  fehlgeschlagen: 'Fehlgeschlagen',
  pausiert: 'Pausiert',
  favorisiert: 'Favorisiert',
}

function Stars({ value }: { value: number }) {
  return (
    <span aria-label={`${value} von 5 Sternen`}>
      {'★'.repeat(value)}
      {'☆'.repeat(5 - value)}
    </span>
  )
}

export function DiaryEntryDetailPage() {
  const { entryId } = useParams<{ entryId: string }>()
  const [entry, setEntry] = useState<DiaryEntry | undefined | null>(undefined)

  useEffect(() => {
    if (!entryId) return
    let cancelled = false
    indexedDbDiaryRepository.getEntry(entryId).then((loaded) => {
      if (!cancelled) setEntry(loaded ?? null)
    })
    return () => {
      cancelled = true
    }
  }, [entryId])

  async function toggleWouldRepeat() {
    if (!entry) return
    const updated: DiaryEntry = {
      ...entry,
      rating: { ...entry.rating, wouldRepeat: !entry.rating.wouldRepeat },
    }
    setEntry(updated)
    await indexedDbDiaryRepository.saveEntry(updated)
  }

  if (entry === undefined) {
    return <p className="diary-entry-detail__loading">Lade...</p>
  }

  if (entry === null) {
    return (
      <div className="diary-entry-detail">
        <p>Dieser Tagebucheintrag wurde nicht gefunden.</p>
        <BackLink to="/diary">← Zurück zum Tagebuch</BackLink>
      </div>
    )
  }

  const stamp = STAMPS.find((s) => s.id === entry.rating.stamp)

  return (
    <div className="diary-entry-detail">
      <MissionImage
        placeholder={entry.missionSnapshot.imagePlaceholder}
        title={entry.missionSnapshot.title}
      />

      <h1>
        {stamp?.emoji} {entry.missionSnapshot.title}
      </h1>
      {entry.rating.inventionName && (
        <p className="diary-entry-detail__invention">"{entry.rating.inventionName}"</p>
      )}

      <div className="diary-entry-detail__badges">
        <Badge tone="safety-green">{STATUS_LABELS[entry.status]}</Badge>
        <Badge tone="violet">{DIFFICULTY_LABELS[entry.rating.difficultyFeedback]}</Badge>
      </div>

      <dl className="diary-entry-detail__facts">
        <div>
          <dt>Ergebnis</dt>
          <dd>
            <Stars value={entry.rating.result} />
          </dd>
        </div>
        {entry.rating.taste !== undefined && (
          <div>
            <dt>Geschmack</dt>
            <dd>
              <Stars value={entry.rating.taste} />
            </dd>
          </div>
        )}
        {entry.rating.appearance !== undefined && (
          <div>
            <dt>Optik</dt>
            <dd>
              <Stars value={entry.rating.appearance} />
            </dd>
          </div>
        )}
        {entry.rating.scariness !== undefined && (
          <div>
            <dt>Gruseligkeit</dt>
            <dd>
              <Stars value={entry.rating.scariness} />
            </dd>
          </div>
        )}
        {entry.rating.decoration !== undefined && (
          <div>
            <dt>Dekoration</dt>
            <dd>
              <Stars value={entry.rating.decoration} />
            </dd>
          </div>
        )}
        {entry.rating.drinkVariant && (
          <div>
            <dt>Variante</dt>
            <dd>{entry.rating.drinkVariant}</dd>
          </div>
        )}
        <div>
          <dt>Weiterempfehlen</dt>
          <dd>{entry.rating.wouldRecommend ? 'Ja' : 'Nein'}</dd>
        </div>
        <div>
          <dt>Abgeschlossen am</dt>
          <dd>{new Date(entry.completedAt).toLocaleString('de-CH')}</dd>
        </div>
      </dl>

      {entry.rating.adjustments.length > 0 && (
        <section>
          <h2>Anpassungswünsche</h2>
          <div className="diary-entry-detail__pill-row">
            {entry.rating.adjustments.map((tag) => (
              <Badge key={tag} tone="acid">
                {ADJUSTMENT_LABELS[tag]}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {entry.rating.freeText && (
        <section>
          <h2>Notizen</h2>
          <p>{entry.rating.freeText}</p>
        </section>
      )}

      {(entry.rating.hypothesis || entry.rating.observation || entry.rating.learnedExplanation) && (
        <section>
          <h2>🔬 Forschungsnotizen</h2>
          {entry.rating.hypothesis && (
            <p>
              <strong>Vermutung:</strong> {entry.rating.hypothesis}
            </p>
          )}
          {entry.rating.observation && (
            <p>
              <strong>Beobachtung:</strong> {entry.rating.observation}
            </p>
          )}
          {entry.rating.learnedExplanation && (
            <p>
              <strong>Erklärung:</strong> {entry.rating.learnedExplanation}
            </p>
          )}
        </section>
      )}

      {entry.rating.photoDataUrls && entry.rating.photoDataUrls.length > 0 && (
        <section>
          <h2>📷 Missionsfotos</h2>
          <p>
            {entry.rating.photoFrame} · {entry.rating.photoEffect}
          </p>
          <div className="diary-entry-detail__photos">
            {entry.rating.photoDataUrls.map((url, index) => (
              <img
                key={`${url.slice(-20)}-${index}`}
                className={`effect-${(entry.rating.photoEffect ?? 'ohne-effekt').toLowerCase().replaceAll(' ', '-')} frame-${(entry.rating.photoFrame ?? 'laborrahmen').toLowerCase().replaceAll(' ', '-')}`}
                src={url}
                alt={`Missionsfoto ${index + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {entry.rating.sisterTeamNote && (
        <section>
          <h2>👭 Teamnotiz</h2>
          <p>{entry.rating.sisterTeamNote}</p>
        </section>
      )}

      <Button
        variant={entry.rating.wouldRepeat ? 'primary' : 'secondary'}
        onClick={toggleWouldRepeat}
      >
        {entry.rating.wouldRepeat ? '✅ Will ich nochmal machen' : '🔁 Nochmal machen?'}
      </Button>

      <BackLink to="/diary">← Zurück zum Tagebuch</BackLink>
    </div>
  )
}
