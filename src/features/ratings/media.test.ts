import { describe, expect, it } from 'vitest'
import { MAX_VIDEO_BYTES, validateVideo } from './media'

describe('Tagebuchvideo', () => {
  it('akzeptiert höchstens drei Sekunden', () => {
    expect(validateVideo(3, 1_000_000)).toBeUndefined()
    expect(validateVideo(3.3, 1_000_000)).toContain('länger als 3 Sekunden')
  })

  it('weist nicht lesbare oder übergrosse Videos verständlich zurück', () => {
    expect(validateVideo(Number.NaN, 100)).toContain('nicht erkannt')
    expect(validateVideo(2, MAX_VIDEO_BYTES + 1)).toContain('zu gross')
  })
})
