import type { MissionFilters, MissionLocation } from '../../domain'

interface MissionFiltersPanelProps {
  filters: MissionFilters
  resultCount: number
  onChange: (filters: MissionFilters) => void
}

function optionalNumber(value: string): number | undefined {
  return value === '' ? undefined : Number(value)
}

export function MissionFiltersPanel({ filters, resultCount, onChange }: MissionFiltersPanelProps) {
  const update = (change: Partial<MissionFilters>) => onChange({ ...filters, ...change })

  return (
    <details className="mission-filters">
      <summary>🧭 Missionen filtern</summary>
      <p className="mission-filters__intro">
        Was passt gerade? Crazy Lab zeigt nur passende Ideen.
      </p>
      <div className="mission-filters__grid">
        <label>
          Zeit
          <select
            value={filters.maxDurationMinutes ?? ''}
            onChange={(event) => update({ maxDurationMinutes: optionalNumber(event.target.value) })}
          >
            <option value="">Egal</option>
            <option value="15">Höchstens 15 Min.</option>
            <option value="30">Höchstens 30 Min.</option>
            <option value="60">Höchstens 60 Min.</option>
          </select>
        </label>
        <label>
          Budget
          <select
            value={filters.maxBudgetChf ?? ''}
            onChange={(event) => update({ maxBudgetChf: optionalNumber(event.target.value) })}
          >
            <option value="">Egal</option>
            <option value="0">Nur kostenlos</option>
            <option value="3">Bis CHF 3</option>
            <option value="5">Bis CHF 5</option>
            <option value="10">Bis CHF 10</option>
          </select>
        </label>
        <label>
          Ort
          <select
            value={filters.location ?? ''}
            onChange={(event) =>
              update({ location: (event.target.value || undefined) as MissionLocation | undefined })
            }
          >
            <option value="">Egal</option>
            <option value="kueche">Küche</option>
            <option value="zimmer">Zimmer</option>
            <option value="bad">Bad</option>
            <option value="garten">Garten</option>
            <option value="ueberall">Überall</option>
          </select>
        </label>
        <label>
          Unordnung
          <select
            value={filters.maxMess ?? ''}
            onChange={(event) => update({ maxMess: optionalNumber(event.target.value) })}
          >
            <option value="">Egal</option>
            <option value="1">Möglichst sauber</option>
            <option value="3">Ein bisschen ist okay</option>
            <option value="5">Darf wild werden</option>
          </select>
        </label>
        <label>
          Hilfe
          <select
            value={filters.adultAvailable ? 'da' : 'allein'}
            onChange={(event) => update({ adultAvailable: event.target.value === 'da' })}
          >
            <option value="da">Erwachsene Person ist da</option>
            <option value="allein">Ich bin allein</option>
          </select>
        </label>
        <label>
          Personen
          <select
            value={filters.peopleAvailable ?? ''}
            onChange={(event) =>
              update({ peopleAvailable: optionalNumber(event.target.value) as 1 | 2 | undefined })
            }
          >
            <option value="">Egal</option>
            <option value="1">Ich allein</option>
            <option value="2">Wir sind mindestens zwei</option>
          </select>
        </label>
      </div>
      <div className="mission-filters__footer">
        <strong>{resultCount} passende Missionen</strong>
        <button type="button" onClick={() => onChange({ adultAvailable: true })}>
          Filter löschen
        </button>
      </div>
    </details>
  )
}
