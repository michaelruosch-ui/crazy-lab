import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Birthday, LocalBackupSnapshot, MascotId, Profile } from '../../domain'
import { DEFAULT_PROFILE, generateId } from '../../domain'
import { BackLink, Button, MascotPicker, ParentGate } from '../../components'
import { backupFileName, createBackup, isBackupData, restoreBackup } from '../../storage/backup'
import {
  getLocalSnapshots,
  restoreLocalSnapshot,
  saveLocalSnapshot,
} from '../../storage/localBackupRepository'
import { useProfile } from './useProfile'
import { useActiveProfileId } from './useActiveProfile'
import { indexedDbProfileRepository } from '../../storage/profileRepository'
import { deleteProfileCompletely } from '../../storage/db'
import './ProfilePage.css'
import { clearAtmosphereSettings, useAtmosphereSettings } from '../atmosphere'
import { APP_LOCALES, LANGUAGE_OPTIONS, useLanguage } from '../../i18n'

type BackupStatus = 'idle' | 'busy' | 'success' | 'error'

function formatMonthDay(monthDay: string, locale: string): string {
  const [month, day] = monthDay.split('-').map(Number)
  if (!month || !day) return monthDay
  return new Date(2000, month - 1, day).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
  })
}

export function ProfilePage() {
  const { activeProfileId, setActiveProfileId } = useActiveProfileId()
  const { profile, loading, save } = useProfile(activeProfileId)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [name, setName] = useState('')
  const [nameSyncedWith, setNameSyncedWith] = useState<Profile | null>(null)
  const [newBirthdayName, setNewBirthdayName] = useState('')
  const [newBirthdayMonth, setNewBirthdayMonth] = useState('')
  const [newBirthdayDay, setNewBirthdayDay] = useState('')
  const backupFileInputRef = useRef<HTMLInputElement>(null)
  const [backupStatus, setBackupStatus] = useState<BackupStatus>('idle')
  const [backupMessage, setBackupMessage] = useState('')
  const [protectedAction, setProtectedAction] = useState<{
    reason: string
    run: () => void | Promise<void>
  } | null>(null)
  const [snapshots, setSnapshots] = useState<LocalBackupSnapshot[]>([])
  const { settings: atmosphereSettings, update: updateAtmosphere } =
    useAtmosphereSettings(activeProfileId)
  const { language, t, setLanguage } = useLanguage()

  useEffect(() => {
    void getLocalSnapshots(activeProfileId).then(setSnapshots)
    void indexedDbProfileRepository.getAll().then(setProfiles)
  }, [activeProfileId])

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
    if (!profile || !newBirthdayName.trim() || !newBirthdayMonth || !newBirthdayDay) return
    const birthday: Birthday = {
      id: generateId(),
      personName: newBirthdayName.trim(),
      monthDay: `${newBirthdayMonth.padStart(2, '0')}-${newBirthdayDay.padStart(2, '0')}`,
    }
    await save({ ...profile, birthdays: [...profile.birthdays, birthday] })
    setNewBirthdayName('')
    setNewBirthdayMonth('')
    setNewBirthdayDay('')
  }

  async function removeBirthday(id: string) {
    if (!profile) return
    await save({ ...profile, birthdays: profile.birthdays.filter((b) => b.id !== id) })
  }

  async function downloadBackup() {
    setBackupStatus('busy')
    try {
      const backup = await createBackup(activeProfileId)
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
      await saveLocalSnapshot(activeProfileId)
      setSnapshots(await getLocalSnapshots(activeProfileId))
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
    return new Date(isoDate).toLocaleString(APP_LOCALES[language], {
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

  function requireAdult(reason: string, run: () => void | Promise<void>) {
    setProtectedAction({ reason, run })
  }

  async function deleteActiveProfile() {
    if (!profile) return
    if (
      !window.confirm(
        `Profil „${profile.researcherName}“ und wirklich alle zugehörigen Inhalte löschen? Das kann nicht rückgängig gemacht werden.`,
      )
    )
      return
    await deleteProfileCompletely(profile.id)
    clearAtmosphereSettings(profile.id)
    const fallback = profiles.find((item) => item.id !== profile.id)
    const nextId =
      fallback?.id ??
      (profile.id === DEFAULT_PROFILE.id ? DEFAULT_PROFILE.id : `profil-${generateId()}`)
    setActiveProfileId(nextId)
    window.location.hash = '#/'
    window.location.reload()
  }

  return (
    <div className="profile-page">
      <h1>{t('profileTitle')}</h1>

      <section>
        <h2>{t('profileLanguageTitle')}</h2>
        <p className="profile-page__hint">{t('profileLanguageHint')}</p>
        <select
          className="profile-page__input"
          aria-label={t('language')}
          value={language}
          onChange={(event) => setLanguage(event.target.value as typeof language)}
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      <section className="profile-page__people">
        <h2>{t('currentResearcher')}</h2>
        <p className="profile-page__hint">{t('profileSeparationHint')}</p>
        <div className="profile-page__people-list">
          {profiles.map((item) => (
            <Button
              key={item.id}
              variant={item.id === activeProfileId ? 'primary' : 'ghost'}
              onClick={() => setActiveProfileId(item.id)}
            >
              {item.id === activeProfileId ? '✓ ' : ''}
              {item.researcherName}
            </Button>
          ))}
        </div>
        <Button variant="secondary" onClick={() => setActiveProfileId(`profil-${generateId()}`)}>
          {t('addPerson')}
        </Button>
      </section>

      <section>
        <h2>{t('researcherName')}</h2>
        <input
          className="profile-page__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveName}
          maxLength={30}
        />
      </section>

      <section>
        <h2>{t('mascot')}</h2>
        <MascotPicker value={profile.mascotVariant} onChange={changeMascot} />
      </section>

      <section>
        <h2>{t('birthdays')}</h2>
        <p className="profile-page__hint">{t('birthdaysHint')}</p>

        {profile.birthdays.length > 0 && (
          <ul className="profile-page__birthday-list">
            {profile.birthdays.map((birthday) => (
              <li key={birthday.id}>
                <span>
                  {birthday.personName} - {formatMonthDay(birthday.monthDay, APP_LOCALES[language])}
                </span>
                <Button variant="ghost" onClick={() => removeBirthday(birthday.id)}>
                  {t('remove')}
                </Button>
              </li>
            ))}
          </ul>
        )}

        <div className="profile-page__add-birthday">
          <input
            className="profile-page__input"
            placeholder={t('name')}
            value={newBirthdayName}
            onChange={(e) => setNewBirthdayName(e.target.value)}
          />
          <select
            className="profile-page__input"
            aria-label={t('month')}
            value={newBirthdayMonth}
            onChange={(event) => {
              setNewBirthdayMonth(event.target.value)
              setNewBirthdayDay('')
            }}
          >
            <option value="">{t('month')}</option>
            {Array.from({ length: 12 }, (_, index) => {
              const value = String(index + 1)
              const label = new Intl.DateTimeFormat(APP_LOCALES[language], {
                month: 'long',
              }).format(new Date(2000, index, 1))
              return (
                <option key={value} value={value}>
                  {label.charAt(0).toLocaleUpperCase(language) + label.slice(1)}
                </option>
              )
            })}
          </select>
          <select
            className="profile-page__input"
            aria-label={t('day')}
            value={newBirthdayDay}
            disabled={!newBirthdayMonth}
            onChange={(event) => setNewBirthdayDay(event.target.value)}
          >
            <option value="">{t('day')}</option>
            {Array.from(
              {
                length: newBirthdayMonth
                  ? new Date(2000, Number(newBirthdayMonth), 0).getDate()
                  : 31,
              },
              (_, index) => String(index + 1),
            ).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <Button variant="secondary" onClick={addBirthday}>
            {t('addBirthday')}
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
                  {t('load')}
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
          <Button
            variant="ghost"
            onClick={() =>
              requireAdult(
                'Eine Notfallkopie kann persönliche Labordaten ausserhalb von Crazy Lab speichern.',
                downloadBackup,
              )
            }
            disabled={backupStatus === 'busy'}
          >
            Notfallkopie in „Dateien“ sichern
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              requireAdult('Eine Notfallkopie ersetzt die Daten des aktiven Profils.', () =>
                backupFileInputRef.current?.click(),
              )
            }
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

      <section>
        <h2>🛡️ Datenschutz und Elternbereich</h2>
        <p className="profile-page__hint">
          Crazy Lab erklärt Kindern und Erwachsenen verständlich, was auf diesem Gerät gespeichert
          wird und was niemals in eine automatische Cloud gelangt.
        </p>
        <Link className="profile-page__privacy-link" to="/datenschutz">
          🔐 Datenschutz einfach erklärt
        </Link>
      </section>

      <section className="profile-page__danger-zone">
        <h2>🗑️ Profil vollständig löschen</h2>
        <p className="profile-page__hint">
          Löscht Forschername, Geburtstage, Tagebuch, Fotos, Videos, Listen, Vorräte, eigene
          Missionen und Sicherungsstände dieses Profils endgültig von diesem Gerät.
        </p>
        <Button
          variant="ghost"
          onClick={() =>
            requireAdult(
              `Das Profil „${profile.researcherName}“ und alle zugehörigen Inhalte werden endgültig gelöscht.`,
              deleteActiveProfile,
            )
          }
        >
          Profil und alle Daten löschen
        </Button>
      </section>

      <ParentGate
        open={protectedAction !== null}
        reason={protectedAction?.reason ?? ''}
        onAuthorized={() => protectedAction?.run()}
        onClose={() => setProtectedAction(null)}
      />

      <BackLink to="/">← Zurück zur Startseite</BackLink>
    </div>
  )
}
