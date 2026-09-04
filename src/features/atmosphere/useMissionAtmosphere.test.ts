import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useMissionAtmosphere } from './useMissionAtmosphere'

function audioContextMock(initialState: AudioContextState = 'suspended') {
  let state = initialState
  const oscillator = {
    type: 'sine',
    frequency: { value: 0 },
    connect: vi.fn().mockReturnThis(),
    start: vi.fn(),
    stop: vi.fn(),
  }
  const gain = {
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn().mockReturnValue({}),
  }
  const context = {
    get state() {
      return state
    },
    currentTime: 1,
    destination: {},
    resume: vi.fn(async () => {
      state = 'running'
    }),
    close: vi.fn(async () => {
      state = 'closed'
    }),
    createOscillator: vi.fn(() => oscillator),
    createGain: vi.fn(() => gain),
  }
  return { context, oscillator }
}

describe('Labormusik', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('weckt iPhone-Audio nach dem Antippen und spielt hörbare Noten', async () => {
    vi.useFakeTimers()
    const { context, oscillator } = audioContextMock()
    const AudioContextConstructor = vi.fn(function AudioContextStub() {
      return context
    })
    Object.defineProperty(window, 'AudioContext', {
      configurable: true,
      value: AudioContextConstructor,
    })

    const { result, unmount } = renderHook(() => useMissionAtmosphere('getraenk', true))
    await act(async () => result.current.toggle())

    expect(context.resume).toHaveBeenCalledOnce()
    expect(oscillator.start).toHaveBeenCalledOnce()
    expect(result.current.playing).toBe(true)
    unmount()
  })

  it('zeigt eine hilfreiche Meldung, wenn das Gerät Audio nicht starten lässt', async () => {
    const { context } = audioContextMock('closed')
    Object.defineProperty(window, 'AudioContext', {
      configurable: true,
      value: vi.fn(function AudioContextStub() {
        return context
      }),
    })

    const { result } = renderHook(() => useMissionAtmosphere('basteln', true))
    await act(async () => result.current.toggle())

    expect(result.current.playing).toBe(false)
    expect(result.current.error).toContain('Lautstärke')
  })
})
