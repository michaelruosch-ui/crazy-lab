import type { Mission, MissionCategory } from '../domain'

type Spec = readonly [slug: string, title: string, description: string]

const drinkSpecs: Spec[] = [
  ['mondschein-brause', 'Mondschein-Brause', 'Eine blau schimmernde Fruchtbrause mit Sternenrand.'],
  ['pfirsich-nebel', 'Pfirsich-Nebel', 'Ein cremig-fruchtiger Wirbel in Orange und Weiss.'],
  ['waldbeeren-orakel', 'Waldbeeren-Orakel', 'Ein violetter Beerentrank mit geheimem Farbverlauf.'],
  ['apfel-frosch', 'Apfel-Frosch-Elixier', 'Ein grüner Apfeldrink mit lustigen Fruchtaugen.'],
  [
    'sonnenuntergang',
    'Sonnenuntergang im Glas',
    'Gelbe und rote Fruchtschichten wie am Abendhimmel.',
  ],
]

const craftSpecs: Spec[] = [
  [
    'monster-koffer',
    'Der Monster-Forscherkoffer',
    'Baue einen kleinen Koffer für geheime Laborfunde.',
  ],
  [
    'playmobil-portal',
    'Das Playmobil-Zeitportal',
    'Gestalte ein leuchtendes Portal aus Karton und Folie.',
  ],
  [
    'mini-gewächshaus',
    'Das Mini-Geistergewächshaus',
    'Baue ein winziges Gewächshaus mit Wattepflanzen.',
  ],
  [
    'dosen-roboter',
    'Der freundliche Dosenroboter',
    'Verwandle eine saubere Dose in einen Laborhelfer.',
  ],
  [
    'geheimkarten',
    'Die unsichtbaren Geheimkarten',
    'Bastle Karten mit versteckten Klappbotschaften.',
  ],
]

const experimentSpecs: Spec[] = [
  [
    'pfeffer-flucht',
    'Die fliehenden Wasserpunkte',
    'Beobachte, wie gemahlene Kräuter auf Wasser davonhuschen.',
  ],
  ['eis-faden', 'Der Eiswürfel am Faden', 'Hebe einen Eiswürfel mit Faden und etwas Salz an.'],
  [
    'ballon-haare',
    'Der unsichtbare Ballonmagnet',
    'Teste, welche leichten Dinge ein geriebener Ballon anzieht.',
  ],
  [
    'schwimm-ei',
    'Das schwebende Ei',
    'Vergleiche, wie ein Ei in normalem und salzigem Wasser schwimmt.',
  ],
  ['regen-glas', 'Regen im Glas', 'Lass farbige Regentropfen durch eine Wolkenschicht sinken.'],
]

const photoSpecs: Spec[] = [
  [
    'taschenlampen-mond',
    'Der Taschenlampen-Mond',
    'Inszeniere eine Taschenlampe als riesigen Mond.',
  ],
  [
    'spielzeug-flucht',
    'Die Spielzeug-Flucht',
    'Erzähle in Bildern, wie eine Figur heimlich ausbricht.',
  ],
  ['farben-detektiv', 'Der Farben-Detektiv', 'Finde und fotografiere fünf Dinge derselben Farbe.'],
  ['glas-kaleidoskop', 'Das Glas-Kaleidoskop', 'Fotografiere Muster durch ein geriffeltes Glas.'],
  [
    'monster-frühstück',
    'Das Monster-Frühstück',
    'Lass ein gewöhnliches Frühstück wie ein Wesen aussehen.',
  ],
]

const sisterSpecs: Spec[] = [
  [
    'geräusch-code',
    'Der geheime Geräusch-Code',
    'Erfindet gemeinsam eine Botschaft nur aus Geräuschen.',
  ],
  [
    'blind-bau',
    'Das blinde Bauteam',
    'Eine beschreibt, die andere baut ohne die Vorlage zu sehen.',
  ],
  [
    'monster-modenschau',
    'Die Monster-Modenschau',
    'Entwerft zwei verrückte Figuren und präsentiert sie gemeinsam.',
  ],
  [
    'zimmer-schatzsuche',
    'Die Mini-Schatzsuche',
    'Versteckt euch gegenseitig eine sichere Spur im Zimmer.',
  ],
  [
    'geschichten-staffel',
    'Die Geschichten-Staffel',
    'Erfindet abwechselnd eine überraschende Laborgeschichte.',
  ],
]

