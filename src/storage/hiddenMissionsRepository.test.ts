import { beforeEach, describe, expect, it } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { indexedDbHiddenMissionsRepository } from './hiddenMissionsRepository'
import { resetDbConnection } from './db'

describe('indexedDbHiddenMissionsRepository', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
  })

  it('speichert einen Verstecken-Vorgang und zeigt ihn im Verlauf', async () => {
    const hiddenAt = new Date('2026-08-23T12:00:00.000Z')
    await indexedDbHiddenMissionsRepository.hide('elena', 'mission-1', hiddenAt)

    const history = await indexedDbHiddenMissionsRepository.getHistory(
      'elena',
      new Date('2026-08-24T00:00:00.000Z'),
    )
    expect(history).toHaveLength(1)
    expect(history[0]!.missionId).toBe('mission-1')
  })

  it('entfernt Einträge nach 14 Tagen aus dem Verlauf', async () => {
    const hiddenAt = new Date('2026-08-23T12:00:00.000Z')
    await indexedDbHiddenMissionsRepository.hide('elena', 'mission-1', hiddenAt)

    const history = await indexedDbHiddenMissionsRepository.getHistory(
      'elena',
      new Date('2026-09-08T00:00:00.000Z'),
    )
    expect(history).toEqual([])
  })

  it('bleibt nach simuliertem Neuladen erhalten', async () => {
    const hiddenAt = new Date('2026-08-23T12:00:00.000Z')
    await indexedDbHiddenMissionsRepository.hide('elena', 'mission-1', hiddenAt)
    resetDbConnection()

    const history = await indexedDbHiddenMissionsRepository.getHistory(
      'elena',
      new Date('2026-08-24T00:00:00.000Z'),
    )
    expect(history).toHaveLength(1)
  })
})
