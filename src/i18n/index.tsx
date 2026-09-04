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

const SPRINT_TRANSLATIONS: Record<Exclude<AppLanguage, 'de'>, Record<string, string>> = {
  en: {
    '✨ Wissenskarte:': '✨ Knowledge card:',
    '🏅 Deine Forscher-Abzeichen': '🏅 Your research badges',
    '👀 Alle': '👀 View all',
    '🧰 Missionen, für die ich alles zu Hause habe': '🧰 Missions I have everything for at home',
    'Das ist der letzte Schritt!': 'This is the final step!',
    'Direkt zum Inhalt': 'Skip to content',
    'Meine Vermutung vor dem Start': 'My prediction before starting',
    'Schritte vorher anschauen': 'Preview the steps',
    'Technische Hinweise für Erwachsene': 'Technical details for adults',
    übrig: 'remaining',
    'Huch, ein Labor-Kobold war da!': 'Oops, a lab goblin was here!',
    'Magisch erforscht!': 'Magically researched!',
    'Noch keines freigeschaltet – deine Forschung hat begonnen!':
      'None unlocked yet – your research has begun!',
    'Geschmack und Farben': 'Taste and colours',
    'Kreative Erfindungen': 'Creative inventions',
    'Licht und Fotografie': 'Light and photography',
    'Wissenschaft entdecken': 'Discover science',
    'Der neue Zuhause-Knopf zeigt Missionen, für die alles bereitliegt.':
      'The new home button shows missions for which everything is ready.',
    'Vor einer Mission kannst du alle Schritte auf einmal anschauen.':
      'You can preview all the steps before a mission.',
    'Im Laborschrank tippst du ein Material an, um alle Einstellungen zu öffnen.':
      'Tap a material in the lab cabinet to open all its settings.',
    'Mit der Weltkugel kannst du die Sprache jederzeit ändern.':
      'Use the globe to change the language at any time.',
    'Dein Eintrag ist noch da. Tippe nochmals, dann versuchen wir das Speichern erneut.':
      'Your entry is still here. Tap again and we will try saving it once more.',
    'Dieses Gerät kann die Labormusik leider nicht abspielen.':
      'Unfortunately, this device cannot play the lab music.',
    'Die Musik konnte nicht starten. Prüfe die Lautstärke und versuche es noch einmal.':
      'The music could not start. Check the volume and try again.',
    '🔒 Elenas Missionswerkstatt': "🔒 Elena's mission workshop",
    'Die Missionswerkstatt gehört Elena als Product Owner. Du kannst veröffentlichte Missionen spielen.':
      'The mission workshop belongs to Elena as Product Owner. You can play published missions.',
    'Nur Elena darf als Product Owner neue Crazy-Lab-Missionen erstellen und bearbeiten.':
      'Only Elena can create and edit new Crazy Lab missions as Product Owner.',
    'Nur Elena darf als Product Owner Missionen in Crazy Lab aufnehmen. Veröffentlichte Missionen erscheinen später automatisch für alle Spielerinnen und Spieler.':
      'Only Elena can add missions to Crazy Lab as Product Owner. Published missions will later appear automatically for all players.',
    '🧪 Privaten Testlink senden': '🧪 Send private test link',
    '🌍 Für alle veröffentlichen kommt mit dem gemeinsamen, geprüften Missionskatalog. Ein privater Testlink veröffentlicht noch nichts.':
      '🌍 Publishing for everyone will arrive with the shared, reviewed mission catalogue. A private test link does not publish anything yet.',
    'Privater Testlink geöffnet. Die Mission wurde noch nicht veröffentlicht.':
      'Private test link opened. The mission has not been published yet.',
    'Privater Testlink kopiert. Die Mission wurde noch nicht veröffentlicht.':
      'Private test link copied. The mission has not been published yet.',
  },
  fr: {
    '✨ Wissenskarte:': '✨ Carte de savoir :',
    '🏅 Deine Forscher-Abzeichen': '🏅 Tes badges de recherche',
    '👀 Alle': '👀 Voir toutes les étapes',
    '🧰 Missionen, für die ich alles zu Hause habe':
      '🧰 Missions pour lesquelles j’ai tout à la maison',
    'Das ist der letzte Schritt!': 'C’est la dernière étape !',
    'Direkt zum Inhalt': 'Aller directement au contenu',
    'Meine Vermutung vor dem Start': 'Mon hypothèse avant de commencer',
    'Schritte vorher anschauen': 'Voir les étapes à l’avance',
    'Technische Hinweise für Erwachsene': 'Détails techniques pour les adultes',
    übrig: 'restantes',
    'Huch, ein Labor-Kobold war da!': 'Oups, un lutin du labo est passé !',
    'Magisch erforscht!': 'Recherche magique terminée !',
    'Noch keines freigeschaltet – deine Forschung hat begonnen!':
      'Aucun badge débloqué – tes recherches commencent !',
    'Geschmack und Farben': 'Goûts et couleurs',
    'Kreative Erfindungen': 'Inventions créatives',
    'Licht und Fotografie': 'Lumière et photographie',
    'Wissenschaft entdecken': 'Découvrir les sciences',
    'Der neue Zuhause-Knopf zeigt Missionen, für die alles bereitliegt.':
      'Le nouveau bouton Maison affiche les missions pour lesquelles tout est prêt.',
    'Vor einer Mission kannst du alle Schritte auf einmal anschauen.':
      'Tu peux voir toutes les étapes avant une mission.',
    'Im Laborschrank tippst du ein Material an, um alle Einstellungen zu öffnen.':
      'Touche un matériel dans l’armoire du labo pour ouvrir ses réglages.',
    'Mit der Weltkugel kannst du die Sprache jederzeit ändern.':
      'Utilise le globe pour changer de langue à tout moment.',
    'Dein Eintrag ist noch da. Tippe nochmals, dann versuchen wir das Speichern erneut.':
      'Ton entrée est toujours là. Appuie encore une fois pour réessayer de l’enregistrer.',
    'Dieses Gerät kann die Labormusik leider nicht abspielen.':
      'Cet appareil ne peut malheureusement pas jouer la musique du labo.',
    'Die Musik konnte nicht starten. Prüfe die Lautstärke und versuche es noch einmal.':
      'La musique n’a pas pu démarrer. Vérifie le volume et réessaie.',
    '🔒 Elenas Missionswerkstatt': '🔒 L’atelier de missions d’Elena',
    'Die Missionswerkstatt gehört Elena als Product Owner. Du kannst veröffentlichte Missionen spielen.':
      'L’atelier de missions appartient à Elena en tant que Product Owner. Tu peux jouer aux missions publiées.',
    'Nur Elena darf als Product Owner neue Crazy-Lab-Missionen erstellen und bearbeiten.':
      'Seule Elena peut créer et modifier de nouvelles missions Crazy Lab en tant que Product Owner.',
    'Nur Elena darf als Product Owner Missionen in Crazy Lab aufnehmen. Veröffentlichte Missionen erscheinen später automatisch für alle Spielerinnen und Spieler.':
      'Seule Elena peut ajouter des missions à Crazy Lab en tant que Product Owner. Les missions publiées apparaîtront ensuite automatiquement pour tout le monde.',
    '🧪 Privaten Testlink senden': '🧪 Envoyer un lien de test privé',
    '🌍 Für alle veröffentlichen kommt mit dem gemeinsamen, geprüften Missionskatalog. Ein privater Testlink veröffentlicht noch nichts.':
      '🌍 La publication pour tout le monde arrivera avec le catalogue commun et vérifié. Un lien de test privé ne publie encore rien.',
    'Privater Testlink geöffnet. Die Mission wurde noch nicht veröffentlicht.':
      'Lien de test privé ouvert. La mission n’est pas encore publiée.',
    'Privater Testlink kopiert. Die Mission wurde noch nicht veröffentlicht.':
      'Lien de test privé copié. La mission n’est pas encore publiée.',
  },
  es: {
    '✨ Wissenskarte:': '✨ Tarjeta de conocimientos:',
    '🏅 Deine Forscher-Abzeichen': '🏅 Tus insignias de investigación',
    '👀 Alle': '👀 Ver todos los pasos',
    '🧰 Missionen, für die ich alles zu Hause habe': '🧰 Misiones para las que tengo todo en casa',
    'Das ist der letzte Schritt!': '¡Este es el último paso!',
    'Direkt zum Inhalt': 'Ir directamente al contenido',
    'Meine Vermutung vor dem Start': 'Mi predicción antes de empezar',
    'Schritte vorher anschauen': 'Ver los pasos antes',
    'Technische Hinweise für Erwachsene': 'Detalles técnicos para adultos',
    übrig: 'restantes',
    'Huch, ein Labor-Kobold war da!': '¡Uy, ha pasado un duende del laboratorio!',
    'Magisch erforscht!': '¡Investigado mágicamente!',
    'Noch keines freigeschaltet – deine Forschung hat begonnen!':
      'Aún no hay insignias: ¡tu investigación ha comenzado!',
    'Geschmack und Farben': 'Sabores y colores',
    'Kreative Erfindungen': 'Inventos creativos',
    'Licht und Fotografie': 'Luz y fotografía',
    'Wissenschaft entdecken': 'Descubrir la ciencia',
    'Der neue Zuhause-Knopf zeigt Missionen, für die alles bereitliegt.':
      'El nuevo botón Casa muestra misiones para las que todo está listo.',
    'Vor einer Mission kannst du alle Schritte auf einmal anschauen.':
      'Puedes ver todos los pasos antes de una misión.',
    'Im Laborschrank tippst du ein Material an, um alle Einstellungen zu öffnen.':
      'Toca un material del armario del laboratorio para abrir sus ajustes.',
    'Mit der Weltkugel kannst du die Sprache jederzeit ändern.':
      'Usa el globo para cambiar el idioma cuando quieras.',
    'Dein Eintrag ist noch da. Tippe nochmals, dann versuchen wir das Speichern erneut.':
      'Tu entrada sigue aquí. Toca otra vez e intentaremos guardarla de nuevo.',
    'Dieses Gerät kann die Labormusik leider nicht abspielen.':
      'Este dispositivo no puede reproducir la música del laboratorio.',
    'Die Musik konnte nicht starten. Prüfe die Lautstärke und versuche es noch einmal.':
      'La música no pudo comenzar. Comprueba el volumen e inténtalo de nuevo.',
    '🔒 Elenas Missionswerkstatt': '🔒 El taller de misiones de Elena',
    'Die Missionswerkstatt gehört Elena als Product Owner. Du kannst veröffentlichte Missionen spielen.':
      'El taller de misiones pertenece a Elena como Product Owner. Puedes jugar a las misiones publicadas.',
    'Nur Elena darf als Product Owner neue Crazy-Lab-Missionen erstellen und bearbeiten.':
      'Solo Elena puede crear y editar nuevas misiones de Crazy Lab como Product Owner.',
    'Nur Elena darf als Product Owner Missionen in Crazy Lab aufnehmen. Veröffentlichte Missionen erscheinen später automatisch für alle Spielerinnen und Spieler.':
      'Solo Elena puede añadir misiones a Crazy Lab como Product Owner. Las misiones publicadas aparecerán después automáticamente para todo el mundo.',
    '🧪 Privaten Testlink senden': '🧪 Enviar enlace de prueba privado',
    '🌍 Für alle veröffentlichen kommt mit dem gemeinsamen, geprüften Missionskatalog. Ein privater Testlink veröffentlicht noch nichts.':
      '🌍 La publicación para todos llegará con el catálogo común y revisado. Un enlace de prueba privado todavía no publica nada.',
    'Privater Testlink geöffnet. Die Mission wurde noch nicht veröffentlicht.':
      'Enlace de prueba privado abierto. La misión todavía no se ha publicado.',
    'Privater Testlink kopiert. Die Mission wurde noch nicht veröffentlicht.':
      'Enlace de prueba privado copiado. La misión todavía no se ha publicado.',
  },
  it: {
    '✨ Wissenskarte:': '✨ Scheda delle conoscenze:',
    '🏅 Deine Forscher-Abzeichen': '🏅 I tuoi distintivi di ricerca',
    '👀 Alle': '👀 Guarda tutti i passaggi',
    '🧰 Missionen, für die ich alles zu Hause habe': '🧰 Missioni per cui ho tutto a casa',
    'Das ist der letzte Schritt!': 'Questo è l’ultimo passaggio!',
    'Direkt zum Inhalt': 'Vai direttamente al contenuto',
    'Meine Vermutung vor dem Start': 'La mia previsione prima di iniziare',
    'Schritte vorher anschauen': 'Guarda prima i passaggi',
    'Technische Hinweise für Erwachsene': 'Dettagli tecnici per adulti',
    übrig: 'rimanenti',
    'Huch, ein Labor-Kobold war da!': 'Ops, è passato un folletto del laboratorio!',
    'Magisch erforscht!': 'Ricerca magica completata!',
    'Noch keines freigeschaltet – deine Forschung hat begonnen!':
      'Ancora nessun distintivo: la tua ricerca è iniziata!',
    'Geschmack und Farben': 'Sapori e colori',
    'Kreative Erfindungen': 'Invenzioni creative',
    'Licht und Fotografie': 'Luce e fotografia',
    'Wissenschaft entdecken': 'Scoprire la scienza',
    'Der neue Zuhause-Knopf zeigt Missionen, für die alles bereitliegt.':
      'Il nuovo pulsante Casa mostra le missioni per cui è tutto pronto.',
    'Vor einer Mission kannst du alle Schritte auf einmal anschauen.':
      'Puoi vedere tutti i passaggi prima di una missione.',
    'Im Laborschrank tippst du ein Material an, um alle Einstellungen zu öffnen.':
      'Tocca un materiale nell’armadio del laboratorio per aprire le impostazioni.',
    'Mit der Weltkugel kannst du die Sprache jederzeit ändern.':
      'Usa il globo per cambiare lingua in qualsiasi momento.',
    'Dein Eintrag ist noch da. Tippe nochmals, dann versuchen wir das Speichern erneut.':
      'La tua voce è ancora qui. Tocca di nuovo e proveremo a salvarla ancora una volta.',
    'Dieses Gerät kann die Labormusik leider nicht abspielen.':
      'Questo dispositivo non può riprodurre la musica del laboratorio.',
    'Die Musik konnte nicht starten. Prüfe die Lautstärke und versuche es noch einmal.':
      'La musica non è partita. Controlla il volume e riprova.',
    '🔒 Elenas Missionswerkstatt': '🔒 Il laboratorio delle missioni di Elena',
    'Die Missionswerkstatt gehört Elena als Product Owner. Du kannst veröffentlichte Missionen spielen.':
      'Il laboratorio delle missioni appartiene a Elena come Product Owner. Puoi giocare alle missioni pubblicate.',
    'Nur Elena darf als Product Owner neue Crazy-Lab-Missionen erstellen und bearbeiten.':
      'Solo Elena può creare e modificare nuove missioni Crazy Lab come Product Owner.',
    'Nur Elena darf als Product Owner Missionen in Crazy Lab aufnehmen. Veröffentlichte Missionen erscheinen später automatisch für alle Spielerinnen und Spieler.':
      'Solo Elena può aggiungere missioni a Crazy Lab come Product Owner. Le missioni pubblicate appariranno poi automaticamente per tutti.',
    '🧪 Privaten Testlink senden': '🧪 Invia link di prova privato',
    '🌍 Für alle veröffentlichen kommt mit dem gemeinsamen, geprüften Missionskatalog. Ein privater Testlink veröffentlicht noch nichts.':
      '🌍 La pubblicazione per tutti arriverà con il catalogo comune e verificato. Un link di prova privato non pubblica ancora nulla.',
    'Privater Testlink geöffnet. Die Mission wurde noch nicht veröffentlicht.':
      'Link di prova privato aperto. La missione non è ancora pubblicata.',
    'Privater Testlink kopiert. Die Mission wurde noch nicht veröffentlicht.':
      'Link di prova privato copiato. La missione non è ancora pubblicata.',
  },
}

function preserveWhitespace(original: string, replacement: string) {
  return original.replace(original.trim(), replacement)
}

const phraseEntries = new Map<AppLanguage, Array<readonly [string, string]>>()

export function translateGeneratedText(original: string, language: AppLanguage): string {
  if (language === 'de' || !original.trim()) return original
  const sprintTranslation = SPRINT_TRANSLATIONS[language][original.trim()]
  if (sprintTranslation) return preserveWhitespace(original, sprintTranslation)
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
