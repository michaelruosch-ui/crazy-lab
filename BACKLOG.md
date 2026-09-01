# Backlog

Neue Ideen werden nicht als neue Nummern zwischen bestehende Sprints geschoben. Sie landen zuerst
hier im Abschnitt "Unpriorisierte Ideen" und werden später priorisiert.

## Aktueller Sprint

### Sprint 5 - PWA auf Elenas iPhone

Status: **Abgeschlossen (2026-08-30).** Rein technischer Sprint ohne neue sichtbare Funktionen - Ziel ist eine
zuverlässige, "richtige" Installation statt der bisherigen Behelfslösung über die lokale
Netzwerk-IP.

- [x] Lokales HTTPS via mkcert (`server`/`preview` in `vite.config.ts`), Zertifikat auf Elenas
      iPhone als Profil installiert und vertraut - bestätigt ohne Zertifikatswarnung
      (siehe DECISIONS.md ADR-017)
- [x] Frühere Offline-Prüfung erfolgreich; Offline-Betrieb am 2026-08-30 auf Familienentscheid
      bewusst entfernt
- [x] Backup/Restore (manuell): alle lokalen Daten (Profil, Tagebuch, Geheimfach, Verlauf) lassen
      sich auf der Profilseite als Datei herunterladen und wieder einspielen - Sicherheitsnetz nach
      einem Datenverlust-Vorfall beim Origin-Wechsel http→https (siehe DECISIONS.md ADR-018)
- [x] Cloudflare-Client und Worker vollständig entfernt; keine persönlichen Daten in einer Cloud
- [x] Dauerhafter iPhone-Speicher wird über die WebKit Storage API angefragt
- [x] Sichere Variante 1 festgelegt: iPhone-Hauptspeicher plus manuelles Backup auf den Mac;
      automatische Mac-Verbindung wegen öffentlich einsehbarem Zugriffsschlüssel verworfen
- [x] Nebenbei behoben: `useProfile` blieb bei endgültig gescheitertem Datenbank-Öffnen für immer
      bei "Lade..." hängen (unbehandelte Promise-Ablehnung) - fällt jetzt auf "kein Profil" zurück
- [x] Neues Schleimmonster-App-Symbol in 192/512/maskable und Manifest-Feinschliff
- [x] Automatische Aktualisierung ohne Update-Knopf durch Online-Laden beim erneuten Öffnen
- [x] Reiner Programmcode kostenlos und verschlüsselt über GitHub Pages veröffentlicht:
      `https://michaelruosch-ui.github.io/crazy-lab/`
- [x] iPhone-Backup öffnet den sichtbaren Teilen-Dialog für „In Dateien sichern“; keine falsche
      Erfolgsmeldung mehr nach einem bloss gestarteten Download
- [x] Direktes Neuladen von Profil und anderen Unterseiten funktioniert auf GitHub Pages ohne 404
- [x] Safari/iPhone-QA inklusive sichtbarem Datei-Export, erfolgreichem Restore und 404-Reparatur

Familienabnahme durch Michael nach erfolgreichem Backup-und-Wiederherstellungs-Rundlauf.

### Parallel umgesetzt: Sprint 6 - Getränke-Labor

Status: **Abgeschlossen (2026-08-30).** Michael hat Sprint 6
ausdrücklich vorgezogen, weil die offenen Punkte aus Sprint 5 Elenas Input benötigen. Sprint 5
bleibt deshalb in Arbeit; Sprint 7 beginnt erst nach der Familienabnahme von Sprint 6.

