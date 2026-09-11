import { useState } from 'react'
import type { AppLanguage } from '../../domain'
import { BackLink } from '../../components'
import { LANGUAGE_OPTIONS, LanguageProvider, useLanguage } from '../../i18n'
import './PrivacyPage.css'

interface PrivacyCopy {
  title: string
  childTitle: string
  childIntro: string
  storesTitle: string
  stores: string[]
  neverTitle: string
  never: string[]
  controlTitle: string
  control: string
  adultTitle: string
  adultParagraphs: string[]
  legalTitle: string
  legalItems: string[]
  back: string
}

const COPY: Record<AppLanguage, PrivacyCopy> = {
  de: {
    title: '🔐 Datenschutz im Crazy Lab',
    childTitle: 'Für Kinder kurz erklärt',
    childIntro:
      'Crazy Lab merkt sich Dinge, damit dein Labor beim nächsten Öffnen noch genauso aussieht.',
    storesTitle: 'Das bleibt auf diesem Gerät',
    stores: [
      'dein Forschername und dein Maskottchen',
      'deine Missionen, Bewertungen und Tagebucheinträge',
      'Fotos und kurze Videos, die du selbst auswählst',
      'dein Laborschrank, deine Einkaufsliste und deine Abzeichen',
    ],
    neverTitle: 'Das macht Crazy Lab nicht',
    never: [
      'keine Werbung und kein Beobachten, was du antippst',
      'kein Verkauf deiner Daten',
      'keine automatische Cloud und kein öffentliches Kinderprofil',
      'keine Gesichtsbilder oder Fingerabdrücke bei der Erwachsenenprüfung',
    ],
    controlTitle: 'Du bestimmst mit',
    control:
      'Eine erwachsene Person kann eine Notfallkopie erstellen oder dein Profil mit allen Inhalten vollständig löschen.',
    adultTitle: 'Vollständige Information für Erwachsene',
    adultParagraphs: [
      'Crazy Lab verarbeitet alle nutzergenerierten Inhalte lokal auf dem jeweiligen Gerät. Es gibt keine Benutzerkonten, Analyse, Werbung, Tracking oder automatische Übermittlung an einen Server.',
      'Fotos, Videos, Namen, Geburtstage, Tagebuch-, Missions-, Einkaufs- und Bestandsdaten dienen ausschließlich den Funktionen der App. Die Verarbeitung erfolgt auf Wunsch der Familie und endet mit dem vollständigen Löschen des Profils.',
      'Eine externe Sicherungsdatei entsteht nur nach einer bewusst ausgelösten und durch die Elternschranke geschützten Aktion. Die empfangende Dateien-App oder ein gewählter Speicherort liegt außerhalb der Verantwortung von Crazy Lab.',
      'Die native Erwachsenenprüfung verwendet ausschließlich Apples Geräteauthentifizierung. Crazy Lab erhält nur Erfolg oder Abbruch und niemals biometrische Rohdaten.',
    ],
    legalTitle: 'Verbindliche Grundsätze',
    legalItems: [
      'Keine Weitergabe an Dritte und keine Drittanbieter-Werbe- oder Analysebibliotheken.',
      'Keine automatische Synchronisation zwischen Geräten.',
      'Lokale Daten bleiben bestehen, bis das Profil oder die App-Daten gelöscht werden.',
      'Stand dieser Erklärung: 11. September 2026. Vor der App-Store-Einreichung werden verantwortliche Kontakt- und Supportadresse ergänzt.',
    ],
    back: '← Zurück',
  },
  en: {
    title: '🔐 Privacy in Crazy Lab',
    childTitle: 'A short explanation for children',
    childIntro:
      'Crazy Lab remembers things so your laboratory looks the same next time you open it.',
    storesTitle: 'This stays on this device',
    stores: [
      'your researcher name and mascot',
      'missions, ratings and diary entries',
      'photos and short videos you choose',
      'your cabinet, shopping list and badges',
    ],
    neverTitle: 'What Crazy Lab does not do',
    never: [
      'no advertising or tracking your taps',
      'no selling your data',
      'no automatic cloud or public child profile',
      'no face images or fingerprints in the adult check',
    ],
    controlTitle: 'You have control',
    control:
      'An adult can create an emergency copy or completely delete your profile and all its contents.',
    adultTitle: 'Full information for adults',
    adultParagraphs: [
      'Crazy Lab processes all user-created content locally on each device. There are no user accounts, analytics, advertising, tracking or automatic server transfers.',
      'Photos, videos, names, birthdays, diary, mission, shopping and inventory data are used only for app functions. Processing is requested by the family and ends when the profile is completely deleted.',
      'An external backup file is created only after a deliberate action protected by the parental gate. The selected Files app or storage location is outside Crazy Lab.',
      'Native adult verification uses only Apple device authentication. Crazy Lab receives only success or cancellation and never biometric raw data.',
    ],
    legalTitle: 'Binding principles',
    legalItems: [
      'No sharing with third parties and no third-party advertising or analytics libraries.',
      'No automatic synchronization between devices.',
      'Local data remains until the profile or app data is deleted.',
      'Version: 11 September 2026. Responsible contact and support address will be added before App Store submission.',
    ],
    back: '← Back',
  },
  fr: {
    title: '🔐 Confidentialité dans Crazy Lab',
    childTitle: 'Explication courte pour les enfants',
    childIntro:
      'Crazy Lab mémorise des choses pour que ton laboratoire soit pareil à la prochaine ouverture.',
    storesTitle: 'Cela reste sur cet appareil',
    stores: [
      'ton nom de chercheur et ta mascotte',
      'tes missions, évaluations et entrées du journal',
      'les photos et courtes vidéos que tu choisis',
      'ton armoire, ta liste de courses et tes badges',
    ],
    neverTitle: 'Ce que Crazy Lab ne fait pas',
    never: [
      'aucune publicité ni suivi de tes actions',
      'aucune vente de tes données',
      'aucun cloud automatique ni profil enfant public',
      'aucune image du visage ni empreinte dans le contrôle adulte',
    ],
    controlTitle: 'Tu gardes le contrôle',
    control:
      'Un adulte peut créer une copie de secours ou supprimer complètement ton profil et tout son contenu.',
    adultTitle: 'Informations complètes pour les adultes',
    adultParagraphs: [
      'Crazy Lab traite tout le contenu créé localement sur chaque appareil. Il n’y a ni compte, ni analyse, ni publicité, ni suivi, ni transfert automatique vers un serveur.',
      'Les photos, vidéos, noms, anniversaires, journaux, missions, achats et stocks servent uniquement aux fonctions de l’app. Le traitement prend fin quand le profil est entièrement supprimé.',
      'Un fichier de sauvegarde externe est créé uniquement après une action volontaire protégée par le contrôle parental. L’emplacement choisi est extérieur à Crazy Lab.',
      'La vérification adulte native utilise uniquement l’authentification Apple. Crazy Lab reçoit seulement le succès ou l’annulation, jamais de données biométriques.',
    ],
    legalTitle: 'Principes obligatoires',
    legalItems: [
      'Aucun partage avec des tiers et aucune bibliothèque publicitaire ou analytique.',
      'Aucune synchronisation automatique entre appareils.',
      'Les données locales restent jusqu’à la suppression du profil ou des données de l’app.',
      'Version : 11 septembre 2026. Le contact responsable sera ajouté avant la soumission à l’App Store.',
    ],
    back: '← Retour',
  },
  es: {
    title: '🔐 Privacidad en Crazy Lab',
    childTitle: 'Explicación breve para niños',
    childIntro:
      'Crazy Lab recuerda cosas para que tu laboratorio siga igual la próxima vez que lo abras.',
    storesTitle: 'Esto se queda en este dispositivo',
    stores: [
      'tu nombre de investigador y mascota',
      'tus misiones, valoraciones y diario',
      'las fotos y vídeos cortos que eliges',
      'tu armario, lista de compras e insignias',
    ],
    neverTitle: 'Lo que Crazy Lab no hace',
    never: [
      'sin publicidad ni seguimiento de tus toques',
      'sin vender tus datos',
      'sin nube automática ni perfil infantil público',
      'sin imágenes faciales ni huellas en la comprobación adulta',
    ],
    controlTitle: 'Tú tienes el control',
    control:
      'Un adulto puede crear una copia de emergencia o eliminar por completo tu perfil y todo su contenido.',
    adultTitle: 'Información completa para adultos',
    adultParagraphs: [
      'Crazy Lab procesa todo el contenido creado localmente en cada dispositivo. No hay cuentas, análisis, publicidad, seguimiento ni transferencias automáticas a servidores.',
      'Fotos, vídeos, nombres, cumpleaños, diario, misiones, compras e inventario se usan solo para funciones de la app. El tratamiento termina al borrar completamente el perfil.',
      'Solo se crea una copia externa tras una acción deliberada protegida por el control parental. El lugar elegido para guardarla queda fuera de Crazy Lab.',
      'La verificación adulta nativa usa únicamente la autenticación del dispositivo Apple. Crazy Lab recibe solo éxito o cancelación, nunca datos biométricos.',
    ],
    legalTitle: 'Principios vinculantes',
    legalItems: [
      'Sin compartir datos con terceros ni bibliotecas publicitarias o analíticas.',
      'Sin sincronización automática entre dispositivos.',
      'Los datos locales permanecen hasta borrar el perfil o los datos de la app.',
      'Versión: 11 de septiembre de 2026. El contacto responsable se añadirá antes del envío a App Store.',
    ],
    back: '← Volver',
  },
  it: {
    title: '🔐 Privacy in Crazy Lab',
    childTitle: 'Spiegazione breve per bambini',
    childIntro:
      'Crazy Lab ricorda alcune cose così il tuo laboratorio resta uguale alla prossima apertura.',
    storesTitle: 'Questo rimane sul dispositivo',
    stores: [
      'il tuo nome da ricercatore e la mascotte',
      'missioni, valutazioni e diario',
      'foto e brevi video scelti da te',
      'armadio, lista della spesa e distintivi',
    ],
    neverTitle: 'Cosa non fa Crazy Lab',
    never: [
      'nessuna pubblicità o controllo dei tuoi tocchi',
      'nessuna vendita dei tuoi dati',
      'nessun cloud automatico o profilo pubblico del bambino',
      'nessuna immagine del volto o impronta nel controllo adulto',
    ],
    controlTitle: 'Decidi anche tu',
    control:
      'Un adulto può creare una copia di emergenza o eliminare completamente il tuo profilo e tutti i contenuti.',
    adultTitle: 'Informazioni complete per adulti',
    adultParagraphs: [
      'Crazy Lab elabora tutti i contenuti creati localmente su ogni dispositivo. Non ci sono account, analisi, pubblicità, tracciamento o invii automatici a server.',
      'Foto, video, nomi, compleanni, diario, missioni, acquisti e inventario servono soltanto alle funzioni dell’app. Il trattamento termina con la cancellazione completa del profilo.',
      'Un file di backup esterno viene creato solo dopo un’azione consapevole protetta dal controllo genitori. Il luogo scelto per salvarlo è esterno a Crazy Lab.',
      'La verifica adulta nativa usa solo l’autenticazione Apple. Crazy Lab riceve soltanto successo o annullamento, mai dati biometrici.',
    ],
    legalTitle: 'Principi vincolanti',
    legalItems: [
      'Nessuna condivisione con terzi e nessuna libreria pubblicitaria o analitica.',
      'Nessuna sincronizzazione automatica tra dispositivi.',
      'I dati locali restano finché non vengono eliminati il profilo o i dati dell’app.',
      'Versione: 11 settembre 2026. Il contatto responsabile sarà aggiunto prima dell’invio ad App Store.',
    ],
    back: '← Indietro',
  },
}

