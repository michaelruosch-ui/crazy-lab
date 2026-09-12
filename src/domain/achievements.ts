import type { DiaryEntry } from './diary'
import type { MissionCategory } from './mission'

export type AchievementRarity = 'bronze' | 'silver' | 'gold' | 'legendary'

export interface ResearchAchievement {
  id: string
  category?: MissionCategory
  title: string
  description: string
  icon: string
  rarity: AchievementRarity
  unlocked: boolean
  progress: number
  target: number
}

const CATEGORY_BADGES: Record<
  MissionCategory,
  { icon: string; levels: Array<{ target: number; title: string; rarity: AchievementRarity }> }
> = {
  getraenk: {
    icon: '🧪',
    levels: [
      { target: 1, title: 'Trank-Lehrling', rarity: 'bronze' },
      { target: 5, title: 'Trank-Magierin', rarity: 'silver' },
      { target: 10, title: 'Elixier-Hexe', rarity: 'gold' },
      { target: 20, title: 'Meisterin der Kessel', rarity: 'legendary' },
    ],
  },
  basteln: {
    icon: '🛠️',
    levels: [
      { target: 1, title: 'Bastel-Funke', rarity: 'bronze' },
      { target: 5, title: 'Grusel-Erfinderin', rarity: 'silver' },
      { target: 10, title: 'Werkstatt-Hexe', rarity: 'gold' },
      { target: 20, title: 'Meisterin der Monsterwerke', rarity: 'legendary' },
    ],
  },
  experiment: {
    icon: '🔬',
    levels: [
      { target: 1, title: 'Fragezeichen-Forscherin', rarity: 'bronze' },
      { target: 5, title: 'Wissens-Hexe', rarity: 'silver' },
      { target: 10, title: 'Elemente-Entdeckerin', rarity: 'gold' },
      { target: 20, title: 'Professorin des Unmöglichen', rarity: 'legendary' },
    ],
  },
  foto: {
    icon: '📷',
    levels: [
      { target: 1, title: 'Lichtfängerin', rarity: 'bronze' },
      { target: 5, title: 'Schatten-Fotografin', rarity: 'silver' },
      { target: 10, title: 'Kamera-Zauberin', rarity: 'gold' },
      { target: 20, title: 'Meisterin der Bilderwelten', rarity: 'legendary' },
    ],
  },
  schwestern: {
    icon: '👭',
    levels: [
      { target: 1, title: 'Team-Funke', rarity: 'bronze' },
      { target: 5, title: 'Team-Zauberin', rarity: 'silver' },
      { target: 10, title: 'Schwestern-Geheimbund', rarity: 'gold' },
      { target: 20, title: 'Unschlagbares Labor-Duo', rarity: 'legendary' },
    ],
  },
}

interface BadgeDefinition {
  id: string
  title: string
  description: string
  icon: string
  rarity: AchievementRarity
  target: number
  progress: (entries: DiaryEntry[], uniqueMissionIds: Set<string>) => number
}

const SPECIAL_MISSIONS: Array<Pick<BadgeDefinition, 'id' | 'title' | 'description' | 'icon'>> = [
  {
    id: 'special-shadow-drink',
    title: 'Blutrotes Gebräu',
    description: 'Den blutroten Schatten-Trank gebraut.',
    icon: '🩸',
  },
  {
    id: 'special-ghost-portal',
    title: 'Portal-Wächterin',
    description: 'Das leuchtende Geisterportal geöffnet.',
    icon: '👻',
  },
  {
    id: 'special-rain-glass',
    title: 'Wetter-Hexe',
    description: 'Regen im Glas erschaffen.',
    icon: '🌧️',
  },
  {
    id: 'special-monster-breakfast',
    title: 'Monster-Köchin',
    description: 'Das Monster-Frühstück serviert.',
    icon: '🥣',
  },
  {
    id: 'special-mini-treasure',
    title: 'Mini-Schatzjägerin',
    description: 'Die Mini-Schatzsuche gelöst.',
    icon: '🗝️',
  },
]