- [x] 15 geprüfte, trinkbare Getränkemissionen mit Materialien, Schritten und Sicherheitshinweisen
- [x] Genau fünf Vorschläge pro Kategorie trotz erweitertem Katalog
- [x] Strukturierte Geschmacks-, Temperatur-, Optik- und Gerätemerkmale
- [x] Mindestens zwei sichtbare Varianten pro Getränkemission
- [x] Vorlieben aus Sprint 3 sortieren auch den erweiterten Getränkekatalog
- [x] Inhaltsregeln geprüft: nicht bitter, nicht scharf, kein Pfeffer und kein Kardamom
- [x] Tagesmission ist exklusiv und erscheint nicht nochmals in einer Kategorie
- [x] Automatische Daten- und UI-Tests ergänzt; nach Entfernung der Cloud-Tests insgesamt 94 Tests
- [x] Von Michael und Elena für den Start von Sprint 7 freigegeben; weiteres Geschmacksfeedback
      fliesst als normales Familienfeedback ein

### Sprint 7 - Getränke-Bewertung und Varianten

Status: **Abgeschlossen (2026-08-30).** Michael hat die Umsetzung bestätigt; der ausführliche
iPhone-Praxistest mit Elena folgt als normales Feedback und blockiert Sprint 8 nicht.

- [x] Getränke getrennt nach Geschmack, Optik, Gruseligkeit und Dekoration bewerten
- [x] Vor dem Start eine konkrete Getränkevariante auswählen
- [x] Gewählte Variante und Einzelbewertungen im Tagebuch speichern und anzeigen
- [x] Varianten anhand von Elenas bisherigen Bewertungen nachvollziehbar sortieren
- [x] Beste bekannte Variante als „Für dich empfohlen“ markieren
- [x] Ohne Bewertungen stabile ursprüngliche Reihenfolge, keine zufällige Bevorzugung
- [x] 2 neue Ranking-Tests und erweiterte Formular-Tests; insgesamt 96 Tests
- [x] Familienfeedback: Tagesmission bleibt exklusiv; abgeschlossene Missionen machen Platz für
      neue Vorschläge und bleiben bei „Merken“ unter „Gemerkte Missionen“ wiederholbar
- [x] Zusätzlicher Vorschlags-Test; insgesamt 97 Tests
- [x] Für Sprint 8 freigegeben; späteres iPhone-Feedback bleibt willkommen

### Sprint 8 - Laborschrank Basis

Status: **Abgeschlossen (2026-08-30).** Michael hat die Basis für den Start von Sprint 9
freigegeben; späteres Praxisfeedback bleibt willkommen.

- [x] Vorbereitete, durchsuchbare Materialliste aus allen vorhandenen Missionen
- [x] Vorhandene Materialien in den persönlichen Laborschrank übernehmen und entfernen
- [x] Bereiche Küche, Bastelkiste, Zimmer, Bad, Keller und Anderswo
- [x] Allgemeine Materialbezeichnung plus freiwillige genaue Sorte oder Marke
- [x] Mengenstatus Leer, Wenig, Genug oder Viel
- [x] Benannte Bastelkisten
- [x] Freiwillige Materialfotos, vor dem Speichern auf höchstens 800 Pixel verkleinert
- [x] Eigener IndexedDB-Store (Datenbankversion 4), vollständig lokal auf dem iPhone
- [x] Laborschrank wird im bestehenden manuellen Backup exportiert und wiederhergestellt
- [x] Repository-, UI- und Navigationstests; insgesamt 99 Tests
- [x] Für Sprint 9 freigegeben; späteres iPhone-Feedback bleibt willkommen

### Sprint 9 - Einkaufsliste Basis

Status: **Abgeschlossen (2026-08-31).** Michael hat bestätigt, dass Sprint 9 soweit passt;
späteres Praxisfeedback bleibt willkommen.

- [x] Alle fehlenden Materialien direkt aus einer Mission übernehmen
- [x] Bereits ausreichend vorhandene Laborschrank-Materialien und bestehende Listeneinträge nicht
      doppelt hinzufügen
- [x] Coop als Standard für Lebensmittel, Jumbo für typische Bastelmaterialien; Migros und alle
      drei Läden manuell wählbar