export function PrivacyPage({ standalone = false }: { standalone?: boolean }) {
  const { language } = useLanguage()
  const copy = COPY[language]
  return (
    <div className="privacy-page">
      <h1>{copy.title}</h1>
      <section className="privacy-page__child">
        <h2>{copy.childTitle}</h2>
        <p>{copy.childIntro}</p>
        <h3>{copy.storesTitle}</h3>
        <ul>
          {copy.stores.map((item) => (
            <li key={item}>✅ {item}</li>
          ))}
        </ul>
        <h3>{copy.neverTitle}</h3>
        <ul>
          {copy.never.map((item) => (
            <li key={item}>🚫 {item}</li>
          ))}
        </ul>
        <h3>{copy.controlTitle}</h3>
        <p>{copy.control}</p>
      </section>
      <details className="privacy-page__adults">
        <summary>{copy.adultTitle}</summary>
        {copy.adultParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <h3>{copy.legalTitle}</h3>
        <ul>
          {copy.legalItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
      {!standalone && <BackLink to="/profil">{copy.back}</BackLink>}
    </div>
  )
}

export function StandalonePrivacyPage() {
  const [language, setLanguage] = useState<AppLanguage>('de')
  return (
    <LanguageProvider language={language} onLanguageChange={setLanguage}>
      <main className="privacy-page privacy-page--standalone">
        <label className="privacy-page__language">
          🌐
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as AppLanguage)}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.short} · {option.label}
              </option>
            ))}
          </select>
        </label>
        <PrivacyPage standalone />
      </main>
    </LanguageProvider>
  )
}