const experimentDetails = [
  {
    materials: ['Flacher Teller mit Wasser', 'Getrocknete Kräuter', 'Ein Tropfen Spülmittel'],
    action:
      'Streue die Kräuter auf das Wasser und berühre die Mitte danach mit einem Spülmitteltropfen.',
    question: 'Wie verändert Spülmittel die Verteilung auf der Wasseroberfläche?',
    explanation:
      'Spülmittel verringert die Oberflächenspannung. Die stärkere Spannung am Rand zieht Wasser und Kräuter nach aussen.',
  },
  {
    materials: ['Eiswürfel', 'Baumwollfaden', 'Eine Prise Salz', 'Teller'],
    action:
      'Lege den Faden auf den Eiswürfel, streue wenig Salz darauf, warte eine Minute und hebe vorsichtig an.',
    question: 'Kann Salz einen Faden kurz an einem Eiswürfel festfrieren lassen?',
    explanation:
      'Salz lässt die Eisoberfläche kurz schmelzen. Das kalte Eis friert das wenige Wasser danach wieder um den Faden fest.',
  },
  {
    materials: ['Luftballon', 'Wollpullover oder trockenes Haar', 'Papierschnipsel'],
    action:
      'Reibe den Ballon an Wolle oder trockenem Haar und nähere ihn ohne Berührung den Papierschnipseln.',
    question: 'Welche leichten Dinge zieht ein elektrisch geladener Ballon an?',
    explanation:
      'Beim Reiben werden elektrische Ladungen getrennt. Der geladene Ballon zieht nahe leichte Gegenstände an.',
  },
  {
    materials: ['Zwei hohe Gläser', 'Wasser', 'Salz', 'Zwei rohe Eier'],
    action:
      'Fülle beide Gläser mit Wasser, löse in einem viel Salz auf und lege vorsichtig je ein Ei hinein.',
    question: 'Schwimmt ein Ei in Salzwasser höher als in normalem Wasser?',
    explanation:
      'Gelöstes Salz erhöht die Dichte des Wassers. Dadurch trägt das Salzwasser das Ei stärker nach oben.',
  },
  {
    materials: [
      'Hohes Glas mit Wasser',
      'Rasierschaum',
      'Lebensmittelfarbe',
      'Pipette oder Löffel',
    ],
    action:
      'Setze eine dünne Schaumwolke auf das Wasser und tropfe Farbe darauf, bis farbiger Regen hindurchsinkt.',
    question: 'Wie viele Farbtropfen hält die Schaumwolke, bevor es darunter regnet?',
    explanation:
      'Der Schaum hält die Tropfen zunächst fest. Werden sie schwer genug, sinken sie durch den Schaum ins Wasser.',
  },
] as const

function baseMission(spec: Spec, category: MissionCategory, index: number): Mission {
  const [slug, title, description] = spec
  return {
    id: `mission-neu-${category}-${slug}`,
    contentVersion: 1,
    title,
    shortDescription: description,
    primaryCategory: category,
    secondaryCategories: [],
    durationMinutes: 15 + index * 5,
    difficulty: index >= 3 ? 'mittel' : 'leicht',
    estimatedCostChf: index % 3,
    materials: [
      { id: 'm1', name: 'Alltagsmaterialien', optional: false, consumable: false },
      { id: 'm2', name: 'Papier und Stift', optional: true, consumable: true },
    ],
    safetyLevel: 'gruen',
    safetyNotes: ['Arbeitsplatz freihalten und bei Unsicherheit eine erwachsene Person fragen.'],
    location: category === 'getraenk' || category === 'experiment' ? 'kueche' : 'zimmer',
    traits: {
      gruselig: 1 + (index % 4),
      farbig: 3 + (index % 3),
      suess: category === 'getraenk' ? 3 : 0,
      kreativ: 4,
      unordentlich: 1 + (index % 2),
      aufwand: 1 + (index % 3),
    },
    steps: [
      { id: 'step-1', order: 1, text: 'Lege alle benötigten Dinge übersichtlich bereit.' },
      { id: 'step-2', order: 2, text: `Plane gemeinsam, wie „${title}“ aussehen soll.` },
      { id: 'step-3', order: 3, text: 'Führe die Hauptidee langsam und aufmerksam aus.' },
      { id: 'step-4', order: 4, text: 'Prüfe das Ergebnis und verändere eine Kleinigkeit.' },
      { id: 'step-5', order: 5, text: 'Gib dem Ergebnis einen Namen und halte es fest.' },
    ],
    generalHelpTip:
      'Mache eine Pause und lies den aktuellen Schritt nochmals, wenn etwas unklar ist.',
    completionQuestion: 'Was war deine beste Idee und was würdest du beim nächsten Mal verändern?',
    imagePlaceholder: `new-${category}-${slug}`,
  }
}

