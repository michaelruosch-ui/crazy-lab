import type { Mission } from '../domain'
import { additionalDrinkMissions } from './drinkMissions'

/**
 * Statische, versionierte Missionsdaten für Sprint 1.
 * `contentVersion` erhöhen, wenn Inhalte einer bestehenden Mission sich ändern -
 * bestehende Tagebuch-Snapshots bleiben davon unberührt.
 */
export const missions: Mission[] = [
  {
    id: 'mission-blutroter-schatten-trank',
    contentVersion: 1,
    title: 'Der blutrote Schatten-Trank',
    shortDescription:
      'Ein geheimnisvoller Trank, der sich vor deinen Augen in blutrote Schatten verwandelt.',
    primaryCategory: 'getraenk',
    secondaryCategories: [],
    durationMinutes: 10,
    difficulty: 'leicht',
    estimatedCostChf: 3,
    materials: [
      { id: 'm1', name: 'Cranberrysaft', quantity: '150 ml', optional: false, consumable: true },
      { id: 'm2', name: 'Zitronenlimonade', quantity: '150 ml', optional: false, consumable: true },
      {
        id: 'm3',
        name: 'Roter Fruchtsirup (z. B. Grenadine)',
        quantity: '2 EL',
        optional: false,
        consumable: true,
      },
      { id: 'm4', name: 'Eiswürfel', quantity: 'eine Handvoll', optional: false, consumable: true },
      {
        id: 'm5',
        name: 'Essbares Glitzerpuder',
        quantity: 'eine Prise',
        optional: true,
        consumable: true,
      },
      { id: 'm6', name: 'Fruchtgummi-Wurm', quantity: '1 Stück', optional: true, consumable: true },
      { id: 'm7', name: 'Hohes Glas', optional: false, consumable: false },
      { id: 'm8', name: 'Strohhalm', optional: true, consumable: true },
    ],
    safetyLevel: 'gruen',
    safetyNotes: [],
    location: 'kueche',
    traits: { gruselig: 4, farbig: 5, suess: 3, kreativ: 3, unordentlich: 1, aufwand: 1 },
    drinkProfile: {
      tastes: ['suess', 'fruchtig', 'prickelnd'],
      servingTemperature: 'kalt',
      appearance: ['blutrot', 'geschichtet', 'glitzernd'],
      equipment: [],
      variants: [
        { name: 'Beerenschatten', description: 'Cranberrysaft durch dunklen Beerensaft ersetzen.' },
        {
          name: 'Extra-Nebel',
          description: 'Mehr Eis verwenden und den Sirup besonders langsam einlaufen lassen.',
        },
      ],
    },
    steps: [
      {
        id: 'step-1',
        order: 1,
        text: 'Fülle das Glas bis zur Hälfte mit Eiswürfeln.',
      },
      {
        id: 'step-2',
        order: 2,
        text: 'Giesse langsam den Cranberrysaft über die Eiswürfel.',
      },
      {
        id: 'step-3',
        order: 3,
        text: 'Giesse die Zitronenlimonade vorsichtig über einen Löffelrücken dazu, damit sich eine Schicht bildet.',
      },
      {
        id: 'step-4',
        order: 4,
        text: 'Lass den roten Fruchtsirup ganz langsam am Glasrand herunterlaufen, bis blutrote Schatten nach unten sinken.',
        helpTip:
          'Giesse den Sirup nur tropfenweise und ganz nah am Glasrand entlang - dann sinkt er wie Rauch nach unten statt sich sofort zu vermischen.',
      },
      {
        id: 'step-5',
        order: 5,
        text: 'Bestreue den Trank optional mit essbarem Glitzer und hänge den Fruchtgummi-Wurm an den Glasrand.',
      },
      {
        id: 'step-6',
        order: 6,
        text: 'Stecke einen Strohhalm hinein und serviere deinen Schatten-Trank sofort.',
      },
    ],
    generalHelpTip:
      'Wenn sich die Farben zu schnell vermischen: Trank kurz ruhen lassen, dann vorsichtig einen weiteren Tropfen Sirup ganz langsam am Rand hinzufügen.',
    completionQuestion:
      'Sind blutrote Schatten in deinem Trank nach unten gesunken? Beschreibe, wie dein Trank ausgesehen hat.',
    imagePlaceholder: 'potion-red',
  },
  {
    id: 'mission-playmobil-geisterbett',
    contentVersion: 1,
    title: 'Das geheimnisvolle Playmobil-Geisterbett',
    shortDescription:
      'Baue aus Karton und Watte ein schaurig-schönes Himmelbett für eine Playmobil-Spukgestalt.',
    primaryCategory: 'basteln',
    secondaryCategories: [],
    durationMinutes: 30,
    difficulty: 'mittel',
    estimatedCostChf: 5,
    materials: [
      { id: 'm1', name: 'Karton (z. B. Verpackungskarton)', optional: false, consumable: true },
      { id: 'm2', name: 'Watte', quantity: 'eine Packung', optional: false, consumable: true },
      { id: 'm3', name: 'Bastelkleber', optional: false, consumable: true },
      { id: 'm4', name: 'Schere', optional: false, consumable: false },
      { id: 'm5', name: 'Schwarzer und violetter Filzstift', optional: false, consumable: false },
      {
        id: 'm6',
        name: 'Leuchtsticker oder Glitzersteine',
        optional: true,
        consumable: true,
      },
      { id: 'm7', name: 'Playmobil-Figur', optional: false, consumable: false },
    ],
    safetyLevel: 'gruen',
    safetyNotes: ['Beim Zuschneiden von Karton auf die Fingerhaltung achten.'],
    location: 'zimmer',
    traits: { gruselig: 3, farbig: 3, suess: 2, kreativ: 5, unordentlich: 3, aufwand: 3 },
    steps: [
      {
        id: 'step-1',
        order: 1,
        text: 'Schneide aus Karton ein Bettgestell mit vier kleinen Pfosten für den Himmel zurecht.',
      },
      {
        id: 'step-2',
        order: 2,
        text: 'Bemale das Bettgestell schwarz-violett und lass es kurz trocknen.',
        timerSeconds: 300,
        helpTip: 'Wenn die Farbe noch klebt: einfach noch etwas länger warten, nicht anfassen.',
      },
      {
        id: 'step-3',
        order: 3,
        text: 'Zupfe die Watte auseinander und klebe sie als wallendes Betttuch und Spinnweben auf.',
      },
      {
        id: 'step-4',
        order: 4,
        text: 'Male mit dem Filzstift ein gruseliges Muster auf die Bettdecke.',
      },
      {
        id: 'step-5',
        order: 5,
        text: 'Verziere den Himmel optional mit Leuchtstickern oder Glitzersteinen.',
      },
      {
        id: 'step-6',
        order: 6,
        text: 'Lege die Playmobil-Figur ins fertige Geisterbett und richte die Szene ein.',
      },
    ],
    generalHelpTip:
      'Wenn der Karton beim Schneiden verrutscht, bitte eine erwachsene Person zum Festhalten dazuholen.',
    completionQuestion:
      'Wie sieht deine Geisterfigur in ihrem neuen Bett aus? Was macht das Bett besonders gruselig?',
    imagePlaceholder: 'craft-ghost-bed',
  },
  {
    id: 'mission-wandernde-farbgeist',
    contentVersion: 1,
    title: 'Der wandernde Farbgeist',
    shortDescription:
      'Beobachte, wie Farbgeister von Glas zu Glas wandern - ein echtes Kapillar-Experiment.',
    primaryCategory: 'experiment',
    secondaryCategories: [],
    durationMinutes: 20,
    difficulty: 'leicht',
    estimatedCostChf: 2,
    materials: [
      { id: 'm1', name: 'Gläser', quantity: '3 Stück', optional: false, consumable: false },
      { id: 'm2', name: 'Küchenpapier', quantity: '3 Streifen', optional: false, consumable: true },
      { id: 'm3', name: 'Wasser', optional: false, consumable: true },
      {
        id: 'm4',
        name: 'Lebensmittelfarbe (blau, grün)',
        optional: false,
        consumable: true,
      },
    ],
    safetyLevel: 'gruen',
    safetyNotes: [],
    location: 'kueche',
    traits: { gruselig: 2, farbig: 5, suess: 0, kreativ: 2, unordentlich: 2, aufwand: 1 },
    steps: [
      {
        id: 'step-1',
        order: 1,
        text: 'Stelle drei Gläser nebeneinander in einer Reihe auf.',
      },
      {
        id: 'step-2',
        order: 2,
        text: 'Fülle das erste und das dritte Glas mit Wasser, das mittlere Glas bleibt leer.',
      },
      {
        id: 'step-3',
        order: 3,
        text: 'Färbe das Wasser im ersten Glas blau und im dritten Glas grün ein.',
      },
      {
        id: 'step-4',
        order: 4,
        text: 'Falte je einen Streifen Küchenpapier und lege ihn als Brücke zwischen die Gläser, sodass ein Ende jeweils ins Wasser reicht.',
      },
      {
        id: 'step-5',
        order: 5,
        text: 'Warte und beobachte, wie die Farbgeister langsam durch das Papier ins leere Glas wandern.',
        timerSeconds: 900,
        helpTip:
          'Wenn sich nach ein paar Minuten nichts tut: Papierstreifen prüfen - beide Enden müssen wirklich im Wasser bzw. am Glasrand fest anliegen.',
      },
      {
        id: 'step-6',
        order: 6,
        text: 'Notiere oder fotografiere, welche neue Farbe im mittleren Glas entstanden ist.',
      },
    ],
    generalHelpTip:
      'Farbgeister sind schüchtern und brauchen Zeit - lass das Experiment ruhig stehen und schau alle paar Minuten vorbei.',
    completionQuestion:
      'Welche Farbe ist im mittleren Glas entstanden? Was, glaubst du, ist mit dem Wasser passiert?',
    imagePlaceholder: 'experiment-color-ghost',
  },
  {
    id: 'mission-schwebende-gegenstand',
    contentVersion: 1,
    title: 'Der schwebende Gegenstand',
    shortDescription:
      'Erschaffe ein magisches Foto, auf dem ein Gegenstand mitten in der Luft zu schweben scheint.',
    primaryCategory: 'foto',
    secondaryCategories: [],
    durationMinutes: 20,
    difficulty: 'mittel',
    estimatedCostChf: 0,
    materials: [
      { id: 'm1', name: 'Smartphone oder Kamera', optional: false, consumable: false },
      {
        id: 'm2',
        name: 'Ein leichter Gegenstand (z. B. Buch, Kuscheltier)',
        optional: false,
        consumable: false,
      },
      {
        id: 'm3',
        name: 'Zweite Person zum Werfen oder Halten',
        optional: false,
        consumable: false,
      },
    ],
    safetyLevel: 'gruen',
    safetyNotes: [],
    location: 'ueberall',
    traits: { gruselig: 2, farbig: 2, suess: 1, kreativ: 4, unordentlich: 0, aufwand: 2 },
    steps: [
      {
        id: 'step-1',
        order: 1,
        text: 'Wähle einen ruhigen Ort mit gutem Licht und einen leichten Gegenstand aus.',
      },
      {
        id: 'step-2',
        order: 2,
        text: 'Übe kurz: Eine Person wirft den Gegenstand sanft hoch, die andere hält die Kamera bereit.',
      },
      {
        id: 'step-3',
        order: 3,
        text: 'Fotografiere den Gegenstand genau im höchsten Punkt seines Fluges, wenn er kurz still in der Luft wirkt.',
        helpTip:
          'Am besten mehrere Fotos kurz hintereinander machen (Serienbildfunktion) und danach das beste auswählen.',
      },
      {
        id: 'step-4',
        order: 4,
        text: 'Schau dir die Fotos an und wähle das gruseligste "schwebende" Bild aus.',
      },
      {
        id: 'step-5',
        order: 5,
        text: 'Erfinde eine kurze geheimnisvolle Geschichte dazu, warum der Gegenstand schwebt.',
      },
    ],
    generalHelpTip:
      'Wenn das Timing schwerfällt: den Gegenstand stattdessen an einem dünnen, später wegretuschierbaren Faden aufhängen und von der Seite fotografieren.',
    completionQuestion:
      'Welche geheimnisvolle Geschichte hast du dir zu deinem schwebenden Gegenstand ausgedacht?',
    imagePlaceholder: 'photo-levitation',
  },
  {
    id: 'mission-zwei-zaubertraenke',
    contentVersion: 1,
    title: 'Zwei Zaubertränke aus demselben Labor',
    shortDescription:
      'Zwei Schwestern, ein Grundrezept, zwei völlig unterschiedliche Zaubertränke - wer verrät sein Geheimnis?',
    primaryCategory: 'schwestern',
    secondaryCategories: ['getraenk'],
    durationMinutes: 25,
    difficulty: 'mittel',
    estimatedCostChf: 4,
    materials: [
      { id: 'm1', name: 'Zitronenlimonade', quantity: '300 ml', optional: false, consumable: true },
      { id: 'm2', name: 'Traubensaft', quantity: '100 ml', optional: false, consumable: true },
      { id: 'm3', name: 'Blaue Lebensmittelfarbe', optional: true, consumable: true },
      { id: 'm4', name: 'Grüne Lebensmittelfarbe', optional: true, consumable: true },
      { id: 'm5', name: 'Fruchtgummis in verschiedenen Formen', optional: true, consumable: true },
      { id: 'm6', name: 'Zwei Gläser', optional: false, consumable: false },
    ],
    safetyLevel: 'gruen',
    safetyNotes: [],
    location: 'kueche',
    traits: { gruselig: 3, farbig: 4, suess: 3, kreativ: 3, unordentlich: 2, aufwand: 2 },
    steps: [
      {
        id: 'step-1',
        order: 1,
        text: 'Bereitet gemeinsam das Grundrezept vor: je 150 ml Zitronenlimonade und 50 ml Traubensaft pro Glas.',
      },
      {
        id: 'step-2',
        order: 2,
        text: 'Geht getrennt in zwei Ecken der Küche - jede Schwester wählt geheim eine eigene Farbe und Dekoration.',
      },
      {
        id: 'step-3',
        order: 3,
        text: 'Verwandle deinen Trank mit deiner geheimen Zutat in einen ganz eigenen Zaubertrank.',
        helpTip:
          'Wenig hilft oft mehr: Nur ein bis zwei Tropfen Farbe nehmen, sonst schmeckt der Trank komisch.',
      },
      {
        id: 'step-4',
        order: 4,
        text: 'Deckt eure Tränke zu und tauscht euch gegenseitig geheimnisvolle Hinweise zu, ohne alles zu verraten.',
      },
      {
        id: 'step-5',
        order: 5,
        text: 'Enthüllt eure Tränke gleichzeitig und vergleicht Farbe, Duft und Namen.',
      },
      {
        id: 'step-6',
        order: 6,
        text: 'Kostet gemeinsam beide Tränke und kürt den "geheimnisvollsten Trank des Labors".',
      },
    ],
    generalHelpTip:
      'Wenn ihr euch nicht einigen könnt, wer gewinnt: Beide Tränke bekommen einen eigenen Titel statt nur einen Gewinner.',
    completionQuestion:
      'Welche geheime Zutat hat jede von euch gewählt, und welcher Trank hat gewonnen?',
    imagePlaceholder: 'potion-sisters',
  },
  ...additionalDrinkMissions,
]
