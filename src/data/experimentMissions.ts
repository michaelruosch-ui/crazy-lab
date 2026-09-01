import type { Mission } from '../domain'

interface ExperimentSpec {
  slug: string
  title: string
  question: string
  explanation: string
  materials: string[]
  minutes?: number
  days?: number
  location?: Mission['location']
}

const SPECS: ExperimentSpec[] = [
  {
    slug: 'salzkristall-geist',
    title: 'Der wachsende Salzkristall-Geist',
    question: 'Was bleibt übrig, wenn Salzwasser langsam verdunstet?',
    explanation:
      'Das Wasser geht als Wasserdampf in die Luft; das gelöste Salz ordnet sich zu Kristallen.',
    materials: ['Salz', 'Warmes Wasser', 'Glas', 'Wollfaden'],
    days: 3,
  },
  {
    slug: 'bohnen-labyrinth',
    title: 'Die Bohne im Lichtlabyrinth',
    question: 'Findet eine Pflanze durch ein dunkles Labyrinth zum Licht?',
    explanation: 'Triebe wachsen in Richtung Licht. Diese Reaktion heisst Phototropismus.',
    materials: ['Keimende Bohne', 'Karton', 'Erde im Becher', 'Klebeband'],
    days: 7,
    minutes: 25,
  },
  {
    slug: 'regenwolke',
    title: 'Die Regenwolke im Glas',
    question: 'Wann fallen Farbtropfen durch eine Rasierschaum-Wolke?',
    explanation:
      'Die Wolke hält Tropfen nur eine Weile. Werden sie zu schwer, sinken sie wie Regen hindurch.',
    materials: ['Glas Wasser', 'Rasierschaum', 'Lebensmittelfarbe', 'Pipette'],
  },
  {
    slug: 'tanzende-rosinen',
    title: 'Die tanzenden Rosinen',
    question: 'Können Gasblasen Rosinen auf und ab bewegen?',
    explanation:
      'Gasblasen haften an den Rosinen und tragen sie hoch. Oben platzen sie und die Rosinen sinken wieder.',
    materials: ['Mineralwasser', 'Rosinen', 'Hohes Glas'],
  },
  {
    slug: 'eisfaden',
    title: 'Der Eiswürfel am Zauberfaden',
    question: 'Kann Salz einen Faden an einen Eiswürfel frieren lassen?',
    explanation:
      'Salz schmilzt kurz die Eisoberfläche. Danach friert das kalte Wasser um den Faden wieder fest.',
    materials: ['Eiswürfel', 'Salz', 'Baumwollfaden', 'Teller'],
  },
  {
    slug: 'pfeffer-flucht',
    title: 'Die Flucht der schwarzen Punkte',
    question: 'Warum fliehen schwimmende Punkte vor einem Tropfen Spülmittel?',
    explanation:
      'Spülmittel verändert die Oberflächenspannung des Wassers und zieht die Oberfläche auseinander.',
    materials: ['Wasser', 'Teller', 'Getrocknete Kräuter', 'Spülmittel'],
  },
  {
    slug: 'farbchromatografie',
    title: 'Das geheime Filzstift-Farblabor',
    question: 'Steckt in einem dunklen Filzstift mehr als eine Farbe?',
    explanation:
      'Wasser trägt Farbstoffe unterschiedlich schnell durch das Papier und trennt die Farbmischung.',
    materials: ['Kaffeefilter', 'Wasserlösliche Filzstifte', 'Wasser', 'Glas'],
  },
  {
    slug: 'eier-schale',
    title: 'Das Ei ohne harte Schale',
    question: 'Was macht Essig über mehrere Tage mit einer Eierschale?',
    explanation:
      'Die Säure reagiert mit dem Kalk der Schale. Dabei entstehen Gasblasen und die Schale löst sich.',
    materials: ['Rohes Ei', 'Essig', 'Glas mit Deckel'],
    days: 2,
  },
  {
    slug: 'apfel-alterung',
    title: 'Das Apfel-Alterungsrennen',
    question: 'Welche Behandlung hält Apfelstücke am längsten hell?',
    explanation: 'Sauerstoff lässt Apfelzellen braun werden. Zitronensaft bremst diese Oxidation.',
    materials: ['Apfel', 'Zitronensaft', 'Wasser', 'Drei Teller'],
    minutes: 30,
  },
  {
    slug: 'papierbruecke',
    title: 'Die superstarke Papierbrücke',
    question: 'Welche Papierform trägt die meisten Münzen?',
    explanation:
      'Falten verteilen Kräfte auf mehrere Kanten und machen dünnes Papier überraschend stabil.',
    materials: ['Papier', 'Zwei Bücher', 'Münzen'],
  },
  {
    slug: 'schatten-uhr',
    title: 'Die wandernde Schattenuhr',
    question: 'Wie verändert sich ein Schatten im Verlauf eines Tages?',
    explanation:
      'Die Erde dreht sich; dadurch scheint die Sonne über den Himmel zu wandern und der Schatten ändert Richtung und Länge.',
    materials: ['Holzstäbchen', 'Knete', 'Papier', 'Stift'],
    days: 1,
    location: 'garten',
  },
  {
    slug: 'sellerie-farbe',
    title: 'Die farbigen Pflanzen-Adern',
    question: 'Wie gelangt gefärbtes Wasser bis in die Blätter?',
    explanation: 'Feine Leitungsbahnen ziehen Wasser durch Kapillarkräfte nach oben.',
    materials: ['Selleriestange mit Blättern', 'Wasser', 'Lebensmittelfarbe', 'Glas'],
    days: 1,
  },
  {
    slug: 'ballon-hefe',
    title: 'Der Hefepilz-Ballon',
    question: 'Kann Hefe einen Ballon aufblasen?',
    explanation:
      'Hefe verarbeitet Zucker und bildet dabei Kohlendioxid. Das Gas sammelt sich im Ballon.',
    materials: ['Trockenhefe', 'Zucker', 'Warmes Wasser', 'Flasche', 'Ballon'],
    minutes: 40,
  },
  {
    slug: 'magnet-detektiv',
    title: 'Der Magnet-Detektiv',
    question: 'Welche Gegenstände werden von einem Magneten angezogen?',
    explanation:
      'Magnete ziehen vor allem Gegenstände mit Eisen an; Metall allein genügt nicht immer.',
    materials: ['Magnet', 'Zehn kleine Alltagsgegenstände', 'Papier und Stift'],
    location: 'ueberall',
  },
]

