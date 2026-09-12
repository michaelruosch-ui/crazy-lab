import { Link } from 'react-router-dom'
import type { DiaryEntry, ResearchAchievement } from '../domain'
import { researchAchievements } from '../domain'
import './ResearchAchievements.css'

function AchievementMedal({ badge }: { badge: ResearchAchievement }) {
  return (
    <article
      className={`research-achievement research-achievement--${badge.rarity} ${
        badge.unlocked ? 'is-unlocked' : ''
      }`}
    >
      <div className="research-achievement__medal" aria-hidden="true">
        <span>{badge.unlocked ? badge.icon : '🔒'}</span>
      </div>
      <strong>{badge.title}</strong>
      <p>{badge.description}</p>
      {badge.unlocked ? (
        <small>Magisch erforscht!</small>
      ) : (
        <div className="research-achievement__progress">
          <progress value={badge.progress} max={badge.target} />
          <small>
            {badge.progress} von {badge.target} geschafft
          </small>
        </div>
      )}
    </article>
  )
}

export function ResearchAchievements({
  entries,
  compact = false,
}: {
  entries: DiaryEntry[]
  compact?: boolean
}) {
  const badges = researchAchievements(entries)
  const unlocked = badges.filter((badge) => badge.unlocked)
  const locked = badges.filter((badge) => !badge.unlocked)
  const visible = compact
    ? [
        ...unlocked.slice(-2),
        ...locked.sort((a, b) => b.progress / b.target - a.progress / a.target).slice(0, 2),
      ]
    : badges

  return (
    <section
      className={`research-achievements ${compact ? 'research-achievements--compact' : ''}`}
      aria-labelledby="achievement-title"
    >
      <div className="research-achievements__heading">
        <div>
          <p className="research-achievements__eyebrow">
            {unlocked.length} von {badges.length} entdeckt
          </p>
          <h2 id="achievement-title">🏅 Deine Forscher-Abzeichen</h2>
        </div>
        {compact && <Link to="/abzeichen">Alle ansehen →</Link>}
      </div>
      {unlocked.length === 0 && <p>Deine erste Mission schaltet gleich zwei Abzeichen frei!</p>}
      <div className="research-achievements__grid">
        {visible.map((badge) => (
          <AchievementMedal key={badge.id} badge={badge} />
        ))}
      </div>
    </section>
  )
}
