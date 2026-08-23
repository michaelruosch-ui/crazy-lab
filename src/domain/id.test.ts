import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateId } from './id'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

describe('generateId', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('nutzt crypto.randomUUID(), wenn verfügbar', () => {
    const id = generateId()
    expect(id).toMatch(UUID_PATTERN)
  })

  it('erzeugt trotzdem eine gültige ID, wenn crypto.randomUUID() fehlt (unsicherer Kontext, z. B. Safari über LAN-HTTP)', () => {
    vi.stubGlobal('crypto', { getRandomValues: crypto.getRandomValues.bind(crypto) })

    const id = generateId()
    expect(id).toMatch(UUID_PATTERN)
  })

  it('erzeugt trotzdem eine eindeutige ID, wenn crypto komplett fehlt', () => {
    vi.stubGlobal('crypto', undefined)

    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
    expect(id1.length).toBeGreaterThan(0)
  })
})
