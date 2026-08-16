# Architektur

## Schichten

```text
src/
  app/            Seiten-Orchestrierung (verbindet Features zu einem Ablauf)
  components/     Wiederverwendbare, feature-lose UI-Bausteine (Button, Badge, Mascot, ...)
  features/       Fachliche Bausteine, je Unterordner ein Feature
    missions/       Missionsdetail-Darstellung
    mission-run/     Schritt-für-Schritt-Ausführung, Timer, Hilfe
    ratings/         Abschlussbewertungs-Formular
    diary/           Labortagebuch-Ansicht + Lese-Hook
    (secret-vault/, profile/ - vorbereitet, ab Sprint 2/4 befüllt)
  domain/         Reine TypeScript-Typen und Domänenlogik (keine UI, kein IO)
  data/           Statische, versionierte Missionsdaten
  storage/        IndexedDB-Repository-Schicht (einziger Ort mit direktem IndexedDB-Zugriff)
  styles/         (für globales Theming reserviert; aktuell in src/index.css)
  test/           Test-Setup (jsdom, fake-indexeddb, jest-dom matcher)
```

Abhängigkeitsrichtung: `app` → `features` → `domain`/`storage`. `domain` hat keine Abhängigkeit
zu React, Storage oder UI. `storage` kennt nur `domain`-Typen, keine UI. `components` kennen
keine Features.

## Datenfluss (Sprint 1)

1. `data/missions.ts` liefert die statische Beispielmission.
2. `app/MissionFlowPage.tsx` hält den Ablauf-Zustand (`detail` → `run` → `rating`) und rendert
   je nach Phase die passende Feature-Komponente.
3. `features/mission-run/StepRunner` verwaltet Schritt-Index, abgehakte Schritte und Hilfe-
   Sichtbarkeit lokal im Component-State; `useTimer` kapselt den manuellen Timer.
4. Nach Abschluss aller Schritte übernimmt `features/ratings/CompletionForm` die
   Bewertungserfassung und liefert ein `CompletionRating`-Objekt an `MissionFlowPage` zurück.
5. `MissionFlowPage` baut daraus einen `DiaryEntry` (inkl. Missions-Snapshot) und speichert ihn
   über `storage/diaryRepository` in IndexedDB.
6. `features/diary/DiaryPage` liest beim Mount alle Einträge über denselben Repository und
   zeigt sie an - unabhängig von einem vorherigen Seiten-Reload.

## Speicherung

- Einzige Persistenzquelle in Sprint 1: IndexedDB, Datenbank `crazylab`, Object Store
  `diaryEntries` (Key: `id`, Indizes: `by-profile`, `by-completedAt`).
- Zugriff ausschliesslich über `storage/diaryRepository.ts` (Interface `DiaryRepository`), damit
  spätere Erweiterungen (z. B. Cloud-Sync in Sprint 19) die UI nicht verändern müssen.
- Missionsdaten sind statisch und nicht in IndexedDB gespiegelt; Tagebucheinträge enthalten einen
  `missionSnapshot` (Titel, Kategorie, `contentVersion`), damit spätere Inhalts-Updates
  bestehende Einträge nicht verändern.

## PWA

- `vite-plugin-pwa` mit Strategie `generateSW` erzeugt Manifest und Service Worker automatisch
  beim Build (`registerType: 'autoUpdate'`, Registrierung wird von Vite ins gebaute `index.html`
  injiziert).
- App-Icons liegen als PNG in `public/icons/` (192, 512, maskable 512), Favicon als eigenes SVG.
- Es besteht keine Abhängigkeit von externen Netzwerk-Ressourcen (keine CDN-Fonts, keine
  externen Bilder).

## Erweiterungspunkte für spätere Sprints

- `domain/profile.ts` ist bereits mehrprofilfähig (`Profile`, `profileId` auf jedem
  `DiaryEntry`); Sprint 20 ergänzt UI zum Profilwechsel.
- `MissionSnapshot.contentVersion` erlaubt spätere Inhalts-Updates ohne bestehende
  Tagebucheinträge zu verändern.
- `storage/diaryRepository.ts` ist ein Interface; eine Cloud-Repository-Implementierung
  (Sprint 19) kann dieselbe Schnittstelle bedienen.
- `MissionStep.timerSeconds` und `helpTip` sind bereits pro Schritt modelliert, auch wenn
  Sprint 1 nur wenige Schritte davon Gebrauch macht.
- Gesamtansicht (alle Schritte gleichzeitig statt Schritt-für-Schritt) ist datenseitig möglich
  (`mission.steps`-Array), aber in Sprint 1 UI-seitig nicht exponiert.
