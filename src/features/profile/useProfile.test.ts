import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Profile } from '../../domain'
import { DEFAULT_PROFILE } from '../../domain'
import type { ProfileRepository } from '../../storage/profileRepository'
import { useProfile } from './useProfile'

describe('useProfile', () => {
  it('bleibt nicht für immer bei "loading", wenn das Öffnen der Datenbank endgültig scheitert', async () => {
    const failingRepository: ProfileRepository = {
      get: () => Promise.reject(new Error('Öffnen der lokalen Datenbank hat zu lange gedauert.')),
      save: () => Promise.resolve(),
    }

    const { result } = renderHook(() => useProfile(DEFAULT_PROFILE.id, failingRepository))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.profile).toBeNull()
  })

  it('lädt ein vorhandenes Profil normal', async () => {
    const profile: Profile = {
      ...DEFAULT_PROFILE,
      onboardingCompletedAt: '2026-08-16T00:00:00.000Z',
    }
    const repository: ProfileRepository = {
      get: () => Promise.resolve(profile),
      save: () => Promise.resolve(),
    }

    const { result } = renderHook(() => useProfile(DEFAULT_PROFILE.id, repository))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.profile).toEqual(profile)
  })
})
