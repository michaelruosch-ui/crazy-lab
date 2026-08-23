# Changelog

## Sprint 5 - Automatisches Cloud-Backup (2026-08-23)

### Hinzugefügt

- Automatisches Cloud-Backup: nach jeder Änderung (Mission abgeschlossen, Geburtstag geändert,
  Maskottchen gewechselt, Geheimfach/Verlauf geändert) sichert die App den aktuellen Stand im
  Hintergrund in eine private Cloud. Öffnet man die App ohne lokales Profil (z. B. nach einer
  Neuinstallation), wird dieser Stand automatisch geladen, bevor das Onboarding gezeigt würde -
  auf ausdrücklichen Wunsch von Michael als vorgezogene, bewusst abgespeckte Version von
  Sprint 19 (echte Mehrgeräte-Synchronisation mit Konfliktauflösung bleibt dort). Neues Modul
  `storage/cloudSync.ts`, neuer separater Cloudflare-Worker (`cloud-worker/`, eigenes Deployment,
  Anleitung in dessen README). Ohne `.env.local`-Konfiguration bleibt die App unverändert rein
  lokal (siehe DECISIONS.md ADR-019).
- 8 neue Tests (6 für `cloudSync.ts`: Upload, Download, Fehlerfälle, deaktivierter Zustand; 2
  Integrationstests in `App.test.tsx` für den Cloud-Restore-Ablauf) - insgesamt 94.

### Behoben

- `useProfile` blieb für immer bei "Lade..." hängen, wenn das Öffnen der lokalen Datenbank nach
  den Wiederholungsversuchen aus ADR-005 endgültig fehlschlug (unbehandelte Promise-Ablehnung).
  Wird jetzt wie ein fehlendes Profil behandelt, damit zumindest das Onboarding erreichbar bleibt.

## Sprint 5 - Lokales HTTPS und Backup/Restore (2026-08-23)

### Hinzugefügt

- Lokales HTTPS über mkcert-Zertifikate: `vite.config.ts` aktiviert HTTPS für `server` und
  `preview`, sobald `certs/crazylab-{cert,key}.pem` vorhanden sind (gitignored). Ermöglicht einen
  sicheren Kontext auch über die lokale Netzwerk-IP, damit Service Worker und Offline-Betrieb
  zuverlässig funktionieren (siehe DECISIONS.md ADR-017). Zertifikat auf Elenas iPhone installiert
  und vertraut, Offline-Betrieb per Flugmodus bestätigt.
- Neuer Abschnitt "📦 Datensicherung" auf der Profilseite (`/profil`): "Backup herunterladen"
  exportiert Profil, Tagebuch, Geheimfach und Verlauf als JSON-Datei; "Backup wiederherstellen"
  liest eine solche Datei wieder ein und lädt die App danach neu. Neues Modul
  `storage/backup.ts` (`createBackup`, `isBackupData`, `restoreBackup`). Ausgelöst durch einen
  Datenverlust-Vorfall beim Origin-Wechsel von http auf https (IndexedDB ist Origin-gebunden) -
  unabhängig von der genauen Ursache als dauerhaftes Sicherheitsnetz gebaut (siehe DECISIONS.md
  ADR-018).
- 6 neue Tests (3 Modul-Tests für Export/Validierung/Restore-Rundlauf, 3 Komponententests für die
  Profilseiten-Integration) - insgesamt 84.

## Sprint 4 - abgeschlossen (2026-08-23)

Von Michael und Elena final bestätigt nach drei Feedback-Runden. Sprint 5 ist freigegeben.

## Sprint 4 - Stempel-Animation (2026-08-23)

### Hinzugefügt

