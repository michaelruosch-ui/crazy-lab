import { describe, expect, it } from 'vitest'
import { missions } from '../data'
import { filterMissions, missionNeedsAdult, minimumPeopleForMission } from './missionFilters'

describe('Missionsfilter', () => {
  it('kombiniert Zeit, Budget, Ort und Unordnung', () => {
    const result = filterMissions(missions, {
      maxDurationMinutes: 15,
      maxBudgetChf: 3,
      location: 'kueche',
      maxMess: 1,
      adultAvailable: true,
    })

    expect(result.length).toBeGreaterThan(0)
    expect(
      result.every(
        (mission) =>
          mission.durationMinutes <= 15 &&
          mission.estimatedCostChf <= 3 &&
          mission.location === 'kueche' &&
          mission.traits.unordentlich <= 1,
      ),
    ).toBe(true)
  })

  it('blendet Missionen mit Erwachsenenhilfe aus, wenn Elena allein ist', () => {
    const result = filterMissions(missions, { adultAvailable: false })
    expect(result.every((mission) => !missionNeedsAdult(mission))).toBe(true)
  })

  it('blendet Schwestern-Missionen für eine einzelne Person aus', () => {
    const result = filterMissions(missions, { adultAvailable: true, peopleAvailable: 1 })
    expect(result.every((mission) => minimumPeopleForMission(mission) === 1)).toBe(true)
  })
})
