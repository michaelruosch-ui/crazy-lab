import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'

const target = new URL('../ios/CrazyLab/www/', import.meta.url)
await rm(target, { recursive: true, force: true })
await mkdir(target, { recursive: true })
await cp(new URL('../dist/', import.meta.url), target, { recursive: true })
const indexUrl = new URL('index.html', target)
let index = await readFile(indexUrl, 'utf8')
// WKWebView behandelt file://-Module und crossorigin-Subressourcen wie fremde Ursprünge.
// Vites einzelnes gebündeltes Skript benötigt keine ESM-Ladeart; als defer-Skript bleiben
// Ausführungsreihenfolge und modernes Browserverhalten identisch.
index = index.replace('type="module"', 'defer').replaceAll(' crossorigin', '')
const scriptPath = index.match(/<script defer src="\.\/(assets\/[^"]+)"><\/script>/)?.[1]
const stylePath = index.match(/<link rel="stylesheet" href="\.\/(assets\/[^"]+)">/)?.[1]
if (!scriptPath || !stylePath)
  throw new Error('Native Assets konnten in index.html nicht gefunden werden.')
const [script, style] = await Promise.all([
  readFile(new URL(scriptPath, target), 'utf8'),
  readFile(new URL(stylePath, target), 'utf8'),
])
const classicScript = script
  .replaceAll('import.meta.url', 'document.baseURI')
  .replaceAll('import.meta.resolve', 'null')
index = index
  .replace(`<script defer src="./${scriptPath}"></script>`, '')
  .replace(`<link rel="stylesheet" href="./${stylePath}">`, () => `<style>${style}</style>`)
  .replace(/\s*<link rel="manifest"[^>]+>/, '')
  .replace(
    '</body>',
    () =>
      `<script>try{${classicScript.replaceAll('</script', '<\\/script')}}catch(error){document.body.innerText='Crazy Lab Startfehler: '+String(error && (error.stack || error.message) || error);throw error}</script></body>`,
  )
await writeFile(indexUrl, index)
console.log('Native Web-Inhalte wurden in ios/CrazyLab/www aktualisiert.')
