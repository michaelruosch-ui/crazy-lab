import type { MascotId } from '../domain'

/** Reine Zeichenlogik (Canvas) für alle wählbaren Maskottchen. Keine Framework-Abhängigkeit
 * ausser der Canvas-API, damit sie sowohl im `Mascot`-Komponente-Ref-Callback als auch
 * unabhängig getestet werden kann. */

export type MascotSpecies =
  'bear' | 'marmot' | 'raccoon' | 'wolf' | 'bat' | 'owl' | 'frog' | 'spider'

export type MascotPaletteKey = 'violet' | 'teal' | 'pink' | 'acid' | 'blood' | 'amber'

interface Palette {
  body: string
  dark: string
  light: string
  accent: string
  label: string
}

export const PALETTES: Record<MascotPaletteKey, Palette> = {
  violet: {
    body: '#7c4dcc',
    dark: '#4a2b7a',
    light: '#9d75e0',
    accent: '#a463f2',
    label: 'Violett',
  },
  teal: { body: '#0f8a78', dark: '#075049', light: '#3fc9b0', accent: '#23e6c8', label: 'Türkis' },
  pink: { body: '#c2447a', dark: '#75204a', light: '#e07aa8', accent: '#ff4fa3', label: 'Pink' },
  acid: {
    body: '#7a9f2a',
    dark: '#445916',
    light: '#a8d456',
    accent: '#b6ff3c',
    label: 'Giftgrün',
  },
  blood: {
    body: '#8a1f3a',
    dark: '#4a0f1f',
    light: '#b8446a',
    accent: '#ff4f6a',
    label: 'Blutrot',
  },
  amber: {
    body: '#b8752a',
    dark: '#6b3f12',
    light: '#e0a860',
    accent: '#ffb84f',
    label: 'Bernstein',
  },
}

export const SPECIES_LABEL: Record<MascotSpecies, string> = {
  bear: 'Bär',
  marmot: 'Murmeltier',
  raccoon: 'Waschbär',
  wolf: 'Wolf',
  bat: 'Fledermaus',
  owl: 'Eule',
  frog: 'Frosch',
  spider: 'Spinnenwesen',
}

export interface MascotCatalogEntry {
  id: MascotId
  species: MascotSpecies
  palette: MascotPaletteKey
  gore: boolean
  name: string
}

