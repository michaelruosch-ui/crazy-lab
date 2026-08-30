# Architektur

## Schichten

```text
src/
  app/            Seiten-Orchestrierung (verbindet Features zu einem Ablauf)
  components/     Wiederverwendbare, feature-lose UI-Bausteine (Button, Badge, Mascot, MissionCard, ...)
  features/       Fachliche Bausteine, je Unterordner ein Feature
    missions/       Startseite, Missionsdetail-Darstellung, Kategorie-Vorschläge, Verlauf
    mission-run/     Schritt-für-Schritt-Ausführung, Timer, Hilfe
    ratings/         Abschlussbewertungs-Formular
    diary/           Labortagebuch-Ansicht + Lese-Hook
    secret-vault/    Geheimfach (dauerhaft gemerkte Missionen)
    onboarding/      Ersteinrichtung: Maskottchen wählen, Forschername vergeben
    profile/         Profilseite: Forschername/Maskottchen ändern, Geburtstage verwalten
  domain/         Reine TypeScript-Typen und Domänenlogik (keine UI, kein IO)
  data/           Statische, versionierte Missionsdaten
  storage/        IndexedDB-Repository-Schicht (einziger Ort mit direktem IndexedDB-Zugriff)
  styles/         (für globales Theming reserviert; aktuell in src/index.css)
  test/           Test-Setup (jsdom, fake-indexeddb, jest-dom matcher)
```

Abhängigkeitsrichtung: `app` → `features` → `domain`/`storage`. `domain` hat keine Abhängigkeit
zu React, Storage oder UI. `storage` kennt nur `domain`-Typen, keine UI. `components` kennen
keine Features.

## Datenfluss

### Startseite und Entdecken (Sprint 2)

1. `features/missions/HomePage` ist der Startbildschirm (`/`). Sie berechnet die Tagesmission
   (`domain/suggestions.pickDailyMission`) und pro Kategorie bis zu fünf Vorschläge
   (`domain/suggestions.suggestionsForCategory`), beides rein aus den statischen Missionsdaten
   plus den aktuell versteckten Missions-IDs.
2. `features/missions/MissionSection` rendert eine Kategorie als Liste von `MissionCard`s mit
   Aktionen ("Merken" fürs Geheimfach, "3 Tage verstecken").
3. Ein Klick auf eine `MissionCard` navigiert zu `/mission/:missionId`, das über
   `App.tsx`s `MissionRoute`-Wrapper einen `key={missionId}` erhält, damit `MissionFlowPage` bei
   Missionswechsel sauber neu initialisiert (Schritt-Fortschritt, Timer etc. nicht aus der
   vorherigen Mission übernommen wird).
4. "Merken"/"Gemerkt" nutzt `features/secret-vault/useSecretVault`, "3 Tage verstecken" nutzt
   `features/missions/useHiddenMissions` - beide kapseln die jeweilige Storage-Repository.
5. `features/missions/HistoryPage` (`/verlauf`) zeigt alle Verstecken-Vorgänge der letzten 14
   Tage inkl. Status ("noch versteckt" / "wieder sichtbar").
6. `features/secret-vault/SecretVaultPage` (`/geheimfach`) zeigt alle dauerhaft gemerkten
   Missionen.

### Missionsablauf (Sprint 1, seit Sprint 2 für beliebige Missionen)

1. `data/missions.ts` liefert die statischen Missionsdaten.
2. `app/MissionFlowPage.tsx` erhält eine `missionId` als Prop, hält den Ablauf-Zustand
   (`detail` → `run` → `rating`) und rendert je nach Phase die passende Feature-Komponente.
3. `features/mission-run/StepRunner` verwaltet Schritt-Index, abgehakte Schritte und Hilfe-
   Sichtbarkeit lokal im Component-State; `useTimer` kapselt den manuellen Timer.
4. Nach Abschluss aller Schritte übernimmt `features/ratings/CompletionForm` die
   Bewertungserfassung und liefert ein `CompletionRating`-Objekt an `MissionFlowPage` zurück.
