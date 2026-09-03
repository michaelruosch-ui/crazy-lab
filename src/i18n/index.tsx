/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import type { AppLanguage } from '../domain'
import { GENERATED_TRANSLATIONS } from './generatedTranslations'

export const LANGUAGE_OPTIONS: Array<{ value: AppLanguage; label: string; short: string }> = [
  { value: 'de', label: 'Deutsch', short: 'DE' },
  { value: 'en', label: 'English', short: 'EN' },
  { value: 'fr', label: 'Français', short: 'FR' },
  { value: 'es', label: 'Español', short: 'ES' },
  { value: 'it', label: 'Italiano', short: 'IT' },
]

const translations = {
  de: {
    language: 'Sprache',
    navigation: 'Labornavigation',
    start: 'Start',
    customMissions: 'Eigene Missionen',
    shoppingList: 'Einkaufsliste',
    labCabinet: 'Laborschrank',
    saved: 'Gemerkt',
    history: 'Verlauf',
    diary: 'Tagebuch',
    profile: 'Profil',
    profileLanguageTitle: '🌐 Sprache der App',
    profileLanguageHint: 'Die Auswahl gilt für dieses Profil und kann jederzeit geändert werden.',
    originalLanguageHint: 'Eigene und geteilte Missionen bleiben in ihrer Originalsprache.',
  },
  en: {
    language: 'Language',
    navigation: 'Lab navigation',
    start: 'Home',
    customMissions: 'My missions',
    shoppingList: 'Shopping list',
    labCabinet: 'Lab cabinet',
    saved: 'Saved',
    history: 'History',
    diary: 'Diary',
    profile: 'Profile',
    profileLanguageTitle: '🌐 App language',
    profileLanguageHint: 'This choice is saved for this profile and can be changed at any time.',
    originalLanguageHint: 'Your own and shared missions remain in their original language.',
  },
  fr: {
    language: 'Langue',
    navigation: 'Navigation du labo',
    start: 'Accueil',
    customMissions: 'Mes missions',
    shoppingList: 'Liste de courses',
    labCabinet: 'Armoire du labo',
    saved: 'Enregistrées',
    history: 'Historique',
    diary: 'Journal',
    profile: 'Profil',
    profileLanguageTitle: "🌐 Langue de l'application",
    profileLanguageHint:
      'Ce choix est enregistré pour ce profil et peut être modifié à tout moment.',
    originalLanguageHint:
      'Vos propres missions et les missions partagées restent dans leur langue originale.',
  },
  es: {
    language: 'Idioma',
    navigation: 'Navegación del laboratorio',
    start: 'Inicio',
    customMissions: 'Mis misiones',
    shoppingList: 'Lista de compras',
    labCabinet: 'Armario del laboratorio',
    saved: 'Guardadas',
    history: 'Historial',
    diary: 'Diario',
    profile: 'Perfil',
    profileLanguageTitle: '🌐 Idioma de la app',
    profileLanguageHint:
      'Esta opción se guarda para este perfil y se puede cambiar en cualquier momento.',
    originalLanguageHint:
      'Tus propias misiones y las misiones compartidas permanecen en su idioma original.',
  },
  it: {
    language: 'Lingua',
    navigation: 'Navigazione del laboratorio',
    start: 'Home',
    customMissions: 'Le mie missioni',
    shoppingList: 'Lista della spesa',
    labCabinet: 'Armadio del laboratorio',
    saved: 'Salvate',
    history: 'Cronologia',
    diary: 'Diario',
    profile: 'Profilo',
    profileLanguageTitle: "🌐 Lingua dell'app",
    profileLanguageHint:
      'Questa scelta viene salvata per il profilo e può essere modificata in qualsiasi momento.',
    originalLanguageHint: 'Le missioni proprie e condivise rimangono nella loro lingua originale.',
  },
} as const

export type TranslationKey = keyof (typeof translations)['de']

interface LanguageContextValue {
  language: AppLanguage
  t: (key: TranslationKey) => string
  setLanguage: (language: AppLanguage) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'de',
  t: (key) => translations.de[key],
  setLanguage: () => undefined,
})

export function LanguageProvider({
  language,
  onLanguageChange,
  children,
}: {
  language: AppLanguage
  onLanguageChange: (language: AppLanguage) => void
  children: ReactNode
}) {
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: (key) => translations[language][key],
        setLanguage: onLanguageChange,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

const TRANSLATABLE_ATTRIBUTES = ['aria-label', 'placeholder', 'title', 'alt'] as const

function preserveWhitespace(original: string, replacement: string) {
  return original.replace(original.trim(), replacement)
}

const phraseEntries = new Map<AppLanguage, Array<readonly [string, string]>>()

export function translateGeneratedText(original: string, language: AppLanguage): string {
  if (language === 'de' || !original.trim()) return original
  const dictionary = GENERATED_TRANSLATIONS[language]
  const exact = dictionary[original.trim() as keyof typeof dictionary]
  if (exact) return preserveWhitespace(original, exact)

  let entries = phraseEntries.get(language)
  if (!entries) {
    entries = Object.entries(dictionary)
      .filter(([source]) => source.length >= 4)
      .sort(([left], [right]) => right.length - left.length)
    phraseEntries.set(language, entries)
  }
  let translated = original
  for (const [source, replacement] of entries) {
    if (translated.includes(source)) translated = translated.split(source).join(replacement)
  }
  return translated
}

export function LocalizedContent({ children }: { children: ReactNode }) {
  const { language } = useLanguage()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || language === 'de') return
    const localizedValues = new WeakMap<Node, string>()

    const translateNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const original = node.textContent ?? ''
        if (localizedValues.get(node) === original) return
        const translated = translateGeneratedText(original, language)
        if (translated !== original) {
          localizedValues.set(node, translated)
          node.textContent = translated
        }
        return
      }
      if (!(node instanceof Element)) return
      for (const attribute of TRANSLATABLE_ATTRIBUTES) {
        const original = node.getAttribute(attribute)
        if (!original) continue
        const translated = translateGeneratedText(original, language)
        if (translated !== original) node.setAttribute(attribute, translated)
      }
    }

    const translateTree = (node: Node) => {
      translateNode(node)
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) translateNode(walker.currentNode)
    }

    translateTree(root)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') translateNode(mutation.target)
        for (const node of mutation.addedNodes) translateTree(node)
      }
    })
    observer.observe(root, { childList: true, characterData: true, subtree: true })
    return () => observer.disconnect()
  }, [language])

  return (
    <div ref={rootRef} className="localized-content">
      {children}
    </div>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
