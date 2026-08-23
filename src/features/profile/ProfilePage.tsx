import { useRef, useState } from 'react'
import type { Birthday, MascotId, Profile } from '../../domain'
import { DEFAULT_PROFILE, generateId } from '../../domain'
import { BackLink, Button, MascotPicker } from '../../components'
import { backupFileName, createBackup, isBackupData, restoreBackup } from '../../storage/backup'
import { useProfile } from './useProfile'
import './ProfilePage.css'

type BackupStatus = 'idle' | 'busy' | 'success' | 'error'

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
  const backupFileInputRef = useRef<HTMLInputElement>(null)
  const [backupStatus, setBackupStatus] = useState<BackupStatus>('idle')
  const [backupMessage, setBackupMessage] = useState('')

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

  async function downloadBackup() {
    setBackupStatus('busy')
    try {
      const backup = await createBackup(DEFAULT_PROFILE.id)
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = backupFileName()
      link.click()
      URL.revokeObjectURL(url)
      setBackupStatus('success')
      setBackupMessage('Backup wurde heruntergeladen.')
    } catch {
      setBackupStatus('error')
      setBackupMessage('Backup konnte nicht erstellt werden. Bitte nochmals versuchen.')
    }
  }

  async function restoreFromFile(file: File) {
    setBackupStatus('busy')
    try {
      const text = await file.text()
      const parsed: unknown = JSON.parse(text)
      if (!isBackupData(parsed)) {
        setBackupStatus('error')
        setBackupMessage('Diese Datei sieht nicht nach einem Crazy-Lab-Backup aus.')
        return
      }
      await restoreBackup(parsed)
      setBackupStatus('success')
      setBackupMessage('Backup wiederhergestellt! Die App lädt jetzt neu...')
      setTimeout(() => window.location.reload(), 1200)
    } catch {
      setBackupStatus('error')
      setBackupMessage('Backup konnte nicht gelesen werden. Ist es wirklich eine Crazy-Lab-Backup-Datei?')
    }
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

      <section>
        <h2>📦 Datensicherung</h2>
        <p className="profile-page__hint">
          Speichere ab und zu ein Backup - Maskottchen, Forschername, Geburtstage, Geheimfach und
          das ganze Labortagebuch werden in einer Datei gesichert und lassen sich auf diesem oder
          einem anderen Gerät wiederherstellen.
        </p>
        <div className="profile-page__backup-actions">
          <Button variant="secondary" onClick={downloadBackup} disabled={backupStatus === 'busy'}>
            Backup herunterladen
          </Button>
          <Button
            variant="ghost"
            onClick={() => backupFileInputRef.current?.click()}
            disabled={backupStatus === 'busy'}
          >
            Backup wiederherstellen
          </Button>
          <input
            ref={backupFileInputRef}
            type="file"
            accept="application/json"
            className="profile-page__file-input"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) restoreFromFile(file)
              e.target.value = ''
            }}
          />
        </div>
        {backupStatus !== 'idle' && backupStatus !== 'busy' && (
          <p
            className={`profile-page__backup-message ${backupStatus === 'error' ? 'profile-page__backup-message--error' : ''}`}
            role="status"
          >
            {backupMessage}
          </p>
        )}
      </section>

      <BackLink to="/">← Zurück zur Startseite</BackLink>
    </div>
  )
}