5. `MissionFlowPage` baut daraus einen `DiaryEntry` (inkl. Missions-Snapshot) und speichert ihn
   über `storage/diaryRepository` in IndexedDB.
6. `features/diary/DiaryPage` liest beim Mount alle Einträge über denselben Repository und
   zeigt sie an - unabhängig von einem vorherigen Seiten-Reload.

### Präferenzprofil (Sprint 3)

1. `domain/preferenceProfile.buildPreferenceProfile(profileId, entries)` baut aus allen
   Tagebucheinträgen eines Profils ein `PreferenceProfile` (Merkmals-Affinität pro
   `MissionTraits`-Dimension). Reine Funktion, keine eigene Speicherung - der Tagebucheintrag
   bleibt einzige Quelle der Wahrheit.
2. `HomePage` lädt die Tagebucheinträge über den bestehenden `useDiaryEntries`-Hook und baut das
   Profil bei jedem Rendern frisch.
3. `domain/suggestions.suggestionsForCategory` sortiert Kandidaten bei vorhandenem Profil nach
   `scoreMissionForProfile` (Skalarprodukt aus Missionsmerkmalen und Profil-Affinität) - ohne
   Profil bzw. ohne Bewertungen bleibt die bisherige primär/sekundär-Reihenfolge unverändert
   (stabile Sortierung).

### Onboarding, Profil und Geburtstage (Sprint 4)

1. `App.tsx` lädt das Profil über `features/profile/useProfile(DEFAULT_PROFILE.id)`, bevor
   irgendeine Route gerendert wird. Solange kein Profil existiert oder
   `onboardingCompletedAt` fehlt, wird ausschliesslich `features/onboarding/OnboardingFlow`
   gerendert - alle übrigen Routen sind dann nicht erreichbar. Bestehende Nutzer:innen (Sprint 1-3
   ohne `profiles`-Store-Eintrag) durchlaufen das Onboarding beim nächsten Start einmalig, ihre
   Tagebuch-/Geheimfach-/Verlaufsdaten bleiben unberührt (separate Object Stores).
2. `OnboardingFlow` sammelt Maskottchen-Wahl (`components/MascotPicker`) und Forschername in
   lokalem State und übergibt beim Abschluss ein vollständiges `Profile`-Objekt an
   `onComplete` (= `useProfile`s `save`), das es in IndexedDB persistiert.
3. `features/profile/ProfilePage` (`/profil`) liest und schreibt dasselbe Profil - Forschername
   (Textfeld, Speichern bei Blur), Maskottchen (`MascotPicker` erneut verwendet) und Geburtstage
   (Liste mit Hinzufügen/Entfernen) sind jederzeit änderbar.
4. `components/Mascot` nimmt eine `mascotId`-Prop entgegen (`MascotId` = `string`, siehe
   `domain/profile.ts`) und rendert per Canvas eines von 33 Maskottchen-Entwürfen aus
   `components/mascotArt.ts` (8 Tierarten × Farbwelt/Blutig-Variante, siehe DECISIONS.md
   ADR-015). Wird im `HomePage`-Header und in der Hilfe-Sprechblase (`StepRunner` →
   `SpeechBubble`) mit dem im Profil gespeicherten Maskottchen dargestellt.
5. `domain/isBirthdayToday` vergleicht nur Monat und Tag (Jahr bewusst irrelevant). `HomePage`
   filtert die Geburtstage des Profils auf "heute" und zeigt bei Treffer die Tagesmission mit
   festlichem Rahmen als "Geburtstagsmission für {Name}" statt der normalen Tagesmission -
   dieselbe Auswahllogik, nur andere Präsentation (siehe DECISIONS.md ADR-013).

### Stempel-Animation (Sprint 4)

