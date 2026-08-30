import { describe, expect, it } from 'vitest'
import { missions } from '../data'
import {
  estimatedPriceForMaterial,
  preferredStoreForMaterial,
  shoppingItemsForMission,
} from './shoppingListPlanning'

describe('shoppingListPlanning', () => {
  it('bevorzugt Coop für Lebensmittel und Jumbo für Bastelmaterial', () => {
    expect(preferredStoreForMaterial('Apfelsaft')).toBe('coop')
    expect(preferredStoreForMaterial('Bastelkleber')).toBe('jumbo')
  })

  it('erstellt aus allen Missionsmaterialien vollständige Einkaufspositionen', () => {
    const mission = missions.find((item) => item.id === 'mission-blutroter-schatten-trank')!
    const items = shoppingItemsForMission(mission, 'elena', new Date('2026-08-30T12:00:00Z'))

    expect(items).toHaveLength(mission.materials.length)
    expect(items.every((item) => item.sourceMissionId === mission.id)).toBe(true)
    expect(items.every((item) => item.estimatedPriceChf > 0)).toBe(true)
    expect(items.every((item) => item.assignedTo === 'gemeinsam')).toBe(true)
  })

  it('liefert einfache nachvollziehbare Richtpreise', () => {
    expect(estimatedPriceForMaterial('Vanillesirup', true)).toBe(3)
    expect(estimatedPriceForMaterial('Schere', false)).toBe(6)
  })
})
