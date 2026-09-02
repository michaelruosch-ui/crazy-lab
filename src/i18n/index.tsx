/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react'
import type { AppLanguage } from '../domain'

export const LANGUAGE_OPTIONS: Array<{ value: AppLanguage; label: string; short: string }> = [
  { value: 'de', label: 'Deutsch', short: 'DE' },
  { value: 'en', label: 'English', short: 'EN' },
  { value: 'fr', label: 'Français', short: 'FR' },
  { value: 'es', label: 'Español', short: 'ES' },
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

export function useLanguage() {
  return useContext(LanguageContext)
}