export const MASCOT_CATALOG: MascotCatalogEntry[] = [
  {
    id: 'blutiger-kuschelbaer',
    species: 'bear',
    palette: 'violet',
    gore: true,
    name: 'Blutiger Kuschelbär',
  },
  { id: 'nachtbaer', species: 'bear', palette: 'violet', gore: false, name: 'Nachtbär' },
  { id: 'der-schlingbaer', species: 'bear', palette: 'blood', gore: true, name: 'Der Schlingbär' },
  { id: 'frostbaer', species: 'bear', palette: 'teal', gore: false, name: 'Frostbär' },
  { id: 'giftbaer', species: 'bear', palette: 'acid', gore: false, name: 'Giftbär' },
  { id: 'zappelmurmel', species: 'marmot', palette: 'amber', gore: false, name: 'Zappelmurmel' },
  { id: 'hoehlenmurmel', species: 'marmot', palette: 'teal', gore: false, name: 'Höhlenmurmel' },
  {
    id: 'der-nagerschreck',
    species: 'marmot',
    palette: 'pink',
    gore: true,
    name: 'Der Nagerschreck',
  },
  { id: 'mondmurmel', species: 'marmot', palette: 'violet', gore: false, name: 'Mondmurmel' },
  {
    id: 'schattenwaschbaer',
    species: 'raccoon',
    palette: 'teal',
    gore: false,
    name: 'Schattenwaschbär',
  },
  { id: 'nebelbandit', species: 'raccoon', palette: 'violet', gore: false, name: 'Nebelbandit' },
  {
    id: 'der-muelltaucher',
    species: 'raccoon',
    palette: 'acid',
    gore: true,
    name: 'Der Mülltaucher',
  },
  { id: 'glitzerbandit', species: 'raccoon', palette: 'pink', gore: false, name: 'Glitzerbandit' },
  { id: 'der-heuler', species: 'wolf', palette: 'blood', gore: true, name: 'Der Heuler' },
  { id: 'mondwolf', species: 'wolf', palette: 'violet', gore: false, name: 'Mondwolf' },
  { id: 'frostzahn', species: 'wolf', palette: 'teal', gore: false, name: 'Frostzahn' },
  { id: 'giftschnauze', species: 'wolf', palette: 'acid', gore: false, name: 'Giftschnauze' },
  { id: 'nachtflatterer', species: 'bat', palette: 'violet', gore: false, name: 'Nachtflatterer' },
  { id: 'der-blutsauger', species: 'bat', palette: 'pink', gore: true, name: 'Der Blutsauger' },
  { id: 'hoehlenfluegel', species: 'bat', palette: 'teal', gore: false, name: 'Höhlenflügel' },
  {
    id: 'daemmerflatterer',
    species: 'bat',
    palette: 'amber',
    gore: false,
    name: 'Dämmerflatterer',
  },
  { id: 'nachtwache', species: 'owl', palette: 'teal', gore: false, name: 'Nachtwache' },
  { id: 'mondauge', species: 'owl', palette: 'violet', gore: false, name: 'Mondauge' },
  { id: 'giftfeder', species: 'owl', palette: 'acid', gore: false, name: 'Giftfeder' },
  { id: 'der-beutegreifer', species: 'owl', palette: 'pink', gore: true, name: 'Der Beutegreifer' },
  { id: 'sumpfhuepfer', species: 'frog', palette: 'acid', gore: false, name: 'Sumpfhüpfer' },
  {
    id: 'froschkoenig-der-nacht',
    species: 'frog',
    palette: 'teal',
    gore: false,
    name: 'Froschkönig der Nacht',
  },
  {
    id: 'der-schlundfrosch',
    species: 'frog',
    palette: 'violet',
    gore: true,
    name: 'Der Schlundfrosch',
  },
  { id: 'glibberkroete', species: 'frog', palette: 'pink', gore: false, name: 'Glibberkröte' },
  { id: 'netzwaechter', species: 'spider', palette: 'violet', gore: false, name: 'Netzwächter' },
  {
    id: 'der-achtbeinige-schrecken',
    species: 'spider',
    palette: 'blood',
    gore: true,
    name: 'Der Achtbeinige Schrecken',
  },
  {
    id: 'spinnenschatten',
    species: 'spider',
    palette: 'teal',
    gore: false,
    name: 'Spinnenschatten',
  },
  { id: 'giftspinne', species: 'spider', palette: 'acid', gore: false, name: 'Giftspinne' },
]

export const DEFAULT_MASCOT_ID: MascotId = 'blutiger-kuschelbaer'

export function getMascotEntry(id: MascotId): MascotCatalogEntry {
  return MASCOT_CATALOG.find((e) => e.id === id) ?? MASCOT_CATALOG[0]!
}

function furTufts(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  count: number,
  color: string,
  len: number,
) {
  ctx.fillStyle = color
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    const bx = cx + Math.cos(a) * rx * 0.92
    const by = cy + Math.sin(a) * ry * 0.92
    const tx = cx + Math.cos(a) * rx * (0.92 + len)
    const ty = cy + Math.sin(a) * ry * (0.92 + len)
    const px = -Math.sin(a) * 5
    const py = Math.cos(a) * 5
    ctx.beginPath()
    ctx.moveTo(bx + px, by + py)
    ctx.lineTo(tx, ty)
    ctx.lineTo(bx - px, by - py)
    ctx.closePath()
    ctx.fill()
  }
}

function bristles(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  count: number,
  color: string,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + 0.2
    const x1 = cx + Math.cos(a) * r * 0.95
    const y1 = cy + Math.sin(a) * r * 0.95
    const x2 = cx + Math.cos(a) * r * 1.2
    const y2 = cy + Math.sin(a) * r * 1.2
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
}

