import type { MissionCategory } from '../../domain'

export type MagicSound = 'mission-start' | 'step-success' | 'mission-success' | 'badge'

type SafariWindow = typeof window & { webkitAudioContext?: typeof AudioContext }

const CATEGORY_ROOTS: Record<MissionCategory, number> = {
  getraenk: 220,
  basteln: 196,
  experiment: 174.6,
  foto: 261.6,
  schwestern: 233.1,
}

let effectsContext: AudioContext | undefined

export function audioContextClass(): typeof AudioContext | undefined {
  if (typeof window === 'undefined') return undefined
  return window.AudioContext ?? (window as SafariWindow).webkitAudioContext
}

export function scheduleMagicTone(
  context: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine',
) {
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = type
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.08, duration / 3))
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain).connect(context.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.03)
}

export function playAtmosphereBeat(context: AudioContext, category: MissionCategory, beat: number) {
  const root = CATEGORY_ROOTS[category]
  const patterns: Record<MissionCategory, number[]> = {
    getraenk: [1, 1.5, 2, 1.25, 1.875, 1.5],
    basteln: [1, 4 / 3, 5 / 3, 2, 5 / 3, 4 / 3],
    experiment: [1, 1.498, 1.782, 2.378, 1.498, 2],
    foto: [1, 1.25, 1.5, 2, 1.5, 2.5],
    schwestern: [1, 1.5, 2, 3, 2, 1.5],
  }
  const note = root * patterns[category][beat % patterns[category].length]!
  const now = context.currentTime

  scheduleMagicTone(context, note, now, 1.1, 0.055, 'triangle')
  scheduleMagicTone(context, note * 2.01, now + 0.13, 0.55, 0.022, 'sine')

  // Ein leiser, langer Grundton macht die Schleife geheimnisvoll statt hektisch.
  if (beat % 4 === 0) {
    scheduleMagicTone(context, root / 2, now, 4.5, 0.026, 'sine')
    scheduleMagicTone(context, root * 0.749, now + 0.04, 4.1, 0.014, 'triangle')
  }
}

export async function playMagicSound(
  sound: MagicSound,
  category: MissionCategory = 'experiment',
): Promise<boolean> {
  const Context = audioContextClass()
  if (!Context) return false
  try {
    const context = effectsContext ?? new Context()
    effectsContext = context
    if (context.state === 'suspended') await context.resume()
    if (context.state !== 'running') return false
    const root = CATEGORY_ROOTS[category]
    const now = context.currentTime
    const notes: Record<MagicSound, Array<[number, number, number, number]>> = {
      'mission-start': [
        [root, 0, 0.55, 0.07],
        [root * 1.5, 0.16, 0.7, 0.065],
        [root * 2, 0.34, 0.9, 0.055],
      ],
      'step-success': [
        [root * 2, 0, 0.18, 0.055],
        [root * 3, 0.08, 0.28, 0.045],
      ],
      'mission-success': [
        [root, 0, 0.42, 0.07],
        [root * 1.5, 0.12, 0.55, 0.07],
        [root * 2, 0.25, 0.72, 0.07],
        [root * 3, 0.43, 1.1, 0.06],
      ],
      badge: [
        [root * 1.5, 0, 0.55, 0.065],
        [root * 2, 0.13, 0.7, 0.065],
        [root * 3, 0.31, 1.15, 0.06],
        [root * 4, 0.5, 1.25, 0.045],
      ],
    }
    notes[sound].forEach(([ratio, offset, duration, volume], index) =>
      scheduleMagicTone(
        context,
        ratio,
        now + offset,
        duration,
        volume,
        index % 2 === 0 ? 'sine' : 'triangle',
      ),
    )
    return true
  } catch {
    effectsContext = undefined
    return false
  }
}
