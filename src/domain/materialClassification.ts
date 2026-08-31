import type { LabCabinetArea, MaterialType } from './labCabinet'

export interface MaterialClassification {
  materialName: string
  materialType: MaterialType
  area: LabCabinetArea
  label: string
}

const RULES: { pattern: RegExp; type: MaterialType; area: LabCabinetArea; label: string }[] = [
  {
    pattern: /watte|wattestäb|papier|karton|kleber|glitzer|perle|wolle|stoff|filz|draht|folie/i,
    type: 'bastelmaterial',
    area: 'bastelkiste',
    label: 'Bastelmaterial',
  },
  {
    pattern: /schere|pinsel|stift|lineal|locher|zange|kamera|lampe/i,
    type: 'werkzeug',
    area: 'bastelkiste',
    label: 'Werkzeug',
  },
  {
    pattern: /glas|becher|flasche|dose|schachtel|box|behälter/i,
    type: 'behaelter',
    area: 'kueche',
    label: 'Behälter',
  },
  {
    pattern: /saft|sirup|milch|joghurt|zucker|frucht|beere|banane|zitrone|limonade|farbe.*essen/i,
    type: 'lebensmittel',
    area: 'kueche',
    label: 'Lebensmittel',
  },
]

function cleanName(value: string): string {
  const cleaned = value.trim().replace(/\s+/g, ' ')
  return cleaned ? cleaned[0]!.toLocaleUpperCase('de') + cleaned.slice(1) : ''
}

/** Transparente lokale Einordnung statt eines Cloud-KI-Aufrufs mit Elenas Daten. */
export function classifyCustomMaterial(value: string): MaterialClassification {
  const materialName = cleanName(value)
  const rule = RULES.find(({ pattern }) => pattern.test(materialName))
  return rule
    ? { materialName, materialType: rule.type, area: rule.area, label: rule.label }
    : { materialName, materialType: 'sonstiges', area: 'anderswo', label: 'Sonstiges Material' }
}
