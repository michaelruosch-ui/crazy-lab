import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { DEFAULT_PROFILE } from '../../domain'
import { ProfilePage } from './ProfilePage'
import { indexedDbProfileRepository } from '../../storage/profileRepository'
import { resetDbConnection } from '../../storage/db'

describe('ProfilePage', () => {
  beforeEach(async () => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
    await indexedDbProfileRepository.save({
      ...DEFAULT_PROFILE,
      onboardingCompletedAt: '2026-08-23T00:00:00.000Z',
    })
  })

  it('speichert einen geänderten Forschernamen dauerhaft', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    )

    const nameInput = await screen.findByDisplayValue('Elena')
    await user.clear(nameInput)
    await user.type(nameInput, 'Forscherin Elena')
    await user.tab()

    const persisted = await indexedDbProfileRepository.get(DEFAULT_PROFILE.id)
    expect(persisted?.researcherName).toBe('Forscherin Elena')
  })

  it('wechselt das Maskottchen', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    )

    await screen.findByRole('radio', { name: /Giftbär/ })
    await user.click(screen.getByRole('radio', { name: /Giftbär/ }))

    const persisted = await indexedDbProfileRepository.get(DEFAULT_PROFILE.id)
    expect(persisted?.mascotVariant).toBe('giftbaer')
  })

  it('fügt einen Geburtstag hinzu und entfernt ihn wieder', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    )

    await user.type(await screen.findByPlaceholderText('Name'), 'Laura')
    const dateInput = document.querySelector('input[type="date"]')
    expect(dateInput).toBeTruthy()
    fireEvent.change(dateInput as HTMLInputElement, { target: { value: '2000-08-23' } })
    await user.click(screen.getByRole('button', { name: 'Geburtstag hinzufügen' }))

    expect(await screen.findByText(/Laura/)).toBeInTheDocument()
    let persisted = await indexedDbProfileRepository.get(DEFAULT_PROFILE.id)
    expect(persisted?.birthdays).toHaveLength(1)
    expect(persisted?.birthdays[0]?.monthDay).toBe('08-23')

    await user.click(screen.getByRole('button', { name: 'Entfernen' }))

    persisted = await indexedDbProfileRepository.get(DEFAULT_PROFILE.id)
    expect(persisted?.birthdays).toHaveLength(0)
  })

  it('lädt ein Backup herunterladen', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('button', { name: 'Jetzt Backup-Datei speichern' }))

    expect(await screen.findByText('Backup wurde heruntergeladen.')).toBeInTheDocument()
  })

  it('stellt ein hochgeladenes Backup wieder her', async () => {
    vi.stubGlobal('location', { ...window.location, reload: vi.fn() })
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    )

    const backupContent = JSON.stringify({
      format: 'crazylab-backup',
      version: 1,
      exportedAt: '2026-08-23T00:00:00.000Z',
      profile: {
        ...DEFAULT_PROFILE,
        researcherName: 'Wiederhergestellte Elena',
        onboardingCompletedAt: '2026-08-16T00:00:00.000Z',
      },
      diaryEntries: [],
      secretVaultEntries: [],
      hiddenMissions: [],
    })
    const file = new File([backupContent], 'crazylab-backup.json', { type: 'application/json' })
    await screen.findByRole('button', { name: 'Jetzt Backup-Datei speichern' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(fileInput, file)

    expect(await screen.findByText(/Backup wiederhergestellt/)).toBeInTheDocument()
    const persisted = await indexedDbProfileRepository.get(DEFAULT_PROFILE.id)
    expect(persisted?.researcherName).toBe('Wiederhergestellte Elena')
    vi.unstubAllGlobals()
  })

  it('lehnt eine fremde Datei beim Wiederherstellen ab', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    )

    const file = new File([JSON.stringify({ hello: 'world' })], 'irgendwas.json', {
      type: 'application/json',
    })
    await screen.findByRole('button', { name: 'Jetzt Backup-Datei speichern' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(fileInput, file)

    expect(
      await screen.findByText('Diese Datei sieht nicht nach einem Crazy-Lab-Backup aus.'),
    ).toBeInTheDocument()
  })
})
