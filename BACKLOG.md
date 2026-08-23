# Backlog

Neue Ideen werden nicht als neue Nummern zwischen bestehende Sprints geschoben. Sie landen zuerst
hier im Abschnitt "Unpriorisierte Ideen" und werden später priorisiert.

## Aktueller Sprint

### Sprint 5 - PWA auf Elenas iPhone

Status: In Arbeit. Rein technischer Sprint ohne neue sichtbare Funktionen - Ziel ist eine
zuverlässige, "richtige" Installation statt der bisherigen Behelfslösung über die lokale
Netzwerk-IP.

- [x] Lokales HTTPS via mkcert (`server`/`preview` in `vite.config.ts`), Zertifikat auf Elenas
      iPhone als Profil installiert und vertraut - bestätigt ohne Zertifikatswarnung
      (siehe DECISIONS.md ADR-017)
- [x] Offline-Prüfung: App funktioniert im Flugmodus vom Home-Bildschirm aus - von der Familie
      bestätigt
- [x] Backup/Restore: alle lokalen Daten (Profil, Tagebuch, Geheimfach, Verlauf) lassen sich auf
      der Profilseite als Datei herunterladen und wieder einspielen - Sicherheitsnetz nach einem
      Datenverlust-Vorfall beim Origin-Wechsel http→https (siehe DECISIONS.md ADR-018), 6 neue
      Tests (3 Modul-, 3 Komponententests) - insgesamt 84
- [ ] Icons/Manifest-Feinschliff
- [ ] Vollständige, geprüfte Installationsanleitung inkl. Update-Hinweis-UI
- [ ] Safari/iPhone-QA-Checkliste

Nächster Schritt: Familie testet Backup herunterladen → App neu installieren → Backup
wiederherstellen als echten Beweis, dass Daten jetzt überleben. Danach weiter mit den
verbleibenden Punkten oben.

## Abgeschlossene Sprints

### Sprint 4 - Forschernamen, Maskottchen und Geburtstage

Status: **Abgeschlossen (2026-08-23).** Drei Feedback-Runden der Familie eingearbeitet: iOS-
Datumsfeld-Bug behoben, Maskottchen-Katalog von 3 CSS-Varianten auf 33 individuelle
Canvas-Entwürfe (8 Tierarten) erweitert, "Blutiger Kuschelbär" (Elenas Favorit) verfeinert
(grösseres Auge, sichtbare Zunge), und eine Stempel-Animation ergänzt: eine zum gewählten
Maskottchen passende, fellbedeckte Pranke stempelt in der Abschlussbewertung sichtbar den
gewählten Stempel aufs Tagebuch-Blatt (siehe DECISIONS.md ADR-016). Von Michael und Elena final
bestätigt.

- [x] Onboarding (`/`, vor jeder anderen Route): Maskottchen wählen, Forschername vergeben
- [x] 33 individuelle Maskottchen-Entwürfe (8 Tierarten × Farbwelt/Blutig-Variante) als
      scrollbares, nach Tierart gruppiertes Auswahlraster (siehe DECISIONS.md ADR-015)
- [x] Profil wird in IndexedDB persistiert (`profiles`-Store, DB-Version 3)
- [x] Profilseite (`/profil`): Forschername und Maskottchen jederzeit änderbar
- [x] Mehrere Geburtstage speicherbar, verwaltet auf der Profilseite (iOS-Datumsfeld-Bug behoben)
- [x] Geburtstagsmissionen: an einem gespeicherten Geburtstag wird die Tagesmission festlich
      als "Geburtstagsmission für {Name}" hervorgehoben (siehe DECISIONS.md ADR-013)
- [x] Gewähltes Maskottchen erscheint im Startseiten-Header und in der Hilfe-Sprechblase
- [x] Stempel-Animation: passende Pranke (Farbe/Fell/Blut je nach Maskottchen) stempelt den
      gewählten Stempel sichtbar aufs Tagebuch-Blatt (siehe DECISIONS.md ADR-016)
- [x] 22 neue Tests seit Sprint-4-Start (Geburtstagslogik, Profil-Repository, Onboarding-Ablauf,
      Profilseite, Maskottchen-Katalog-Integrität, Stempel-Animation) - insgesamt 78

