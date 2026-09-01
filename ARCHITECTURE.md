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

### Dauerhafter iPhone-Speicher und manuelles Backup (Sprint 5)

IndexedDB auf dem iPhone bleibt Quelle der Wahrheit. `persistentStorage.ts` fordert zusätzlich
WebKits persistenten Speichermodus an. `storage/backup.ts` exportiert/importiert bei Bedarf eine
zweite, manuell auf dem Mac aufbewahrte Kopie. Eine automatische lokale Mac-Verbindung wurde nach
Sicherheitsprüfung verworfen; Cloudflare-Client und Worker sind entfernt. ADR-019 bleibt nur als
historische Entscheidung erhalten und wird von ADR-021 abgelöst.

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

## Getränke-Bewertung und Variantenlernen (Sprint 7)

`CompletionRating` speichert für Getränke optional `taste`, `appearance`, `scariness`,
`decoration` und den Namen der tatsächlich gewählten `drinkVariant`. Alte Tagebucheinträge ohne
diese Felder bleiben vollständig kompatibel. `domain/drinkVariantRanking.ts` berechnet je
Mission und Variante den Mittelwert der vorhandenen Einzelbewertungen (ersatzweise das
Gesamtergebnis) und sortiert bekannte Varianten absteigend. Unbewertete Varianten folgen in der
redaktionellen Katalogreihenfolge. Es gibt kein separates Lernprofil und keine zweite
Speicherquelle: Die Tagebucheinträge bleiben die nachvollziehbare Wahrheit.

Die Startseite leitet aus denselben Tagebucheinträgen zusätzlich die Menge abgeschlossener
Missions-IDs ab. `suggestionsForCategory` blendet diese aus, sodass noch offene Katalogeinträge
nachrücken. Die Tagesmission erhält sowohl die aktuell sichtbaren Kategorie-IDs als auch die
abgeschlossenen IDs als Ausschlussmenge. Im Geheimfach gespeicherte Missionen werden davon nicht
gelöscht und bleiben unabhängig von ihrem Abschlussstatus wiederholbar.

## Laborschrank (Sprint 8)

`LabCabinetItem` verbindet die allgemeine Materialbezeichnung aus dem statischen Missionskatalog
mit Elenas lokaler genauer Bezeichnung, Bereich, optionaler Bastelkiste, Mengenstatus und
freiwilligem Foto. Die vorbereitete Vorschlagsliste wird zur Laufzeit aus allen
`Mission.materials` dedupliziert; sie ist keine zweite Datenbanktabelle. Nur tatsächlich
übernommene Materialien liegen im IndexedDB-Store `labCabinetItems` (DB-Version 4, Indexe nach
Profil und Material). Fotos werden clientseitig auf maximal 800 Pixel verkleinert und als
JPEG-Data-URL zusammen mit dem Eintrag gespeichert. `BackupData.labCabinetItems` ist optional,
damit bestehende Backups der Version 1 weiterhin eingelesen werden können.

## Einkaufsliste (Sprint 9)

`shoppingListPlanning.ts` wandelt Missionsmaterialien in profilbezogene `ShoppingListItem`s um.
Eine kleine, explizite Wortliste wählt für typische Bastelmaterialien Jumbo, ansonsten Coop;
Migros und alle Läden bleiben in der UI änderbar. Richtpreise sind bewusst grobe lokale Regeln,
keine extern abgerufenen Produktpreise. `MissionFlowPage` überspringt Materialnamen, die bereits
auf der Liste stehen oder im Laborschrank den Status „Genug“/„Viel“ haben. Der Store
`shoppingListItems` (DB-Version 5) hält Laden, Preis, Zuständigkeit und Abhakstatus. Beim Übernehmen
wird ein vorhandener Laborschrank-Eintrag auf „Genug“ gesetzt oder ein neuer Eintrag in Küche
(Jumbo: Bastelkiste) angelegt und die Einkaufsposition entfernt. Auch dieses Backup-Feld ist
optional für Rückwärtskompatibilität.

## Missionsfilter und Diversität (Sprint 10)