- [x] Einfache nachvollziehbare Richtpreise pro Material und offene Gesamtsumme
- [x] Artikel abhaken und wieder öffnen
- [x] Zuständigkeit Gemeinsam, Michael oder Elena
- [x] Abgehakte Einkäufe direkt in den Laborschrank übernehmen
- [x] Eigener IndexedDB-Store (Datenbankversion 5), im manuellen Backup enthalten
- [x] Planungs-, Repository- und Navigationstests; insgesamt 103 Tests
- [x] Für Sprint 10 freigegeben; späteres iPhone-Feedback bleibt willkommen

### Sprint 10 - Filter und Vorschlagsmaschine

Status: **Abgeschlossen (2026-08-31).** Michael hat Sprint 10 für die Weiterarbeit freigegeben;
der iPhone-Test mit Elena folgt als normales Feedback.

- [x] Aufklappbarer, mobiler Filterbereich direkt auf der Startseite
- [x] Filter für maximale Zeit und maximales Budget
- [x] Filter für Küche, Zimmer, Bad, Garten oder überall
- [x] Drei verständliche Stufen für erlaubte Unordnung
- [x] Erwachsenen-Verfügbarkeit berücksichtigt Sicherheitsstufe und Sicherheitshinweise
- [x] Einzelperson blendet Schwestern-Missionen aus; zwei Personen lassen sie zu
- [x] Alle Filter wirken auch auf die Tagesmission und verhindern Doppelnennungen
- [x] Bestehende gelernte Vorlieben bleiben Teil der Sortierung
- [x] Diversitätsregeln mischen unterschiedliche Zeit-, Preis- und Unordnungsprofile ein, ohne
      Missionen einer bloss sekundären Kategorie vorzuziehen
- [x] Automatische Filter-, Diversitäts- und Navigationstests; insgesamt 107 Tests
- [x] Für Sprint 11 freigegeben; späteres iPhone-Feedback bleibt willkommen

### Sprint 11 - Bastel-Labor und Bedienungsverbesserungen

Status: **Technisch umgesetzt (2026-08-31), Familienabnahme offen.**

- [x] 15 vollständige Bastelmissionen mit mindestens vier Schritten
- [x] Schwerpunkte Playmobil, realistische Miniaturen, Geheimfächer und sichere Spezialeffekte
- [x] Gefährliche Effekte ausgeschlossen; LED statt Flamme, Watte statt Rauch/Trockeneis
- [x] Gelbe Sicherheitsstufe und klare Erwachsenenhilfe bei anspruchsvollem Zuschneiden
- [x] Bestehende Filter, Einkaufsliste, Laborschrank und Vorschlagsmaschine nutzen neue Materialien
- [x] Automatische lokale Sicherungsstände beim Öffnen, alle fünf Minuten und beim App-Wechsel
- [x] Nur bei echten Datenänderungen sichern; höchstens zehn Stände aufbewahren
- [x] Normale Bedienung mit „Jetzt sichern“, datierter Liste und „Laden“ statt sichtbarer JSON-Datei
- [x] Externe Datei nur noch als klar gekennzeichnete Notfallkopie bei kompletter App-Löschung
- [x] Eigene Laborschrank-Materialien per Freitext erfassen
- [x] Lokale, transparente Einordnung in Lebensmittel, Bastelmaterial, Werkzeug, Behälter oder
      Sonstiges; keine Cloud, kein Konto und keine kostenpflichtige KI
- [x] Datenbankversion 6 und automatische Tests; insgesamt 113 Tests
- [ ] Michael und Elena testen Bastelmissionen, Sicherungsliste und eigene Materialien auf dem iPhone

### Sprint 12 - Experimentier-Labor

Status: **Technisch umgesetzt (2026-09-01), Familienabnahme offen.**

- [x] 15 sichere Experimentier-Missionen mit jeweils mindestens vier Schritten
- [x] Strukturierte Forschungsfrage, eigene Vermutung, Beobachtung und verständliche Erklärung
- [x] Mehrtägige Versuche mit gespeichertem Schrittfortschritt pausieren und fortsetzen
- [x] Laufende Versuche direkt auf der Startseite wiederfinden
- [x] Forschungsnotizen im Labortagebuch speichern und anzeigen
- [x] Laufende Versuche im Backup sichern und wiederherstellen
- [ ] Michael und Elena testen kurze und mehrtägige Versuche auf dem iPhone

