# Changelog

## Sprint 18 - iPad- und Mac-Optimierung (2026-09-01)

- Das bewährte einspaltige iPhone-Layout bleibt unverändert erhalten.
- Auf iPads erscheinen Missionskategorien und Tagebucheinträge in mehreren Spalten.
- Auf Mac und grossen iPads ist eine feste seitliche Labornavigation verfügbar.
- Profil- und Inhaltsseiten nutzen breitere Bildschirme kontrolliert, ohne unlesbar lange Zeilen.
- Safari 12 bleibt unterstützt; 128 Tests, Typecheck, Lint und Produktions-Build erfolgreich.

## Kompatibilitätskorrektur für iOS 12.5.8 (2026-09-01)

- Der Produktions-Build wird bis Safari 12 zurückübersetzt, damit Crazy Lab auf dem alten
  Familien-iPad nicht mehr wegen zu neuer JavaScript-Syntax mit schwarzem Bildschirm startet.
- Nicht verfügbare Laufzeitfunktionen für Fotoklassen und Missionslisten wurden durch gleichwertige
  kompatible Varianten ersetzt; die von der Navigation intern benötigte Listenfunktion wird nur
  ergänzt, wenn der Browser sie noch nicht selbst besitzt.
- Moderne iPhones erhalten weiterhin denselben Funktionsumfang, dasselbe Datenformat und dieselbe
  lokale Speicherung; es gibt keine separate alte App und keine Datenübertragung zwischen Geräten.
- Typecheck, Lint, 128 Tests und Produktions-Build erfolgreich; Sichtprüfung auf dem echten alten
  iPad noch offen.

## Sprint 17 - Musik und Atmosphäre (2026-09-01)

- Jede Mission startet mit einem gut sichtbaren, überspringbaren Drei-Sekunden-Countdown.
- Fünf unterschiedliche dezente Tonfolgen werden lokal über die Web-Audio-Funktion des Browsers
  erzeugt und passen zu Getränke-, Bastel-, Experiment-, Foto- und Schwestern-Missionen.
- Musik startet erst nach Elenas Berührung und lässt sich während der Mission abschalten.
- Im Profil können Musik und Animationen global ausgeschaltet werden.
- „Bewegung reduzieren“ des Betriebssystems wird unabhängig davon automatisch respektiert.
- Keine Musikdateien, externen Übertragungen, Konten, Abos oder neuen Kosten.

## Sprint 16 - Labortagebuch vollständig (2026-09-01)

- Tagebuch nach Text, Kategorie und Status durchsuchbar und filterbar.
- Einträge erscheinen als Bildkarten mit erstem Foto oder Missionsmotiv und sichtbarem Stempel.
- Eigener Name, Notiz, Status und Stempel lassen sich nachträglich bearbeiten.
- Gespeicherte Fotos können einzeln entfernt werden; Foto-Challenges erlauben bis zu zehn Bilder.
- Löschen eines Eintrags erfordert eine eindeutige Rückfrage und entfernt ihn erst danach lokal.

## Sprint 15 - Eigene Missionen (2026-09-01)

- Neuer Startseitenbereich für eigene Missionen mit kindgerechtem Maskottchen-Assistenten.
- Missionen lassen sich mit Titel, Beschreibung, Kategorie, Dauer, Kosten, Materialien und
  einzelnen Schritten erfinden und später bearbeiten.
- Jede Katalogmission und jede eigene Mission kann als Vorlage kopiert werden.
- Gelbe und rote Entwürfe benötigen zwingend einen konkreten Sicherheitshinweis.
- Eigene Missionen verwenden den normalen Ablauf mit Einkaufsliste, Schritten, Bewertung und
  Labortagebuch.
- Neuer IndexedDB-Store `customMissions` in Version 8; automatische und externe Sicherungen
  enthalten eigene Missionen.
- 123 Tests, Typprüfung, Lint, Format und Produktions-Build erfolgreich; Familienabnahme offen.

## Sprint 14 - Schwestern-Missionen (2026-09-01)

- Katalog auf 15 Schwestern-Missionen mit gemeinsamen Anleitungen ausgebaut.
- Geheime Teilaufgaben für Elena und ihre Schwester lassen sich getrennt aufklappen.
- Ausgewählte Missionen enthalten eine Fünf-Minuten-Challenge mit sichtbarem Timer.
- Jede Mission endet mit einem gemeinsamen Finale; eine Teamnotiz bleibt im Tagebuch erhalten.
- Vollständige Qualitätsprüfung gemeinsam mit Sprint 12/13: 120 Tests erfolgreich.

