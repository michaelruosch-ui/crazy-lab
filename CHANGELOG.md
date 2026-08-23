# Changelog

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