- Neue Komponente `components/StampAnimation.tsx`: Beim Antippen eines Stempels in der
  Abschlussbewertung erscheint eine kurze Animation, in der eine zum gewählten Maskottchen
  passende, fellbedeckte Pranke (Farbe und "blutig"-Merkmal aus dem Maskottchen-Katalog) den
  gewählten Stempel sichtbar aufs Tagebuch-Blatt drückt. Automatisches Ende nach ca. 1.9 s,
  Antippen des Hintergrunds beendet sie vorzeitig; respektiert `prefers-reduced-motion`.
- `CompletionForm` und `MissionFlowPage` reichen dafür das aktuelle Profil-Maskottchen durch
  (`mascotId`-Prop).
- 6 neue Tests (Blut-Anzeige je nach Maskottchen, Timing, vorzeitiges Beenden, Formular bleibt
  nach der Animation normal bedienbar) - insgesamt 78.

## Sprint 4 - Maskottchen-Katalog erweitert (2026-08-23)

### Behoben

- Geburtsdatum-Auswahl auf iOS: Änderungen an Monat/Jahr im nativen Datumsrad wurden verworfen,
  weil das Feld vollständig "controlled" war und bei jeder Zwischeneingabe neu rendert wurde.
  Feld ist jetzt uncontrolled (Ref statt State), Wert wird erst beim Klick auf "Hinzufügen"
  ausgelesen.

### Geändert

- Maskottchen-Auswahl von 3 CSS-Varianten (Geist/Vampir/Kobold) auf 33 individuelle
  Canvas-Entwürfe erweitert - 8 Tierarten (Bär, Murmeltier, Waschbär, Wolf, Fledermaus, Eule,
  Frosch, Spinnenwesen) in mehreren Farbwelten, teils mit blutigem Detail (Auge im offenen Maul
  auf einer Zunge liegend, Zähne, Blutstropfen). Neue Datei `components/mascotArt.ts` kapselt
  die Zeichenlogik; `MascotPicker` zeigt alle Entwürfe als scrollbares, nach Tierart
  gruppiertes Raster (siehe DECISIONS.md ADR-015).
- `Profile.mascotVariant` ist jetzt ein offener `MascotId`-String statt einer festen
  Drei-Werte-Union; Standard-Maskottchen ist "Blutiger Kuschelbär" (Elenas Favorit aus der
  Vorauswahl).
- 5 neue Tests (Maskottchen-Katalog-Integrität) - insgesamt 72.

## Sprint 4 - Forschernamen, Maskottchen und Geburtstage (2026-08-23)

### Hinzugefügt

- Onboarding (`features/onboarding/OnboardingFlow`): Maskottchen wählen, Forschername vergeben.
  Läuft vor jeder anderen Route, solange kein abgeschlossenes Profil existiert
  (`App.tsx`-Gate, siehe DECISIONS.md ADR-014).
- Drei Maskottchen-Varianten (Geist, Vampir, Kobold) mit eigenem Farbschema über CSS-Custom-
  Properties (`components/Mascot.tsx`, `components/MascotPicker.tsx`).
- Profil wird erstmals persistiert: neuer IndexedDB-Store `profiles` (DB-Version 3),
  `storage/profileRepository.ts`, `features/profile/useProfile.ts`.
- Profilseite (`/profil`): Forschername und Maskottchen jederzeit änderbar, mehrere Geburtstage
  hinzufügbar/entfernbar.
- Geburtstagsmissionen: An einem gespeicherten Geburtstag wird die Tagesmission auf der
  Startseite festlich als "Geburtstagsmission für {Name}" hervorgehoben, statt neuer Inhalte zu
  erfinden (siehe DECISIONS.md ADR-013).
- Das gewählte Maskottchen erscheint jetzt im Startseiten-Header und in der Hilfe-Sprechblase
  während einer Mission.
- 11 neue Tests (Geburtstagslogik, Profil-Repository, Onboarding-Ablauf, Profilseite) -
  insgesamt 67. Ein Testfall deckte einen echten Doppel-Slice-Bug beim Speichern des
  Geburtsdatums auf (`ProfilePage.addBirthday`), der vor dem Commit behoben wurde.

