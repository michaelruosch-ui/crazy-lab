export type ShoppingStore = 'coop' | 'migros' | 'jumbo'
export type ShoppingAssignee = 'michael' | 'elena' | 'gemeinsam'

export interface ShoppingListItem {
  id: string
  profileId: string
  materialName: string
  quantity?: string
  sourceMissionId?: string
  sourceMissionTitle?: string
  store: ShoppingStore
  estimatedPriceChf: number
  checked: boolean
  assignedTo: ShoppingAssignee
  addedAt: string
}
