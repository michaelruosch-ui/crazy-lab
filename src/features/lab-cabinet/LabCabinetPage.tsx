import { useMemo, useState } from 'react'
import { missions } from '../../data'
import {
  DEFAULT_PROFILE,
  generateId,
  type LabCabinetArea,
  type LabCabinetItem,
  type QuantityStatus,
} from '../../domain'
import { BackLink, Button } from '../../components'
import { useLabCabinet } from './useLabCabinet'
import './LabCabinetPage.css'

const AREAS: { value: LabCabinetArea; label: string }[] = [
  { value: 'kueche', label: '🍴 Küche' },
  { value: 'bastelkiste', label: '📦 Bastelkiste' },
  { value: 'zimmer', label: '🛏️ Zimmer' },
  { value: 'bad', label: '🫧 Bad' },
  { value: 'keller', label: '🪜 Keller' },
  { value: 'anderswo', label: '🧭 Anderswo' },
]

const QUANTITIES: { value: QuantityStatus; label: string }[] = [
  { value: 'leer', label: 'Leer' },
  { value: 'wenig', label: 'Wenig' },
  { value: 'genug', label: 'Genug' },
  { value: 'viel', label: 'Viel' },
]

const MATERIAL_SUGGESTIONS = [
  ...new Set(missions.flatMap((mission) => mission.materials.map((m) => m.name))),
].sort((a, b) => a.localeCompare(b, 'de'))

function imageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('Foto konnte nicht gelesen werden.'))
      image.onload = () => {
        const scale = Math.min(1, 800 / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        const context = canvas.getContext('2d')
        if (!context) return reject(new Error('Foto konnte nicht verkleinert werden.'))
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export function LabCabinetPage() {
  const { items, loading, save, remove } = useLabCabinet(DEFAULT_PROFILE.id)
  const [search, setSearch] = useState('')
  const [photoError, setPhotoError] = useState('')
  const filteredSuggestions = useMemo(() => {
    const storedMaterialNames = new Set(items.map((item) => item.materialName))
    const normalized = search.trim().toLocaleLowerCase('de')
    return MATERIAL_SUGGESTIONS.filter(
      (name) =>
        !storedMaterialNames.has(name) &&
        (!normalized || name.toLocaleLowerCase('de').includes(normalized)),
    ).slice(0, 30)
  }, [items, search])

  async function addMaterial(materialName: string) {
    await save({
      id: generateId(),
      profileId: DEFAULT_PROFILE.id,
      materialName,
      area: 'kueche',
      quantityStatus: 'genug',
      updatedAt: new Date().toISOString(),
    })
  }

  async function update(item: LabCabinetItem, patch: Partial<LabCabinetItem>) {
    await save({ ...item, ...patch, updatedAt: new Date().toISOString() })
  }

  async function addPhoto(item: LabCabinetItem, file?: File) {
    if (!file) return
    setPhotoError('')
    try {
      await update(item, { photoDataUrl: await imageFileToDataUrl(file) })
    } catch {
      setPhotoError('Das Foto konnte nicht gespeichert werden. Bitte ein anderes versuchen.')
    }
  }

  return (
    <div className="lab-cabinet-page">
      <h1>🧰 Laborschrank</h1>
      <p>Was haben wir schon zu Hause und wo liegt es?</p>

      <section>
        <h2>Im Laborschrank</h2>
        {loading && <p>Lade Materialien...</p>}
        {!loading && items.length === 0 && <p>Noch leer – füge unten das erste Material hinzu.</p>}
        {photoError && <p className="lab-cabinet-page__error">{photoError}</p>}
        <div className="lab-cabinet-page__items">
          {items.map((item) => (
            <article key={item.id} className="cabinet-item">
              <div className="cabinet-item__title">
                <div>
                  <h3>{item.materialName}</h3>
                  <input
                    aria-label={`Genaue Bezeichnung für ${item.materialName}`}
                    defaultValue={item.exactName ?? ''}
                    placeholder="Genaue Sorte oder Marke (freiwillig)"
                    onBlur={(event) =>
                      update(item, { exactName: event.target.value.trim() || undefined })
                    }
                  />
                </div>
                {item.photoDataUrl && <img src={item.photoDataUrl} alt={item.materialName} />}
              </div>

              <label>
                Bereich
                <select
                  value={item.area}
                  onChange={(event) => update(item, { area: event.target.value as LabCabinetArea })}
                >
                  {AREAS.map((area) => (
                    <option key={area.value} value={area.value}>
                      {area.label}
                    </option>
                  ))}
                </select>
              </label>

              {item.area === 'bastelkiste' && (
                <label>
                  Name der Bastelkiste
                  <input
                    defaultValue={item.boxName ?? ''}
                    placeholder="z. B. Grusel-Kiste"
                    onBlur={(event) =>
                      update(item, { boxName: event.target.value.trim() || undefined })
                    }
                  />
                </label>
              )}

              <fieldset>
                <legend>Wie viel ist da?</legend>
                <div className="cabinet-item__quantity">
                  {QUANTITIES.map((quantity) => (
                    <button
                      type="button"
                      key={quantity.value}
                      className={item.quantityStatus === quantity.value ? 'active' : ''}
                      onClick={() => update(item, { quantityStatus: quantity.value })}
                    >
                      {quantity.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="cabinet-item__actions">
                <label className="cabinet-item__photo">
                  📷 {item.photoDataUrl ? 'Foto ändern' : 'Foto hinzufügen'}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(event) => addPhoto(item, event.target.files?.[0])}
                  />
                </label>
                <Button variant="ghost" onClick={() => remove(item.id)}>
                  Entfernen
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="lab-cabinet-page__suggestions">
        <h2>Material hinzufügen</h2>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Material suchen..."
          aria-label="Material suchen"
        />
        <div>
          {filteredSuggestions.map((materialName) => (
            <button type="button" key={materialName} onClick={() => addMaterial(materialName)}>
              + {materialName}
            </button>
          ))}
        </div>
      </section>

      <BackLink to="/">← Zurück zur Startseite</BackLink>
    </div>
  )
}