## Sprint 3 - Lokale Persistenz und Präferenzen (2026-08-23)

### Hinzugefügt

- `domain/preferenceProfile.ts`: `buildPreferenceProfile` aggregiert die strukturierten
  Anpassungswünsche (`gruseliger`, `weniger_gruselig`, `farbiger`, `weniger_suess`, `einfacher`,
  `schwieriger`) aus allen Tagebucheinträgen eines Profils zu einer Merkmals-Affinität je
  `MissionTraits`-Dimension. Keine eigene Speicherung - immer frisch aus dem Tagebuch berechnet
  (siehe DECISIONS.md ADR-011).
- `scoreMissionForProfile` bewertet, wie gut eine Mission zum Profil passt (Skalarprodukt aus
  Missionsmerkmalen und Affinität) - einfache, nachvollziehbare Formel statt Black-Box-Logik.
- `suggestionsForCategory` sortiert Kategorie-Vorschläge auf der Startseite jetzt nach Passung
  zum Präferenzprofil; ohne Bewertungen bleibt die Reihenfolge wie in Sprint 2.
- 8 neue Tests (Profilaufbau, Score-Berechnung, Umsortierung) - insgesamt 56.

### Bewusst nicht Teil von Sprint 3 (siehe DECISIONS.md ADR-012)

- Die Tagesmission (`pickDailyMission`) bleibt bei ihrer tagesstabilen Zufallsauswahl,
  unabhängig vom Präferenzprofil - bleibt bewusst überraschend.

## Sprint 2 - abgeschlossen (2026-08-23)

Von Michael final bestätigt nach zwei Feedback-Runden. Sprint 3 ist freigegeben.

## Sprint 2 - Navigation ans untere Bildschirmende verschoben (2026-08-23)

### Geändert

- Alle Zurück-Links (Missionsdetail → Startseite, Tagebuch-Detail → Tagebuch, Geheimfach →
  Startseite, Verlauf → Startseite) wandern vom oberen an den unteren Bildschirmrand - dort mit
  einer Hand am iPhone kaum erreichbar, siehe DECISIONS.md ADR-010.
- Neue wiederverwendbare Komponente `components/BackLink.tsx`: grosszügiges Touch-Ziel,
  Sicherheitsabstand zum unteren Rand via `env(safe-area-inset-bottom)`.
- Die Fortschritts-Punkte im Schritt-Modus sind nicht mehr anklickbar (kein "zu Schritt springen"
  mehr ganz oben am Bildschirm), sondern rein visuelle Anzeige des Fortschritts.

## Sprint 2 - Familien-Feedback eingearbeitet (2026-08-23)

### Behoben/Hinzugefügt

- "Zurück" im Schritt-Modus verlässt bei Schritt 1 die Mission (zurück zur Missionsdetail-
  Ansicht) statt deaktiviert zu bleiben; `StepRunner` erhält dafür eine `onExit`-Callback-Prop.
- Tagebucheinträge sind jetzt anklickbar und öffnen eine Detailansicht (`/diary/:entryId`,
  `features/diary/DiaryEntryDetailPage`) mit allen erfassten Bewertungsdetails.
- "Nochmal machen" lässt sich direkt aus der Tagebuch-Detailansicht umschalten und wird
  dauerhaft gespeichert (bestehender `DiaryRepository.saveEntry` als Upsert wiederverwendet).
- 6 neue automatisierte Tests (Zurück/Exit-Verhalten, Tagebuch-Navigation, Detailansicht,
  Persistenz des Umschaltens) - insgesamt 48.

## Sprint 2 - Entdecken und Wiederfinden (2026-08-23)

### Hinzugefügt

- Echte Startseite (`/`, `features/missions/HomePage`) mit Tagesmission und fünf
  Kategorie-Abschnitten (Getränke, Basteln, Experimente, Foto-Challenges,
  Schwestern-Missionen), je bis zu fünf Vorschlägen.