### Sprint 13 - Foto-Challenges

Status: **Technisch umgesetzt (2026-09-01), Familienabnahme offen.**

- [x] 15 Foto-Challenges mit mindestens vier Schritten und konkreten Fototipps
- [x] Kamera oder Fotomediathek über die normale iPhone-Auswahl verwenden
- [x] Bis zu fünf Fotos auswählen und vor dem Speichern auf höchstens 1000 Pixel verkleinern
- [x] Laborrahmen, Monsterkrallen oder Geisternebel auswählen
- [x] Ohne Effekt, Schwarzweiss, Kaltblau oder Dramatisch auswählen
- [x] Fotos samt Rahmen und Effekt im Tagebuch speichern und sichtbar darstellen
- [ ] Michael und Elena testen Kamera, Fotowahl und Darstellung auf dem iPhone

### Sprint 14 - Schwestern-Missionen

Status: **Technisch umgesetzt (2026-09-01), Familienabnahme offen.**

- [x] 15 Schwestern-Missionen mit mindestens vier gemeinsamen Schritten
- [x] Eine verständliche gemeinsame Anleitung pro Mission
- [x] Getrennt aufklappbare geheime Teilaufgaben für Elena und ihre Schwester
- [x] Optionale Fünf-Minuten-Challenges mit sichtbarem Timer
- [x] Gemeinsames Finale und freiwillige Teamnotiz im Tagebuch
- [x] Inhalts- und UI-Prüfungen; insgesamt über alle Sprints 120 automatische Tests
- [ ] Michael, Elena und ihre Schwester testen die Missionen auf dem iPhone

### Sprint 15 - Eigene Missionen

Status: **Technisch umgesetzt (2026-09-01), Familienabnahme offen.**

- [x] Eigener Bereich „Eigene Missionen“ auf der Startseite
- [x] Kindgerechter Maskottchen-Assistent statt technischer Datenmaske
- [x] Titel, Beschreibung, Kategorie, Dauer, Kosten, Materialien und Schritte erfassen
- [x] Vorhandene und eigene Missionen als Ausgangspunkt kopieren
- [x] Eigene Missionen später bearbeiten und versioniert speichern
- [x] Eigene Missionen vollständig spielen, bewerten und im Tagebuch speichern
- [x] Gelbe und rote Sicherheitsstufen nur mit verständlichem Sicherheitshinweis speichern
- [x] Eigene Missionen in automatische Sicherungsstände und Notfallkopie aufnehmen
- [x] IndexedDB-Version 8 und automatische Tests; insgesamt 123 Tests
- [ ] Michael und Elena testen Erstellen, Kopieren, Bearbeiten und Spielen auf dem iPhone

### Sprint 16 - Labortagebuch vollständig

Status: **Technisch umgesetzt (2026-09-01), Familienabnahme offen.**

- [x] Volltextsuche sowie Filter nach Kategorie und Status
- [x] Bildkarten mit erstem Missionsfoto oder Missionsmotiv und sichtbarem Stempel
- [x] Eigenen Namen, Notiz, Status und Stempel nachträglich bearbeiten
- [x] Einzelne gespeicherte Fotos aus einem Eintrag entfernen
- [x] Tagebucheintrag nur nach klarer Rückfrage endgültig löschen
- [x] Bis zu zehn statt bisher fünf Fotos pro Foto-Challenge
- [x] Repository- und UI-Tests ergänzt
- [ ] Michael und Elena testen Filtern, Bearbeiten und Löschen auf dem iPhone

### Sprint 17 - Musik und Atmosphäre

Status: **Technisch umgesetzt (2026-09-01), Familienabnahme offen.**