`missionFilters.ts` enthält die reine Filterlogik und ein bewusst kleines, nicht persistiertes
`MissionFilters`-Objekt. Die Startseite filtert den statischen Katalog vor Tagesmission und
Kategorie-Vorschlägen, damit überall dieselben Bedingungen gelten. „Allein“ schliesst Missionen
mit gelber/roter Sicherheitsstufe oder ausdrücklichem Hilfehinweis aus; Schwestern-Missionen
benötigen mindestens zwei Personen. `suggestions.ts` behält Präferenz-Scores und
Primärkategorie-Vorrang bei, wählt nach dem stärksten Treffer aber möglichst verschiedene
Kombinationen aus Dauer-, Kosten- und Unordnungsstufe. Filter werden nach einem Neustart bewusst
zurückgesetzt: Sie beschreiben die aktuelle Situation, keine dauerhafte Vorliebe.
`suggestionsForCategory` bleibt auf fünf Ergebnisse begrenzt und nutzt weiterhin das lokale
Präferenzprofil aus Sprint 3. Die Startseite berechnet zuerst alle Kategorie-Vorschläge und
übergibt deren IDs als Ausschlussmenge an `pickDailyMission`; die Tagesmission ist damit immer
eine zusätzliche, unten nicht nochmals sichtbare Mission.

## Bastelkatalog und eigene Materialien (Sprint 11)

`craftMissions.ts` ergänzt vierzehn Bastelmissionen; zusammen mit dem bestehenden Geisterbett
liegen genau 15 primäre Bastelmissionen im gemeinsamen statischen Katalog. Sie verwenden dasselbe
Missionsmodell, dieselben Filter und dieselben Einkaufs-/Laborschrank-Pfade wie Getränke.
`materialClassification.ts` normalisiert frei eingegebene Materialnamen und ordnet sie über
sichtbare Wortregeln einem `MaterialType` und Startbereich zu. Der gespeicherte
`LabCabinetItem.source` unterscheidet Katalog- und eigene Einträge; Elena kann Bereich und genaue
Bezeichnung danach wie gewohnt ändern.

## Lokale Sicherungsstände (Sprint 11)

`localBackupSnapshots` (DB-Version 6) speichert höchstens zehn vollständige, intern serialisierte
`BackupData`-Stände pro Profil. `useAutomaticSnapshots` versucht einen Stand beim App-Start, alle
fünf Minuten und beim Wechsel in den Hintergrund zu erzeugen. Ein Fingerabdruck ohne den variablen
Exportzeitpunkt verhindert Dubletten. Die Profilseite listet die Stände mit Datum; Wiederherstellen
entfernt zuerst die aktuellen profilbezogenen Nutzdaten und spielt dann den gewählten Stand über
`restoreBackup` ein. Diese Stände liegen bewusst auf demselben iPhone und sind
daher Komfortschutz, kein Schutz vor kompletter App-/Browserdaten-Löschung. Der externe
Datei-Export aus Sprint 5 bleibt deshalb in einem separaten Notfallbereich erhalten.

## Strukturierte Experimente und Fortschritt (Sprint 12)

`experimentMissions.ts` ergänzt den statischen Katalog auf 15 primäre Experimente. Ein optionales
`ExperimentProfile` hält Forschungsfrage, Eingabeaufforderungen, redaktionelle Erklärung und die
Anzahl Versuchstage. `StepRunner` meldet bei Experimenten jeden abgehakten Schritt an
`MissionFlowPage`; mehrtägige Versuche können zusätzlich pausiert werden. Das
`experimentProgressRepository` speichert den Fortschritt profil- und missionsbezogen. Die
Startseite liest diese Einträge und zeigt „Laufende Versuche“. Beim Abschluss wird der
Fortschritt entfernt und Vermutung, Beobachtung sowie Erklärung werden Teil der normalen
Tagebuchbewertung.

## Foto-Challenges (Sprint 13)

`photoMissions.ts` ergänzt den Katalog auf 15 primäre Foto-Challenges. Ein `PhotoProfile` enthält
redaktionelle Tipps sowie erlaubte Rahmen und Effekte. `CompletionForm` nutzt den normalen
Browser-Dateiwähler mit Kamera-Unterstützung, nimmt höchstens fünf Bilder an und verkleinert sie
im Browser auf maximal 1000 Pixel. Daten-URLs, Rahmen und Effekt liegen als optionale Felder im
Tagebucheintrag. Es gibt keinen Upload und keine externe Bildverarbeitung.

## Schwestern-Missionen (Sprint 14)

`sisterMissions.ts` ergänzt den Katalog auf 15 primäre Schwestern-Missionen. Das
`SisterProfile` trennt zwei geheime Teilaufgaben, einen gemeinsamen Abschluss und optional eine
Zeitvorgabe. Die Geheimnisse werden in der Detailansicht bewusst einzeln aufgeklappt. Bei einer
Zeit-Challenge aktiviert `StepRunner` im vorgesehenen Schritt denselben getesteten Timer wie
andere Missionen. Eine freiwillige Teamnotiz wird im Tagebucheintrag gespeichert.