const drinks = drinkSpecs.map((spec, index): Mission => ({
  ...baseMission(spec, 'getraenk', index),
  materials: [
    {
      id: 'm1',
      name: index % 2 ? 'Apfelsaft' : 'Orangensaft',
      quantity: '150 ml',
      optional: false,
      consumable: true,
    },
    { id: 'm2', name: 'Mineralwasser', quantity: '100 ml', optional: false, consumable: true },
    { id: 'm3', name: 'Frische Früchte', optional: true, consumable: true },
    { id: 'm4', name: 'Glas und Löffel', optional: false, consumable: false },
  ],
  steps: [
    {
      id: 'step-1',
      order: 1,
      text: 'Stelle ein Glas, Löffel, Saft und gekühltes Mineralwasser bereit.',
    },
    { id: 'step-2', order: 2, text: 'Fülle zuerst den Saft ins Glas.' },
    { id: 'step-3', order: 3, text: 'Giesse das Mineralwasser langsam am Glasrand dazu.' },
    {
      id: 'step-4',
      order: 4,
      text: 'Rühre einmal vorsichtig oder beobachte die entstandenen Schichten.',
    },
    {
      id: 'step-5',
      order: 5,
      text: 'Dekoriere mit einem Fruchtstück, gib dem Getränk einen Namen und probiere es.',
    },
  ],
  drinkProfile: {
    tastes:
      index === 1
        ? ['cremig', 'fruchtig']
        : index === 2
          ? ['sauer', 'fruchtig']
          : ['suess', 'fruchtig', 'prickelnd'],
    servingTemperature: 'kalt',
    appearance: ['farbig', index % 2 ? 'wirbelnd' : 'geschichtet'],
    equipment: [],
    variants: [
      { name: 'Fruchtstern', description: 'Mit kleinen Fruchtstücken am Rand dekorieren.' },
      {
        name: 'Sprudelgeist',
        description: 'Mehr Mineralwasser für besonders viele Bläschen verwenden.',
      },
    ],
  },
}))

const crafts = craftSpecs.map((spec, index): Mission => ({
  ...baseMission(spec, 'basteln', index),
  materials: [
    {
      id: 'm1',
      name:
        index === 3
          ? 'Saubere leere Konservendose ohne scharfe Kanten'
          : 'Sauberer Verpackungskarton',
      optional: false,
      consumable: true,
    },
    { id: 'm2', name: 'Bastelkleber', optional: false, consumable: true },
    { id: 'm3', name: 'Farbstifte', optional: false, consumable: false },
    { id: 'm4', name: 'Kinderschere', optional: false, consumable: false },
  ],
  safetyLevel: index === 3 ? 'gelb' : 'gruen',
  safetyNotes:
    index === 3
      ? ['Eine erwachsene Person prüft die Dose vollständig auf scharfe Kanten.']
      : ['Nur eine Kinderschere verwenden und Kleber nicht in Mund oder Augen bringen.'],
  steps: [
    {
      id: 'step-1',
      order: 1,
      text: 'Zeichne eine einfache Vorderseite, Rückseite und passende Dekoration vor.',
    },
    { id: 'step-2', order: 2, text: 'Schneide die grossen Formen mit der Kinderschere aus.' },
    {
      id: 'step-3',
      order: 3,
      text: `Baue die Grundform für „${spec[1]}“ und klebe sie stabil zusammen.`,
    },
    {
      id: 'step-4',
      order: 4,
      text: 'Ergänze farbige Zeichen, Knöpfe, Fenster oder Geheimklappen.',
    },
    {
      id: 'step-5',
      order: 5,
      text: 'Lass alles trocknen und teste vorsichtig, ob die beweglichen Teile funktionieren.',
    },
  ],
}))

