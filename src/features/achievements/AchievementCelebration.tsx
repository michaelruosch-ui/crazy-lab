import { useEffect, useState } from 'react'
import type { DiaryEntry, ResearchAchievement } from '../../domain'
import { researchAchievements } from '../../domain'
import { Button } from '../../components'
import './AchievementCelebration.css'

function readSeen(profileId: string): Set<string> {
  try {
    return new Set(JSON.parse(window.localStorage.getItem(`crazy-lab-badges-${profileId}`) ?? '[]'))
  } catch {
    return new Set()
  }
}

function saveSeen(profileId: string, ids: string[]) {
  try {
    window.localStorage.setItem(`crazy-lab-badges-${profileId}`, JSON.stringify(ids))
  } catch {
    // Die Feier funktioniert auch, wenn der Browser keinen lokalen Schlüssel erlaubt.
  }
}

export function AchievementCelebration({
  profileId,
  entries,
}: {
  profileId: string
  entries: DiaryEntry[]
}) {
  const [badge, setBadge] = useState<ResearchAchievement>()

  useEffect(() => {
    if (entries.length === 0) return
    const unlocked = researchAchievements(entries).filter((item) => item.unlocked)
    const seen = readSeen(profileId)
    const newBadge = unlocked.find((item) => !seen.has(item.id))
    saveSeen(
      profileId,
      unlocked.map((item) => item.id),
    )
    if (newBadge) {
      navigator.vibrate?.([80, 40, 140])
      const timeout = window.setTimeout(() => setBadge(newBadge), 0)
      return () => window.clearTimeout(timeout)
    }
  }, [entries, profileId])

  useEffect(() => {
    if (!badge) return
    const timeout = window.setTimeout(() => setBadge(undefined), 5200)
    return () => window.clearTimeout(timeout)
  }, [badge])

  if (!badge) return null

  return (
    <div className="achievement-celebration" role="dialog" aria-modal="true">
      <div className="achievement-celebration__confetti" aria-hidden="true">
        ✦ ★ ✧ 🧪 ✦ ★ ✧
      </div>
      <p>Neues Abzeichen!</p>
      <div className={`achievement-celebration__medal is-${badge.rarity}`} aria-hidden="true">
        {badge.icon}
      </div>
      <h2>{badge.title}</h2>
      <span>{badge.description}</span>
      <Button onClick={() => setBadge(undefined)}>Wow, einsammeln!</Button>
    </div>
  )
}
