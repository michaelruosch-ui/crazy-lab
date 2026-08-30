import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { DEFAULT_PROFILE } from '../domain'
import { resetDbConnection } from './db'
import { indexedDbProfileRepository } from './profileRepository'
import { downloadBackupFromMac, uploadBackupToMac } from './localBackup'

describe('lokale Mac-Sicherung', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
    vi.restoreAllMocks()
  })

  it('sendet den vollständigen lokalen Stand an den Mac', async () => {
    await indexedDbProfileRepository.save(DEFAULT_PROFILE)
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }))

    await uploadBackupToMac(DEFAULT_PROFILE.id, 'https://mac.test/backup', 'test-token')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://mac.test/backup',
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({ authorization: 'Bearer test-token' }),
      }),
    )
  })

  it('liest ein gültiges Backup vom Mac', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({
        format: 'crazylab-backup',
        version: 1,
        exportedAt: '2026-08-30T00:00:00.000Z',
        profile: DEFAULT_PROFILE,
        diaryEntries: [],
        secretVaultEntries: [],
        hiddenMissions: [],
      }),
    )

    expect(await downloadBackupFromMac('https://mac.test/backup', 'test-token')).not.toBeNull()
  })

  it('stört die App nicht, wenn der Mac nicht erreichbar ist', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Mac aus'))
    await expect(
      uploadBackupToMac(DEFAULT_PROFILE.id, 'https://mac.test/backup', 'test-token'),
    ).resolves.toBeUndefined()
    await expect(downloadBackupFromMac('https://mac.test/backup', 'test-token')).resolves.toBeNull()
  })
})