## Sprint 13 - Foto-Challenges (2026-09-01)

- Katalog auf 15 Foto-Challenges mit konkreten Bildideen und Tipps ausgebaut.
- Bis zu fünf Bilder lassen sich über Kamera oder Fotomediathek auswählen und werden auf maximal
  1000 Pixel verkleinert.
- Drei Rahmen und vier einfache Effekte stehen zur Wahl; Auswahl und Bilder bleiben im Tagebuch
  erhalten und werden dort entsprechend dargestellt.
- Bilder bleiben ausschliesslich im lokalen IndexedDB-Speicher und in ausdrücklich erstellten
  Sicherungen.

## Sprint 12 - Experimentier-Labor (2026-09-01)

- Katalog auf 15 sichere Experimente mit Forschungsfrage, Vermutung, Beobachtung und Erklärung
  ausgebaut.
- Mehrtägige Versuche speichern jeden abgehakten Schritt und lassen sich pausieren.
- Laufende Versuche erscheinen zum direkten Fortsetzen auf der Startseite.
- Forschungsnotizen und Fortschritt werden lokal gespeichert; der Fortschritt ist Bestandteil
  von Backup und Wiederherstellung.
- IndexedDB auf Version 7 mit neuem Store `experimentProgress` erweitert.

## Sprint 11 - Bastel-Labor und Bedienungsverbesserungen (2026-08-31)

- Bastelkatalog auf 15 sichere Missionen ausgebaut: Playmobil-Szenen, Miniaturen, Geheimfächer,
  Kulissen sowie ungefährliche Licht- und Nebeleffekte.
- Automatische lokale Sicherungsstände beim Start, im Fünf-Minuten-Takt und beim App-Wechsel;
  unveränderte Daten werden nicht doppelt gespeichert, maximal zehn Stände bleiben erhalten.
- Profilseite zeigt „Jetzt sichern“ und eine verständliche datierte Wiederherstellungsliste; die
  technische Datei ist nur noch in der aufgeklappten Notfallkopie sichtbar.
- Eigene Materialien können im Laborschrank frei eingegeben werden. Eine lokale, nachvollziehbare
  Regelmaschine ordnet beispielsweise Wattestäbchen als Bastelmaterial ein.
- IndexedDB auf Version 6 erweitert; 113 Tests erfolgreich, Familienabnahme offen.

## Sprint 10 - Filter und Vorschlagsmaschine (2026-08-31)

- Neuer aufklappbarer Missionsfilter auf der Startseite für Zeit, Budget, Ort, Unordnung,
  Erwachsenenhilfe und Personenanzahl.
- Filter gelten einheitlich für Kategorie-Vorschläge und Tagesmission.
- Sicherheitsstufen und Hinweise entscheiden nachvollziehbar, welche Missionen ohne erwachsene
  Person angeboten werden; Schwestern-Missionen benötigen mindestens zwei Personen.
- Die bestehende Präferenzsortierung wird um einfache Diversitätsregeln für Dauer, Kosten und
  Unordnung ergänzt; Hauptkategorien behalten immer Vorrang.
- 107 Tests erfolgreich; Familienabnahme auf Elenas iPhone offen.

## Sprint 9 - Einkaufsliste Basis (2026-08-30)

- Missionen können ihre noch fehlenden Materialien mit einem Knopfdruck auf die Einkaufsliste
  legen; ausreichend vorhandene Laborschrank-Materialien und bestehende Listeneinträge werden
  nicht dupliziert.
- Coop ist Standard für Lebensmittel, Jumbo für typische Bastelmaterialien; Migros bleibt als
  auswählbare Alternative verfügbar.
- Richtpreise, offene Gesamtsumme, Abhaken und Zuständigkeit für Michael, Elena oder beide.
- Abgehakte Einkäufe lassen sich direkt als „Genug“ in den Laborschrank übernehmen.
- Neuer IndexedDB-Store `shoppingListItems` in Datenbankversion 5 und Backup-Integration.
- 103 Tests erfolgreich; Familienabnahme auf Elenas iPhone offen.

## Sprint 8 - Laborschrank Basis (2026-08-30)

- Neuer Bereich „Laborschrank“ auf der Startseite.
- Durchsuchbare, vorbereitete Materialliste wird direkt aus allen Missionsmaterialien erzeugt.
- Materialien lassen sich mit genauer Sorte/Marke, Bereich, Mengenstatus und benannter
  Bastelkiste lokal verwalten.