function matchesMission(entry: DiaryEntry, words: string[]) {
  const searchable =
    `${entry.missionSnapshot.missionId} ${entry.missionSnapshot.title}`.toLowerCase()
  return words.every((word) => searchable.includes(word))
}

function maxRepeats(entries: DiaryEntry[]) {
  const counts = new Map<string, number>()
  for (const entry of entries) {
    counts.set(
      entry.missionSnapshot.missionId,
      (counts.get(entry.missionSnapshot.missionId) ?? 0) + 1,
    )
  }
  return Math.max(0, ...counts.values())
}

const GENERAL_BADGES: BadgeDefinition[] = [
  {
    id: 'first-mission',
    title: 'Erster Labor-Funke',
    description: 'Die allererste Mission geschafft.',
    icon: '✨',
    rarity: 'bronze',
    target: 1,
    progress: (_entries, unique) => unique.size,
  },
  {
    id: 'unique-3',
    title: 'Neugier-Nase',
    description: 'Drei verschiedene Missionen ausprobiert.',
    icon: '🔎',
    rarity: 'bronze',
    target: 3,
    progress: (_entries, unique) => unique.size,
  },
  {
    id: 'unique-10',
    title: 'Geheimlabor-Stammgast',
    description: 'Zehn verschiedene Missionen gemeistert.',
    icon: '🔮',
    rarity: 'silver',
    target: 10,
    progress: (_entries, unique) => unique.size,
  },
  {
    id: 'unique-25',
    title: 'Crazy-Lab-Legende',
    description: '25 verschiedene Missionen erforscht.',
    icon: '👑',
    rarity: 'legendary',
    target: 25,
    progress: (_entries, unique) => unique.size,
  },
  {
    id: 'all-categories',
    title: 'Labor-Alleskönnerin',
    description: 'In jeder der fünf Laborwelten mindestens eine Mission geschafft.',
    icon: '🌈',
    rarity: 'gold',
    target: 5,
    progress: (entries) =>
      new Set(entries.map((entry) => entry.missionSnapshot.primaryCategory)).size,
  },
  {
    id: 'repeat-mission',
    title: 'Nochmal-Zauber',
    description: 'Eine Lieblingsmission ein zweites Mal gemacht.',
    icon: '🔁',
    rarity: 'bronze',
    target: 2,
    progress: maxRepeats,
  },
  {
    id: 'perfect-five',
    title: 'Fünf-Sterne-Magie',
    description: 'Fünf Missionen mit fünf Sternen bewertet.',
    icon: '⭐',
    rarity: 'gold',
    target: 5,
    progress: (entries) => entries.filter((entry) => entry.rating.result === 5).length,
  },
  {
    id: 'recommend-three',
    title: 'Geheimtipp-Geberin',
    description: 'Drei Missionen weiterempfohlen.',
    icon: '📣',
    rarity: 'silver',
    target: 3,
    progress: (entries) => entries.filter((entry) => entry.rating.wouldRecommend).length,
  },
  {
    id: 'long-mission',
    title: 'Ausdauer-Alchemistin',
    description: 'Eine Mission mit mindestens 45 Minuten Dauer geschafft.',
    icon: '⏳',
    rarity: 'gold',
    target: 1,
    progress: (entries) =>
      entries.filter((entry) => (entry.missionSnapshot.durationMinutes ?? 0) >= 45).length,
  },
  {
    id: 'hard-mission',
    title: 'Mutprobe bestanden',
    description: 'Eine schwere Mission gemeistert.',
    icon: '🦇',
    rarity: 'silver',
    target: 1,
    progress: (entries) =>
      entries.filter((entry) => entry.missionSnapshot.difficulty === 'schwer').length,
  },
  {
    id: 'photo-memory',
    title: 'Beweisfoto!',
    description: 'Ein Missionsfoto im Tagebuch festgehalten.',
    icon: '📸',
    rarity: 'bronze',
    target: 1,
    progress: (entries) => entries.filter((entry) => entry.rating.photoDataUrls?.length).length,
  },
  {
    id: 'video-memory',
    title: 'Drei-Sekunden-Regisseurin',
    description: 'Ein kurzes Missionsvideo aufgenommen.',
    icon: '🎬',
    rarity: 'silver',
    target: 1,
    progress: (entries) => entries.filter((entry) => entry.rating.videoDataUrl).length,
  },
  {
    id: 'prediction',
    title: 'Orakel des Labors',
    description: 'Vor einem Experiment eine Vermutung notiert.',
    icon: '🧿',
    rarity: 'bronze',
    target: 1,
    progress: (entries) => entries.filter((entry) => entry.rating.hypothesis).length,
  },
  {
    id: 'research-notes',
    title: 'Schlaue Forschungsakte',
    description: 'Vermutung, Beobachtung und Erklärung vollständig festgehalten.',
    icon: '📚',
    rarity: 'gold',
    target: 1,
    progress: (entries) =>
      entries.filter(
        (entry) =>
          entry.rating.hypothesis && entry.rating.observation && entry.rating.learnedExplanation,
      ).length,
  },
  {
    id: 'own-invention',
    title: 'Namens-Erfinderin',
    description: 'Einer eigenen Erfindung einen Namen gegeben.',
    icon: '💡',
    rarity: 'silver',
    target: 1,
    progress: (entries) => entries.filter((entry) => entry.rating.inventionName).length,
  },
  ...SPECIAL_MISSIONS.map((badge) => ({
    ...badge,
    rarity: 'gold' as const,
    target: 1,
    progress: (entries: DiaryEntry[]) => {
      const searchWords: Record<string, string[]> = {
        'special-shadow-drink': ['blutrot', 'schatten'],
        'special-ghost-portal': ['geisterportal'],
        'special-rain-glass': ['regen', 'glas'],
        'special-monster-breakfast': ['monster', 'frühstück'],
        'special-mini-treasure': ['mini', 'schatz'],
      }
      return entries.filter((entry) => matchesMission(entry, searchWords[badge.id] ?? [])).length
    },
  })),
]