## Eigene Missionen (Sprint 15)

`features/custom-missions` enthält Übersicht und Editor. Der Editor baut aus kindgerechten
Feldern ein vollständiges `CustomMission`-Objekt; Materialien und Schritte werden zeilenweise
erfasst. Eine Kopie übernimmt sichtbare Grunddaten der Vorlage, erhält beim Speichern aber eine
neue ID. Gelbe und rote Entwürfe benötigen vor dem Speichern einen ausreichend konkreten
Sicherheitshinweis. `App.tsx` lädt eigene Missionen für `/mission/:missionId` aus dem Repository
und reicht sie als `missionOverride` in denselben Ablauf wie Katalogmissionen. Damit bleiben
Einkaufsliste, Schrittmodus, Bewertung und Tagebuch einheitlich.

## Vollständiges Labortagebuch (Sprint 16)

`DiaryPage` filtert die bereits geladenen profilbezogenen Einträge lokal nach Suchtext,
Hauptkategorie und Status. Die Bildkarte nutzt das erste gespeicherte Foto, sonst weiterhin den
unveränderlichen Missions-Snapshot. `DiaryEntryDetailPage` schreibt bearbeitbare Anzeigefelder
über dasselbe Repository zurück; Fotos können einzeln aus `photoDataUrls` entfernt werden.
`DiaryRepository.removeEntry` ist der einzige Löschpfad und wird erst nach einer sichtbaren
Browser-Rückfrage aufgerufen. Neue Fotoabschlüsse begrenzen die Liste auf zehn Bilder.

## Speicherung

IndexedDB, Datenbank `crazylab`, aktuell Version 8 mit neun Object Stores:

- `diaryEntries` (seit Sprint 1): Key `id`, Indizes `by-profile`, `by-completedAt`.
- `secretVaultEntries` (seit Sprint 2): Key `id`, Indizes `by-profile`, `by-mission`.
- `hiddenMissions` (seit Sprint 2): Key `id`, Indizes `by-profile`, `by-mission`.
- `profiles` (seit Sprint 4): Key `id`, kein Index (aktuell genau ein Eintrag pro App).
- `labCabinetItems` (seit Sprint 8): Key `id`, Indizes `by-profile`, `by-material`.
- `shoppingListItems` (seit Sprint 9): Key `id`, Indizes `by-profile`, `by-material`.
- `localBackupSnapshots` (seit Sprint 11): Key `id`, Indizes `by-profile`, `by-createdAt`.
- `experimentProgress` (seit Sprint 12): Key `id`, Indizes `by-profile`, `by-mission`.
- `customMissions` (seit Sprint 15): Key `id`, Indizes `by-profile`, `by-updatedAt`.

Zugriff ausschliesslich über je ein Repository-Interface (`DiaryRepository`,
`SecretVaultRepository`, `HiddenMissionsRepository`, `ProfileRepository`,
`LabCabinetRepository`, `ShoppingListRepository`, `ExperimentProgressRepository`,
`CustomMissionRepository`) in `src/storage`, damit
spätere
Erweiterungen (z. B. Cloud-Sync in Sprint 19) die UI nicht verändern müssen. `storage/db.ts`
kapselt den `upgrade`-Callback so, dass neue Object Stores versionsweise ergänzt werden, ohne
bestehende Stores zu berühren.

Missionsdaten sind statisch und nicht in IndexedDB gespiegelt; Tagebucheinträge enthalten einen
`missionSnapshot` (Titel, Kategorie, `contentVersion`), damit spätere Inhalts-Updates bestehende
Einträge nicht verändern.

## PWA

- Ein statisches Web-App-Manifest macht die Online-App auf dem iPhone installierbar. Ein Service
  Worker wird auf Familienentscheid nicht mehr erzeugt; beim erneuten Öffnen wird die aktuelle
  Online-Version geladen.
- App-Icons liegen als PNG in `public/icons/` (192, 512, maskable 512), Favicon als eigenes SVG.
- Die Produktionsversion liegt unter `https://michaelruosch-ui.github.io/crazy-lab/`; persönliche
  Daten verlassen IndexedDB auf dem iPhone nur beim ausdrücklich ausgelösten manuellen Backup.
- `HashRouter` hält alle Unterseiten hinter `#`. Dadurch beantwortet GitHub Pages auch ein
  Neuladen nach Backup/Restore immer mit der App statt mit seiner statischen 404-Seite.

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
