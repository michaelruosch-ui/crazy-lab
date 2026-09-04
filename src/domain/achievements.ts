import type { DiaryEntry } from './diary'
import type { MissionCategory } from './mission'

export interface ResearchAchievement {
  id: string
  category: MissionCategory
  threshold: 5 | 10 | 20
  title: string
  icon: string
  unlocked: boolean
  progress: number
}

const CATEGORY_BADGES: Record<MissionCategory, { name: string; icon: string }> = {
  getraenk: { name: 'Trank-Magierin', icon: '🧪' },
  basteln: { name: 'Grusel-Erfinderin', icon: '🛠️' },
  experiment: { name: 'Wissens-Hexe', icon: '🔬' },
  foto: { name: 'Schatten-Fotografin', icon: '📷' },
  schwestern: { name: 'Team-Zauberin', icon: '👭' },
}

export function researchAchievements(entries: DiaryEntry[]): ResearchAchievement[] {
  const completed = new Map<MissionCategory, Set<string>>()
  for (const entry of entries) {
    const category = entry.missionSnapshot.primaryCategory
    const ids = completed.get(category) ?? new Set<string>()
    ids.add(entry.missionSnapshot.missionId)
    completed.set(category, ids)
  }

  return (Object.keys(CATEGORY_BADGES) as MissionCategory[]).flatMap((category) => {
    const progress = completed.get(category)?.size ?? 0
    const badge = CATEGORY_BADGES[category]
    return ([5, 10, 20] as const).map((threshold) => ({
      id: `${category}-${threshold}`,
      category,
      threshold,
      title: `${badge.name} ${threshold}`,
      icon: badge.icon,
      unlocked: progress >= threshold,
      progress: Math.min(progress, threshold),
    }))
  })
}