### Sprint 3 - Lokale Persistenz und Präferenzen

Status: **Abgeschlossen (2026-08-23).** Für Elena selbst nicht sichtbar - wirkt nur im
Hintergrund auf die Vorschlagsreihenfolge. Von Michael bestätigt, direkt weiter mit Sprint 4.

- [x] `domain/preferenceProfile.ts`: Präferenzprofil wird aus strukturierten
      Anpassungswünschen aller Tagebucheinträge eines Profils aufgebaut (keine separate
      Speicherung, siehe DECISIONS.md ADR-011)
- [x] `suggestionsForCategory` gewichtet Kategorie-Vorschläge nach Passung zum Präferenzprofil,
      ohne Bewertungen unverändertes Verhalten wie in Sprint 2
- [x] Nachvollziehbare, einfache Gewichtungsformel (Skalarprodukt Missionsmerkmale × Affinität,
      keine Black-Box-Logik)
- [x] 8 neue Tests (Profilaufbau, Score-Berechnung, Umsortierung) - insgesamt 56

### Sprint 2 - Entdecken und Wiederfinden

Status: **Abgeschlossen (2026-08-23).** Familien-Feedback in zwei Runden eingearbeitet
(Ausstieg aus dem Schritt-Modus, Tagebuch-Detailansicht mit "Nochmal machen"-Umschalter,
Navigation ans untere Bildschirmende verschoben). Von Michael final bestätigt.

- [x] Startseite (`/`) mit Tagesmission und fünf Kategorie-Abschnitten
- [x] Bis zu fünf Vorschläge pro Kategorie (primäre und passende sekundäre Kategorie)
- [x] Missionskarten mit Bild, Name, Dauer, Schwierigkeit, Kosten, Zutatenanzahl
- [x] Geheimfach: Missionen dauerhaft merken/entfernen, eigene Seite `/geheimfach`
- [x] "3 Tage verstecken" blendet eine Mission aus Vorschlägen aus
- [x] 14-Tage-Verlauf (`/verlauf`) zeigt versteckte Missionen mit Status
- [x] Tagesmission: tagesstabile Auswahl über alle sichtbaren Missionen
- [x] Missionsablauf (Detail/Schritte/Bewertung) funktioniert jetzt für jede Mission über
      `/mission/:missionId`, nicht mehr nur für eine fest verdrahtete Beispielmission
- [x] "Zurück" bei Schritt 1 verlässt den Schritt-Modus statt inaktiv zu bleiben
- [x] Tagebucheinträge sind anklickbar und öffnen eine Detailansicht (`/diary/:entryId`)
- [x] "Nochmal machen" lässt sich direkt im Tagebuch umschalten und bleibt gespeichert
- [x] Navigation konsequent am unteren Bildschirmrand statt oben

### Sprint 1 - Projektfundament und Vertical Slice

Status: **Abgeschlossen (2026-08-23).** Familientest (Abschnitt 8 der Spezifikation) am
2026-08-16 durchgeführt, Fragen 1-4 und 7 positiv, Fragen 5/6 zeigten einen echten Bug (Speichern
hing auf dem installierten iPhone, Tagebuch liess sich nicht anzeigen). Ursache gefunden und
behoben (`crypto.randomUUID` fehlt in Safari ohne sicheren Kontext/HTTPS, siehe DECISIONS.md
ADR-006). Erneuter Familientest am 2026-08-23 erfolgreich - alle sieben Fragen aus Abschnitt 8
positiv beantwortet.

- [x] Projektstruktur, Qualitätswerkzeuge (TypeScript strict, ESLint, Prettier, Vitest)
- [x] PWA-Grundlage (Manifest, Service Worker, Icons)
- [x] Fünf echte Beispielmissionen im Datenmodell
- [x] Beispielmission als erster Bildschirm
- [x] Missionsdetails, Schrittmodus, manueller Timer, Hilfe-Sprechblase
- [x] Abschlussbewertung mit strukturierten Anpassungswünschen
- [x] Lokaler Tagebucheintrag (IndexedDB), übersteht Neuladen
- [x] Bugfix: `crypto.randomUUID` fehlt in Safari ohne HTTPS/localhost (echte Ursache gefunden
      und behoben)
