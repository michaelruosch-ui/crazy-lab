import { beforeEach, describe, expect, it } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { DEFAULT_PROFILE } from '../domain'
import { createBackup, isBackupData, restoreBackup } from './backup'
import { resetDbConnection } from './db'
import { indexedDbProfileRepository } from './profileRepository'
import { indexedDbDiaryRepository } from './diaryRepository'
import { indexedDbSecretVaultRepository } from './secretVaultRepository'
import { indexedDbHiddenMissionsRepository } from './hiddenMissionsRepository'

const diaryEntry = {
  id: 'entry-1',
  profileId: DEFAULT_PROFILE.id,
  missionSnapshot: {
    missionId: 'mission-blutroter-schatten-trank',
    contentVersion: 1,
    title: 'Der blutrote Schatten-Trank',
    primaryCategory: 'getraenk' as const,
    imagePlaceholder: 'potion-red',
  },
  status: 'erfolgreich' as const,
  rating: {
    result: 5 as const,
    difficultyFeedback: 'genau_richtig' as const,
    wouldRepeat: true,
    wouldRecommend: true,
    adjustments: [],
    stamp: 'geheimnisvoll' as const,
    photoDataUrls: ['data:image/jpeg;base64,foto'],
    videoDataUrl: 'data:video/mp4;base64,video',
  },
  completedAt: '2026-08-20T10:00:00.000Z',
}

async function seedData() {
  await indexedDbProfileRepository.save({
    ...DEFAULT_PROFILE,
    researcherName: 'Forscherin Elena',
    onboardingCompletedAt: '2026-08-16T00:00:00.000Z',
    birthdays: [{ id: 'b1', personName: 'Laura', monthDay: '08-23' }],
  })
  await indexedDbDiaryRepository.saveEntry(diaryEntry)
  await indexedDbSecretVaultRepository.save(DEFAULT_PROFILE.id, 'mission-playmobil-geisterbett')
  await indexedDbHiddenMissionsRepository.hide(
    DEFAULT_PROFILE.id,
    'mission-wandernde-farbgeist',
    new Date('2026-08-20T12:00:00.000Z'),
  )
}

describe('backup', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
  })

  it('exportiert alle Daten eines Profils', async () => {
    await seedData()

    const backup = await createBackup(DEFAULT_PROFILE.id)

    expect(backup.format).toBe('crazylab-backup')
    expect(backup.profile?.researcherName).toBe('Forscherin Elena')
    expect(backup.profile?.birthdays).toHaveLength(1)
    expect(backup.diaryEntries).toHaveLength(1)
    expect(backup.secretVaultEntries).toHaveLength(1)
    expect(backup.hiddenMissions).toHaveLength(1)
  })

  it('erkennt gültige Backup-Dateien und lehnt fremde Dateien ab', async () => {
    await seedData()
    const backup = await createBackup(DEFAULT_PROFILE.id)

    expect(isBackupData(backup)).toBe(true)
    expect(isBackupData({ hello: 'world' })).toBe(false)
    expect(isBackupData(null)).toBe(false)
    expect(isBackupData('not an object')).toBe(false)
  })

  it('stellt ein Backup vollständig wieder her (z. B. nach Neuinstallation)', async () => {
    await seedData()
    const backup = await createBackup(DEFAULT_PROFILE.id)

    // Simuliert eine "frische" Installation ohne bestehende Daten.
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
    expect(await indexedDbProfileRepository.get(DEFAULT_PROFILE.id)).toBeUndefined()

    await restoreBackup(backup)

    const restoredProfile = await indexedDbProfileRepository.get(DEFAULT_PROFILE.id)
    expect(restoredProfile?.researcherName).toBe('Forscherin Elena')
    expect(restoredProfile?.birthdays).toEqual([
      { id: 'b1', personName: 'Laura', monthDay: '08-23' },
    ])

    const restoredDiary = await indexedDbDiaryRepository.getAllEntries(DEFAULT_PROFILE.id)
    expect(restoredDiary).toHaveLength(1)
    expect(restoredDiary[0]!.id).toBe('entry-1')
    expect(restoredDiary[0]!.rating.photoDataUrls).toEqual(['data:image/jpeg;base64,foto'])
    expect(restoredDiary[0]!.rating.videoDataUrl).toBe('data:video/mp4;base64,video')

    expect(
      await indexedDbSecretVaultRepository.isSaved(
        DEFAULT_PROFILE.id,
        'mission-playmobil-geisterbett',
      ),
    ).toBe(true)

    const restoredHistory = await indexedDbHiddenMissionsRepository.getHistory(
      DEFAULT_PROFILE.id,
      new Date('2026-08-21T00:00:00.000Z'),
    )
    expect(restoredHistory).toHaveLength(1)
    expect(restoredHistory[0]!.missionId).toBe('mission-wandernde-farbgeist')
  })
})
