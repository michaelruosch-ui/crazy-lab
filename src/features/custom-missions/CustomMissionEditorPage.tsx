import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { missions } from '../../data'
import {
  DEFAULT_PROFILE,
  generateId,
  isCustomMissionSafe,
  type CustomMission,
  type MissionCategory,
  type SafetyLevel,
} from '../../domain'
import { BackLink, Button, SpeechBubble } from '../../components'
import { useProfile } from '../profile'
import { indexedDbCustomMissionRepository } from '../../storage/customMissionRepository'
import './CustomMissionsPage.css'

const CATEGORY_LABELS: Record<MissionCategory, string> = {
  getraenk: 'Getränk',
  basteln: 'Basteln',
  experiment: 'Experiment',
  foto: 'Foto-Challenge',
  schwestern: 'Schwestern-Mission',
}

interface Draft {
  title: string
  description: string
  category: MissionCategory
  duration: number
  cost: number
  materials: string
  steps: string
  safetyLevel: SafetyLevel
  safetyNote: string
}

const EMPTY_DRAFT: Draft = {
  title: '',
  description: '',
  category: 'basteln',
  duration: 20,
  cost: 0,
  materials: '',
  steps: '',
  safetyLevel: 'gruen',
  safetyNote: '',
}

function draftFromMission(mission: CustomMission | (typeof missions)[number]): Draft {
  return {
    title: mission.title,
    description: mission.shortDescription,
    category: mission.primaryCategory,
    duration: mission.durationMinutes,
    cost: mission.estimatedCostChf,
    materials: mission.materials.map((item) => item.name).join('\n'),
    steps: mission.steps.map((step) => step.text).join('\n'),
    safetyLevel: mission.safetyLevel,
    safetyNote: mission.safetyNotes.join('\n'),
  }
}

