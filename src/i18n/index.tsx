/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react'
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
    badges: 'Abzeichen',
    profile: 'Profil',
    profileLanguageTitle: '🌐 Sprache der App',
    profileLanguageHint: 'Die Auswahl gilt für dieses Profil und kann jederzeit geändert werden.',
    originalLanguageHint: 'Eigene und geteilte Missionen bleiben in ihrer Originalsprache.',
    profileTitle: '👤 Dein Profil',
    currentResearcher: 'Wer forscht gerade?',
    profileSeparationHint:
      'Jede Person hat ein eigenes Tagebuch, eigene Missionen und eigene Listen.',
    addPerson: '➕ Neue Person anlegen',
    researcherName: 'Forschername',
    mascot: 'Maskottchen',
    birthdays: 'Geburtstage',
    birthdaysHint:
      'Trage Geburtstage ein – dann erscheint an diesem Tag eine besondere Geburtstagsmission.',
    remove: 'Entfernen',
    name: 'Name',
    month: 'Monat',
    day: 'Tag',
    addBirthday: 'Geburtstag hinzufügen',
    chooseMascot: 'Maskottchen auswählen',
    mascotPickerHint: 'Scrolle durch alle 33 Entwürfe und tippe deinen Favoriten an.',
    labTip: 'Labor-Tipp:',
    understood: 'Verstanden',
    load: 'Laden',
    minuteShort: 'Min.',
    difficultyEasy: 'Leicht',
    difficultyMedium: 'Mittel',
    difficultyHard: 'Schwer',
    ingredient: 'Zutat',
    ingredients: 'Zutaten',
    material: 'Material',
    materials: 'Materialien',
    approximateMaterialCost: 'Material ca.',
    safetySafe: 'Sicher',
    safetyCaution: 'Mit Vorsicht',
    safetyAdultsOnly: 'Nur mit Erwachsenen',
    publicationReadyMessage:
      '„{title}“ ist für die Qualitätsprüfung und das nächste App-Update freigegeben.',
    speciesBear: 'Bär',
    speciesMarmot: 'Murmeltier',
    speciesRaccoon: 'Waschbär',
    speciesWolf: 'Wolf',
    speciesBat: 'Fledermaus',
    speciesOwl: 'Eule',
    speciesFrog: 'Frosch',
    speciesSpider: 'Spinnenwesen',
    fullVersionEyebrow: 'Geheime Vollversion',
    fullVersionDescription:
      'Diese Mission gehört zum grossen Crazy Lab. Eine erwachsene Person kann alle Missionen einmalig freischalten – ohne Abo, Werbung oder Tracking.',
    fullVersionPermanent: 'Danach dauerhaft mit demselben Apple-Konto nutzbar.',
    fullVersionUnlock: '🔓 Ganzes Crazy Lab freischalten',
    restorePurchase: 'Früheren Kauf wiederherstellen',
    freeMissionsHint:
      'Die sechs Startmissionen bleiben gratis. Käufe sind nur in der App-Store-App nötig; eure bisherige Familien-Testversion bleibt vollständig offen.',
    storeUnavailable:
      'Der App Store ist gerade nicht erreichbar. Deine kostenlosen Missionen funktionieren trotzdem.',
    purchaseSuccess: '🎉 Das ganze Crazy Lab ist jetzt dauerhaft freigeschaltet!',
    restoreSuccess: '✅ Dein früherer Kauf wurde wiederhergestellt.',
    restoreEmpty: 'Zu diesem Apple-Konto wurde noch kein Kauf gefunden.',
    freeLabel: 'GRATIS',
    purchaseGateReason:
      'Alle Missionen sollen einmalig über den Apple App Store freigeschaltet werden.',
    restoreGateReason: 'Ein früherer Kauf soll mit dem Apple-Konto wiederhergestellt werden.',
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
    badges: 'Badges',
    profile: 'Profile',
    profileLanguageTitle: '🌐 App language',
    profileLanguageHint: 'This choice is saved for this profile and can be changed at any time.',
    originalLanguageHint: 'Your own and shared missions remain in their original language.',
    profileTitle: '👤 Your profile',
    currentResearcher: 'Who is experimenting?',
    profileSeparationHint: 'Each person has their own diary, missions and lists.',
    addPerson: '➕ Add another person',
    researcherName: 'Researcher name',
    mascot: 'Mascot',
    birthdays: 'Birthdays',
    birthdaysHint: 'Add birthdays and a special birthday mission will appear on that day.',
    remove: 'Remove',
    name: 'Name',
    month: 'Month',
    day: 'Day',
    addBirthday: 'Add birthday',
    chooseMascot: 'Choose a mascot',
    mascotPickerHint: 'Scroll through all 33 designs and tap your favourite.',
    labTip: 'Lab tip:',
    understood: 'Got it',
    load: 'Load',
    minuteShort: 'min',
    difficultyEasy: 'Easy',
    difficultyMedium: 'Medium',
    difficultyHard: 'Hard',
    ingredient: 'ingredient',
    ingredients: 'ingredients',
    material: 'material',
    materials: 'materials',
    approximateMaterialCost: 'Materials approx.',
    safetySafe: 'Safe',
    safetyCaution: 'Use caution',
    safetyAdultsOnly: 'Adults only',
    publicationReadyMessage: '“{title}” is approved for quality review and the next app update.',
    speciesBear: 'Bear',
    speciesMarmot: 'Marmot',
    speciesRaccoon: 'Raccoon',
    speciesWolf: 'Wolf',
    speciesBat: 'Bat',
    speciesOwl: 'Owl',
    speciesFrog: 'Frog',
    speciesSpider: 'Spider creature',
    fullVersionEyebrow: 'Secret full version',
    fullVersionDescription:
      'This mission belongs to the big Crazy Lab. An adult can unlock every mission with one purchase – with no subscription, ads or tracking.',
    fullVersionPermanent: 'Then it stays available with the same Apple Account.',
    fullVersionUnlock: '🔓 Unlock the whole Crazy Lab',
    restorePurchase: 'Restore an earlier purchase',
    freeMissionsHint:
      'The six starter missions stay free. Purchases are only needed in the App Store app; your existing family test version remains fully open.',
    storeUnavailable: 'The App Store is not reachable right now. Your free missions still work.',
    purchaseSuccess: '🎉 The whole Crazy Lab is now permanently unlocked!',
    restoreSuccess: '✅ Your earlier purchase has been restored.',
    restoreEmpty: 'No purchase was found for this Apple Account yet.',
    freeLabel: 'FREE',
    purchaseGateReason: 'All missions are about to be unlocked with one Apple App Store purchase.',
    restoreGateReason: 'An earlier purchase is about to be restored with the Apple Account.',
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
    badges: 'Badges',
    profile: 'Profil',
    profileLanguageTitle: "🌐 Langue de l'application",
    profileLanguageHint:
      'Ce choix est enregistré pour ce profil et peut être modifié à tout moment.',
    originalLanguageHint:
      'Vos propres missions et les missions partagées restent dans leur langue originale.',
    profileTitle: '👤 Ton profil',
    currentResearcher: 'Qui fait des recherches ?',
    profileSeparationHint: 'Chaque personne a son propre journal, ses missions et ses listes.',
    addPerson: '➕ Ajouter une personne',
    researcherName: 'Nom de chercheur',
    mascot: 'Mascotte',
    birthdays: 'Anniversaires',
    birthdaysHint: 'Ajoute les anniversaires : une mission spéciale apparaîtra ce jour-là.',
    remove: 'Supprimer',
    name: 'Nom',
    month: 'Mois',
    day: 'Jour',
    addBirthday: 'Ajouter un anniversaire',
    chooseMascot: 'Choisir une mascotte',
    mascotPickerHint: 'Fais défiler les 33 modèles et touche ton préféré.',
    labTip: 'Astuce du labo :',
    understood: 'J’ai compris',
    load: 'Charger',
    minuteShort: 'min',
    difficultyEasy: 'Facile',
    difficultyMedium: 'Moyenne',
    difficultyHard: 'Difficile',
    ingredient: 'ingrédient',
    ingredients: 'ingrédients',
    material: 'matériel',
    materials: 'matériaux',
    approximateMaterialCost: 'Matériel env.',
    safetySafe: 'Sûre',
    safetyCaution: 'Avec prudence',
    safetyAdultsOnly: 'Avec un adulte',
    publicationReadyMessage:
      '« {title} » est approuvée pour le contrôle qualité et la prochaine mise à jour.',
    speciesBear: 'Ours',
    speciesMarmot: 'Marmotte',
    speciesRaccoon: 'Raton laveur',
    speciesWolf: 'Loup',
    speciesBat: 'Chauve-souris',
    speciesOwl: 'Chouette',
    speciesFrog: 'Grenouille',
    speciesSpider: 'Créature araignée',
    fullVersionEyebrow: 'Version complète secrète',
    fullVersionDescription:
      'Cette mission fait partie du grand Crazy Lab. Un adulte peut débloquer toutes les missions en un seul achat, sans abonnement, publicité ni suivi.',
    fullVersionPermanent: 'Elle reste ensuite disponible avec le même compte Apple.',
    fullVersionUnlock: '🔓 Débloquer tout Crazy Lab',
    restorePurchase: 'Restaurer un achat précédent',
    freeMissionsHint:
      'Les six missions de départ restent gratuites. Un achat est nécessaire uniquement dans l’app de l’App Store ; votre version familiale de test reste entièrement ouverte.',
    storeUnavailable:
      'L’App Store est momentanément inaccessible. Tes missions gratuites fonctionnent quand même.',
    purchaseSuccess: '🎉 Tout Crazy Lab est maintenant débloqué pour toujours !',
    restoreSuccess: '✅ Ton achat précédent a été restauré.',
    restoreEmpty: 'Aucun achat n’a encore été trouvé pour ce compte Apple.',
    freeLabel: 'GRATUIT',
    purchaseGateReason:
      'Toutes les missions vont être débloquées par un achat unique sur l’App Store.',
    restoreGateReason: 'Un achat précédent va être restauré avec le compte Apple.',
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
    badges: 'Insignias',
    profile: 'Perfil',
    profileLanguageTitle: '🌐 Idioma de la app',
    profileLanguageHint:
      'Esta opción se guarda para este perfil y se puede cambiar en cualquier momento.',
    originalLanguageHint:
      'Tus propias misiones y las misiones compartidas permanecen en su idioma original.',
    profileTitle: '👤 Tu perfil',
    currentResearcher: '¿Quién está investigando?',
    profileSeparationHint: 'Cada persona tiene su propio diario, misiones y listas.',
    addPerson: '➕ Añadir persona',
    researcherName: 'Nombre de investigador',
    mascot: 'Mascota',
    birthdays: 'Cumpleaños',
    birthdaysHint: 'Añade cumpleaños y ese día aparecerá una misión especial.',
    remove: 'Eliminar',
    name: 'Nombre',
    month: 'Mes',
    day: 'Día',
    addBirthday: 'Añadir cumpleaños',
    chooseMascot: 'Elegir mascota',
    mascotPickerHint: 'Recorre los 33 diseños y toca tu favorito.',
    labTip: 'Consejo del laboratorio:',
    understood: 'Entendido',
    load: 'Cargar',
    minuteShort: 'min',
    difficultyEasy: 'Fácil',
    difficultyMedium: 'Media',
    difficultyHard: 'Difícil',
    ingredient: 'ingrediente',
    ingredients: 'ingredientes',
    material: 'material',
    materials: 'materiales',
    approximateMaterialCost: 'Material aprox.',
    safetySafe: 'Segura',
    safetyCaution: 'Con cuidado',
    safetyAdultsOnly: 'Solo con adultos',
    publicationReadyMessage:
      '«{title}» está aprobada para el control de calidad y la próxima actualización.',
    speciesBear: 'Oso',
    speciesMarmot: 'Marmota',
    speciesRaccoon: 'Mapache',
    speciesWolf: 'Lobo',
    speciesBat: 'Murciélago',
    speciesOwl: 'Búho',
    speciesFrog: 'Rana',
    speciesSpider: 'Criatura araña',
    fullVersionEyebrow: 'Versión completa secreta',
    fullVersionDescription:
      'Esta misión pertenece al gran Crazy Lab. Una persona adulta puede desbloquear todas las misiones con una sola compra, sin suscripción, anuncios ni seguimiento.',
    fullVersionPermanent: 'Después seguirá disponible con la misma cuenta de Apple.',
    fullVersionUnlock: '🔓 Desbloquear todo Crazy Lab',
    restorePurchase: 'Restaurar una compra anterior',
    freeMissionsHint:
      'Las seis misiones iniciales siguen siendo gratis. Solo hace falta comprar en la app del App Store; vuestra versión familiar de prueba sigue completamente abierta.',
    storeUnavailable:
      'Ahora mismo no se puede acceder al App Store. Tus misiones gratuitas siguen funcionando.',
    purchaseSuccess: '🎉 ¡Todo Crazy Lab está desbloqueado para siempre!',
    restoreSuccess: '✅ Se ha restaurado tu compra anterior.',
    restoreEmpty: 'Todavía no se ha encontrado ninguna compra para esta cuenta de Apple.',
    freeLabel: 'GRATIS',
    purchaseGateReason:
      'Todas las misiones se van a desbloquear con una sola compra en el App Store.',
    restoreGateReason: 'Se va a restaurar una compra anterior con la cuenta de Apple.',
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
    badges: 'Distintivi',
    profile: 'Profilo',
    profileLanguageTitle: "🌐 Lingua dell'app",
    profileLanguageHint:
      'Questa scelta viene salvata per il profilo e può essere modificata in qualsiasi momento.',
    originalLanguageHint: 'Le missioni proprie e condivise rimangono nella loro lingua originale.',
    profileTitle: '👤 Il tuo profilo',
    currentResearcher: 'Chi sta facendo ricerca?',
    profileSeparationHint: 'Ogni persona ha il proprio diario, le proprie missioni e liste.',
    addPerson: '➕ Aggiungi persona',
    researcherName: 'Nome da ricercatore',
    mascot: 'Mascotte',
    birthdays: 'Compleanni',
    birthdaysHint: 'Aggiungi i compleanni: quel giorno apparirà una missione speciale.',
    remove: 'Rimuovi',
    name: 'Nome',
    month: 'Mese',
    day: 'Giorno',
    addBirthday: 'Aggiungi compleanno',
    chooseMascot: 'Scegli una mascotte',
    mascotPickerHint: 'Scorri tutti i 33 modelli e tocca il tuo preferito.',
    labTip: 'Consiglio del laboratorio:',
    understood: 'Ho capito',
    load: 'Carica',
    minuteShort: 'min',
    difficultyEasy: 'Facile',
    difficultyMedium: 'Media',
    difficultyHard: 'Difficile',
    ingredient: 'ingrediente',
    ingredients: 'ingredienti',
    material: 'materiale',
    materials: 'materiali',
    approximateMaterialCost: 'Materiali ca.',
    safetySafe: 'Sicura',
    safetyCaution: 'Con cautela',
    safetyAdultsOnly: 'Solo con adulti',
    publicationReadyMessage:
      '“{title}” è approvata per il controllo qualità e il prossimo aggiornamento.',
    speciesBear: 'Orso',
    speciesMarmot: 'Marmotta',
    speciesRaccoon: 'Procione',
    speciesWolf: 'Lupo',
    speciesBat: 'Pipistrello',
    speciesOwl: 'Gufo',
    speciesFrog: 'Rana',
    speciesSpider: 'Creatura ragno',
    fullVersionEyebrow: 'Versione completa segreta',
    fullVersionDescription:
      'Questa missione fa parte del grande Crazy Lab. Un adulto può sbloccare tutte le missioni con un solo acquisto, senza abbonamento, pubblicità o tracciamento.',
    fullVersionPermanent: 'Poi resterà disponibile con lo stesso Apple Account.',
    fullVersionUnlock: '🔓 Sblocca tutto Crazy Lab',
    restorePurchase: 'Ripristina un acquisto precedente',
    freeMissionsHint:
      'Le sei missioni iniziali restano gratuite. Un acquisto serve solo nell’app dell’App Store; la vostra versione familiare di prova resta completamente aperta.',
    storeUnavailable:
      'L’App Store non è raggiungibile in questo momento. Le missioni gratuite funzionano comunque.',
    purchaseSuccess: '🎉 Tutto Crazy Lab è ora sbloccato per sempre!',
    restoreSuccess: '✅ Il tuo acquisto precedente è stato ripristinato.',
    restoreEmpty: 'Non è stato ancora trovato alcun acquisto per questo Apple Account.',
    freeLabel: 'GRATIS',
    purchaseGateReason: 'Tutte le missioni saranno sbloccate con un solo acquisto sull’App Store.',
    restoreGateReason: 'Un acquisto precedente sarà ripristinato con l’Apple Account.',
  },
} as const

