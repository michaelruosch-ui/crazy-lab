# Architecture Decision Records

## ADR-001: Installierbare PWA statt native App

**Status:** Angenommen (Sprint 1)

**Kontext:** Crazy Lab soll zuerst auf Elenas iPhone installierbar sein, ohne App-Store-Prozess,
und später auf iPad/Mac erweiterbar sein.

**Entscheidung:** Umsetzung als Progressive Web App (Vite + React + `vite-plugin-pwa`,
Strategie `generateSW`) statt nativer iOS-App.

**Konsequenzen:** Installation über Safari "Zum Home-Bildschirm" statt App Store; kein Apple-
Entwicklerkonto nötig für Sprint 1-18; Einschränkungen von iOS-PWAs (z. B. Push-Notifications,
Speicherlimits) müssen in späteren Sprints beachtet werden, insbesondere ab Sprint 5 (iPhone-QA)
und Sprint 24 (App-Store-Version, falls dort eine native Verpackung gewünscht wird).

## ADR-002: Lokale Speicherung über IndexedDB ohne Backend

**Status:** Angenommen (Sprint 1)

**Kontext:** Die App muss offline nutzbar sein, ohne Anmeldung und ohne externe Dienste im MVP.

**Entscheidung:** Alle veränderlichen Daten (aktuell: Tagebucheinträge) werden in IndexedDB
gespeichert, gekapselt hinter einem `DiaryRepository`-Interface in `src/storage`. Zugriff über
die schlanke Bibliothek `idb` (Promise-Wrapper um die native IndexedDB-API), da sie die
Fehleranfälligkeit von Callback-basiertem IndexedDB-Code reduziert, ohne ein grosses
State-Management-Framework einzuführen.

**Konsequenzen:** Kein Server, kein Login, volle Offline-Fähigkeit. Cloud-Synchronisation
(Sprint 19) erfordert eine zweite Repository-Implementierung hinter demselben Interface plus
eine Konfliktlösungsstrategie; das ist durch die Kapselung vorbereitet, aber nicht Teil von
Sprint 1.

## ADR-003: Statische, versionierte Missionsdaten als TypeScript-Modul

**Status:** Angenommen (Sprint 1)

**Kontext:** Missionen müssen zur Build-Zeit typsicher validierbar sein, ohne Backend oder
externe Datenquelle in Sprint 1-18.

**Entscheidung:** Missionen werden als typisiertes TypeScript-Array in `src/data/missions.ts`
gepflegt statt als JSON, damit der Compiler fehlende Pflichtfelder direkt erkennt. Jede Mission
trägt ein `contentVersion`-Feld; Tagebucheinträge speichern einen `missionSnapshot` mit
`contentVersion`, damit spätere Inhaltsänderungen bestehende Tagebucheinträge nicht verfälschen.

**Konsequenzen:** Inhaltspflege erfordert einen Code-Deploy (kein CMS). Das ist für Sprint 1-18
akzeptabel; Sprint 21 ("Neue geprüfte Inhalte") muss diese Entscheidung überdenken, falls
redaktionelle Freigabe ausserhalb von Code-Deploys gewünscht ist.

## ADR-004: ESLint + Prettier statt oxlint (Vite-Default)

**Status:** Angenommen (Sprint 1)

**Kontext:** Das aktuelle Vite-React-TS-Scaffold bringt standardmässig `oxlint` mit.

**Entscheidung:** `oxlint` wurde entfernt und durch ESLint (Flat Config, `typescript-eslint`,
`eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`) plus Prettier ersetzt, wie in der
Projektspezifikation explizit gefordert.

**Konsequenzen:** Etwas langsamere Lint-Läufe als mit oxlint, dafür ausgereiftere
React-Hooks-Regeln (u. a. `react-hooks/set-state-in-effect`, das in Sprint 1 zwei echte
Effect-Antipatterns in `useTimer` und `useDiaryEntries` aufgedeckt hat).

## ADR-005: Timeout + Wiederholungsversuch beim Öffnen der IndexedDB

**Status:** Angenommen, aber unbestätigte Hypothese - hat den beim Familientest beobachteten Bug
nicht behoben (die tatsächliche Ursache war `crypto.randomUUID`, siehe ADR-006). Bleibt als
sinnvolle Absicherung für den beschriebenen WebKit-Bug im Code, ohne dass dieser konkrete Bug je
bestätigt auftrat.

