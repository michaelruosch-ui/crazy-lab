import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { DEFAULT_PROFILE } from '../domain'
import { downloadBackupFromCloud, uploadBackupToCloud } from './cloudSync'
import { resetDbConnection } from './db'
import { indexedDbProfileRepository } from './profileRepository'

const config = { url: 'https://sync.example.test', key: 'family-secret-key' }

function backupPayload() {
  return {
    format: 'crazylab-backup' as const,
    version: 1 as const,
    exportedAt: '2026-08-23T00:00:00.000Z',
    profile: { ...DEFAULT_PROFILE, onboardingCompletedAt: '2026-08-16T00:00:00.000Z' },
    diaryEntries: [],
    secretVaultEntries: [],
    hiddenMissions: [],
  }
}

describe('cloudSync', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
    vi.unstubAllGlobals()
  })

  it('lädt den aktuellen Stand per PUT an den konfigurierten Endpunkt hoch', async () => {
    await indexedDbProfileRepository.save({
      ...DEFAULT_PROFILE,
      onboardingCompletedAt: '2026-08-16T00:00:00.000Z',
    })
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await uploadBackupToCloud(DEFAULT_PROFILE.id, config)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://sync.example.test/family-secret-key',
      expect.objectContaining({ method: 'PUT' }),
    )
    const body: unknown = JSON.parse(fetchMock.mock.calls[0]![1].body)
    expect(body).toMatchObject({ format: 'crazylab-backup' })
  })

  it('wirft keinen Fehler, wenn der Upload fehlschlägt (kein Internet)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))

    await expect(uploadBackupToCloud(DEFAULT_PROFILE.id, config)).resolves.toBeUndefined()
  })

  it('lädt einen gültigen Cloud-Stand herunter', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(backupPayload()) }),
    )

    const result = await downloadBackupFromCloud(config)

    expect(result?.profile?.id).toBe(DEFAULT_PROFILE.id)
  })

  it('gibt null zurück, wenn nichts in der Cloud liegt (404)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    expect(await downloadBackupFromCloud(config)).toBeNull()
  })

  it('gibt null zurück bei ungültigem Inhalt statt zu werfen', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ hello: 'world' }) }),
    )

    expect(await downloadBackupFromCloud(config)).toBeNull()
  })

  it('ist deaktiviert (kein Fetch-Aufruf), wenn keine Konfiguration übergeben wird', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await uploadBackupToCloud(DEFAULT_PROFILE.id, null)
    const result = await downloadBackupFromCloud(null)

    expect(fetchMock).not.toHaveBeenCalled()
    expect(result).toBeNull()
  })
})