export const additionalExperimentMissions: Mission[] = SPECS.map((spec, index) => ({
  id: `mission-experiment-${spec.slug}`,
  contentVersion: 1,
  title: spec.title,
  shortDescription: `${spec.question} Stelle zuerst eine Vermutung auf und führe dann den sicheren Versuch durch.`,
  primaryCategory: 'experiment',
  secondaryCategories: [],
  durationMinutes: spec.minutes ?? 20,
  difficulty: spec.days ? 'mittel' : 'leicht',
  estimatedCostChf: 2,
  materials: spec.materials.map((name, materialIndex) => ({
    id: `m${materialIndex + 1}`,
    name,
    optional: false,
    consumable: !/glas|teller|buch|münz|magnet|stift|flasche/i.test(name),
  })),
  safetyLevel: /ei ohne|hefe/i.test(spec.title) ? 'gelb' : 'gruen',
  safetyNotes: /ei ohne|hefe/i.test(spec.title)
    ? ['Eine erwachsene Person begleitet den Versuch. Versuchsbestandteile nicht essen.']
    : ['Versuchsmaterialien nach dem Experiment nicht essen oder trinken.'],
  location: spec.location ?? 'kueche',
  traits: {
    gruselig: index % 4,
    farbig: 2 + (index % 4),
    suess: 0,
    kreativ: 3,
    unordentlich: 1 + (index % 3),
    aufwand: spec.days ? 4 : 2,
  },
  experimentProfile: {
    researchQuestion: spec.question,
    hypothesisPrompt: 'Was glaubst du, was passieren wird – und warum?',
    observationPrompt: 'Was siehst, hörst oder misst du wirklich?',
    explanation: spec.explanation,
    durationDays: spec.days,
  },
  steps: [
    { id: 'step-1', order: 1, text: `Lege bereit: ${spec.materials.join(', ')}.` },
    { id: 'step-2', order: 2, text: 'Schreibe oder erzähle zuerst deine Vermutung.' },
    {
      id: 'step-3',
      order: 3,
      text: `Führe den Versuch langsam durch und beobachte: ${spec.question}`,
    },
    {
      id: 'step-4',
      order: 4,
      text: spec.days
        ? `Markiere den Aufbau und beobachte ihn ${spec.days} Tag${spec.days === 1 ? '' : 'e'} lang.`
        : 'Vergleiche das Ergebnis mit deiner Vermutung.',
    },
  ],
  generalHelpTip:
    'Verändere immer nur eine Sache auf einmal, dann erkennst du den Grund für das Ergebnis.',
  completionQuestion:
    'Was hast du vermutet, was wirklich beobachtet und wie erklärst du den Unterschied?',
  imagePlaceholder: `experiment-${spec.slug}`,
}))
