import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = new URL('../src/', import.meta.url)
const ignored = new Set(['test', 'i18n'])

async function sourceFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const result = []
  for (const entry of entries) {
    if (ignored.has(entry.name)) continue
    const location = path.join(directory, entry.name)
    if (entry.isDirectory()) result.push(...(await sourceFiles(location)))
    else if (
      /\.tsx?$/.test(entry.name) &&
      !entry.name.endsWith('.test.ts') &&
      !entry.name.endsWith('.test.tsx')
    )
      result.push(location)
  }
  return result
}

function useful(value) {
  const text = value.trim()
  if (text.length < 2 || text.length > 1500) return false
  if (/^(\.?\.?\/|[a-z]+-[a-z0-9-]+$|#[0-9a-f]+$)/i.test(text)) return false
  if (/^[a-zA-Z0-9_.:/-]+$/.test(text) && !text.includes(' ')) return false
  return /[A-Za-zÄÖÜäöüßÀ-ÿ]/.test(text)
}

const texts = new Set()
for (const file of await sourceFiles(fileURLToPath(root))) {
  const contents = await fs.readFile(file, 'utf8')
  const source = ts.createSourceFile(
    file,
    contents,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
  function visit(node) {
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && useful(node.text))
      texts.add(node.text.trim())
    if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      if (useful(node.text)) texts.add(node.text.trim())
    }
    if (ts.isJsxText(node) && useful(node.text)) texts.add(node.text.trim().replace(/\s+/g, ' '))
    ts.forEachChild(node, visit)
  }
  visit(source)
}

async function translate(text, language) {
  const url = new URL('https://translate.googleapis.com/translate_a/single')
  url.search = new URLSearchParams({ client: 'gtx', sl: 'de', tl: language, dt: 't', q: text })
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const response = await fetch(url)
    if (response.ok) {
      const body = await response.json()
      return body[0].map((part) => part[0]).join('')
    }
    await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)))
  }
  throw new Error(`Übersetzung fehlgeschlagen: ${language} / ${text}`)
}

