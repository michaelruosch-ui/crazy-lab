import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { resetDbConnection } from '../../storage/db'
import { indexedDbCustomMissionRepository } from '../../storage/customMissionRepository'
import { CustomMissionEditorPage } from './CustomMissionEditorPage'

describe('Maskottchen-Assistent für eigene Missionen', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
    const data = new Map<string, string>()
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => data.set(key, value),
        clear: () => data.clear(),
      },
    })
    window.localStorage.setItem('crazylab-active-profile', 'elena')
  })

  it('reserviert die Missionswerkstatt für Elena als Product Owner', () => {
    window.localStorage.setItem('crazylab-active-profile', 'michael')
    render(
      <MemoryRouter>
        <CustomMissionEditorPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('🔒 Elenas Missionswerkstatt')).toBeInTheDocument()
    expect(screen.queryByLabelText('Titel der Mission')).not.toBeInTheDocument()
  })

  it('erstellt aus verständlichen Feldern eine spielbare Mission', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <CustomMissionEditorPage />
      </MemoryRouter>,
    )
    await user.type(screen.getByLabelText('Titel der Mission'), 'Das Sockenmonster')
    await user.type(screen.getByLabelText('Was passiert?'), 'Wir bauen ein lustiges Monster.')
    await user.type(screen.getByLabelText(/Materialien/), 'Socke\nFilzstifte')
    await user.type(screen.getByLabelText(/Schritte/), 'Socke wählen.\nGesicht malen.')
    await user.click(screen.getByRole('button', { name: 'Mission speichern' }))

    const saved = await indexedDbCustomMissionRepository.getAll('elena')
    expect(saved).toHaveLength(1)
    expect(saved[0]!.steps).toHaveLength(2)
    expect(saved[0]!.title).toBe('Das Sockenmonster')
  })

  it('verlangt bei Erwachsenenhilfe einen Sicherheitshinweis', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <CustomMissionEditorPage />
      </MemoryRouter>,
    )
    await user.type(screen.getByLabelText('Titel der Mission'), 'Kartonburg')
    await user.type(screen.getByLabelText('Was passiert?'), 'Wir bauen eine grosse Burg.')
    await user.type(screen.getByLabelText(/Materialien/), 'Karton')
    await user.type(screen.getByLabelText(/Schritte/), 'Planen.\nSchneiden.')
    await user.selectOptions(screen.getByLabelText('Sicherheitsstufe'), 'gelb')
    expect(screen.getByRole('button', { name: 'Mission speichern' })).toBeDisabled()
    await user.type(
      screen.getByLabelText(/Was muss beachtet werden/),
      'Eine erwachsene Person schneidet den Karton.',
    )
    expect(screen.getByRole('button', { name: 'Mission speichern' })).toBeEnabled()
  })
})
