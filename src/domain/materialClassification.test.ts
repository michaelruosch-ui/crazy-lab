import { describe, expect, it } from 'vitest'
import { classifyCustomMaterial } from './materialClassification'

describe('eigene Materialien einordnen', () => {
  it('erkennt Wattestäbchen als Bastelmaterial', () => {
    expect(classifyCustomMaterial('  wattestäbchen  ')).toEqual({
      materialName: 'Wattestäbchen',
      materialType: 'bastelmaterial',
      area: 'bastelkiste',
      label: 'Bastelmaterial',
    })
  })

  it('bewahrt unbekannte Begriffe sinnvoll als Sonstiges auf', () => {
    expect(classifyCustomMaterial('Zauberding')).toMatchObject({
      materialName: 'Zauberding',
      materialType: 'sonstiges',
      area: 'anderswo',
    })
  })
})
