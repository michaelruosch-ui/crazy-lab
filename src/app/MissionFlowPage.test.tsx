import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { App } from '../App'
import { resetDbConnection } from '../storage/db'
import { missions } from '../data/missions'
import { DEFAULT_PROFILE } from '../domain'
import { indexedDbDiaryRepository } from '../storage/diaryRepository'
import { indexedDbProfileRepository } from '../storage/profileRepository'

const mission = missions.find((m) => m.id === 'mission-blutroter-schatten-trank')!

describe('Vollständiger Missionsablauf', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
  })

  it('führt von Detail über Schritte und Bewertung zu einem persistierten Tagebucheintrag', async () => {
    await indexedDbProfileRepository.save({
      ...DEFAULT_PROFILE,
      onboardingCompletedAt: '2026-08-23T00:00:00.000Z',
    })
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={[`/mission/${mission.id}`]}>
        <App />
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('button', { name: 'Alles bereit für die Mission?' }))

    for (let i = 0; i < mission.steps.length; i++) {
      await user.click(screen.getByRole('checkbox'))
      if (i < mission.steps.length - 1) {
        await user.click(screen.getByRole('button', { name: 'Weiter' }))
      }
    }
    await user.click(screen.getByRole('button', { name: 'Mission abschliessen' }))

    expect(screen.getByText('Mission geschafft!')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Im Labortagebuch speichern' }))

    expect(
      await screen.findByRole('heading', { name: 'Geheimnisvolles Labortagebuch' }),
    ).toBeInTheDocument()
    expect(await screen.findByText(mission.title)).toBeInTheDocument()

    const persisted = await indexedDbDiaryRepository.getAllEntries(DEFAULT_PROFILE.id)
    expect(persisted).toHaveLength(1)
    expect(persisted[0]!.missionSnapshot.title).toBe(mission.title)

    resetDbConnection()
    const afterReload = await indexedDbDiaryRepository.getAllEntries(DEFAULT_PROFILE.id)
    expect(afterReload).toHaveLength(1)
  })
})
