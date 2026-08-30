import { describe, expect, it, vi } from 'vitest'
import { requestPersistentStorage } from './persistentStorage'

describe('requestPersistentStorage', () => {
  it('fordert dauerhaften Speicher an, wenn er noch nicht aktiv ist', async () => {
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: {
        persisted: vi.fn().mockResolvedValue(false),
        persist: vi.fn().mockResolvedValue(true),
      },
    })
    await expect(requestPersistentStorage()).resolves.toBe(true)
  })

  it('akzeptiert bereits dauerhaften Speicher ohne neue Anfrage', async () => {
    const persist = vi.fn()
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: { persisted: vi.fn().mockResolvedValue(true), persist },
    })
    await expect(requestPersistentStorage()).resolves.toBe(true)
    expect(persist).not.toHaveBeenCalled()
  })
})