export function researchAchievements(entries: DiaryEntry[]): ResearchAchievement[] {
  const uniqueMissionIds = new Set(entries.map((entry) => entry.missionSnapshot.missionId))
  const completedByCategory = new Map<MissionCategory, Set<string>>()
  for (const entry of entries) {
    const category = entry.missionSnapshot.primaryCategory
    const ids = completedByCategory.get(category) ?? new Set<string>()
    ids.add(entry.missionSnapshot.missionId)
    completedByCategory.set(category, ids)
  }

  const general = GENERAL_BADGES.map((badge) => {
    const rawProgress = badge.progress(entries, uniqueMissionIds)
    return {
      ...badge,
      progress: Math.min(rawProgress, badge.target),
      unlocked: rawProgress >= badge.target,
    }
  })

  const category = (Object.keys(CATEGORY_BADGES) as MissionCategory[]).flatMap((categoryId) => {
    const progress = completedByCategory.get(categoryId)?.size ?? 0
    const badge = CATEGORY_BADGES[categoryId]
    return badge.levels.map((level) => ({
      id: `${categoryId}-${level.target}`,
      category: categoryId,
      target: level.target,
      title: level.title,
      description:
        level.target === 1
          ? 'Die erste Mission dieser Laborwelt geschafft.'
          : `${level.target} verschiedene Missionen dieser Laborwelt geschafft.`,
      icon: badge.icon,
      rarity: level.rarity,
      unlocked: progress >= level.target,
      progress: Math.min(progress, level.target),
    }))
  })

  return [...general, ...category]
}
