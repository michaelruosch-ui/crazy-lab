import { describe, expect, it } from 'vitest'
import { missions } from '../data/missions'
import { GENERATED_TRANSLATIONS } from './generatedTranslations'
import { translateGeneratedText } from '.'

function visibleTexts(value: unknown): string[] {
  if (typeof value === 'string') {
    const text = value.trim()
    if (text.length < 2 || /^[a-zA-Z0-9_.:/-]+$/.test(text)) return []
    if (/^\d+\s*(ml|g|kg|cm|m|min)$/i.test(text)) return []
    return /[A-Za-zÄÖÜäöüßÀ-ÿ]/.test(text) ? [text] : []
  }
  if (Array.isArray(value)) return value.flatMap(visibleTexts)
  if (value && typeof value === 'object') return Object.values(value).flatMap(visibleTexts)
  return []
}

describe('Vollständige redaktionelle Übersetzungen', () => {
  it.each(['en', 'fr', 'es', 'it'] as const)(
    'übersetzt alle Missionsinhalte nach %s',
    (language) => {
      const missing = [...new Set(visibleTexts(missions))].filter(
        (text) => translateGeneratedText(text, language) === text,
      )
      expect(missing).toEqual([])
    },
  )

  it('enthält einen vollständigen, fest eingebauten Oberflächenkatalog', () => {
    const sizes = Object.values(GENERATED_TRANSLATIONS).map(
      (dictionary) => Object.keys(dictionary).length,
    )
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(1129)
    expect(new Set(sizes).size).toBe(1)
  })
})