- Freiwillige Fotos werden vor dem Speichern auf maximal 800 Pixel verkleinert.
- Neuer IndexedDB-Store `labCabinetItems` in Datenbankversion 4.
- Manuelles Backup enthält jetzt auch den Laborschrank; alte Backup-Dateien bleiben kompatibel.
- 99 Tests erfolgreich; Familienabnahme auf Elenas iPhone offen.

## Sprint 7 - Getränke-Bewertung und lernende Varianten (2026-08-30)

- Vor Missionsstart lässt sich eine konkrete Getränkevariante auswählen.
- Getränke werden getrennt nach Geschmack, Optik, Gruseligkeit und Dekoration bewertet.
- Tagebucheinträge speichern und zeigen die gewählte Variante und alle vier Einzelbewertungen.
- Crazy Lab sortiert Varianten beim nächsten Versuch nach dem Durchschnitt von Elenas eigenen
  Bewertungen und markiert die beste bekannte Variante als persönliche Empfehlung.
- Ohne vorhandene Bewertung bleibt die redaktionelle Katalogreihenfolge erhalten.
- Familienfeedback: Abgeschlossene Missionen verschwinden aus den normalen Vorschlägen, die
  nächste offene Mission rückt nach. Gemerkte Missionen bleiben im verständlicher benannten
  Bereich „Gemerkte Missionen“ mit „Nochmals machen“ erreichbar. Die Tagesmission bleibt von den
  Kategorie-Vorschlägen ausgeschlossen.
- 97 Tests erfolgreich; Familienabnahme auf Elenas iPhone offen.

## Sprint 5 - Online-Betrieb und lokale Mac-Sicherung (2026-08-30)

- Cloudflare-Client, Worker-Gerüst und zugehörige Abhängigkeiten vollständig entfernt.
- IndexedDB bleibt Hauptspeicher; die App beantragt beim Start dauerhaften WebKit-Speicher.
- Nach Sicherheitsprüfung die automatische Mac-Verbindung verworfen: Ein im öffentlichen
  Web-Build enthaltener Zugriffsschlüssel wäre kein Geheimnis. Zweite Kopie bleibt das bewährte
  manuelle Backup auf der Profilseite.
- Offline-Service-Worker auf Familienentscheid entfernt; Aktualisierungen kommen beim erneuten
  Online-Öffnen automatisch.
- Neues, von Michael ausgewähltes Schleimmonster-App-Symbol und statisches Web-App-Manifest.
- Reiner Programmcode kostenlos und verschlüsselt über GitHub Pages veröffentlicht; der Mac muss
  für die Nutzung nicht laufen und persönliche Daten werden nicht hochgeladen.
- iPhone-Backup korrigiert: Statt eines unzuverlässigen stillen Downloads öffnet Crazy Lab den
  iOS-Teilen-Dialog für „In Dateien sichern“ und behauptet nicht mehr ungeprüft, die Datei sei
  gespeichert.
- Navigation auf GitHub Pages auf Hash-Routen umgestellt: Nach einer Wiederherstellung oder dem
  Neuladen einer Unterseite erscheint dadurch kein `404 File not found` mehr.
- Öffentlicher Build sowie vollständiger Backup-/Restore-Rundlauf auf dem iPhone erfolgreich;
  Sprint 5 abgeschlossen.

## Sprint 6 - Getränke-Labor, Familienabnahme offen (2026-08-30)

### Hinzugefügt

- Getränke-Katalog auf genau 15 vollständige, trinkbare und kindgerecht beschriebene Missionen
  mit Materialien, Schritten, Sicherheitsstufe und Hilfen erweitert.
- Strukturiertes `drinkProfile` mit Geschmack, Temperatur, Optik, Geräten und mindestens zwei
  Varianten je Getränkemission; die Detailansicht zeigt Merkmale und Varianten direkt an.
- Inhaltskatalog in `src/data/drinkMissions.ts` ausgelagert.

### Qualität

- Inhaltsvalidierung, Anzahl, Vielfalt, Vorschlagslimit und Detailansicht automatisch geprüft -
  insgesamt 100 erfolgreiche Tests.
- Familienfeedback umgesetzt: Die Tagesmission wird nur aus Missionen gewählt, die nicht bereits
  unten in einer Kategorie angezeigt werden. Die fünf Kategorie-Vorschläge bleiben dadurch
  unverändert vollständig.
- Sprint 5 bleibt in Arbeit; Sprint 6 ist bis zu Elenas Praxistest noch nicht familienseitig
  abgeschlossen.

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
- Keine Startseiten-Knöpfe für Laborschrank, laufende Missionen, eigene Mission (Sprints 8, 12, 15) - keine Stub-Seiten für noch nicht existierende Bereiche.

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
