import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { missions } from '../../data'
import type { CustomMission } from '../../domain'
import { resetDbConnection } from '../../storage/db'
import { indexedDbCustomMissionRepository } from '../../storage/customMissionRepository'
import { CustomMissionsPage } from './CustomMissionsPage'

describe('Elenas Missionsfreigabe', () => {
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

  it('ersetzt den privaten Testlink durch die Freigabe für alle', async () => {
    const now = new Date().toISOString()
    const custom: CustomMission = {
      ...missions[0]!,
      id: 'mission-eigen-blutkleim',
      title: 'Der Blutkleim',
      profileId: 'elena',
      createdAt: now,
      updatedAt: now,
      publicationStatus: 'draft',
    }
    await indexedDbCustomMissionRepository.save(custom)
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <CustomMissionsPage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('button', { name: '🌍 Für alle freigeben' })).toBeInTheDocument()
    expect(screen.queryByText(/Testlink/i)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '🌍 Für alle freigeben' }))

    expect(await screen.findByText('✅ Für das nächste App-Update freigegeben')).toBeInTheDocument()
    expect((await indexedDbCustomMissionRepository.get(custom.id))?.publicationStatus).toBe(
      'ready-for-review',
    )
  })
})
