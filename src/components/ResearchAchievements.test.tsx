import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { DiaryEntry } from '../domain'
import { ResearchAchievements } from './ResearchAchievements'

const completedPhotoMission: DiaryEntry = {
  id: 'entry-photo-1',
  profileId: 'elena',
  completedAt: '2026-09-13T00:00:00.000Z',
  status: 'erfolgreich',
  missionSnapshot: {
    missionId: 'photo-1',
    contentVersion: 1,
    title: 'Ein Foto-Test',
    primaryCategory: 'foto',
    imagePlaceholder: 'photo-test',
  },
  rating: {
    result: 4,
    difficultyFeedback: 'genau_richtig',
    wouldRepeat: true,
    wouldRecommend: false,
    adjustments: [],
    stamp: 'genial',
  },
}

describe('Forscher-Abzeichen in der Übersicht', () => {
  it('zeigt alle geschafften Abzeichen vor den noch offenen Abzeichen', () => {
    render(<ResearchAchievements entries={[completedPhotoMission]} />)

    const cards = screen.getAllByRole('article')
    const unlocked = cards.map((card) => card.classList.contains('is-unlocked'))
    const lastUnlockedIndex = unlocked.lastIndexOf(true)
    const firstLockedIndex = unlocked.indexOf(false)

    expect(lastUnlockedIndex).toBeGreaterThanOrEqual(0)
    expect(firstLockedIndex).toBeGreaterThan(lastUnlockedIndex)
  })
})
