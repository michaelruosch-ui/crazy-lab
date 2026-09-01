import { useEffect, useRef, useState } from 'react'
import type { Birthday, LocalBackupSnapshot, MascotId, Profile } from '../../domain'
import { DEFAULT_PROFILE, generateId } from '../../domain'
import { BackLink, Button, MascotPicker } from '../../components'
import { backupFileName, createBackup, isBackupData, restoreBackup } from '../../storage/backup'
import {
  getLocalSnapshots,
  restoreLocalSnapshot,
  saveLocalSnapshot,
} from '../../storage/localBackupRepository'
import { useProfile } from './useProfile'
import './ProfilePage.css'
import { useAtmosphereSettings } from '../atmosphere'

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
  const [snapshots, setSnapshots] = useState<LocalBackupSnapshot[]>([])
  const { settings: atmosphereSettings, update: updateAtmosphere } = useAtmosphereSettings()

  useEffect(() => {
    void getLocalSnapshots(DEFAULT_PROFILE.id).then(setSnapshots)
  }, [])

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
      const contents = JSON.stringify(backup, null, 2)
      const fileName = backupFileName()
      const file = new File([contents], fileName, { type: 'application/json' })

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Crazy-Lab-Backup',
          text: 'Bitte „In Dateien sichern“ wählen und den Speicherort merken.',
        })
        setBackupStatus('success')
        setBackupMessage('Sicherungsdialog abgeschlossen. Prüfe die Datei jetzt in „Dateien“.')
        return
      }

      const blob = new Blob([contents], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      URL.revokeObjectURL(url)
      setBackupStatus('success')
      setBackupMessage('Download gestartet. Prüfe jetzt, ob die Datei im Download-Ordner liegt.')
    } catch {
      setBackupStatus('error')
      setBackupMessage('Backup konnte nicht erstellt werden. Bitte nochmals versuchen.')
    }
  }

  async function saveSnapshotNow() {
    setBackupStatus('busy')
    try {
      await saveLocalSnapshot(DEFAULT_PROFILE.id)
      setSnapshots(await getLocalSnapshots(DEFAULT_PROFILE.id))
      setBackupStatus('success')
      setBackupMessage('Alles ist gesichert. Du musst keine Datei öffnen oder verschieben.')
    } catch {
      setBackupStatus('error')
      setBackupMessage('Sichern hat nicht geklappt. Bitte nochmals versuchen.')
    }
  }

  async function restoreSnapshot(snapshot: LocalBackupSnapshot) {
    if (!window.confirm('Diesen Sicherungsstand wirklich wiederherstellen?')) return
    setBackupStatus('busy')
    try {
      await restoreLocalSnapshot(snapshot)
      setBackupStatus('success')
      setBackupMessage('Sicherungsstand wiederhergestellt! Die App lädt jetzt neu...')
      setTimeout(() => window.location.reload(), 1200)
    } catch {
      setBackupStatus('error')
      setBackupMessage('Dieser Sicherungsstand konnte nicht geladen werden.')
    }
  }

  function formatSnapshotDate(isoDate: string): string {
    return new Date(isoDate).toLocaleString('de-CH', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
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
      setBackupMessage(
        'Backup konnte nicht gelesen werden. Ist es wirklich eine Crazy-Lab-Backup-Datei?',
      )
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
          <input className="profile-page__input" type="date" ref={dateInputRef} defaultValue="" />
          <Button variant="secondary" onClick={addBirthday}>
            Geburtstag hinzufügen
          </Button>
        </div>
      </section>

      <section>
        <h2>🎵 Musik und Bewegung</h2>
        <p className="profile-page__hint">
          Beides kann jederzeit geändert werden. Crazy Lab respektiert zusätzlich die
          iPhone-Einstellung „Bewegung reduzieren“.
        </p>
        <label className="profile-page__toggle">
          <input
            type="checkbox"
            checked={atmosphereSettings.soundEnabled}
            onChange={(e) => updateAtmosphere({ soundEnabled: e.target.checked })}
          />{' '}
          Dezente Labormusik erlauben
        </label>
        <label className="profile-page__toggle">
          <input
            type="checkbox"
            checked={atmosphereSettings.animationsEnabled}
            onChange={(e) => updateAtmosphere({ animationsEnabled: e.target.checked })}
          />{' '}
          Animationen anzeigen
        </label>
      </section>

      <section>
        <h2>📦 Datensicherung</h2>

        <div className="profile-page__backup-block">
          <h3>Automatisch gesichert</h3>
          <p className="profile-page__hint">
            Crazy Lab sichert Änderungen im Hintergrund. Hier kannst du zusätzlich sofort einen
            Sicherungsstand erstellen – ohne technische Datei.
          </p>
          <Button variant="secondary" onClick={saveSnapshotNow} disabled={backupStatus === 'busy'}>
            Jetzt sichern
          </Button>
        </div>

        <div className="profile-page__backup-block">
          <h3>Früheren Stand laden</h3>
          <p className="profile-page__hint">
            Wähle einfach den gewünschten Zeitpunkt. Crazy Lab bewahrt höchstens zehn Stände auf.
          </p>
          {snapshots.length === 0 && <p>Noch kein Sicherungsstand vorhanden.</p>}
          <ul className="profile-page__snapshot-list">
            {snapshots.map((snapshot, index) => (
              <li key={snapshot.id}>
                <span>
                  <strong>{index === 0 ? 'Neuester Stand' : 'Sicherungsstand'}</strong>
                  <small>{formatSnapshotDate(snapshot.createdAt)}</small>
                </span>
                <Button
                  variant="ghost"
                  onClick={() => restoreSnapshot(snapshot)}
                  disabled={backupStatus === 'busy'}
                >
                  Laden
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <details className="profile-page__emergency-backup">
          <summary>Notfallkopie ausserhalb der App</summary>
          <p className="profile-page__hint">
            Nur nötig, falls die App komplett gelöscht wird oder das iPhone kaputtgeht. Dabei wird
            eine Datei in „Dateien“ oder auf dem Mac abgelegt.
          </p>
          <Button variant="ghost" onClick={downloadBackup} disabled={backupStatus === 'busy'}>
            Notfallkopie in „Dateien“ sichern
          </Button>
          <Button
            variant="ghost"
            onClick={() => backupFileInputRef.current?.click()}
            disabled={backupStatus === 'busy'}
          >
            Notfallkopie auswählen
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
        </details>

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