function teethRow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  width: number,
  count: number,
  h: number,
  up: boolean,
) {
  const step = width / count
  ctx.fillStyle = '#eafffb'
  for (let i = 0; i < count; i++) {
    const x = cx - width / 2 + i * step
    ctx.beginPath()
    if (up) {
      ctx.moveTo(x, y)
      ctx.lineTo(x + step / 2, y + h)
      ctx.lineTo(x + step, y)
    } else {
      ctx.moveTo(x, y)
      ctx.lineTo(x + step / 2, y - h)
      ctx.lineTo(x + step, y)
    }
    ctx.closePath()
    ctx.fill()
  }
}

function glowEye(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.save()
  ctx.shadowColor = color
  ctx.shadowBlur = 16
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
  ctx.beginPath()
  ctx.arc(x + r * 0.25, y - r * 0.25, r * 0.35, 0, Math.PI * 2)
  ctx.fillStyle = '#071018'
  ctx.fill()
}

function eatenEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  iris: string,
  seed: number,
) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = '#f5f0e8'
  ctx.fill()
  ctx.strokeStyle = 'rgba(190,20,40,0.55)'
  ctx.lineWidth = 1
  for (let i = 0; i < 5; i++) {
    const a = seed + i * 1.31
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.arc(x, y, r * 0.55, 0, Math.PI * 2)
  ctx.fillStyle = iris
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x, y, r * 0.24, 0, Math.PI * 2)
  ctx.fillStyle = '#071018'
  ctx.fill()
}

function bloodDrip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  len: number,
  color: string,
  seed: number,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 3.5
  ctx.lineCap = 'round'
  const wob = Math.sin(seed) * 4
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.quadraticCurveTo(x + wob, y + len * 0.6, x + wob * 0.5, y + len)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x + wob * 0.5, y + len, 2.6, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
}

/** Isst-Zunge im offenen Maul, darauf liegt ein grosses gegessenes Auge. */
function tongue(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  ctx.beginPath()
  ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#c23a52'
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cx, cy - h * 0.7)
  ctx.lineTo(cx, cy + h * 0.7)
  ctx.stroke()
}

function goreMouth(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  pal: Palette,
  seed: number,
) {
  ctx.beginPath()
  ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#1a0508'
  ctx.fill()
  teethRow(ctx, cx, cy - h * 0.34, w * 0.82, 6, 9, false)
  teethRow(ctx, cx, cy + h * 0.34, w * 0.82, 6, 9, true)
  tongue(ctx, cx, cy + h * 0.34, w * 0.4, h * 0.32)
  eatenEye(ctx, cx, cy - h * 0.02, Math.min(w, h) * 0.28, pal.accent, seed)
  bloodDrip(ctx, cx - w * 0.3, cy + h * 0.5, 22, '#ff4f6a', seed)
  bloodDrip(ctx, cx + w * 0.24, cy + h * 0.52, 17, '#ff4f6a', seed + 2)
}

function eyeSocket(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = '#1a0508'
  ctx.fill()
  ctx.strokeStyle = '#ff4f6a'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(x - r * 0.6, y - r * 0.6)
  ctx.lineTo(x + r * 0.6, y + r * 0.6)
  ctx.moveTo(x + r * 0.6, y - r * 0.6)
  ctx.lineTo(x - r * 0.6, y + r * 0.6)
  ctx.stroke()
}

type DrawFn = (ctx: CanvasRenderingContext2D, p: Palette, gore: boolean) => void

