import type { Mission } from './mission'
import type { ShoppingListItem, ShoppingStore } from './shoppingList'

const JUMBO_WORDS = ['kleber', 'schere', 'karton', 'pinsel', 'draht', 'werkzeug', 'klebeband']

export function preferredStoreForMaterial(materialName: string): ShoppingStore {
  const normalized = materialName.toLocaleLowerCase('de')
  return JUMBO_WORDS.some((word) => normalized.includes(word)) ? 'jumbo' : 'coop'
}

export function estimatedPriceForMaterial(materialName: string, consumable: boolean): number {
  const normalized = materialName.toLocaleLowerCase('de')
  if (normalized.includes('glitzer') || normalized.includes('lebensmittelfarbe')) return 4
  if (normalized.includes('sirup') || normalized.includes('saft')) return 3
  if (normalized.includes('milch') || normalized.includes('joghurt')) return 2.5
  if (normalized.includes('glas') || normalized.includes('schüssel')) return 5
  return consumable ? 2.5 : 6
}

export function shoppingItemsForMission(
  mission: Mission,
  profileId: string,
  now = new Date(),
): ShoppingListItem[] {
  return mission.materials.map((material, index) => ({
    id: `shopping-${mission.id}-${material.id}-${now.getTime()}-${index}`,
    profileId,
    materialName: material.name,
    quantity: material.quantity,
    sourceMissionId: mission.id,
    sourceMissionTitle: mission.title,
    store: preferredStoreForMaterial(material.name),
    estimatedPriceChf: estimatedPriceForMaterial(material.name, material.consumable),
    checked: false,
    assignedTo: 'gemeinsam',
    addedAt: now.toISOString(),
  }))
}
