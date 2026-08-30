import {
  DEFAULT_PROFILE,
  generateId,
  type ShoppingAssignee,
  type ShoppingListItem,
  type ShoppingStore,
} from '../../domain'
import { BackLink, Button } from '../../components'
import { indexedDbLabCabinetRepository } from '../../storage/labCabinetRepository'
import { useShoppingList } from './useShoppingList'
import './ShoppingListPage.css'

const STORES: { value: ShoppingStore; label: string }[] = [
  { value: 'coop', label: 'Coop' },
  { value: 'migros', label: 'Migros' },
  { value: 'jumbo', label: 'Jumbo' },
]

const ASSIGNEES: { value: ShoppingAssignee; label: string }[] = [
  { value: 'gemeinsam', label: 'Gemeinsam' },
  { value: 'michael', label: 'Michael' },
  { value: 'elena', label: 'Elena' },
]

export function ShoppingListPage() {
  const { items, loading, save, remove } = useShoppingList(DEFAULT_PROFILE.id)
  const openTotal = items
    .filter((item) => !item.checked)
    .reduce((sum, item) => sum + item.estimatedPriceChf, 0)

  async function update(item: ShoppingListItem, patch: Partial<ShoppingListItem>) {
    await save({ ...item, ...patch })
  }

  async function moveToCabinet(item: ShoppingListItem) {
    const cabinetItems = await indexedDbLabCabinetRepository.getAll(DEFAULT_PROFILE.id)
    const existing = cabinetItems.find((entry) => entry.materialName === item.materialName)
    await indexedDbLabCabinetRepository.save(
      existing
        ? { ...existing, quantityStatus: 'genug', updatedAt: new Date().toISOString() }
        : {
            id: generateId(),
            profileId: DEFAULT_PROFILE.id,
            materialName: item.materialName,
            area: item.store === 'jumbo' ? 'bastelkiste' : 'kueche',
            quantityStatus: 'genug',
            updatedAt: new Date().toISOString(),
          },
    )
    await remove(item.id)
  }

  return (
    <div className="shopping-list-page">
      <h1>🛒 Einkaufsliste</h1>
      <p>Coop zuerst, Migros und Jumbo als Alternativen. Preise sind grobe Richtwerte.</p>

      <div className="shopping-list-page__total">
        Noch offen: <strong>ca. CHF {openTotal.toFixed(2)}</strong>
      </div>

      {loading && <p>Lade Einkaufsliste...</p>}
      {!loading && items.length === 0 && (
        <p>Noch nichts einzukaufen. Öffne eine Mission und tippe auf „Auf Einkaufsliste“.</p>
      )}

      <div className="shopping-list-page__items">
        {items.map((item) => (
          <article
            key={item.id}
            className={`shopping-item ${item.checked ? 'shopping-item--checked' : ''}`}
          >
            <label className="shopping-item__check">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(event) => update(item, { checked: event.target.checked })}
              />
              <span>
                <strong>{item.materialName}</strong>
                {item.quantity && <small>{item.quantity}</small>}
              </span>
            </label>
            {item.sourceMissionTitle && <p>Für: {item.sourceMissionTitle}</p>}
            <div className="shopping-item__fields">
              <label>
                Laden
                <select
                  value={item.store}
                  onChange={(event) => update(item, { store: event.target.value as ShoppingStore })}
                >
                  {STORES.map((store) => (
                    <option key={store.value} value={store.value}>
                      {store.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Zuständig
                <select
                  value={item.assignedTo}
                  onChange={(event) =>
                    update(item, { assignedTo: event.target.value as ShoppingAssignee })
                  }
                >
                  {ASSIGNEES.map((person) => (
                    <option key={person.value} value={person.value}>
                      {person.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Preis ca. CHF
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={item.estimatedPriceChf}
                  onChange={(event) =>
                    update(item, { estimatedPriceChf: Math.max(0, Number(event.target.value)) })
                  }
                />
              </label>
            </div>
            <div className="shopping-item__actions">
              {item.checked && (
                <Button variant="secondary" onClick={() => moveToCabinet(item)}>
                  ✅ In Laborschrank übernehmen
                </Button>
              )}
              <Button variant="ghost" onClick={() => remove(item.id)}>
                Entfernen
              </Button>
            </div>
          </article>
        ))}
      </div>
      <BackLink to="/">← Zurück zur Startseite</BackLink>
    </div>
  )
}
