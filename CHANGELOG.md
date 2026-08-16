# Changelog

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
