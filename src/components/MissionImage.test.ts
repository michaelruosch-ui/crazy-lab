import { describe, expect, it } from 'vitest'
import { missions } from '../data'
import {
  decodeCustomMissionImage,
  encodeCustomMissionImage,
  getCustomMissionScene,
  getMissionVisualSpec,
  getPremiumMissionArt,
} from './MissionImage'

describe('Missionsbilder', () => {
  it('gibt jeder Mission ein eindeutig erzeugtes Motiv', () => {
    const fingerprints = missions.map(
      (mission) => getMissionVisualSpec(mission.imagePlaceholder, mission.title).fingerprint,
    )
    expect(missions).toHaveLength(100)
    expect(new Set(fingerprints).size).toBe(missions.length)
  })

  it('bewahrt die neue Premium-Szene und zeigt alte Bildkombinationen weiter an', () => {
    const placeholder = encodeCustomMissionImage({ scene: 'witch-cauldron' })
    expect(decodeCustomMissionImage(placeholder)).toEqual({ scene: 'witch-cauldron' })
    expect(getCustomMissionScene(placeholder)).toMatchObject({
      label: 'Hexenkessel',
      mood: 'gruselig',
    })
    expect(getMissionVisualSpec('custom-v1:blood:ghost:gruselig', 'Alte Mission')).toMatchObject({
      hue: 344,
      symbol: '👻',
      mood: 'gruselig',
    })
  })

  it('ordnet allen sechs Gratis-Missionen ein eigenes Premium-Bild zu', () => {
    const titles = [
      'Der Blutkleim',
      'Das leuchtende Geisterportal',
      'Der blutrote Schatten-Trank',
      'Regen im Glas',
      'Das Monster-Frühstück',
      'Die Mini-Schatzsuche',
    ]
    const positions = titles.map((title) => getPremiumMissionArt(title)?.position)
    expect(positions.every(Boolean)).toBe(true)
    expect(new Set(positions)).toHaveLength(6)
  })

  it('bietet zwölf voneinander getrennte neue Titelbild-Szenen', async () => {
    const { CUSTOM_IMAGE_SCENES } = await import('./MissionImage')
    expect(CUSTOM_IMAGE_SCENES).toHaveLength(12)
    expect(new Set(CUSTOM_IMAGE_SCENES.map((scene) => scene.position))).toHaveLength(12)
  })
})
