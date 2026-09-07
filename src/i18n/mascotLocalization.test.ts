import { describe, expect, it } from 'vitest'
import { MASCOT_CATALOG } from '../components/mascotArt'
import type { AppLanguage } from '../domain'
import { translateGeneratedText } from './index'

describe('Maskottchennamen in allen App-Sprachen', () => {
  for (const language of ['en', 'fr', 'es', 'it'] satisfies AppLanguage[]) {
    it(`übersetzt alle Namen nach ${language}`, () => {
      const untranslated = MASCOT_CATALOG.map((entry) => entry.name).filter(
        (name) => translateGeneratedText(name, language) === name,
      )
      expect(untranslated).toEqual([])
    })
  }
})
