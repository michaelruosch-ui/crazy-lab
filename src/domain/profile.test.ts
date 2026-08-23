import { describe, expect, it } from 'vitest'
import { isBirthdayToday, type Birthday } from './profile'

const laura: Birthday = { id: 'b1', personName: 'Laura', monthDay: '08-23' }

describe('isBirthdayToday', () => {
  it('erkennt einen Geburtstag am selben Monat/Tag, unabhängig vom Jahr', () => {
    expect(isBirthdayToday(laura, new Date(2026, 7, 23))).toBe(true)
    expect(isBirthdayToday(laura, new Date(2030, 7, 23, 23, 0))).toBe(true)
  })

  it('erkennt einen anderen Tag korrekt nicht als Geburtstag', () => {
    expect(isBirthdayToday(laura, new Date(2026, 7, 24))).toBe(false)
    expect(isBirthdayToday(laura, new Date(2026, 8, 23))).toBe(false)
  })
})
