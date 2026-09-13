import { describe, expect, it } from 'vitest'
import {
  checkPublicationCode,
  EMPTY_PUBLICATION_CODE_STATE,
  PUBLICATION_LOCK_MS,
} from './publicationCode'

describe('Product-Owner-Code für Missionsfreigaben', () => {
  it('akzeptiert ausschliesslich den festgelegten Code', () => {
    expect(checkPublicationCode('4002', EMPTY_PUBLICATION_CODE_STATE, 1).status).toBe('authorized')
    expect(checkPublicationCode('4001', EMPTY_PUBLICATION_CODE_STATE, 1)).toMatchObject({
      status: 'retry',
      remainingAttempts: 2,
    })
  })

  it('sperrt nach drei falschen Versuchen zehn Minuten', () => {
    const first = checkPublicationCode('0000', EMPTY_PUBLICATION_CODE_STATE, 1)
    const second = checkPublicationCode('1111', first.state, 2)
    const third = checkPublicationCode('2222', second.state, 3)
    expect(third).toMatchObject({ status: 'locked', lockedUntil: 3 + PUBLICATION_LOCK_MS })
    expect(checkPublicationCode('4002', third.state, 4).status).toBe('locked')
    expect(checkPublicationCode('4002', third.state, 3 + PUBLICATION_LOCK_MS).status).toBe(
      'authorized',
    )
  })
})