- `MissionCard`-Komponente für kompakte Missionsübersichten (Bild, Name, Dauer, Schwierigkeit,
  Kosten, Zutatenanzahl).
- Geheimfach (`/geheimfach`): Missionen dauerhaft merken/entfernen, eigene IndexedDB-Tabelle
  `secretVaultEntries`.
- "3 Tage verstecken" blendet eine Mission aus den Vorschlägen aus; 14-Tage-Verlauf (`/verlauf`)
  zeigt alle Verstecken-Vorgänge der letzten 14 Tage mit Status, eigene IndexedDB-Tabelle
  `hiddenMissions`.
- Tagesstabile Tagesmission-Auswahl (`domain/suggestions.pickDailyMission`), noch ohne gelernte
  Vorlieben (folgt Sprint 3).
- Missionsablauf (`app/MissionFlowPage`) funktioniert jetzt für jede Mission über
  `/mission/:missionId` statt nur für eine fest verdrahtete Beispielmission.
- IndexedDB-Schema auf Version 2 erweitert (neue Object Stores, bestehende `diaryEntries`
  unangetastet).
- 18 neue automatisierte Tests (Vorschlagslogik, Verstecken/Verlauf-Zeitfenster,
  Geheimfach-Repository, Verlauf-Repository, Startseiten-Navigation) - insgesamt 42.

### Bewusst nicht Teil von Sprint 2 (siehe DECISIONS.md ADR-007 bis ADR-009)

- Kein Onboarding-"Mission zuerst"-Moment mehr auf `/` - das gehört inhaltlich zu Sprint 4.
- Keine "fehlenden Materialien" auf Missionskarten (braucht Laborschrank, Sprint 8) - stattdessen
  Zutatenanzahl.
- Keine Startseiten-Knöpfe für Laborschrank, laufende Missionen, eigene Mission (Sprints 8, 12,
  15) - keine Stub-Seiten für noch nicht existierende Bereiche.

## Sprint 1 - abgeschlossen (2026-08-23)

Erneuter Familientest auf Elenas iPhone nach dem `crypto.randomUUID`-Fix erfolgreich: kompletter
Ablauf von der Beispielmission über Schritte, Timer, Hilfe, Abschlussbewertung bis zum
persistierten Tagebucheintrag funktioniert auf dem echten Gerät, inklusive Neustart der
installierten App. Alle sieben Prüffragen aus Abschnitt 8 der Spezifikation positiv beantwortet.
Sprint 1 ist damit fertig; Sprint 2 ist freigegeben.

## Sprint 1 - Bugfix nach Familientest (2026-08-23)

### Behoben

- **Tatsächliche Ursache des Speicher-Bugs:** `crypto.randomUUID()` erfordert einen sicheren
  Kontext (HTTPS oder localhost). Beim Testen über die lokale Netzwerk-IP per HTTP
  (`http://<Mac-IP>:4173`, nötig um auf Elenas iPhone zu installieren) ist die Funktion in Safari
  nicht vorhanden, wodurch jeder Speicherversuch mit `TypeError: crypto.randomUUID is not a
  function` fehlschlug - reproduzierbar und nicht durch Wiederholen behebbar. Neue Hilfsfunktion
  `generateId()` (`src/domain/id.ts`) fällt auf `crypto.getRandomValues()` und zuletzt auf
  `Math.random()` zurück, wenn `crypto.randomUUID` fehlt.
- Ein erster Fix-Versuch (Timeout + Wiederholungsversuch beim Öffnen der IndexedDB,
  `src/storage/db.ts`) adressierte eine plausible, aber nicht die tatsächliche Ursache. Bleibt als
  sinnvolle Absicherung für den bekannten iOS-Standalone-PWA-Bug erhalten, hat das Problem beim
  Familientest aber nicht gelöst.
