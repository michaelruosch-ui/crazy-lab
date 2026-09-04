import { describe, expect, it } from 'vitest'
import { missions } from '../data'
import { getMissionVisualSpec } from './MissionImage'

describe('Missionsbilder', () => {
  it('gibt jeder Mission ein eindeutig erzeugtes Motiv', () => {
    const fingerprints = missions.map(
      (mission) => getMissionVisualSpec(mission.imagePlaceholder, mission.title).fingerprint,
    )
    expect(missions).toHaveLength(100)
    expect(new Set(fingerprints).size).toBe(missions.length)
  })
})