const sourceTexts = [...texts].sort((a, b) => a.localeCompare(b, 'de'))
await fs.writeFile(
  new URL('file:///private/tmp/crazy-lab-source-texts.json'),
  JSON.stringify(sourceTexts, null, 2),
)
if (process.argv.includes('--extract')) {
  console.log(`${sourceTexts.length} deutsche Ausgangstexte extrahiert.`)
  process.exit(0)
}
if (process.argv.includes('--from-browser')) {
  const browserTranslations = JSON.parse(
    await fs.readFile('/private/tmp/crazy-lab-browser-translations.json', 'utf8'),
  )
  const neutralMissionTranslations = {
    en: {
      'Baue aus Karton und Watte ein schaurig-schönes Himmelbett für eine kleine Spukgestalt.':
        'Build a spooky and beautiful four-poster bed for a little ghost figure out of cardboard and cotton wool.',
      'Baue ein farbig schimmerndes Portal, durch das Geister-Spielfiguren reisen.':
        'Build a colourful, shimmering portal for ghost toy figures to travel through.',
      'Baue eine Kulisse, vor der Spielfiguren wie riesige Monster wirken.':
        'Build a backdrop that makes toy figures look like giant monsters.',
      'Baue einen aufklappbaren Sarkophag mit einer eingewickelten Spielfiguren-Mumie.':
        'Build a hinged sarcophagus with a wrapped toy mummy inside.',
      'Baue einen felsigen Vulkan für eine dramatische Spielfiguren-Forschungsszene.':
        'Build a rocky volcano for a dramatic toy-figure research scene.',
      'Das geheimnisvolle Spielfiguren-Geisterbett': 'The mysterious toy-figure ghost bed',
      'Das Spielfiguren-Zeitportal': 'The toy-figure time portal',
      'Der Spielfiguren-Mini-Vulkan': 'The toy-figure mini volcano',
      'Gestalte eine realistische, herrlich chaotische Miniküche für Zombie-Spielfiguren.':
        'Create a realistic, wonderfully chaotic mini kitchen for zombie toy figures.',
      'Konstruiere ein Spielfiguren-Möbel, dessen Geheimfach wirklich geöffnet werden kann.':
        'Build toy-figure furniture with a secret compartment that really opens.',
      'Lass eine Spielfigur durch Perspektive grösser als ein Mensch wirken.':
        'Use perspective to make a toy figure look bigger than a person.',
      'Lege die Spielfigur ins fertige Geisterbett und richte die Szene ein.':
        'Place the toy figure in the finished ghost bed and arrange the scene.',
      'Spielfiguren-Zubehör': 'Toy-figure accessories',
    },
    fr: {
      'Baue aus Karton und Watte ein schaurig-schönes Himmelbett für eine kleine Spukgestalt.':
        'Fabrique un magnifique lit à baldaquin effrayant pour un petit fantôme avec du carton et de la ouate.',
      'Baue ein farbig schimmerndes Portal, durch das Geister-Spielfiguren reisen.':
        'Construis un portail coloré et scintillant pour les figurines fantômes.',
      'Baue eine Kulisse, vor der Spielfiguren wie riesige Monster wirken.':
        'Crée un décor qui donne aux figurines l’apparence de monstres géants.',
      'Baue einen aufklappbaren Sarkophag mit einer eingewickelten Spielfiguren-Mumie.':
        'Construis un sarcophage à charnières avec une momie miniature emmaillotée.',
      'Baue einen felsigen Vulkan für eine dramatische Spielfiguren-Forschungsszene.':
        'Construis un volcan rocheux pour une scène de recherche spectaculaire avec des figurines.',
      'Das geheimnisvolle Spielfiguren-Geisterbett': 'Le mystérieux lit fantôme pour figurines',
      'Das Spielfiguren-Zeitportal': 'Le portail temporel des figurines',
      'Der Spielfiguren-Mini-Vulkan': 'Le mini-volcan des figurines',
      'Gestalte eine realistische, herrlich chaotische Miniküche für Zombie-Spielfiguren.':
        'Crée une mini-cuisine réaliste et délicieusement chaotique pour des figurines zombies.',
      'Konstruiere ein Spielfiguren-Möbel, dessen Geheimfach wirklich geöffnet werden kann.':
        'Construis un meuble pour figurines avec un compartiment secret qui s’ouvre vraiment.',
      'Lass eine Spielfigur durch Perspektive grösser als ein Mensch wirken.':
        'Utilise la perspective pour faire paraître une figurine plus grande qu’une personne.',
      'Lege die Spielfigur ins fertige Geisterbett und richte die Szene ein.':
        'Place la figurine dans le lit fantôme terminé et arrange la scène.',
      'Spielfiguren-Zubehör': 'Accessoires pour figurines',
    },
    es: {
      'Baue aus Karton und Watte ein schaurig-schönes Himmelbett für eine kleine Spukgestalt.':
        'Construye una cama con dosel bonita y espeluznante para un pequeño fantasma con cartón y algodón.',
      'Baue ein farbig schimmerndes Portal, durch das Geister-Spielfiguren reisen.':
        'Construye un portal colorido y brillante para que viajen las figuras fantasma.',
      'Baue eine Kulisse, vor der Spielfiguren wie riesige Monster wirken.':
        'Crea un escenario que haga que las figuras parezcan monstruos gigantes.',
      'Baue einen aufklappbaren Sarkophag mit einer eingewickelten Spielfiguren-Mumie.':
        'Construye un sarcófago con bisagra y una momia de juguete envuelta dentro.',
      'Baue einen felsigen Vulkan für eine dramatische Spielfiguren-Forschungsszene.':
        'Construye un volcán rocoso para una espectacular escena de investigación con figuras.',
      'Das geheimnisvolle Spielfiguren-Geisterbett': 'La misteriosa cama fantasma para figuras',
      'Das Spielfiguren-Zeitportal': 'El portal del tiempo de las figuras',
      'Der Spielfiguren-Mini-Vulkan': 'El minivolcán de las figuras',
      'Gestalte eine realistische, herrlich chaotische Miniküche für Zombie-Spielfiguren.':
        'Crea una minicocina realista y maravillosamente caótica para figuras zombi.',
      'Konstruiere ein Spielfiguren-Möbel, dessen Geheimfach wirklich geöffnet werden kann.':
        'Construye un mueble para figuras con un compartimento secreto que se abra de verdad.',
      'Lass eine Spielfigur durch Perspektive grösser als ein Mensch wirken.':
        'Usa la perspectiva para que una figura parezca más grande que una persona.',
      'Lege die Spielfigur ins fertige Geisterbett und richte die Szene ein.':
        'Coloca la figura en la cama fantasma terminada y prepara la escena.',
      'Spielfiguren-Zubehör': 'Accesorios para figuras',
    },
    it: {
      'Baue aus Karton und Watte ein schaurig-schönes Himmelbett für eine kleine Spukgestalt.':
        'Costruisci un letto a baldacchino bello e spaventoso per un piccolo fantasma usando cartone e ovatta.',
      'Baue ein farbig schimmerndes Portal, durch das Geister-Spielfiguren reisen.':
        'Costruisci un portale colorato e scintillante per far viaggiare i personaggi fantasma.',
      'Baue eine Kulisse, vor der Spielfiguren wie riesige Monster wirken.':
        'Crea uno sfondo che faccia sembrare i personaggi dei mostri giganti.',
      'Baue einen aufklappbaren Sarkophag mit einer eingewickelten Spielfiguren-Mumie.':
        'Costruisci un sarcofago apribile con una mummia giocattolo avvolta al suo interno.',
      'Baue einen felsigen Vulkan für eine dramatische Spielfiguren-Forschungsszene.':
        'Costruisci un vulcano roccioso per una spettacolare scena di ricerca con personaggi giocattolo.',
      'Das geheimnisvolle Spielfiguren-Geisterbett':
        'Il misterioso letto fantasma per personaggi giocattolo',
      'Das Spielfiguren-Zeitportal': 'Il portale temporale dei personaggi giocattolo',
      'Der Spielfiguren-Mini-Vulkan': 'Il mini vulcano dei personaggi giocattolo',
      'Gestalte eine realistische, herrlich chaotische Miniküche für Zombie-Spielfiguren.':
        'Crea una mini cucina realistica e meravigliosamente caotica per personaggi zombie.',
      'Konstruiere ein Spielfiguren-Möbel, dessen Geheimfach wirklich geöffnet werden kann.':
        'Costruisci un mobile per personaggi con un vano segreto che si apre davvero.',
      'Lass eine Spielfigur durch Perspektive grösser als ein Mensch wirken.':
        'Usa la prospettiva per far sembrare un personaggio giocattolo più grande di una persona.',
      'Lege die Spielfigur ins fertige Geisterbett und richte die Szene ein.':
        'Metti il personaggio giocattolo nel letto fantasma finito e prepara la scena.',
      'Spielfiguren-Zubehör': 'Accessori per personaggi giocattolo',
    },
  }
  for (const language of ['en', 'fr', 'es', 'it']) {
    Object.assign(browserTranslations[language], neutralMissionTranslations[language])
  }
  const output = `// Einmalig aus den versionierten deutschen App-Inhalten erzeugt. Keine Übersetzung erfolgt zur Laufzeit.\nexport const GENERATED_TRANSLATIONS = ${JSON.stringify(browserTranslations, null, 2)} as const\n`
  await fs.writeFile(new URL('../src/i18n/generatedTranslations.ts', import.meta.url), output)
  console.log('Vier feste Sprachdateien aus der geprüften Browser-Übersetzung erstellt.')
  process.exit(0)
}
const cacheUrl = new URL('file:///private/tmp/crazy-lab-translation-cache.json')
let dictionaries = {}
try {
  dictionaries = JSON.parse(await fs.readFile(cacheUrl, 'utf8'))
} catch {
  // Beim ersten Lauf existiert noch kein Zwischenspeicher.
}
for (const language of ['en', 'fr', 'es', 'it']) {
  dictionaries[language] ??= {}
  const missing = sourceTexts.filter((text) => !dictionaries[language][text])
  for (let index = 0; index < missing.length; index += 3) {
    const batch = missing.slice(index, index + 3)
    const translated = await Promise.all(batch.map((text) => translate(text, language)))
    for (let itemIndex = 0; itemIndex < batch.length; itemIndex += 1) {
      dictionaries[language][batch[itemIndex]] = translated[itemIndex]
    }
    await fs.writeFile(cacheUrl, JSON.stringify(dictionaries))
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
}

const output = `// Automatisch aus den versionierten deutschen App-Inhalten erzeugt.\nexport const GENERATED_TRANSLATIONS = ${JSON.stringify(dictionaries, null, 2)} as const\n`
await fs.writeFile(new URL('../src/i18n/generatedTranslations.ts', import.meta.url), output)
console.log(`${sourceTexts.length} Texte in drei Sprachen übersetzt.`)