**Kontext:** Beim Test auf Elenas iPhone als installierte "Zum Home-Bildschirm"-App blieb das
Speichern eines Tagebucheintrags hängen; das Tagebuch liess sich nicht anzeigen. Ursache ist ein
bekannter WebKit-Bug: Der allererste `indexedDB.open()`-Aufruf einer neu installierten
Standalone-PWA kann auf iOS nie auflösen und nie ablehnen. Da die Verbindung modulweit als
Promise gecacht wurde, blieb diese hängende Promise für die gesamte Sitzung bestehen.

**Entscheidung:** `getDb()` in `src/storage/db.ts` bricht den Öffnen-Versuch nach 4 Sekunden ab
und versucht es bis zu dreimal erneut; ein fehlgeschlagener Versuch wird nicht dauerhaft gecacht,
damit ein erneuter Aufruf (z. B. über den "Nochmals versuchen"-Knopf) wirklich neu startet. Die
Abschlussbewertung zeigt zusätzlich einen sichtbaren Speichern-/Fehlerzustand statt stillem
Nichtstun.

**Konsequenzen:** In seltenen Fällen kann der verworfene erste Öffnen-Versuch im Hintergrund
später doch noch auflösen und eine ungenutzte zusätzliche Verbindung erzeugen; das ist für eine
lokale Single-User-App unproblematisch. Dieses Verhalten ist auf echten iOS-Geräten nur manuell
reproduzierbar (nicht zuverlässig automatisiert testbar) und wurde daher durch Familientest statt
durch einen Unit-Test verifiziert.

## ADR-006: `generateId()` statt `crypto.randomUUID()` für Tagebuch-IDs

**Status:** Angenommen (Sprint 1, Bugfix nach Familientest)

**Kontext:** Die tatsächliche Ursache des beim Familientest beobachteten Speicher-Bugs (siehe
ADR-005-Kontext) war `crypto.randomUUID()`: Diese Funktion erfordert einen sicheren Kontext
(HTTPS oder `localhost`). Zum Testen auf Elenas iPhone wird die App aber über die lokale
Netzwerk-IP des Mac per HTTP aufgerufen (`http://<Mac-IP>:PORT`) - kein sicherer Kontext im Sinne
der Browser-Spezifikation. In Safari ist `crypto.randomUUID` dort schlicht `undefined`, was bei
jedem Speicherversuch einen `TypeError` warf. Gefunden, weil die App den echten Fehlertext direkt
in der Oberfläche anzeigte (siehe `src/app/MissionFlowPage.tsx`) und Michael ihn per Sprachnachricht
weitergeben konnte, statt Remote-Debugging einrichten zu müssen.

**Entscheidung:** Neue Hilfsfunktion `generateId()` in `src/domain/id.ts`: nutzt
`crypto.randomUUID()`, wenn verfügbar, sonst `crypto.getRandomValues()` (funktioniert ohne
sicheren Kontext) für eine spec-konforme UUID v4, sonst als letzten Ausweg einen
`Math.random()`-basierten String. Ersetzt den direkten `crypto.randomUUID()`-Aufruf in
`MissionFlowPage.tsx`.

**Konsequenzen:** IDs sind weiterhin eindeutig genug für eine lokale Single-User-App, aber nicht
mehr durchgehend kryptographisch stark - für Tagebuch-Eintrags-IDs unproblematisch. Diese Lektion
gilt für alle künftigen Sprints: sicherer-Kontext-abhängige Browser-APIs (`crypto.randomUUID`,
Service-Worker-Registrierung, u. a.) verhalten sich auf `http://<LAN-IP>` anders als auf
`https://` oder `localhost`. Solange ohne HTTPS auf dem iPhone getestet wird, sollte neuer Code
auf solche APIs geprüft werden, bevor er beim Familientest scheitert.

## ADR-007: Startseite ersetzt "Beispielmission zuerst" als Sprint-1-Übergangslösung

**Status:** Angenommen (Sprint 2)

