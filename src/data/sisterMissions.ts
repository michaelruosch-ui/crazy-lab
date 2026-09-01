import type { Mission } from '../domain'

const SISTER_SPECS = [
  [
    'monster-bau',
    'Das gemeinsame Monster',
    'Elena baut den Kopf, die Schwester heimlich den Körper.',
  ],
  [
    'blind-zeichnen',
    'Das blinde Monsterbild',
    'Eine beschreibt ein Monster, die andere zeichnet ohne Rückfragen.',
  ],
  [
    'geheim-agentinnen',
    'Die Labor-Geheimagentinnen',
    'Löst zwei getrennte Hinweise und kombiniert die Passwörter.',
  ],
  [
    'turm-duell',
    'Das wacklige Turm-Team',
    'Baut abwechselnd einen hohen Turm, ohne über den nächsten Schritt zu sprechen.',
  ],
  [
    'farb-tausch',
    'Der geheime Farbentausch',
    'Jede wählt eine geheime Farbe, am Ende müssen beide Werke zusammenpassen.',
  ],
  [
    'schatten-theater',
    'Das Zwei-Geister-Schattentheater',
    'Spielt mit zwei Figuren eine kurze gemeinsame Gruselgeschichte.',
  ],
  [
    'geraeusch-raten',
    'Das Labor-Geräuscherätsel',
    'Eine erzeugt sichere Geräusche, die andere errät die Gegenstände.',
  ],
  [
    'spuren-suche',
    'Die verschwundene Laborprobe',
    'Legt euch gegenseitig eine geheime Spurensuche.',
  ],
  [
    'roboter',
    'Der Zwei-Kopf-Roboter',
    'Baut getrennt zwei Hälften, die am Ende zusammenpassen müssen.',
  ],
  [
    'foto-regie',
    'Fotografin und Monster-Regisseurin',
    'Eine inszeniert, die andere fotografiert – danach tauscht ihr.',
  ],
  [
    'wort-trank',
    'Der erfundene Zauberspruch',
    'Erfindet abwechselnd Wörter für einen gemeinsamen Zauberspruch.',
  ],
  [
    'papier-flieger',
    'Die Fluglabor-Staffel',
    'Faltet zwei Fluggeräte und verbessert gemeinsam die kürzere Strecke.',
  ],
  [
    'mini-zimmer',
    'Das geteilte Mini-Zimmer',
    'Jede gestaltet geheim eine Zimmerhälfte für dieselbe Figur.',
  ],
  [
    'zeit-kette',
    'Die 5-Minuten-Laborkette',
    'Löst unter Zeitdruck vier kleine Aufgaben als echtes Team.',
  ],
] as const

export const additionalSisterMissions: Mission[] = SISTER_SPECS.map(
  ([slug, title, description], index) => ({
    id: `mission-schwestern-${slug}`,
    contentVersion: 1,
    title,
    shortDescription: description,
    primaryCategory: 'schwestern',
    secondaryCategories: index === 9 ? ['foto'] : index % 3 === 0 ? ['basteln'] : [],
    durationMinutes: 20 + (index % 4) * 5,
    difficulty: index % 5 === 0 ? 'mittel' : 'leicht',
    estimatedCostChf: index % 4,
    materials: [
      { id: 'm1', name: 'Papier', optional: false, consumable: true },
      { id: 'm2', name: 'Filzstifte', optional: false, consumable: false },
      {
        id: 'm3',
        name: 'Zwei Schwestern oder Teampartnerinnen',
        optional: false,
        consumable: false,
      },
    ],
    safetyLevel: 'gruen',
    safetyNotes: [
      'Fair bleiben: Stopp sagen ist jederzeit erlaubt, geheime Aufgaben dürfen niemanden erschrecken oder verletzen.',
    ],
    location: 'ueberall',
    traits: {
      gruselig: 1 + (index % 4),
      farbig: 3,
      suess: 0,
      kreativ: 5,
      unordentlich: 1 + (index % 3),
      aufwand: 2 + (index % 3),
    },
    sisterProfile: {
      secretTaskElena: `Geheimauftrag Elena: Baue unauffällig das Zeichen ${['★', '👁️', '🌙'][index % 3]} ein.`,
      secretTaskSister: `Geheimauftrag Schwester: Baue unauffällig die Farbe ${['Violett', 'Türkis', 'Rot'][index % 3]} ein.`,
      jointFinish:
        'Zeigt euch die Geheimaufträge, verbindet beide Ergebnisse und gebt dem Teamwerk gemeinsam einen Namen.',
      timeChallengeSeconds: index % 2 === 0 ? 300 : undefined,
    },
    steps: [
      { id: 'step-1', order: 1, text: 'Lest gemeinsam die Anleitung und verteilt die Rollen.' },
      {
        id: 'step-2',
        order: 2,
        text: 'Schaut eure Geheimaufträge nacheinander an, ohne zu spicken.',
      },
      { id: 'step-3', order: 3, text: description },
      {
        id: 'step-4',
        order: 4,
        text: 'Enthüllt beide Geheimnisse und vollendet das Ergebnis gemeinsam.',
      },
    ],
    generalHelpTip: 'Wenn ihr feststeckt, darf jede genau einen kleinen Hinweis geben.',
    completionQuestion:
      'Was hat jede Schwester beigetragen und was wurde erst zusammen richtig gut?',
    imagePlaceholder: `sisters-${slug}`,
  }),
)
