import { describe, expect, it } from 'vitest'
import { missions } from '../data'
import {
  decodeCustomMissionImage,
  encodeCustomMissionImage,
  getMissionVisualSpec,
} from './MissionImage'

describe('Missionsbilder', () => {
  it('gibt jeder Mission ein eindeutig erzeugtes Motiv', () => {
    const fingerprints = missions.map(
      (mission) => getMissionVisualSpec(mission.imagePlaceholder, mission.title).fingerprint,
    )
    expect(missions).toHaveLength(100)
    expect(new Set(fingerprints).size).toBe(missions.length)
  })

  it('bewahrt Elenas gewählten Hintergrund, Symbol und Stimmung', () => {
    const placeholder = encodeCustomMissionImage({
      background: 'blood',
      symbol: 'ghost',
      mood: 'gruselig',
    })
    expect(decodeCustomMissionImage(placeholder)).toEqual({
      background: 'blood',
      symbol: 'ghost',
      mood: 'gruselig',
    })
    expect(getMissionVisualSpec(placeholder, 'Der Blutkleim')).toMatchObject({
      hue: 344,
      symbol: '👻',
      mood: 'gruselig',
    })
  })
})