const DRAW: Record<MascotSpecies, DrawFn> = {
  bear(ctx, p, gore) {
    furTufts(ctx, 120, 152, 68, 60, 22, p.dark, 0.22)
    ctx.beginPath()
    ctx.ellipse(120, 152, 66, 58, 0, 0, Math.PI * 2)
    ctx.fillStyle = p.body
    ctx.fill()
    ctx.beginPath()
    ctx.arc(70, 92, 21, 0, Math.PI * 2)
    ctx.fillStyle = p.dark
    ctx.fill()
    ctx.beginPath()
    ctx.arc(170, 92, 21, 0, Math.PI * 2)
    ctx.fillStyle = p.dark
    ctx.fill()
    ctx.beginPath()
    ctx.arc(70, 92, 10, 0, Math.PI * 2)
    ctx.fillStyle = p.light
    ctx.fill()
    ctx.beginPath()
    ctx.arc(170, 92, 10, 0, Math.PI * 2)
    ctx.fillStyle = p.light
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(120, 178, 30, 22, 0, 0, Math.PI * 2)
    ctx.fillStyle = p.light
    ctx.fill()
    if (gore) {
      glowEye(ctx, 92, 132, 9, p.accent)
      eyeSocket(ctx, 148, 132, 9)
      goreMouth(ctx, 120, 182, 58, 40, p, 3.1)
    } else {
      glowEye(ctx, 96, 132, 9, p.accent)
      glowEye(ctx, 144, 132, 9, p.accent)
      ctx.beginPath()
      ctx.arc(120, 170, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#1a0508'
      ctx.fill()
      ctx.strokeStyle = p.dark
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.arc(120, 182, 14, 0.15 * Math.PI, 0.85 * Math.PI)
      ctx.stroke()
      teethRow(ctx, 120, 190, 16, 2, 6, false)
    }
  },
  marmot(ctx, p, gore) {
    ctx.beginPath()
    ctx.ellipse(120, 160, 78, 46, 0, 0, Math.PI * 2)
    ctx.fillStyle = p.body
    ctx.fill()
    ctx.beginPath()
    ctx.arc(88, 122, 13, 0, Math.PI * 2)
    ctx.fillStyle = p.dark
    ctx.fill()
    ctx.beginPath()
    ctx.arc(152, 122, 13, 0, Math.PI * 2)
    ctx.fillStyle = p.dark
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(70, 168, 16, 20, 0, 0, Math.PI * 2)
    ctx.fillStyle = p.light
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(170, 168, 16, 20, 0, 0, Math.PI * 2)
    ctx.fillStyle = p.light
    ctx.fill()
    if (gore) {
      glowEye(ctx, 98, 148, 8, p.accent)
      eyeSocket(ctx, 142, 148, 8)
      goreMouth(ctx, 120, 178, 52, 32, p, 1.4)
    } else {
      glowEye(ctx, 100, 148, 8, p.accent)
      glowEye(ctx, 140, 148, 8, p.accent)
      ctx.fillStyle = '#eafffb'
      ctx.fillRect(112, 172, 7, 14)
      ctx.fillRect(121, 172, 7, 14)
      ctx.strokeStyle = p.dark
      ctx.lineWidth = 1
      ctx.strokeRect(112, 172, 7, 14)
      ctx.strokeRect(121, 172, 7, 14)
    }
  },
  raccoon(ctx, p, gore) {
    ctx.beginPath()
    ctx.ellipse(120, 152, 62, 58, 0, 0, Math.PI * 2)
    ctx.fillStyle = p.body
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(62, 100)
    ctx.lineTo(80, 60)
    ctx.lineTo(96, 100)
    ctx.closePath()
    ctx.fillStyle = p.dark
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(144, 100)
    ctx.lineTo(160, 60)
    ctx.lineTo(178, 100)
    ctx.closePath()
    ctx.fillStyle = p.dark
    ctx.fill()
    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.ellipse(210, 130 + i * 16, 14, 8, 0.5, 0, Math.PI * 2)
      ctx.fillStyle = i % 2 === 0 ? p.dark : p.light
      ctx.fill()
    }
    if (!gore) {
      ctx.beginPath()
      ctx.ellipse(120, 130, 44, 14, 0, 0, Math.PI * 2)
      ctx.fillStyle = p.dark
      ctx.fill()
      glowEye(ctx, 100, 130, 8, p.accent)
      glowEye(ctx, 140, 130, 8, p.accent)
      ctx.beginPath()
      ctx.arc(120, 168, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#1a0508'
      ctx.fill()
    } else {
      ctx.beginPath()
      ctx.ellipse(140, 130, 22, 12, 0, 0, Math.PI * 2)
      ctx.fillStyle = p.dark
      ctx.fill()
      glowEye(ctx, 140, 130, 8, p.accent)
      eyeSocket(ctx, 100, 130, 8)
      goreMouth(ctx, 120, 176, 50, 32, p, 2.2)
    }
  },
  wolf(ctx, p, gore) {
    ctx.beginPath()
    ctx.ellipse(118, 150, 54, 58, 0, 0, Math.PI * 2)
    ctx.fillStyle = p.body
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(78, 100)
    ctx.lineTo(70, 54)
    ctx.lineTo(102, 92)
    ctx.closePath()
    ctx.fillStyle = p.dark
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(158, 100)
    ctx.lineTo(166, 54)
    ctx.lineTo(134, 92)
    ctx.closePath()
    ctx.fillStyle = p.dark
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(118, 192, 26, 20, 0, 0, Math.PI * 2)
    ctx.fillStyle = p.light
    ctx.fill()
    if (gore) {
      glowEye(ctx, 92, 132, 8, p.accent)
      eyeSocket(ctx, 144, 132, 8)
      goreMouth(ctx, 118, 196, 44, 30, p, 0.7)
    } else {
      glowEye(ctx, 96, 132, 8, p.accent)
      glowEye(ctx, 140, 132, 8, p.accent)
      ctx.beginPath()
      ctx.arc(118, 186, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#1a0508'
      ctx.fill()
      teethRow(ctx, 118, 200, 26, 3, 8, false)
    }
  },
  bat(ctx, p, gore) {
    const wing = (mirror: boolean) => {
      const s = mirror ? -1 : 1
      ctx.beginPath()
      ctx.moveTo(120 + s * 26, 130)
      ctx.quadraticCurveTo(120 + s * 100, 90, 120 + s * 96, 150)
      ctx.quadraticCurveTo(120 + s * 88, 140, 120 + s * 70, 160)
      ctx.quadraticCurveTo(120 + s * 60, 150, 120 + s * 40, 168)
      ctx.closePath()
      ctx.fillStyle = p.dark
      ctx.fill()
    }
    wing(false)
    wing(true)
    ctx.beginPath()
    ctx.ellipse(120, 150, 34, 42, 0, 0, Math.PI * 2)
    ctx.fillStyle = p.body
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(100, 116)
    ctx.lineTo(96, 92)
    ctx.lineTo(112, 114)
    ctx.closePath()
    ctx.fillStyle = p.dark
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(140, 116)
    ctx.lineTo(144, 92)
    ctx.lineTo(128, 114)
    ctx.closePath()
    ctx.fillStyle = p.dark
    ctx.fill()
    if (gore) {
      glowEye(ctx, 108, 142, 7, p.accent)
      eyeSocket(ctx, 132, 142, 7)
      goreMouth(ctx, 120, 172, 34, 24, p, 4.0)
    } else {
      glowEye(ctx, 110, 142, 7, p.accent)
      glowEye(ctx, 130, 142, 7, p.accent)
      ctx.fillStyle = '#eafffb'
      ctx.beginPath()
      ctx.moveTo(112, 166)
      ctx.lineTo(116, 176)
      ctx.lineTo(120, 166)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(120, 166)
      ctx.lineTo(124, 176)
      ctx.lineTo(128, 166)
      ctx.fill()
    }
  },
  owl(ctx, p, gore) {
    ctx.beginPath()
    ctx.arc(120, 152, 62, 0, Math.PI * 2)
    ctx.fillStyle = p.body
    ctx.fill()
    bristles(ctx, 120, 152, 62, 26, p.dark)
    ctx.beginPath()
    ctx.moveTo(84, 100)
    ctx.lineTo(76, 70)
    ctx.lineTo(98, 96)
    ctx.closePath()
    ctx.fillStyle = p.dark
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(156, 100)
    ctx.lineTo(164, 70)
    ctx.lineTo(142, 96)
    ctx.closePath()
    ctx.fillStyle = p.dark
    ctx.fill()
    ctx.beginPath()
    ctx.arc(96, 140, 26, 0, Math.PI * 2)
    ctx.fillStyle = p.light
    ctx.fill()
    ctx.beginPath()
    ctx.arc(144, 140, 26, 0, Math.PI * 2)
    ctx.fillStyle = p.light
    ctx.fill()
    if (gore) {
      glowEye(ctx, 96, 140, 15, p.accent)
      eyeSocket(ctx, 144, 140, 15)
      ctx.beginPath()
      ctx.moveTo(112, 172)
      ctx.lineTo(120, 190)
      ctx.lineTo(128, 172)
      ctx.closePath()
      ctx.fillStyle = '#1a0508'
      ctx.fill()
      eatenEye(ctx, 120, 179, 9, p.accent, 5.5)
      bloodDrip(ctx, 118, 188, 16, '#ff4f6a', 1.2)
    } else {
      glowEye(ctx, 96, 140, 15, p.accent)
      glowEye(ctx, 144, 140, 15, p.accent)
      ctx.beginPath()
      ctx.moveTo(112, 172)
      ctx.lineTo(120, 186)
      ctx.lineTo(128, 172)
      ctx.closePath()
      ctx.fillStyle = p.dark
      ctx.fill()
    }
  },
  frog(ctx, p, gore) {
    ctx.beginPath()
    ctx.ellipse(120, 168, 74, 46, 0, 0, Math.PI * 2)
    ctx.fillStyle = p.body
    ctx.fill()
    ctx.fillStyle = p.dark
    for (const [dx, dy, r] of [
      [-40, -6, 7],
      [30, 10, 6],
      [55, -10, 5],
      [-58, 12, 5],
      [5, 20, 6],
    ] as const) {
      ctx.beginPath()
      ctx.arc(120 + dx, 168 + dy, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.beginPath()
    ctx.arc(92, 118, 20, 0, Math.PI * 2)
    ctx.fillStyle = p.body
    ctx.fill()
    ctx.beginPath()
    ctx.arc(148, 118, 20, 0, Math.PI * 2)
    ctx.fillStyle = p.body
    ctx.fill()
    if (gore) {
      glowEye(ctx, 92, 118, 11, p.accent)
      eyeSocket(ctx, 148, 118, 11)
      goreMouth(ctx, 120, 178, 60, 26, p, 2.8)
    } else {
      glowEye(ctx, 92, 118, 11, p.accent)
      glowEye(ctx, 148, 118, 11, p.accent)
      ctx.strokeStyle = p.dark
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(80, 178)
      ctx.quadraticCurveTo(120, 194, 160, 178)
      ctx.stroke()
    }
  },
  spider(ctx, p, gore) {
    ctx.strokeStyle = p.dark
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    for (let i = 0; i < 8; i++) {
      const s = i < 4 ? -1 : 1
      const idx = i % 4
      const baseY = 130 + idx * 16
      ctx.beginPath()
      ctx.moveTo(120 + s * 30, baseY)
      ctx.quadraticCurveTo(120 + s * 80, baseY - 10, 120 + s * 100, baseY + 24)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(120, 156, 46, 0, Math.PI * 2)
    ctx.fillStyle = p.body
    ctx.fill()
    bristles(ctx, 120, 156, 46, 20, p.dark)
    const eyeSpots: [number, number][] = [
      [-14, -18],
      [14, -18],
      [-22, -6],
      [22, -6],
      [0, -26],
    ]
    eyeSpots.forEach(([dx, dy], i) => {
      if (gore && i === 4) {
        eyeSocket(ctx, 120 + dx, 156 + dy, 6)
        return
      }
      glowEye(ctx, 120 + dx, 156 + dy, i === 4 ? 6 : 4, p.accent)
    })
    if (gore) {
      goreMouth(ctx, 120, 186, 40, 24, p, 6.1)
    } else {
      ctx.fillStyle = '#eafffb'
      ctx.beginPath()
      ctx.moveTo(110, 182)
      ctx.lineTo(114, 192)
      ctx.lineTo(118, 182)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(122, 182)
      ctx.lineTo(126, 192)
      ctx.lineTo(130, 182)
      ctx.fill()
    }
  },
}

/** Zeichnet ein Maskottchen in ein 240x240-Koordinatensystem. Der Aufrufer skaliert das
 * `<canvas>`-Element per CSS/`ctx.scale` auf die gewünschte Anzeigegrösse. */
export function drawMascot(ctx: CanvasRenderingContext2D, mascotId: MascotId): void {
  const entry = getMascotEntry(mascotId)
  ctx.clearRect(0, 0, 240, 240)
  DRAW[entry.species](ctx, PALETTES[entry.palette], entry.gore)
}