const experiments = experimentSpecs.map((spec, index): Mission => ({
  ...baseMission(spec, 'experiment', index),
  safetyNotes: [
    'Versuchsmaterial nicht probieren und verschüttetes Wasser sofort aufwischen.',
    ...(index === 3 ? ['Nach dem Berühren roher Eier die Hände gründlich waschen.'] : []),
  ],
  materials: experimentDetails[index]!.materials.map((name, materialIndex) => ({
    id: `m${materialIndex + 1}`,
    name,
    optional: false,
    consumable: materialIndex > 0,
  })),
  steps: [
    { id: 'step-1', order: 1, text: 'Lege das Material auf eine abwischbare Unterlage.' },
    { id: 'step-2', order: 2, text: 'Notiere zuerst deine Vermutung.' },
    { id: 'step-3', order: 3, text: experimentDetails[index]!.action },
    { id: 'step-4', order: 4, text: 'Wiederhole den Vergleich einmal und beobachte genau.' },
    { id: 'step-5', order: 5, text: 'Notiere Beobachtung und Erklärung getrennt voneinander.' },
  ],
  experimentProfile: {
    researchQuestion: experimentDetails[index]!.question,
    hypothesisPrompt: 'Was glaubst du, wird passieren? Begründe deine Vermutung.',
    observationPrompt: 'Beschreibe genau, was du siehst, ohne gleich eine Erklärung zu erfinden.',
    explanation: experimentDetails[index]!.explanation,
  },
}))

const photos = photoSpecs.map((spec, index): Mission => ({
  ...baseMission(spec, 'foto', index),
  materials: [
    { id: 'm1', name: 'iPhone- oder iPad-Kamera', optional: false, consumable: false },
    {
      id: 'm2',
      name: index % 2 ? 'Spielzeugfigur' : 'Alltagsgegenstand',
      optional: false,
      consumable: false,
    },
  ],
  steps: [
    {
      id: 'step-1',
      order: 1,
      text: 'Wähle einen sicheren Ort und räume störende Dinge aus dem Hintergrund.',
    },
    { id: 'step-2', order: 2, text: `Baue die Szene für „${spec[1]}“ auf.` },
    {
      id: 'step-3',
      order: 3,
      text: 'Fotografiere die Szene aus Augenhöhe und danach von oben oder unten.',
    },
    {
      id: 'step-4',
      order: 4,
      text: 'Verändere Licht oder Abstand und mache eine zweite Bildidee.',
    },
    { id: 'step-5', order: 5, text: 'Wähle deine stärksten Bilder für das Tagebuch aus.' },
  ],
  photoProfile: {
    tips: [
      'Linse reinigen',
      'Auf einen ruhigen Hintergrund achten',
      'Zwei Blickwinkel ausprobieren',
    ],
    frames: ['Laborrahmen', 'Monsterkrallen', 'Geisternebel'],
    effects: ['Ohne Effekt', 'Schwarzweiss', 'Kaltblau', 'Dramatisch'],
  },
}))

const sisters = sisterSpecs.map((spec, index): Mission => ({
  ...baseMission(spec, 'schwestern', index),
  materials: [
    { id: 'm1', name: 'Papier und zwei Stifte', optional: false, consumable: true },
    { id: 'm2', name: 'Kleine Spiel- oder Bastelgegenstände', optional: true, consumable: false },
  ],
  steps: [
    {
      id: 'step-1',
      order: 1,
      text: 'Lest gemeinsam die Aufgabe und verteilt Material und Platz fair.',
    },
    {
      id: 'step-2',
      order: 2,
      text: 'Öffnet nacheinander eure geheimen Teilaufgaben, ohne sie zu verraten.',
    },
    {
      id: 'step-3',
      order: 3,
      text: `Führt „${spec[1]}“ abwechselnd aus, sodass beide gleich viel beitragen.`,
    },
    {
      id: 'step-4',
      order: 4,
      text: 'Gebt euch gegenseitig einen hilfreichen Hinweis statt die Lösung vorzusagen.',
    },
    {
      id: 'step-5',
      order: 5,
      text: 'Enthüllt eure Überraschungen und beendet die Aufgabe gemeinsam.',
    },
  ],
  sisterProfile: {
    secretTaskElena: 'Überrasche deine Partnerin mit einem zusätzlichen kleinen Hinweis.',
    secretTaskSister: 'Baue heimlich ein lustiges Detail in euren gemeinsamen Abschluss ein.',
    jointFinish: `Zeigt euch eure Geheimaufgaben und beendet „${spec[1]}“ gemeinsam.`,
    timeChallengeSeconds: index % 2 === 0 ? 300 : undefined,
  },
}))

export const sprint21Missions: Mission[] = [
  ...drinks,
  ...crafts,
  ...experiments,
  ...photos,
  ...sisters,
]
