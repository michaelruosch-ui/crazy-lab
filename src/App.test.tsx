import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { App } from './App'
import { resetDbConnection } from './storage/db'

describe('App', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
  })

  it('zeigt beim Start die Startseite mit Kategorien und der Tagesmission (Render-Smoke-Test)', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: '🔮 Crazy Lab' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '✨ Tagesmission' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '🧃 Getränke' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '🗝️ Geheimfach' })).toBeInTheDocument()
  })

  it('öffnet eine Mission über die Startseite und zeigt die Missionsdetails', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('heading', { name: 'Der blutrote Schatten-Trank' }))

    expect(screen.getByRole('button', { name: 'Alles bereit für die Mission?' })).toBeInTheDocument()
  })
})
