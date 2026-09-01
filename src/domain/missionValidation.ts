import type { Mission } from './mission'

export const FORBIDDEN_DRINK_TERMS = ['bitter', 'scharf', 'pfeffer', 'kardamom']

export interface MissionValidationError {
  missionId: string
  message: string
}

function textFieldsOf(mission: Mission): string[] {
  return [
    mission.title,
    mission.shortDescription,
    mission.completionQuestion,
    ...mission.materials.map((m) => m.name),
    ...mission.steps.map((s) => s.text),
  ]
}

export function validateMission(mission: Mission): MissionValidationError[] {
  const errors: MissionValidationError[] = []
  const fail = (message: string) => errors.push({ missionId: mission.id, message })

  if (!mission.id) fail('id fehlt')
  if (mission.contentVersion < 1) fail('contentVersion muss >= 1 sein')
  if (!mission.title) fail('title fehlt')
  if (!mission.shortDescription) fail('shortDescription fehlt')
  if (mission.durationMinutes <= 0) fail('durationMinutes muss > 0 sein')
  if (mission.estimatedCostChf < 0) fail('estimatedCostChf darf nicht negativ sein')
  if (mission.steps.length === 0) fail('mindestens ein Schritt erforderlich')
  if (!mission.generalHelpTip) fail('generalHelpTip fehlt')
  if (!mission.completionQuestion) fail('completionQuestion fehlt')

  const stepIds = new Set<string>()
  for (const step of mission.steps) {
    if (stepIds.has(step.id)) fail(`doppelte Schritt-ID: ${step.id}`)
    stepIds.add(step.id)
    if (!step.text) fail(`Schritt ${step.id} hat keinen Text`)
    if (step.timerSeconds !== undefined && step.timerSeconds <= 0) {
      fail(`Schritt ${step.id} hat ungültige timerSeconds`)
    }
  }

  for (const trait of Object.values(mission.traits)) {
    if (trait < 0 || trait > 5) fail('Merkmalswert ausserhalb 0-5')
  }

  if (
    (mission.safetyLevel === 'gelb' || mission.safetyLevel === 'rot') &&
    mission.safetyNotes.length === 0
  ) {
    fail('safetyNotes erforderlich bei gelber/roter Sicherheitsstufe')
  }

  const categories = [mission.primaryCategory, ...mission.secondaryCategories]
  if (categories.includes('getraenk')) {
    const haystack = textFieldsOf(mission).join(' ').toLowerCase()
    for (const term of FORBIDDEN_DRINK_TERMS) {
      if (haystack.includes(term)) {
        fail(`verbotener Begriff in Getränke-Mission gefunden: "${term}"`)
      }
    }
  }

  if (mission.primaryCategory === 'getraenk') {
    if (!mission.drinkProfile) {
      fail('drinkProfile ist für Getränke-Missionen erforderlich')
    } else {
      if (mission.drinkProfile.tastes.length === 0)
        fail('mindestens ein Geschmacksmerkmal erforderlich')
      if (mission.drinkProfile.appearance.length === 0)
        fail('mindestens ein Optikmerkmal erforderlich')
      if (mission.drinkProfile.variants.length < 2)
        fail('mindestens zwei Getränkevarianten erforderlich')
    }
  }

  if (mission.primaryCategory === 'experiment' && !mission.experimentProfile) {
    fail('experimentProfile ist für Experimentier-Missionen erforderlich')
  }
  if (mission.primaryCategory === 'foto' && !mission.photoProfile) {
    fail('photoProfile ist für Foto-Missionen erforderlich')
  }
  if (mission.primaryCategory === 'schwestern' && !mission.sisterProfile) {
    fail('sisterProfile ist für Schwestern-Missionen erforderlich')
  }

  return errors
}

export function validateMissions(missions: Mission[]): MissionValidationError[] {
  const ids = new Set<string>()
  const errors: MissionValidationError[] = []
  for (const mission of missions) {
    if (ids.has(mission.id)) {
      errors.push({ missionId: mission.id, message: 'doppelte Mission-ID' })
    }
    ids.add(mission.id)
    errors.push(...validateMission(mission))
  }
  return errors
}