export function CustomMissionEditorPage() {
  const { missionId } = useParams<{ missionId: string }>()
  const [searchParams] = useSearchParams()
  const copyId = searchParams.get('kopie')
  const staticCopy = copyId ? missions.find((mission) => mission.id === copyId) : undefined
  const [draft, setDraft] = useState(() =>
    staticCopy ? draftFromMission(staticCopy) : EMPTY_DRAFT,
  )
  const [existing, setExisting] = useState<CustomMission>()
  const [loaded, setLoaded] = useState(!missionId)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { profile } = useProfile(DEFAULT_PROFILE.id)

  useEffect(() => {
    if (missionId) {
      void indexedDbCustomMissionRepository.get(missionId).then((mission) => {
        if (mission) {
          setExisting(mission)
          setDraft(draftFromMission(mission))
        }
        setLoaded(true)
      })
      return
    }
    if (copyId) {
      if (!staticCopy)
        void indexedDbCustomMissionRepository.get(copyId).then((mission) => {
          if (mission) setDraft(draftFromMission(mission))
        })
    }
  }, [copyId, missionId, staticCopy])

  const materials = useMemo(
    () =>
      draft.materials
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean),
    [draft.materials],
  )
  const steps = useMemo(
    () =>
      draft.steps
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean),
    [draft.steps],
  )
  const valid =
    draft.title.trim().length >= 3 &&
    draft.description.trim().length >= 5 &&
    materials.length > 0 &&
    steps.length >= 2 &&
    isCustomMissionSafe({ safetyLevel: draft.safetyLevel, safetyNotes: [draft.safetyNote] })

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  async function save() {
    if (!valid) {
      setMessage(
        'Bitte fülle die markierten Pflichtfelder aus. Eine Mission braucht mindestens zwei Schritte.',
      )
      return
    }
    const now = new Date().toISOString()
    const mission: CustomMission = {
      id: existing?.id ?? `mission-eigen-${generateId()}`,
      profileId: DEFAULT_PROFILE.id,
      contentVersion: (existing?.contentVersion ?? 0) + 1,
      title: draft.title.trim(),
      shortDescription: draft.description.trim(),
      primaryCategory: draft.category,
      secondaryCategories: [],
      durationMinutes: Math.max(5, draft.duration),
      difficulty: draft.duration > 45 ? 'mittel' : 'leicht',
      estimatedCostChf: Math.max(0, draft.cost),
      materials: materials.map((name, index) => ({
        id: `m${index + 1}`,
        name,
        optional: false,
        consumable: true,
      })),
      safetyLevel: draft.safetyLevel,
      safetyNotes: draft.safetyNote.trim() ? [draft.safetyNote.trim()] : [],
      location: 'ueberall',
      traits: { gruselig: 2, farbig: 3, suess: 0, kreativ: 5, unordentlich: 2, aufwand: 2 },
      steps: steps.map((text, index) => ({ id: `step-${index + 1}`, order: index + 1, text })),
      generalHelpTip: 'Lies jeden Schritt noch einmal und hole Hilfe, sobald du unsicher bist.',
      completionQuestion: 'Was hat besonders gut funktioniert und was würdest du verändern?',
      imagePlaceholder: `eigen-${draft.category}`,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      sourceMissionId: existing?.sourceMissionId ?? copyId ?? undefined,
    }
    await indexedDbCustomMissionRepository.save(mission)
    navigate('/eigene-missionen')
  }

  if (!loaded) return <p className="custom-mission-editor">Lade Mission...</p>

  return (
    <div className="custom-mission-editor">
      <h1>{existing ? '✏️ Mission bearbeiten' : '🧠 Mission erfinden'}</h1>
      <SpeechBubble
        mascotId={profile?.mascotVariant}
        text="Schreib pro Zeile ein Material und einen Schritt. Ich passe auf, dass nichts Wichtiges fehlt."
      />

      <label>
        Titel der Mission
        <input
          value={draft.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Zum Beispiel: Das Sockenmonster"
        />
      </label>
      <label>
        Was passiert?
        <textarea
          value={draft.description}
          onChange={(e) => update('description', e.target.value)}
        />
      </label>
      <label>
        Kategorie
        <select
          value={draft.category}
          onChange={(e) => update('category', e.target.value as MissionCategory)}
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <div className="custom-mission-editor__numbers">
        <label>
          Minuten
          <input
            type="number"
            min="5"
            value={draft.duration}
            onChange={(e) => update('duration', Number(e.target.value))}
          />
        </label>
        <label>
          Kosten CHF
          <input
            type="number"
            min="0"
            step="0.5"
            value={draft.cost}
            onChange={(e) => update('cost', Number(e.target.value))}
          />
        </label>
      </div>
      <label>
        Materialien – eines pro Zeile
        <textarea
          value={draft.materials}
          onChange={(e) => update('materials', e.target.value)}
          placeholder={'Papier\nFilzstifte'}
        />
      </label>
      <label>
        Schritte – einer pro Zeile
        <textarea
          value={draft.steps}
          onChange={(e) => update('steps', e.target.value)}
          placeholder={'Lege alles bereit.\nBaue deine Idee.\nGib ihr einen Namen.'}
        />
      </label>

      <fieldset>
        <legend>🛡️ Sicherheit</legend>
        <label>
          Sicherheitsstufe
          <select
            value={draft.safetyLevel}
            onChange={(e) => update('safetyLevel', e.target.value as SafetyLevel)}
          >
            <option value="gruen">Grün – allein okay</option>
            <option value="gelb">Gelb – Erwachsene helfen</option>
            <option value="rot">Rot – nur mit Erwachsenen</option>
          </select>
        </label>
        <label>
          Was muss beachtet werden?{draft.safetyLevel !== 'gruen' && <strong> Pflichtfeld</strong>}
          <textarea
            value={draft.safetyNote}
            onChange={(e) => update('safetyNote', e.target.value)}
            placeholder="Zum Beispiel: Eine erwachsene Person schneidet mit dem Messer."
          />
        </label>
      </fieldset>
      {message && (
        <p role="alert" className="custom-mission-editor__message">
          {message}
        </p>
      )}
      <Button variant="primary" onClick={save} disabled={!valid}>
        Mission speichern
      </Button>
      <BackLink to="/eigene-missionen">← Abbrechen</BackLink>
    </div>
  )
}
