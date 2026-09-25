import { describe, expect, it } from 'vitest'
import { canUseProductOwnerTools } from './productOwnerAccess'

describe('Product-Owner-Zugriff in der Besuchsversion', () => {
  it('lässt Elena nur in der normalen Familienversion in die Werkstatt', () => {
    expect(canUseProductOwnerTools('elena', '/crazy-lab/')).toBe(true)
    expect(canUseProductOwnerTools('elena', '/crazy-lab/besuch-20260913-v7m4/')).toBe(false)
    expect(canUseProductOwnerTools('elena', '/crazy-lab/freunde-20260925-oct31-k9p7/')).toBe(false)
    expect(canUseProductOwnerTools('michael', '/crazy-lab/')).toBe(false)
  })
})
