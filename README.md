# Crazy Lab

Crazy Lab ist eine deutschsprachige, installierbare Progressive Web App für Elena. Sie ermöglicht,
coole trinkbare Getränke zu mixen, gruselig-schöne Dinge zu basteln, Experimente und
Foto-Challenges durchzuführen sowie Schwestern-Missionen zu erleben. Ergebnisse werden im
geheimnisvollen Labortagebuch festgehalten.

Dieses Repository befindet sich in **Sprint 5** (PWA auf Elenas iPhone); **Sprint 6 ist technisch
umgesetzt und wartet auf Elenas Familienabnahme**. Der aktuelle Stand: Beim
ersten Start wählt man eines von 33 Maskottchen (8 Tierarten in verschiedenen Farbwelten) und
einen Forschernamen. Danach öffnet die App eine echte Startseite mit Tagesmission und fünf
Kategorien (Getränke, Basteln, Experimente, Foto-Challenges, Schwestern-Missionen). Jede Mission
kann vollständig durchgespielt, bewertet und lokal im Tagebuch gespeichert werden, dauerhaft im
Geheimfach gemerkt oder für drei Tage versteckt werden (mit 14-Tage-Verlauf). Bewertungen
fliessen zusätzlich in ein lokales Präferenzprofil ein, das die Kategorie-Vorschläge künftig
passender sortiert. Beim Abschluss stempelt eine zum Maskottchen passende Pranke sichtbar den
gewählten Stempel ins Tagebuch. Auf der Profilseite lassen sich Forschername, Maskottchen und
Geburtstage jederzeit ändern; an gespeicherten Geburtstagen erscheint eine besondere
Geburtstagsmission. Ausserdem lässt sich dort jederzeit ein Backup aller lokalen Daten
herunterladen und wieder einspielen - komplett offline, ohne Login und ohne Backend. Das
Getränke-Labor umfasst inzwischen 15 sichere Missionen mit strukturierten Geschmacks- und
Optikmerkmalen sowie mindestens zwei direkt sichtbaren Varianten pro Getränk.

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

Erstellt einen produktiven Online-Build inkl. PWA-Manifest in `dist/`. Ein Service Worker wird
bewusst nicht erzeugt: Die Familie hat sich gegen Offline-Betrieb entschieden.

## Lokale Vorschau des Production-Builds

```bash
npm run preview
```

## Installation auf dem iPhone (Sprint 5)

Die aktuelle App läuft kostenlos und verschlüsselt unter
<https://michaelruosch-ui.github.io/crazy-lab/>. Der Mac muss dafür nicht eingeschaltet sein.

1. Die Adresse in Safari auf dem iPhone öffnen.
2. Teilen-Symbol antippen → "Zum Home-Bildschirm".
3. Crazy Lab künftig über das neue Schleimmonster-Symbol starten. Beim Schliessen und erneuten
   Öffnen wird automatisch die neueste Version geladen; eine Internetverbindung ist erforderlich.

Beim Wechsel von einer früheren Installation über die lokale Netzwerk-IP gilt zwingend: zuerst
in der alten App unter Profil ein Backup herunterladen, erst danach die alte Home-Bildschirm-App
entfernen, die öffentliche Version installieren und dort das Backup wieder einspielen. Browser
trennen die Datenspeicher der beiden Adressen voneinander.

### Backup und Wiederherstellung (manuell)

Auf der Profilseite (`/profil`, Abschnitt "📦 Datensicherung") lässt sich jederzeit eine
Backup-Datei mit allen lokalen Daten herunterladen und auf demselben oder einem anderen Gerät
wieder einspielen (siehe DECISIONS.md ADR-018). Sinnvoll als zusätzliches, manuelles Sicherheits-
netz. Hauptspeicher ist IndexedDB auf dem iPhone; WebKit wird beim Start zusätzlich um dauerhaften
Speicher gebeten. Für eine zweite Kopie wird gelegentlich über die Profilseite eine Backup-Datei
heruntergeladen und auf dem Mac aufbewahrt. Eine automatische Mac-Verbindung wurde verworfen,
weil ihr Zugriffsschlüssel in einem öffentlichen Web-Build nicht geheim bliebe (ADR-021).

## Architektur

Siehe [ARCHITECTURE.md](./ARCHITECTURE.md) für Schichten, Datenfluss und Erweiterungspunkte, sowie
[DECISIONS.md](./DECISIONS.md) für Architekturentscheidungen.

## Projektstand

Siehe [BACKLOG.md](./BACKLOG.md) für den aktuellen Sprint und offene Sprints, sowie
[CHANGELOG.md](./CHANGELOG.md) für die Änderungshistorie.
