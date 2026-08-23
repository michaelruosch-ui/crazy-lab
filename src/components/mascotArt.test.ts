import { describe, expect, it } from 'vitest'
import { DEFAULT_MASCOT_ID, MASCOT_CATALOG, getMascotEntry } from './mascotArt'

describe('mascotArt Katalog', () => {
  it('enthält 33 Entwürfe', () => {
    expect(MASCOT_CATALOG).toHaveLength(33)
  })

  it('hat ausschliesslich eindeutige IDs', () => {
    const ids = MASCOT_CATALOG.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('DEFAULT_MASCOT_ID existiert im Katalog', () => {
    expect(MASCOT_CATALOG.some((e) => e.id === DEFAULT_MASCOT_ID)).toBe(true)
  })

  it('deckt alle acht Tierarten ab', () => {
    const species = new Set(MASCOT_CATALOG.map((e) => e.species))
    expect(species).toEqual(
      new Set(['bear', 'marmot', 'raccoon', 'wolf', 'bat', 'owl', 'frog', 'spider']),
    )
  })

  it('fällt bei unbekannter ID auf den ersten Katalogeintrag zurück', () => {
    expect(getMascotEntry('unbekannt-123')).toEqual(MASCOT_CATALOG[0])
  })
})
