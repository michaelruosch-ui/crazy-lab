# Crazy Lab

Crazy Lab ist eine deutschsprachige, installierbare Progressive Web App für Elena. Sie ermöglicht,
coole trinkbare Getränke zu mixen, gruselig-schöne Dinge zu basteln, Experimente und
Foto-Challenges durchzuführen sowie Schwestern-Missionen zu erleben. Ergebnisse werden im
geheimnisvollen Labortagebuch festgehalten.

Dieses Repository befindet sich in **Sprint 5** (PWA auf Elenas iPhone). Der aktuelle Stand: Beim
ersten Start wählt man eines von 33 Maskottchen (8 Tierarten in verschiedenen Farbwelten) und
einen Forschernamen. Danach öffnet die App eine echte Startseite mit Tagesmission und fünf
Kategorien (Getränke, Basteln, Experimente, Foto-Challenges, Schwestern-Missionen). Jede Mission
kann vollständig durchgespielt, bewertet und lokal im Tagebuch gespeichert werden, dauerhaft im
Geheimfach gemerkt oder für drei Tage versteckt werden (mit 14-Tage-Verlauf). Bewertungen
fliessen zusätzlich in ein lokales Präferenzprofil ein, das die Kategorie-Vorschläge künftig
passender sortiert. Beim Abschluss stempelt eine zum Maskottchen passende Pranke sichtbar den
gewählten Stempel ins Tagebuch. Auf der Profilseite lassen sich Forschername, Maskottchen und
Geburtstage jederzeit ändern; an gespeicherten Geburtstagen erscheint eine besondere
Geburtstagsmission - komplett offline, ohne Login und ohne Backend.

## Voraussetzungen

- Node.js 20+ und npm (getestet mit Node 26 / npm 11)
- Ein moderner Browser; für die reale Nutzung: iPhone Safari

## Installation

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Startet den Vite-Dev-Server mit Hot Module Reload (Standard-URL: http://localhost:5173).

## Tests

```bash
npm run test        # einmaliger Testlauf (Vitest + Testing Library)
npm run test:watch  # Watch-Modus
```

## Typecheck, Lint, Format

```bash
npm run typecheck
npm run lint
npm run format:check
```

## Build

```bash
npm run build
```

Erstellt einen produktiven Build inkl. PWA-Manifest und Service Worker in `dist/`.

## Lokale Vorschau des Production-Builds

```bash
npm run preview
```

## Installation auf dem iPhone (Sprint 1: manuell im lokalen Netzwerk)

1. `npm run build && npm run preview -- --host` auf dem Mac ausführen.
2. Die angezeigte Netzwerk-URL (z. B. `http://192.168.x.x:4173`) im Safari auf dem iPhone öffnen
   (Mac und iPhone müssen im gleichen WLAN sein).
3. Teilen-Symbol antippen → "Zum Home-Bildschirm".
4. Die App startet danach offline vom Home-Bildschirm aus.

Eine vollständige, geprüfte iPhone-Installationsanleitung inkl. Update-Hinweis folgt in Sprint 5.

## Architektur

Siehe [ARCHITECTURE.md](./ARCHITECTURE.md) für Schichten, Datenfluss und Erweiterungspunkte, sowie
[DECISIONS.md](./DECISIONS.md) für Architekturentscheidungen.

## Projektstand

Siehe [BACKLOG.md](./BACKLOG.md) für den aktuellen Sprint und offene Sprints, sowie
[CHANGELOG.md](./CHANGELOG.md) für die Änderungshistorie.