1. `features/ratings/CompletionForm` erhält eine `mascotId`-Prop (Default
   `DEFAULT_PROFILE.mascotVariant`, real befüllt von `MissionFlowPage` aus dem geladenen
   Profil). Tippt man in der Abschlussbewertung einen Stempel an, setzt das Formular sofort den
   gewählten Stempel UND merkt sich zusätzlich `animatingStamp`, wodurch
   `components/StampAnimation` als Overlay gerendert wird.
2. `StampAnimation` liest über `getMascotEntry`/`PALETTES` aus `components/mascotArt.ts` Farbe
   und "blutig"-Merkmal des aktuell gewählten Maskottchens und zeichnet eine dazu passende,
   fellbedeckte Pranke (CSS-Formen, keine Canvas-Neuzeichnung), die den gewählten Stempel
   (dynamisch aus `domain/rating.STAMPS`) aufs Tagebuch-Blatt drückt. Blutstropfen erscheinen
   nur, wenn der Katalogeintrag `gore: true` hat.
3. Die Animation ruft `onDone` nach ca. 1.9 s automatisch auf (oder sofort bei
   `prefers-reduced-motion`); Antippen des abgedunkelten Hintergrunds beendet sie vorzeitig. Das
   Formular bleibt darunter unverändert nutzbar - die Animation ist ein zusätzliches Overlay,
   kein Bestandteil des Speichervorgangs.

### Datensicherung: Backup/Restore (Sprint 5)

1. `storage/backup.ts` ist reine Storage-Logik ohne UI-Abhängigkeit: `createBackup(profileId)`
   liest Profil, Tagebuch, Geheimfach und Verlauf parallel über die bestehenden Repositories und
   bündelt sie in ein versioniertes `BackupData`-Objekt; `isBackupData` prüft eine unbekannte
   JSON-Struktur per Type-Guard; `restoreBackup` schreibt alle Daten zurück (siehe DECISIONS.md
   ADR-018 für die Details zur ID-Behandlung von Geheimfach/Verlauf).
2. `features/profile/ProfilePage` bindet das im neuen Abschnitt "📦 Datensicherung" an: "Backup
   herunterladen" erzeugt einen `Blob` und löst über einen unsichtbaren `<a download>` den
   nativen Browser-Speichern-Dialog aus; "Backup wiederherstellen" öffnet über ein verstecktes
   `<input type="file">` den nativen Dateiauswahl-Dialog, liest die Datei per `FileReader`, prüft
   sie mit `isBackupData` und lädt die Seite nach erfolgreichem Restore neu.
3. Kein eigener Object Store und keine neue DB-Version nötig - das Feature liest/schreibt
   ausschliesslich über die vier bestehenden Repositories.

### Lokale Mac-Sicherung (Sprint 5, ersetzt Cloud-Backup)

`storage/localBackup.ts` erstellt nach lokalen Änderungen ein vollständiges Backup und sendet es
best-effort an den HTTPS-Dienst im Heimnetz. Das iPhone bleibt Quelle der Wahrheit. Der Dienst
prüft Zugriffsschlüssel und erlaubten Origin und schreibt atomar in `local-backups/`. Bei leerem
iPhone-Speicher versucht `App.tsx` einmalig die Wiederherstellung vom Mac. `persistentStorage.ts`
fordert zusätzlich WebKits persistenten Speichermodus an. Der frühere Cloudflare-Client und Worker
sind entfernt; ADR-019 bleibt nur als historische Entscheidung erhalten und wird von ADR-021
abgelöst.

### Historisch: Automatisches Cloud-Backup (Sprint 5)

1. `storage/cloudSync.ts` kapselt zwei Funktionen: `uploadBackupToCloud(profileId)` (baut über
   `createBackup` den aktuellen Stand und sendet ihn per `PUT` an den konfigurierten Worker) und
   `downloadBackupFromCloud()` (per `GET`, validiert die Antwort mit `isBackupData`). Beide sind
   ohne `VITE_CLOUD_SYNC_URL`/`VITE_CLOUD_SYNC_KEY` (siehe `.env.local.example`) reine No-Ops -
   kein Fetch-Aufruf, kein Fehler. Netzwerkfehler werden verschluckt, nie an die aufrufende Stelle
   durchgereicht (siehe DECISIONS.md ADR-019).
