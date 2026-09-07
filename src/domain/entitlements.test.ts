import { describe, expect, it } from 'vitest'
import { missions } from '../data'
import {
  FREE_CATALOG_MISSION_IDS,
  FREE_PRODUCT_OWNER_MISSION_TITLE,
  isMissionFree,
} from './entitlements'

describe('kostenloser App-Store-Einstieg', () => {
  it('enthält genau die fünf genannten Katalogmissionen', () => {
    const freeCatalog = missions.filter(isMissionFree)
    expect(freeCatalog.map((mission) => mission.title).sort()).toEqual(
      [
        'Das leuchtende Geisterportal',
        'Das Monster-Frühstück',
        'Der blutrote Schatten-Trank',
        'Die Mini-Schatzsuche',
        'Regen im Glas',
      ].sort(),
    )
    expect(FREE_CATALOG_MISSION_IDS.size).toBe(5)
  })

  it('erkennt Elenas lokale Mission Der Blutkleim unabhängig von ihrer Geräte-ID', () => {
    expect(
      isMissionFree({ id: 'mission-eigen-zufaellig', title: FREE_PRODUCT_OWNER_MISSION_TITLE }),
    ).toBe(true)
    expect(isMissionFree({ id: 'mission-eigen-anders', title: 'Eine andere Mission' })).toBe(false)
  })
})