- [x] Familientest mit Fix erfolgreich (Abschnitt 8 der Spezifikation, alle 7 Fragen positiv)

## Offene Sprints

### P1 - Getränke zuerst vollständig ausbauen

- **Sprint 6 - Getränke-Labor:** 15 geprüfte Getränkemissionen, fünf Vorschläge,
  Zutatenmerkmale, Varianten und Vorlieben; nicht bitter, nicht scharf, kein Pfeffer oder
  Kardamom.
- **Sprint 7 - Getränke-Bewertung und Varianten:** Geschmack, Optik, Gruseligkeit, Dekoration
  und lernende Variantenauswahl.
- **Sprint 8 - Laborschrank Basis:** vorbereitete Materialliste, Bereiche, allgemeine und genaue
  Materialien, Mengenstatus, Bastelkisten und optionale Fotos.
- **Sprint 9 - Einkaufsliste Basis:** missionsbezogene Liste, Coop bevorzugt, danach
  Migros/Jumbo, grobe Preise, Gesamtsumme, Abhaken, Zuständigkeit und Übernahme in den Schrank.
- **Sprint 10 - Filter und Vorschlagsmaschine:** Zeit, Budget, Ort, Unordnung, erwachsene Hilfe,
  Personenanzahl und Diversitätsregeln.

### P2 - Übrige Inhalte

- **Sprint 11 - Bastel-Labor:** 15 Missionen mit Schwerpunkt Playmobil, Realismus,
  Spezialeffekte und vorhandene Bastelkisten.
- **Sprint 12 - Experimentier-Labor:** 15 Missionen, Vermutung, Beobachtung, Erklärung,
  mehrtägige Versuche und laufende Missionen.
- **Sprint 13 - Foto-Challenges:** 15 Missionen, Kamera/Fotowahl, mehrere Fotos, Tipps, Rahmen
  und einfache Effekte.
- **Sprint 14 - Schwestern-Missionen:** 15 Missionen, gleiche Anleitung, geheime Teilaufgaben,
  Zeit-Challenges und gemeinschaftlicher Abschluss.
- **Sprint 15 - Eigene Missionen:** Assistent des Maskottchens, Erstellen, Kopieren, Bearbeiten
  und Sicherheitsfelder.
- **Sprint 16 - Labortagebuch vollständig:** Filter, Bildkarten, Bearbeiten, Löschen mit
  Rückfrage, Status, Stempel und maximal zehn Fotos.
- **Sprint 17 - Musik und Atmosphäre:** missionsabhängige Musik, Countdown, abschaltbare
  Animationen und Barrierefreiheit.

### P3 - Plattform und Veröffentlichung

- **Sprint 18 - iPad- und Mac-Optimierung:** responsive Navigation, grössere Layouts und
  Installationsprüfung.
- **Sprint 19 - Cloud-Synchronisation:** Backend-Auswahl, Authentifizierung, Konfliktlösung,
  Datenschutz und Austausch zwischen Geräten.
- **Sprint 20 - Mehrere Profile:** Laura und weitere Personen mit getrennten Tagebüchern,
  Vorlieben und Einstellungen.
- **Sprint 21 - Neue geprüfte Inhalte:** sicherer Import beziehungsweise redaktionelle Freigabe
  neuer Missionen.
- **Sprint 22 - Video im Tagebuch:** Aufnahme, Komprimierung, Speicherregeln und
  Synchronisation.
- **Sprint 23 - Englisch und weitere Sprachen:** vollständige Übersetzungsinfrastruktur und
  Inhalte.
- **Sprint 24 - Öffentliche/App-Store-Version:** Datenschutz, Einwilligungen, Alterskonzept,
  Hosting, Monitoring, Packaging und Store-Anforderungen.

## Unpriorisierte Ideen

- Elena gefällt das aktuelle App-Icon (Homescreen-Symbol) nicht besonders gut - bei Gelegenheit
  ein ansprechenderes Icon gestalten. Thematisch passt das gut zu Sprint 4 (Maskottchen-Auswahl),
  ist aber technisch unabhängig davon (`public/favicon.svg`, `public/icons/*.png`).