2. Fünf Aufrufstellen lösen nach einer erfolgreichen lokalen Änderung `scheduleCloudBackup`
   "fire and forget" aus: `features/profile/useProfile` (`save`),
   `features/missions/useHiddenMissions` (`hide`), `features/secret-vault/useSecretVault`
   (`toggle`), `app/MissionFlowPage` und `features/diary/DiaryEntryDetailPage` (jeweils nach
   `saveEntry`). Bewusst auf Ebene der Feature-Hooks/-Seiten statt in den Repositories selbst, um
   einen Zirkelimport zu vermeiden (`backup.ts` importiert alle vier Repositories).
3. `App.tsx` versucht beim Start `downloadBackupFromCloud()` genau dann, wenn lokal noch kein
   abgeschlossenes Profil existiert - existiert bereits eines, wird die Cloud nicht angefragt
   ("lokal schlägt Cloud"-Regel, siehe ADR-019). Ein gefundener Stand wird über `restoreBackup`
   eingespielt, bevor `OnboardingFlow` gerendert würde.
4. `cloud-worker/` ist ein separates Deployable (eigenes `package.json`, kein Teil des
   Vite-Builds): ein minimaler Cloudflare Worker mit KV-Speicher, der genau `PUT /:key` und
   `GET /:key` beantwortet. Der lange, zufällige `key` ist zugleich der einzige Zugriffsschutz -
   Deployment-Anleitung in `cloud-worker/README.md`.

## Getränke-Katalog (Sprint 6)

Getränkemissionen verwenden das optionale, für die Primärkategorie `getraenk` aber validierte
`Mission.drinkProfile`. Es enthält Geschmack, Serviertemperatur, sichtbare Eigenschaften,
benötigte Geräte und mindestens zwei Varianten. Vierzehn neue Getränke liegen getrennt in
`src/data/drinkMissions.ts`; zusammen mit der ersten Beispielmission ergeben sich genau 15.

Die Merkmale versorgen die Missionsdetailseite und bilden eine Grundlage für Sprint 7.
`suggestionsForCategory` bleibt auf fünf Ergebnisse begrenzt und nutzt weiterhin das lokale
Präferenzprofil aus Sprint 3. Die Startseite berechnet zuerst alle Kategorie-Vorschläge und
übergibt deren IDs als Ausschlussmenge an `pickDailyMission`; die Tagesmission ist damit immer
eine zusätzliche, unten nicht nochmals sichtbare Mission.

## Speicherung

IndexedDB, Datenbank `crazylab`, aktuell Version 3 mit vier Object Stores:

- `diaryEntries` (seit Sprint 1): Key `id`, Indizes `by-profile`, `by-completedAt`.
- `secretVaultEntries` (seit Sprint 2): Key `id`, Indizes `by-profile`, `by-mission`.
- `hiddenMissions` (seit Sprint 2): Key `id`, Indizes `by-profile`, `by-mission`.
- `profiles` (seit Sprint 4): Key `id`, kein Index (aktuell genau ein Eintrag pro App).

Zugriff ausschliesslich über je ein Repository-Interface (`DiaryRepository`,
`SecretVaultRepository`, `HiddenMissionsRepository`, `ProfileRepository`) in `src/storage`, damit
spätere
Erweiterungen (z. B. Cloud-Sync in Sprint 19) die UI nicht verändern müssen. `storage/db.ts`
kapselt den `upgrade`-Callback so, dass neue Object Stores versionsweise ergänzt werden, ohne
bestehende Stores zu berühren.

Missionsdaten sind statisch und nicht in IndexedDB gespiegelt; Tagebucheinträge enthalten einen
`missionSnapshot` (Titel, Kategorie, `contentVersion`), damit spätere Inhalts-Updates bestehende
Einträge nicht verändern.

