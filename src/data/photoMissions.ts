import type { Mission } from '../domain'

const PHOTO_SPECS = [
  [
    'riesen-schatten',
    'Der riesige Monsterschatten',
    'Lass einen kleinen Gegenstand einen riesigen Schatten werfen.',
  ],
  [
    'spiegel-doppelgaenger',
    'Der Spiegel-Doppelgänger',
    'Fotografiere eine Figur und ihr Spiegelbild als zwei verschiedene Wesen.',
  ],
  [
    'wasser-portal',
    'Das Portal in der Pfütze',
    'Nutze eine Spiegelung im Wasser als Eingang in eine andere Welt.',
  ],
  [
    'miniatur-riese',
    'Der Miniatur-Riese',
    'Lass eine Spielfigur durch Perspektive grösser als ein Mensch wirken.',
  ],
  ['farbgeist', 'Der Farblicht-Geist', 'Erzeuge mit farbiger Folie geheimnisvolles Licht.'],
  [
    'unsichtbar',
    'Die fast unsichtbare Figur',
    'Verstecke eine Figur farblich so gut wie möglich im Hintergrund.',
  ],
  ['bewegungs-spur', 'Die rasende Geisterspur', 'Fange Bewegung als verwischte Spur ein.'],
  [
    'augen-dunkel',
    'Die Augen in der Dunkelheit',
    'Zeige nur zwei leuchtende Augen in einer dunklen Szene.',
  ],
  [
    'verkehrte-welt',
    'Die verkehrte Welt',
    'Drehe die Kamera so, dass Boden und Decke ihre Rollen tauschen.',
  ],
  [
    'monster-portrait',
    'Das Monster-Porträt',
    'Fotografiere ein Alltagsobjekt wie ein gefährliches Wesen.',
  ],
  [
    'geheim-tuer',
    'Die winzige Geheimtür',
    'Baue und fotografiere eine kleine Tür an einem unerwarteten Ort.',
  ],
  ['eis-koenigin', 'Die gefrorene Königin', 'Nutze Eis, Glas oder Folie für einen frostigen Look.'],
  [
    'farb-sprung',
    'Der schwebende Farbsprung',
    'Fange einen Sprung mit bunten Tüchern im richtigen Moment ein.',
  ],
  [
    'detektiv-serie',
    'Die drei Detektivbilder',
    'Erzähle in drei Fotos Fund, Spur und Lösung eines Rätsels.',
  ],
] as const

export const additionalPhotoMissions: Mission[] = PHOTO_SPECS.map(
  ([slug, title, description], index) => ({
    id: `mission-foto-${slug}`,
    contentVersion: 1,
    title,
    shortDescription: description,
    primaryCategory: 'foto',
    secondaryCategories: [],
    durationMinutes: 20 + (index % 3) * 5,
    difficulty: index % 4 === 0 ? 'mittel' : 'leicht',
    estimatedCostChf: index % 3,
    materials: [
      { id: 'm1', name: 'iPhone-Kamera', optional: false, consumable: false },
      {
        id: 'm2',
        name: index % 2 ? 'Spielfigur' : 'Kleiner Alltagsgegenstand',
        optional: false,
        consumable: false,
      },
      { id: 'm3', name: 'Papier oder Stoff als Hintergrund', optional: true, consumable: false },
    ],
    safetyLevel: 'gruen',
    safetyNotes: [
      'Nur an einem sicheren Ort fotografieren und keine fremden Personen ohne Erlaubnis aufnehmen.',
    ],
    location: 'ueberall',
    traits: {
      gruselig: 2 + (index % 4),
      farbig: 2 + (index % 4),
      suess: 0,
      kreativ: 5,
      unordentlich: index % 2,
      aufwand: 2 + (index % 3),
    },
    photoProfile: {
      tips: [
        'Linse kurz reinigen',
        'Mehrere Blickwinkel ausprobieren',
        index % 2 ? 'Kamera möglichst ruhig halten' : 'Licht von der Seite nutzen',
      ],
      frames: ['Laborrahmen', 'Monsterkrallen', 'Geisternebel'],
      effects: ['Ohne Effekt', 'Schwarzweiss', 'Kaltblau', 'Dramatisch'],
    },
    steps: [
      { id: 'step-1', order: 1, text: 'Wähle Motiv, Hintergrund und Licht.' },
      { id: 'step-2', order: 2, text: 'Mache ein Testfoto und prüfe die Wirkung.' },
      {
        id: 'step-3',
        order: 3,
        text: 'Verändere Blickwinkel oder Abstand und mache mehrere Bilder.',
      },
      { id: 'step-4', order: 4, text: 'Wähle bis zu fünf Lieblingsbilder für dein Labortagebuch.' },
    ],
    generalHelpTip: 'Gehe näher ans Motiv, statt mit den Fingern stark zu zoomen.',
    completionQuestion: 'Welches Bild erzählt die stärkste Geschichte und warum?',
    imagePlaceholder: `photo-${slug}`,
  }),
)