export const APP_LOCALES: Record<AppLanguage, string> = {
  de: 'de-CH',
  en: 'en-GB',
  fr: 'fr-CH',
  es: 'es-ES',
  it: 'it-CH',
}

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
  const translate = useCallback((key: TranslationKey) => translations[language][key], [language])
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: translate,
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
    '🎨 Titelbild zusammenstellen': '🎨 Design the cover image',
    'Wähle einen Hintergrund, ein Symbol und die Stimmung deiner Mission.':
      'Choose a background, a symbol and the mood of your mission.',
    Hintergrund: 'Background',
    Symbol: 'Symbol',
    Stimmung: 'Mood',
    'Violettes Labor': 'Violet laboratory',
    'Türkiser Nebel': 'Turquoise mist',
    'Giftgrüner Schleim': 'Toxic green slime',
    'Blutroter Mond': 'Blood-red moon',
    'Goldener Zauber': 'Golden magic',
    'Geheimnisvolle Nacht': 'Mysterious night',
    Zaubertrank: 'Magic potion',
    Geist: 'Ghost',
    Monster: 'Monster',
    Mikroskop: 'Microscope',
    Kamera: 'Camera',
    Drache: 'Dragon',
    Mond: 'Moon',
    Zauberstab: 'Magic wand',
    Pflanze: 'Plant',
    Erfindung: 'Invention',
    Lustig: 'Funny',
    Gruselig: 'Spooky',
    Eklig: 'Yucky',
    Magisch: 'Magical',
    Geheimnisvoll: 'Mysterious',
    Niedlich: 'Cute',
    '🌍 Für alle freigeben': '🌍 Approve for everyone',
    '✅ Für das nächste App-Update freigegeben': '✅ Approved for the next app update',
    '🌍 Nur du kannst Missionen für alle freigeben. Vor dem nächsten App-Update werden Inhalt und Sicherheit noch einmal geprüft.':
      '🌍 Only you can approve missions for everyone. Content and safety are checked again before the next app update.',
    Zappelmurmel: 'Fidget Marmot',
    Mondmurmel: 'Moon Marmot',
    Nebelbandit: 'Fog Bandit',
    Glitzerbandit: 'Glitter Bandit',
    Mondwolf: 'Moon Wolf',
    Frostzahn: 'Frost Fang',
    Giftschnauze: 'Venom Snout',
    Nachtflatterer: 'Night Flutterer',
    Nachtwache: 'Night Watch',
    Mondauge: 'Moon Eye',
    Giftfeder: 'Venom Feather',
    Spinnenschatten: 'Spider Shadow',
    Giftspinne: 'Venom Spider',
    'Was passiert?': 'What happens?',
    Kategorie: 'Category',
    Basteln: 'Crafting',
    'Foto-Challenge': 'Photo challenge',
    'Schwestern-Mission': 'Sister mission',
    Minuten: 'Minutes',
    Sicherheitsstufe: 'Safety level',
    'Meine neue Mission, magisch': 'My new mission, magical',
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
    '🎨 Titelbild zusammenstellen': '🎨 Créer l’image de couverture',
    'Wähle einen Hintergrund, ein Symbol und die Stimmung deiner Mission.':
      'Choisis un arrière-plan, un symbole et l’ambiance de ta mission.',
    Hintergrund: 'Arrière-plan',
    Symbol: 'Symbole',
    Stimmung: 'Ambiance',
    'Violettes Labor': 'Laboratoire violet',
    'Türkiser Nebel': 'Brume turquoise',
    'Giftgrüner Schleim': 'Slime vert toxique',
    'Blutroter Mond': 'Lune rouge sang',
    'Goldener Zauber': 'Magie dorée',
    'Geheimnisvolle Nacht': 'Nuit mystérieuse',
    Zaubertrank: 'Potion magique',
    Geist: 'Fantôme',
    Monster: 'Monstre',
    Mikroskop: 'Microscope',
    Kamera: 'Appareil photo',
    Drache: 'Dragon',
    Mond: 'Lune',
    Zauberstab: 'Baguette magique',
    Pflanze: 'Plante',
    Erfindung: 'Invention',
    Lustig: 'Drôle',
    Gruselig: 'Effrayante',
    Eklig: 'Dégoûtante',
    Magisch: 'Magique',
    Geheimnisvoll: 'Mystérieuse',
    Niedlich: 'Mignonne',
    '🌍 Für alle freigeben': '🌍 Approuver pour tout le monde',
    '✅ Für das nächste App-Update freigegeben': '✅ Approuvée pour la prochaine mise à jour',
    '🌍 Nur du kannst Missionen für alle freigeben. Vor dem nächsten App-Update werden Inhalt und Sicherheit noch einmal geprüft.':
      '🌍 Toi seule peux approuver des missions pour tout le monde. Le contenu et la sécurité sont revérifiés avant la prochaine mise à jour.',
    Zappelmurmel: 'Marmotte gigoteuse',
    Mondmurmel: 'Marmotte lunaire',
    Nebelbandit: 'Bandit des brumes',
    Glitzerbandit: 'Bandit pailleté',
    Mondwolf: 'Loup lunaire',
    Frostzahn: 'Croc de givre',
    Giftschnauze: 'Museau venimeux',
    Nachtflatterer: 'Voltigeur nocturne',
    Nachtwache: 'Veilleuse nocturne',
    Mondauge: 'Œil de lune',
    Giftfeder: 'Plume venimeuse',
    Spinnenschatten: 'Ombre d’araignée',
    Giftspinne: 'Araignée venimeuse',
    'Was passiert?': 'Que va-t-il se passer ?',
    Kategorie: 'Catégorie',
    Basteln: 'Bricolage',
    'Foto-Challenge': 'Défi photo',
    'Schwestern-Mission': 'Mission entre sœurs',
    Minuten: 'Minutes',
    Sicherheitsstufe: 'Niveau de sécurité',
    'Meine neue Mission, magisch': 'Ma nouvelle mission, magique',
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
    '🎨 Titelbild zusammenstellen': '🎨 Diseñar la portada',
    'Wähle einen Hintergrund, ein Symbol und die Stimmung deiner Mission.':
      'Elige un fondo, un símbolo y el ambiente de tu misión.',
    Hintergrund: 'Fondo',
    Symbol: 'Símbolo',
    Stimmung: 'Ambiente',
    'Violettes Labor': 'Laboratorio violeta',
    'Türkiser Nebel': 'Niebla turquesa',
    'Giftgrüner Schleim': 'Slime verde tóxico',
    'Blutroter Mond': 'Luna rojo sangre',
    'Goldener Zauber': 'Magia dorada',
    'Geheimnisvolle Nacht': 'Noche misteriosa',
    Zaubertrank: 'Poción mágica',
    Geist: 'Fantasma',
    Monster: 'Monstruo',
    Mikroskop: 'Microscopio',
    Kamera: 'Cámara',
    Drache: 'Dragón',
    Mond: 'Luna',
    Zauberstab: 'Varita mágica',
    Pflanze: 'Planta',
    Erfindung: 'Invento',
    Lustig: 'Divertida',
    Gruselig: 'Terrorífica',
    Eklig: 'Asquerosa',
    Magisch: 'Mágica',
    Geheimnisvoll: 'Misteriosa',
    Niedlich: 'Bonita',
    '🌍 Für alle freigeben': '🌍 Aprobar para todos',
    '✅ Für das nächste App-Update freigegeben': '✅ Aprobada para la próxima actualización',
    '🌍 Nur du kannst Missionen für alle freigeben. Vor dem nächsten App-Update werden Inhalt und Sicherheit noch einmal geprüft.':
      '🌍 Solo tú puedes aprobar misiones para todos. El contenido y la seguridad se revisan antes de la próxima actualización.',
    Zappelmurmel: 'Marmota inquieta',
    Mondmurmel: 'Marmota lunar',
    Nebelbandit: 'Bandido de la niebla',
    Glitzerbandit: 'Bandido brillante',
    Mondwolf: 'Lobo lunar',
    Frostzahn: 'Colmillo helado',
    Giftschnauze: 'Hocico venenoso',
    Nachtflatterer: 'Aleteador nocturno',
    Nachtwache: 'Guardiana nocturna',
    Mondauge: 'Ojo lunar',
    Giftfeder: 'Pluma venenosa',
    Spinnenschatten: 'Sombra de araña',
    Giftspinne: 'Araña venenosa',
    'Was passiert?': '¿Qué va a pasar?',
    Kategorie: 'Categoría',
    Basteln: 'Manualidades',
    'Foto-Challenge': 'Reto fotográfico',
    'Schwestern-Mission': 'Misión de hermanas',
    Minuten: 'Minutos',
    Sicherheitsstufe: 'Nivel de seguridad',
    'Meine neue Mission, magisch': 'Mi nueva misión, mágica',
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
    '🎨 Titelbild zusammenstellen': '🎨 Crea l’immagine di copertina',
    'Wähle einen Hintergrund, ein Symbol und die Stimmung deiner Mission.':
      'Scegli uno sfondo, un simbolo e l’atmosfera della tua missione.',
    Hintergrund: 'Sfondo',
    Symbol: 'Simbolo',
    Stimmung: 'Atmosfera',
    'Violettes Labor': 'Laboratorio viola',
    'Türkiser Nebel': 'Nebbia turchese',
    'Giftgrüner Schleim': 'Slime verde tossico',
    'Blutroter Mond': 'Luna rosso sangue',
    'Goldener Zauber': 'Magia dorata',
    'Geheimnisvolle Nacht': 'Notte misteriosa',
    Zaubertrank: 'Pozione magica',
    Geist: 'Fantasma',
    Monster: 'Mostro',
    Mikroskop: 'Microscopio',
    Kamera: 'Fotocamera',
    Drache: 'Drago',
    Mond: 'Luna',
    Zauberstab: 'Bacchetta magica',
    Pflanze: 'Pianta',
    Erfindung: 'Invenzione',
    Lustig: 'Divertente',
    Gruselig: 'Spaventosa',
    Eklig: 'Disgustosa',
    Magisch: 'Magica',
    Geheimnisvoll: 'Misteriosa',
    Niedlich: 'Carina',
    '🌍 Für alle freigeben': '🌍 Approva per tutti',
    '✅ Für das nächste App-Update freigegeben': '✅ Approvata per il prossimo aggiornamento',
    '🌍 Nur du kannst Missionen für alle freigeben. Vor dem nächsten App-Update werden Inhalt und Sicherheit noch einmal geprüft.':
      '🌍 Solo tu puoi approvare missioni per tutti. Contenuto e sicurezza vengono ricontrollati prima del prossimo aggiornamento.',
    Zappelmurmel: 'Marmotta saltellante',
    Mondmurmel: 'Marmotta lunare',
    Nebelbandit: 'Bandito della nebbia',
    Glitzerbandit: 'Bandito scintillante',
    Mondwolf: 'Lupo lunare',
    Frostzahn: 'Zanna gelata',
    Giftschnauze: 'Muso velenoso',
    Nachtflatterer: 'Svolazzatore notturno',
    Nachtwache: 'Sentinella notturna',
    Mondauge: 'Occhio lunare',
    Giftfeder: 'Piuma velenosa',
    Spinnenschatten: 'Ombra di ragno',
    Giftspinne: 'Ragno velenoso',
    'Was passiert?': 'Cosa succede?',
    Kategorie: 'Categoria',
    Basteln: 'Lavoretti',
    'Foto-Challenge': 'Sfida fotografica',
    'Schwestern-Mission': 'Missione tra sorelle',
    Minuten: 'Minuti',
    Sicherheitsstufe: 'Livello di sicurezza',
    'Meine neue Mission, magisch': 'La mia nuova missione, magica',
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