## PWA

- `vite-plugin-pwa` mit Strategie `generateSW` erzeugt Manifest und Service Worker automatisch
  beim Build (`registerType: 'autoUpdate'`, Registrierung wird von Vite ins gebaute `index.html`
  injiziert).
- App-Icons liegen als PNG in `public/icons/` (192, 512, maskable 512), Favicon als eigenes SVG.
- Es besteht keine Abhängigkeit von externen Netzwerk-Ressourcen (keine CDN-Fonts, keine
  externen Bilder).
- Sowohl die Service-Worker-Registrierung als auch `crypto.randomUUID()` (siehe `domain/id.ts`)
  erfordern einen sicheren Kontext (HTTPS oder `localhost`). Seit Sprint 5 stellt `vite.config.ts`
  bei vorhandenen lokalen mkcert-Zertifikaten (`certs/`, gitignored) HTTPS auch für `server` und
  `preview` bereit (siehe DECISIONS.md ADR-017), damit die App auch über die lokale Netzwerk-IP
  in einem sicheren Kontext läuft und offline-fähig ist - bestätigt per Flugmodus-Test auf Elenas
  iPhone.

## Erweiterungspunkte für spätere Sprints

- `domain/profile.ts` ist bereits mehrprofilfähig (`Profile`, `profileId` auf jedem
  `DiaryEntry`, `SecretVaultEntry` und `HiddenMissionEntry`); Sprint 20 ergänzt UI zum
  Profilwechsel.
- `MissionSnapshot.contentVersion` erlaubt spätere Inhalts-Updates ohne bestehende
  Tagebucheinträge zu verändern.
- `storage/*Repository.ts`-Dateien sind Interfaces; Cloud-Repository-Implementierungen
  (Sprint 19) können dieselbe Schnittstelle bedienen. Der manuelle Backup/Restore aus Sprint 5
  (`storage/backup.ts`) deckt bis dahin den wichtigsten Fall (Datenverlust bei Neuinstallation)
  ab, ersetzt aber keine echte Geräte-Synchronisation.
- `MissionStep.timerSeconds` und `helpTip` sind bereits pro Schritt modelliert.
- Gesamtansicht (alle Schritte gleichzeitig statt Schritt-für-Schritt) ist datenseitig möglich
  (`mission.steps`-Array), aber UI-seitig noch nicht exponiert.
- `domain/suggestions.ts` (`suggestionsForCategory`, `pickDailyMission`) ist bewusst simpel
  gehalten (keine gelernten Vorlieben) - Sprint 3 ersetzt bzw. erweitert die Auswahllogik um ein
  Präferenzprofil, ohne dass Aufrufer (`HomePage`) sich ändern müssen, solange die Signatur
  kompatibel bleibt.
- Missionskarten zeigen aktuell die Anzahl benötigter Zutaten statt "fehlender Materialien" -
  Sprint 8 (Laborschrank) liefert die Inventardaten, die für einen echten
  Fehlt-mir-noch-Abgleich nötig sind; `MissionCard` kann dann um diese Information erweitert
  werden.
- `Profile.birthdays` ist bereits eine Liste (mehrere Personen); Geburtstagsmissionen nutzen
  bisher nur die bestehende Tagesmissions-Auswahl mit festlichem Rahmen, keine eigens kuratierten
  Geburtstagsinhalte - sobald mehr Missionen existieren (Sprint 6+), könnte hier gezielter
  ausgewählt werden (z. B. bevorzugt Schwestern-Missionen bei Geschwister-Geburtstagen).
- Sprint 20 (Mehrere Profile) muss `App.tsx`s Onboarding-Gate erweitern: aktuell prüft sie nur
  ein einziges Profil mit fester ID (`DEFAULT_PROFILE.id`), ein Profilwechsel bräuchte zusätzlich
  eine Auswahl, welches Profil aktiv ist.
