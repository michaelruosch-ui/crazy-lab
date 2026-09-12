import { beforeEach, describe, expect, it, vi } from 'vitest'
import { playAtmosphereBeat, playMagicSound } from './magicSounds'

function contextMock() {
  let state: AudioContextState = 'suspended'
  const oscillator = {
    type: 'sine' as OscillatorType,
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
  return {
    context: {
      get state() {
        return state
      },
      currentTime: 1,
      destination: {},
      resume: vi.fn(async () => {
        state = 'running'
      }),
      createOscillator: vi.fn(() => oscillator),
      createGain: vi.fn(() => gain),
    } as unknown as AudioContext,
    oscillator,
  }
}

describe('magische Klangwelt', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('baut pro Kategorie einen mehrstimmigen Atmosphären-Puls', () => {
    const { context, oscillator } = contextMock()
    playAtmosphereBeat(context, 'experiment', 0)
    expect(oscillator.start).toHaveBeenCalledTimes(4)
  })

  it('spielt nach einer Berührung einen eigenen Abzeichenklang', async () => {
    const { context, oscillator } = contextMock()
    Object.defineProperty(window, 'AudioContext', {
      configurable: true,
      value: vi.fn(function AudioContextStub() {
        return context
      }),
    })
    await expect(playMagicSound('badge')).resolves.toBe(true)
    expect(oscillator.start).toHaveBeenCalledTimes(4)
  })
})
