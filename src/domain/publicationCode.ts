export const PUBLICATION_CODE = '4002'
export const PUBLICATION_MAX_ATTEMPTS = 3
export const PUBLICATION_LOCK_MS = 10 * 60 * 1000

export interface PublicationCodeState {
  failedAttempts: number
  lockedUntil: number
}

export type PublicationCodeResult =
  | { status: 'authorized'; state: PublicationCodeState }
  | { status: 'retry'; remainingAttempts: number; state: PublicationCodeState }
  | { status: 'locked'; lockedUntil: number; state: PublicationCodeState }

export const EMPTY_PUBLICATION_CODE_STATE: PublicationCodeState = {
  failedAttempts: 0,
  lockedUntil: 0,
}

export function normalizePublicationCodeState(
  value: Partial<PublicationCodeState> | undefined,
  now: number,
): PublicationCodeState {
  if (!value || !Number.isFinite(value.failedAttempts) || !Number.isFinite(value.lockedUntil)) {
    return EMPTY_PUBLICATION_CODE_STATE
  }
  if ((value.lockedUntil ?? 0) <= now && (value.failedAttempts ?? 0) >= PUBLICATION_MAX_ATTEMPTS) {
    return EMPTY_PUBLICATION_CODE_STATE
  }
  return {
    failedAttempts: Math.max(0, Math.floor(value.failedAttempts ?? 0)),
    lockedUntil: Math.max(0, value.lockedUntil ?? 0),
  }
}

export function checkPublicationCode(
  input: string,
  current: PublicationCodeState,
  now: number,
): PublicationCodeResult {
  const state = normalizePublicationCodeState(current, now)
  if (state.lockedUntil > now) return { status: 'locked', lockedUntil: state.lockedUntil, state }
  if (input === PUBLICATION_CODE) {
    return { status: 'authorized', state: EMPTY_PUBLICATION_CODE_STATE }
  }
  const failedAttempts = state.failedAttempts + 1
  if (failedAttempts >= PUBLICATION_MAX_ATTEMPTS) {
    const lockedState = { failedAttempts, lockedUntil: now + PUBLICATION_LOCK_MS }
    return { status: 'locked', lockedUntil: lockedState.lockedUntil, state: lockedState }
  }
  const retryState = { failedAttempts, lockedUntil: 0 }
  return {
    status: 'retry',
    remainingAttempts: PUBLICATION_MAX_ATTEMPTS - failedAttempts,
    state: retryState,
  }
}
