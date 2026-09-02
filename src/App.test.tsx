import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { App } from './App'
import { DEFAULT_PROFILE } from './domain'
import { resetDbConnection } from './storage/db'
import { indexedDbProfileRepository } from './storage/profileRepository'

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
    expect(screen.getByText('🧭 Missionen filtern')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '🗝️ Gemerkte Missionen' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '🧰 Laborschrank' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '🛒 Einkaufsliste' })).toBeInTheDocument()
    expect(screen.getByLabelText('Labornavigation')).toBeInTheDocument()
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

  it('wechselt die Sprache oben in der App und speichert sie im aktiven Profil', async () => {
    await seedCompletedProfile()
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    await user.selectOptions(await screen.findByLabelText('Sprache'), 'en')

    expect(await screen.findByLabelText('Language')).toHaveValue('en')
    expect(screen.getByLabelText('Lab navigation')).toBeInTheDocument()
    expect((await indexedDbProfileRepository.get('elena'))?.language).toBe('en')
  })
})
