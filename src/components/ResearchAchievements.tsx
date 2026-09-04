import type { DiaryEntry } from '../domain'
import { researchAchievements } from '../domain'
import './ResearchAchievements.css'

export function ResearchAchievements({ entries }: { entries: DiaryEntry[] }) {
  const badges = researchAchievements(entries)
  const unlocked = badges.filter((badge) => badge.unlocked)
  const next = badges.filter((badge) => !badge.unlocked && badge.threshold === 5)

  return (
    <section className="research-achievements" aria-labelledby="achievement-title">
      <h2 id="achievement-title">🏅 Deine Forscher-Abzeichen</h2>
      {unlocked.length === 0 && <p>Noch keines freigeschaltet – deine Forschung hat begonnen!</p>}
      <div className="research-achievements__grid">
        {unlocked.map((badge) => (
          <article key={badge.id} className="research-achievement is-unlocked">
            <span>{badge.icon}</span>
            <strong>{badge.title}</strong>
            <small>Magisch erforscht!</small>
          </article>
        ))}
        {next.map((badge) => (
          <article key={badge.id} className="research-achievement">
            <span>🔒</span>
            <strong>
              {badge.icon} {badge.title}
            </strong>
            <small>
              {badge.progress} von {badge.threshold} geschafft
            </small>
          </article>
        ))}
      </div>
    </section>
  )
}