- Die Oberfläche zeigt jetzt sichtbar "Wird gespeichert..." während des Speicherns und bei einem
  Fehler eine Meldung mit dem echten Fehlertext sowie einem "Nochmals versuchen"-Knopf, statt
  scheinbar untätig zu bleiben (`src/app/MissionFlowPage.tsx`,
  `src/features/ratings/CompletionForm.tsx`). Das hat die eigentliche Fehlersuche ohne
  Remote-Debugging auf dem iPhone ermöglicht.

### Bekannte Einschränkung beim Testen über LAN-HTTP

Nicht nur `crypto.randomUUID`, auch die Service-Worker-Registrierung (Grundlage für echte
Offline-Fähigkeit) erfordert einen sicheren Kontext. Solange auf Elenas iPhone über
`http://<Mac-IP>:PORT` getestet wird, registriert sich der Service Worker in Safari
wahrscheinlich nicht. Echte Offline-Prüfung ist erst mit einer HTTPS-fähigen Testumgebung möglich
und ist ohnehin explizit Teil von Sprint 5 ("PWA auf Elenas iPhone").

## Sprint 1 - Projektfundament und Vertical Slice (2026-08-16)

### Hinzugefügt

- Projekt-Setup: Vite + React 19 + TypeScript (strict mode), ESLint (flat config) + Prettier,
  Vitest + Testing Library.
- PWA-Grundlage: Web-App-Manifest, Service Worker (`vite-plugin-pwa`, `generateSW`), App-Icons,
  offline-fähige App-Shell.
- Domain-Modell (`src/domain`): Mission, Schritt, Merkmale, Bewertung, Tagebucheintrag, Profil,
  Missionsvalidierung (inkl. Prüfung auf verbotene Zutaten bei Getränke-Missionen).
- Fünf echte Beispielmissionen (`src/data/missions.ts`): je eine für Getränk, Basteln,
  Experiment, Foto und Schwestern-Mission.
- IndexedDB-Repository für Tagebucheinträge (`src/storage`) über die Bibliothek `idb`.
- UI-Grundbausteine: Dark-Türkis-Theme, Maskottchen (CSS-Platzhalterfigur), Button, Badge,
  Sprechblase, Missions-Illustration (CSS/Emoji-Platzhalter, keine externen Bilder).
- Missionsdetail-Ansicht mit Bild, Titel, Dauer, Schwierigkeit, Kosten, Material und
  Sicherheitsstufe.
- Schritt-für-Schritt-Ausführung: Schritte abhaken, manueller Timer (Start/Pause/Reset), Hilfe-
  Sprechblase mit schritt- bzw. missionsspezifischem Tipp, Fortschritt bleibt während der
  Sitzung erhalten.
- Abschlussbewertung: Ergebnis, Geschmack (bei Getränken), Schwierigkeits-Feedback, nochmals
  machen, weiterempfehlen, strukturierte Anpassungswünsche, Freitext, Erfindungsname, Stempel.
- Geheimnisvolles Labortagebuch: zeigt gespeicherte Einträge, übersteht Neuladen.
- Automatisierte Tests: Missionsdaten-Validierung, Timer-Verhalten, Schritte abhaken,
  Hilfe-Tipps, Abschlussvalidierung, Persistenz nach simuliertem und echtem Neuladen,
  verbotene Zutaten, Render-Smoke-Test, vollständiger End-to-End-Ablauf.
- Projektdokumentation: README, BACKLOG, ARCHITECTURE, DECISIONS.

### Bekannte Grenzen (bewusst nicht Teil von Sprint 1)

- Keine Startseite mit Kategorie-Übersicht, kein Geheimfach, keine Tagesmission (Sprint 2).
- Präferenzprofil/lernende Gewichtung noch nicht implementiert (Sprint 3).
- Kein Onboarding, kein veränderbarer Forschername, keine Geburtstage (Sprint 4).
- iPhone-Installationsanleitung ist provisorisch; volle Offline-/Safari-QA folgt in Sprint 5.
