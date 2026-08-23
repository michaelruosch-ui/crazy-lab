import { useRef, useState } from 'react'
import type { Birthday, MascotId, Profile } from '../../domain'
import { DEFAULT_PROFILE, generateId } from '../../domain'
import { BackLink, Button, MascotPicker } from '../../components'
import { useProfile } from './useProfile'
import './ProfilePage.css'

function formatMonthDay(monthDay: string): string {
  const [month, day] = monthDay.split('-').map(Number)
  if (!month || !day) return monthDay
  return new Date(2000, month - 1, day).toLocaleDateString('de-CH', {
    day: 'numeric',
    month: 'long',
  })
}

export function ProfilePage() {
  const { profile, loading, save } = useProfile(DEFAULT_PROFILE.id)
  const [name, setName] = useState('')
  const [nameSyncedWith, setNameSyncedWith] = useState<Profile | null>(null)
  const [newBirthdayName, setNewBirthdayName] = useState('')
  const dateInputRef = useRef<HTMLInputElement>(null)

  if (profile && profile !== nameSyncedWith) {
    setNameSyncedWith(profile)
    setName(profile.researcherName)
  }

  if (loading) {
    return <p className="profile-page__loading">Lade...</p>
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <p>Es wurde noch kein Profil angelegt.</p>
        <BackLink to="/">← Zurück zur Startseite</BackLink>
      </div>
    )
  }

  async function saveName() {
    if (!profile) return
    const trimmed = name.trim()
    if (!trimmed || trimmed === profile.researcherName) return
    await save({ ...profile, researcherName: trimmed })
  }

  async function changeMascot(mascotId: MascotId) {
    if (!profile) return
    await save({ ...profile, mascotVariant: mascotId })
  }

  async function addBirthday() {
    const fullDate = dateInputRef.current?.value ?? ''
    if (!profile || !newBirthdayName.trim() || !fullDate) return
    const birthday: Birthday = {
      id: generateId(),
      personName: newBirthdayName.trim(),
      monthDay: fullDate.slice(5),
    }
    await save({ ...profile, birthdays: [...profile.birthdays, birthday] })
    setNewBirthdayName('')
    if (dateInputRef.current) dateInputRef.current.value = ''
  }

  async function removeBirthday(id: string) {
    if (!profile) return
    await save({ ...profile, birthdays: profile.birthdays.filter((b) => b.id !== id) })
  }

  return (
    <div className="profile-page">
      <h1>👤 Dein Profil</h1>

      <section>
        <h2>Forschername</h2>
        <input
          className="profile-page__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveName}
          maxLength={30}
        />
      </section>

      <section>
        <h2>Maskottchen</h2>
        <MascotPicker value={profile.mascotVariant} onChange={changeMascot} />
      </section>

      <section>
        <h2>Geburtstage</h2>
        <p className="profile-page__hint">
          Trage Geburtstage ein - dann erscheint an diesem Tag eine besondere Geburtstagsmission.
        </p>

        {profile.birthdays.length > 0 && (
          <ul className="profile-page__birthday-list">
            {profile.birthdays.map((birthday) => (
              <li key={birthday.id}>
                <span>
                  {birthday.personName} - {formatMonthDay(birthday.monthDay)}
                </span>
                <Button variant="ghost" onClick={() => removeBirthday(birthday.id)}>
                  Entfernen
                </Button>
              </li>
            ))}
          </ul>
        )}

        <div className="profile-page__add-birthday">
          <input
            className="profile-page__input"
            placeholder="Name"
            value={newBirthdayName}
            onChange={(e) => setNewBirthdayName(e.target.value)}
          />
          <input
            className="profile-page__input"
            type="date"
            ref={dateInputRef}
            defaultValue=""
          />
          <Button variant="secondary" onClick={addBirthday}>
            Geburtstag hinzufügen
          </Button>
        </div>
      </section>

      <BackLink to="/">← Zurück zur Startseite</BackLink>
    </div>
  )
}
