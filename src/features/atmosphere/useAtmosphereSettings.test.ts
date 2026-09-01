import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAtmosphereSettings } from './useAtmosphereSettings'

describe('Atmosphäre-Einstellungen', () => {
  beforeEach(() => {
    const data = new Map<string, string>()
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => data.set(key, value),
        clear: () => data.clear(),
      },
    })
  })

  it('speichert Musik und Animationen lokal', () => {
    const { result } = renderHook(() => useAtmosphereSettings())
    act(() => result.current.update({ soundEnabled: false, animationsEnabled: false }))
    expect(result.current.settings).toEqual({ soundEnabled: false, animationsEnabled: false })
    const second = renderHook(() => useAtmosphereSettings())
    expect(second.result.current.settings.soundEnabled).toBe(false)
  })
})
