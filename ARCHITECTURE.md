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
    (profile/ - vorbereitet, ab Sprint 4 befüllt)
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

## Speicherung

IndexedDB, Datenbank `crazylab`, aktuell Version 2 mit drei Object Stores:

- `diaryEntries` (seit Sprint 1): Key `id`, Indizes `by-profile`, `by-completedAt`.
- `secretVaultEntries` (seit Sprint 2): Key `id`, Indizes `by-profile`, `by-mission`.
- `hiddenMissions` (seit Sprint 2): Key `id`, Indizes `by-profile`, `by-mission`.

Zugriff ausschliesslich über je ein Repository-Interface (`DiaryRepository`,
`SecretVaultRepository`, `HiddenMissionsRepository`) in `src/storage`, damit spätere
Erweiterungen (z. B. Cloud-Sync in Sprint 19) die UI nicht verändern müssen. `storage/db.ts`
kapselt den `upgrade`-Callback so, dass neue Object Stores versionsweise ergänzt werden, ohne
bestehende Stores zu berühren.

Missionsdaten sind statisch und nicht in IndexedDB gespiegelt; Tagebucheinträge enthalten einen
`missionSnapshot` (Titel, Kategorie, `contentVersion`), damit spätere Inhalts-Updates bestehende
Einträge nicht verändern.

## PWA

- `vite-plugin-pwa` mit Strategie `generateSW` erzeugt Manifest und Service Worker automatisch
  beim Build (`registerType: 'autoUpdate'`, Registrierung wird von Vite ins gebaute `index.html`
  injiziert).
- App-Icons liegen als PNG in `public/icons/` (192, 512, maskable 512), Favicon als eigenes SVG.
- Es besteht keine Abhängigkeit von externen Netzwerk-Ressourcen (keine CDN-Fonts, keine
  externen Bilder).
- **Bekannte Einschränkung:** Sowohl die Service-Worker-Registrierung als auch
  `crypto.randomUUID()` (siehe `domain/id.ts`) erfordern einen sicheren Kontext (HTTPS oder
  `localhost`). Beim Testen über die lokale Netzwerk-IP per HTTP funktioniert daher die
  Service-Worker-Registrierung in Safari vermutlich nicht, auch wenn die App selbst normal
  funktioniert. Echte Offline-Verifizierung ist erst mit einer HTTPS-fähigen Testumgebung
  möglich (geplant für Sprint 5).

## Erweiterungspunkte für spätere Sprints

- `domain/profile.ts` ist bereits mehrprofilfähig (`Profile`, `profileId` auf jedem
  `DiaryEntry`, `SecretVaultEntry` und `HiddenMissionEntry`); Sprint 20 ergänzt UI zum
  Profilwechsel.
- `MissionSnapshot.contentVersion` erlaubt spätere Inhalts-Updates ohne bestehende
  Tagebucheinträge zu verändern.
- `storage/*Repository.ts`-Dateien sind Interfaces; Cloud-Repository-Implementierungen
  (Sprint 19) können dieselbe Schnittstelle bedienen.
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