- [x] Überspringbarer Drei-Sekunden-Countdown vor jeder Mission
- [x] Dezente, lokal erzeugte Tonfolgen passend zu allen fünf Missionskategorien
- [x] Musik startet auf dem iPhone erst nach einer bewussten Berührung
- [x] Musik während der Mission jederzeit an- und ausschalten
- [x] Globale Profil-Schalter für Musik und Animationen
- [x] Systemeinstellung „Bewegung reduzieren“ automatisch respektieren
- [x] Keine fremden Musikdateien, kein Streaming, Konto, Abo oder Cloud-Dienst
- [x] Automatische Tests für Countdown und gespeicherte Einstellungen
- [ ] Michael und Elena testen Lautstärke, Countdown und reduzierte Bewegung auf dem iPhone

### Sprint 18 - iPad- und Mac-Optimierung

Status: **Technisch umgesetzt (2026-09-01), Familienabnahme der grösseren Layouts offen.**

- [x] iPhone bleibt bei der bewährten einspaltigen Bedienung
- [x] iPads zeigen Missionskategorien und Tagebucheinträge platzsparend in mehreren Spalten
- [x] Mac und grosse iPads erhalten eine feste seitliche Navigation
- [x] Inhaltsseiten nutzen auf breiten Bildschirmen mehr Platz, ohne überlange Textzeilen
- [x] Touch-Ziele und mobile Navigation bleiben vollständig erhalten
- [x] Safari-12-Unterstützung des alten Familien-iPads bleibt aktiv
- [x] Typecheck, Lint, 128 Tests und Produktions-Build erfolgreich
- [ ] Michael prüft die grössere Darstellung gelegentlich auf iPad oder Mac

### Sprint 20 - Mehrere Profile

Status: **Technisch umgesetzt (2026-09-01), Familienabnahme offen.** Sprint 19 wurde auf
Familienentscheid bewusst nicht umgesetzt, weil keine Cloud-Synchronisation gewünscht ist.

- [x] Vorhandenes Elena-Profil und alle bisherigen Daten unverändert übernommen
- [x] Beliebig viele weitere Personen ohne Passwort anlegen
- [x] Aktive Person auf der Profilseite mit einem Tippen wechseln
- [x] Tagebuch, Vorschläge, Geheimfach, Verlauf und laufende Experimente getrennt
- [x] Laborschrank, Einkaufsliste und eigene Missionen getrennt
- [x] Lokale Sicherungsstände, Musik- und Animationseinstellungen getrennt
- [x] Abgebrochenes neues Profil kann jederzeit zum vorhandenen Profil zurückkehren
- [x] Fremde Tagebuch- und eigene Missionseinträge sind nicht über eine direkte Adresse sichtbar
- [x] Typecheck, Lint, 130 Tests und Produktions-Build erfolgreich
- [ ] Michael legt ein zweites Testprofil an und bestätigt den Wechsel ohne vermischte Einträge

### Kompatibilitätskorrektur - Familien-iPad mit iOS 12.5.8

Status: **Abgeschlossen (2026-09-01).** Diese
Korrektur ist kein vorgezogener Sprint 18: Sie behebt nur den schwarzen Bildschirm auf dem bereits
vorhandenen Familiengerät; grössere iPad- und Mac-Layouts bleiben in Sprint 18.

- [x] Produktions-Build gezielt für Safari 12 erzeugen
- [x] Nicht verfügbare Laufzeitfunktionen kompatibel ersetzt; `replaceAll` wird vermieden und
      `flat` für die intern verwendete Navigationsbibliothek nur auf alten Browsern ergänzt
- [x] Datenformat, IndexedDB-Speicher, Funktionen und Darstellung neuer iPhones nicht verändert
- [x] Typecheck, Lint, 128 Tests und Produktions-Build erfolgreich
- [x] Michael hat bestätigt, dass die neu veröffentlichte Version auf dem iPad mit iOS 12.5.8
      statt des schwarzen Bildschirms korrekt startet

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

### P2 - Übrige Inhalte

### P3 - Plattform und Veröffentlichung

- **Sprint 19 - Cloud-Synchronisation:** Backend-Auswahl, Authentifizierung, Konfliktlösung,
  Datenschutz und Austausch zwischen Geräten.
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