**Kontext:** Die Spezifikation verlangt unter "Verbindliche Produktregeln": "Erster
App-Eindruck: eine echte Beispielmission, danach Startseite." Sprint 1 hatte noch keine
Startseite, weshalb `/` direkt die Beispielmission zeigte. Sprint 2 baut die echte Startseite;
Michael und Elena bestätigten beim Sprint-1-Test explizit, dass sie ab jetzt eine Startseite mit
Kategorie-Auswahl erwarten.

**Entscheidung:** `/` zeigt ab Sprint 2 die echte Startseite (`features/missions/HomePage`), nicht
mehr direkt eine Mission. Die "Mission zuerst"-Regel wird als Sprint-1-spezifische
Bootstrapping-Lösung interpretiert, nicht als dauerhaftes Verhalten - ein echter "Wow-Moment beim
allerersten App-Start" gehört inhaltlich zum Onboarding (Sprint 4), das noch nicht existiert.

**Konsequenzen:** Falls Sprint 4 (Onboarding) einen expliziten "erste Mission zuerst"-Moment für
komplett neue Profile vorsehen soll, muss das dort als eigener Onboarding-Schritt ergänzt werden,
nicht als Dauerverhalten der Startseite.

## ADR-008: Kein Laborschrank-Abgleich, keine Buttons für noch nicht gebaute Bereiche

**Status:** Angenommen (Sprint 2)

**Kontext:** Die Produktregeln verlangen Missionskarten mit "fehlenden Materialien" sowie
Startseiten-Knöpfe für Laborschrank, laufende Missionen und eigene Mission. Diese Funktionen
existieren technisch erst ab Sprint 8 (Laborschrank), Sprint 12 (laufende Missionen) bzw.
Sprint 15 (eigene Missionen). Der konkrete Sprint-2-Auftrag in `BACKLOG.md` listet sie nicht.

**Entscheidung:** Sprint 2 zeigt auf Missionskarten die Anzahl benötigter Zutaten statt
"fehlender" Materialien (kein Inventar zum Abgleichen vorhanden) und verzichtet auf
Startseiten-Knöpfe für Laborschrank, laufende Missionen und eigene Mission, statt Knöpfe zu
Platzhalter-/Stub-Seiten zu bauen.

**Konsequenzen:** Diese drei Knöpfe müssen in den jeweiligen späteren Sprints (8, 12, 15) zur
Startseite ergänzt werden. Die Regel "keine Backlog-Funktion wird versehentlich halb
implementiert" wird höher gewichtet als eine wortwörtliche, aber zum aktuellen Zeitpunkt
inhaltsleere Umsetzung der Produktregel.

## ADR-009: "3 Tage verstecken" und "14-Tage-Verlauf" als ein gemeinsamer Mechanismus

**Status:** Angenommen (Sprint 2)

**Kontext:** Die Produktregeln nennen zwei separate Sätze: "`3 Tage verstecken` blendet eine
Mission temporär aus" und "ersetzte Vorschläge bleiben 14 Tage im Verlauf". Letzteres klingt nach
einem automatischen Vorschlags-Rotationsmechanismus (die Vorschlagsmaschine ersetzt einen
Vorschlag durch einen anderen). Mit aktuell nur fünf Missionen (eine pro Kategorie) gibt es
faktisch nichts, das automatisch "ersetzt" werden könnte - eine echte Vorschlagsrotation ergibt
erst ab Sprint 6+ (mehr Inhalte) und Sprint 10 (Vorschlagsmaschine) Sinn.

**Entscheidung:** Jede "3 Tage verstecken"-Aktion (`domain/missionVisibility.ts`,
`createHiddenMissionEntry`) erzeugt einen einzigen Eintrag, der die Mission 3 Tage aus aktiven
Vorschlägen ausblendet und gleichzeitig 14 Tage lang im `/verlauf` auffindbar bleibt (auch nach
Ablauf der 3 Tage, solange die 14 Tage nicht überschritten sind).

**Konsequenzen:** Sobald Sprint 6+/10 eine echte Vorschlagsrotation einführt, sollte geprüft
werden, ob algorithmisch "ersetzte" Vorschläge ebenfalls über denselben `HiddenMissionEntry`-
Mechanismus laufen sollen oder einen eigenen Eintragstyp brauchen.
