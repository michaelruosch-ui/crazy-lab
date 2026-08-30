import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { App } from './App'
import { DEFAULT_PROFILE } from './domain'
import { resetDbConnection } from './storage/db'
import { indexedDbProfileRepository } from './storage/profileRepository'
import * as cloudSync from './storage/cloudSync'

async function seedCompletedProfile() {
  await indexedDbProfileRepository.save({
    ...DEFAULT_PROFILE,
    onboardingCompletedAt: '2026-08-23T00:00:00.000Z',
  })
}

describe('App', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
  })

  it('zeigt das Onboarding, solange noch kein Profil abgeschlossen wurde', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', { name: /Willkommen im Crazy Lab/ }),
    ).toBeInTheDocument()
  })

  it('zeigt nach abgeschlossenem Onboarding die Startseite mit Kategorien und der Tagesmission', async () => {
    await seedCompletedProfile()
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: '🔮 Crazy Lab' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '✨ Tagesmission' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '🧃 Getränke' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '🗝️ Geheimfach' })).toBeInTheDocument()
  })

  it('lädt bei fehlendem lokalen Profil automatisch den Stand aus der Cloud, statt das Onboarding zu zeigen', async () => {
    vi.spyOn(cloudSync, 'downloadBackupFromCloud').mockResolvedValue({
      format: 'crazylab-backup',
      version: 1,
      exportedAt: '2026-08-23T00:00:00.000Z',
      profile: {
        ...DEFAULT_PROFILE,
        researcherName: 'Aus der Cloud wiederhergestellt',
        onboardingCompletedAt: '2026-08-16T00:00:00.000Z',
      },
      diaryEntries: [],
      secretVaultEntries: [],
      hiddenMissions: [],
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: '🔮 Crazy Lab' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /Willkommen im Crazy Lab/ }),
    ).not.toBeInTheDocument()
    vi.restoreAllMocks()
  })

  it('zeigt trotzdem das Onboarding, wenn auch die Cloud nichts liefert', async () => {
    vi.spyOn(cloudSync, 'downloadBackupFromCloud').mockResolvedValue(null)

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', { name: /Willkommen im Crazy Lab/ }),
    ).toBeInTheDocument()
    vi.restoreAllMocks()
  })

  it('öffnet eine Mission über die Startseite und zeigt die Missionsdetails', async () => {
    await seedCompletedProfile()
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('heading', { name: 'Der blutrote Schatten-Trank' }))

    expect(
      screen.getByRole('button', { name: 'Alles bereit für die Mission?' }),
    ).toBeInTheDocument()
  })
})
