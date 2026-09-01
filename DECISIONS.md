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

## ADR-010: Navigation grundsätzlich am unteren Bildschirmrand, nicht oben

**Status:** Angenommen (Sprint 2, zweite Feedback-Runde)

**Kontext:** Michael testete auf dem echten iPhone und stellte fest, dass "Zurück"-Links am
oberen Bildschirmrand (z. B. "← Tagebuch" auf der Tagebuch-Detailseite) mit einer Hand kaum
erreichbar sind - zu nah an Kerbe/Statusleiste. Explizite Rückmeldung: grundsätzlich keine
antippbaren Elemente ganz oben am Display, stattdessen alle Navigation unten, mit genug Abstand
zum unteren Rand für bequemes Antippen.

**Entscheidung:** Neue Komponente `components/BackLink.tsx` kapselt Zurück-Navigation als
grosszügig grosses, unten platziertes Element mit `env(safe-area-inset-bottom)`-Abstand zur
Home-Indicator-Zone. Eingesetzt in `MissionFlowPage`, `DiaryEntryDetailPage`, `DiaryPage`,
`SecretVaultPage`, `HistoryPage` - überall, wo vorher ein Zurück-Link existierte. Die
Fortschritts-Punkte im Schritt-Modus (`StepRunner`) waren als anklickbare "Springe zu Schritt
N"-Buttons ganz oben implementiert; sie wurden zu rein visuellen, nicht interaktiven Indikatoren
gemacht (Navigation läuft ausschliesslich über die bereits unten platzierten
Zurück/Weiter-Knöpfe).

**Konsequenzen:** Jede neue Seite mit einer Zurück-Aktion sollte künftig `BackLink` verwenden statt
einen eigenen Link zu bauen, damit die Konvention (unten, sicherer Abstand, grosses Touch-Ziel)
konsistent bleibt. Freies Springen zwischen Schritten per Klick auf einen Fortschrittspunkt ist
damit nicht mehr möglich - war ohnehin keine spezifizierte Anforderung, nur ein Sprint-1-Extra.

## ADR-011: Präferenzprofil wird immer frisch aus dem Tagebuch berechnet, nicht separat gespeichert

**Status:** Angenommen (Sprint 3)

**Kontext:** Die Spezifikation verlangt ein "transparentes Präferenzprofil je Profil" und
"nachvollziehbare lokale Gewichtung". `BACKLOG.md` nennt dafür separat "robustes
IndexedDB-Repository" und "Präferenzprofil" - liest sich zunächst nach einer eigenen
Speicherstruktur für das Profil.

**Entscheidung:** Kein eigener IndexedDB-Store fürs Präferenzprofil. Stattdessen baut
`domain/preferenceProfile.buildPreferenceProfile` das Profil bei Bedarf rein aus den bereits
gespeicherten `rating.adjustments` aller Tagebucheinträge (`diaryEntries`, seit Sprint 1). Das
bestehende `DiaryRepository` mit seiner Timeout-/Retry-Logik beim Öffnen (ADR-005) erfüllt damit
bereits die Anforderung "robustes IndexedDB-Repository" - es gibt keine zusätzliche
Speicherquelle, die aus dem Takt geraten könnte.

**Konsequenzen:** Bei sehr vielen Tagebucheinträgen (realistisch weit ausserhalb des
MVP-Rahmens für ein einzelnes Kind) müsste die Berechnung ggf. memoisiert oder inkrementell
gepflegt werden - für Sprint 3 unproblematisch. Vorteil: Das Profil kann nie von den Bewertungen
abweichen, aus denen es entsteht, was die Anforderung "nachvollziehbar" direkt erfüllt.

## ADR-012: Strukturierte Anpassungswünsche gewichten nur die Kategorie-Vorschläge, nicht die Tagesmission

**Status:** Angenommen (Sprint 3)

**Kontext:** `domain/suggestions.ts` enthält zwei Funktionen: `suggestionsForCategory` (Grundlage
der Kategorie-Abschnitte auf der Startseite) und `pickDailyMission` (die einzelne Tagesmission).
Beide könnten theoretisch das Präferenzprofil nutzen.

**Entscheidung:** Nur `suggestionsForCategory` erhält das Präferenzprofil. `pickDailyMission`
bleibt bei seiner tagesstabilen, datumsbasierten Zufallsauswahl unverändert.

**Konsequenzen:** Die Tagesmission bleibt bewusst überraschend statt sich ausschliesslich auf
bereits bekannte Vorlieben zu verengen - passt zur Spezifikationsidee einer "geheimnisvollen"
Tagesmission. Eine präferenzbewusste Tagesmission könnte in Sprint 10
("Filter und Vorschlagsmaschine") sinnvoll ergänzt werden, falls gewünscht.

## ADR-013: Geburtstagsmission wiederverwendet die Tagesmissions-Auswahl statt eigener Inhalte

**Status:** Angenommen (Sprint 4)

**Kontext:** Die Spezifikation verlangt: "Geburtstage mehrerer Personen werden speicherbar. Dazu
können personalisierte Geburtstagsmissionen erscheinen, beispielsweise für Laura." Mit aktuell
nur fünf Missionen gibt es keinen Spielraum, echte geburtstagsspezifische Inhalte zu kuratieren -
das ist Inhaltsarbeit für Sprint 6+ (mehr Missionen pro Kategorie).

**Entscheidung:** Trifft `HomePage` auf einen Geburtstag "heute" (`domain/isBirthdayToday`),
ersetzt sie nur die Präsentation der ohnehin berechneten Tagesmission
(`pickDailyMission`): festlicher Rahmen, Kuchen-Emoji, Titel "Geburtstagsmission für {Name}"
statt "Tagesmission". Die zugrunde liegende Mission ist identisch mit der, die ohne Geburtstag
gezeigt worden wäre.

**Konsequenzen:** "Personalisiert" bezieht sich aktuell nur auf Namen und Rahmen, nicht auf den
Missionsinhalt selbst. Sobald mehr Inhalte existieren, könnte die Auswahl gezielter werden (siehe
ARCHITECTURE.md, Erweiterungspunkte) - das ist bewusst auf später verschoben, um Sprint 4 nicht
mit Inhaltsarbeit zu vermischen, die eigentlich zu Sprint 6+ gehört.

## ADR-014: Profil-Onboarding als globales Gate in `App.tsx`, kein eigener Router-Zweig

**Status:** Angenommen (Sprint 4)

**Kontext:** Vor Sprint 4 gab es kein persistiertes Profil - `DEFAULT_PROFILE` war eine
Konstante, überall direkt verwendet. Jetzt muss die App unterscheiden: Profil noch nicht
eingerichtet (Onboarding zeigen) vs. Profil vorhanden (normale Routen zeigen).

**Entscheidung:** `App.tsx` lädt das Profil zentral über `useProfile` und rendert bei fehlendem
oder unvollständigem Profil (`!profile.onboardingCompletedAt`) ausschliesslich
`OnboardingFlow` - keine `Routes`, kein Zugriff auf `/diary`, `/geheimfach` etc. während des
Onboardings. Bestehende Profile aus Sprint 1-3-Installationen (kein `profiles`-Store-Eintrag)
durchlaufen das Onboarding beim ersten Start nach diesem Update einmalig; ihre übrigen Daten
(Tagebuch, Geheimfach, Verlauf) bleiben unangetastet, da sie in separaten Object Stores liegen.

**Konsequenzen:** Jede Seite, die Forschername oder Maskottchen anzeigen will, lädt das Profil
selbst erneut über `useProfile` (kein globaler Context) - konsistent mit dem bestehenden Muster
aus Sprint 1-3 (`useDiaryEntries`, `useSecretVault` funktionieren genauso). Für die aktuelle
App-Grösse unproblematisch; bei spürbaren Performance-Problemen könnte ein gemeinsamer
Profil-Context eingeführt werden, ist aber kein Sprint-4-Thema.

## ADR-015: 33-Maskottchen-Katalog per Canvas statt drei CSS-Varianten

**Status:** Angenommen (Sprint 4, zweite Feedback-Runde)

**Kontext:** Die ursprünglichen drei CSS-Maskottchen (Geist/Vampir/Kobold, reine
div-Formen) waren Elena zu wenig differenziert. Gewünscht: deutlich detailliertere,
eigenständige Figuren (u. a. Fell, ein Auge im offenen Maul auf einer Zunge liegend, Blut) -
und ausdrücklich **alle** Entwürfe sollen in der App wählbar sein, nicht nur drei Favoriten.
Zur Ideenfindung wurde zunächst eine separate HTML/Canvas-Galerie mit 33 Entwürfen gebaut und
Michael/Elena zur Auswahl gezeigt.

**Entscheidung:** Die Zeichenlogik aus der Galerie wurde nach `components/mascotArt.ts`
portiert (TypeScript, Canvas-2D-API) statt in SVG/JSX neu gebaut zu werden - identischer,
bereits geprüfter visueller Output, kein Risiko einer Abweichung zwischen Vorschau und App.
`Profile.mascotVariant` wechselt von einer geschlossenen Drei-Werte-Union (`MascotVariant`) zu
einem offenen String-Typ (`MascotId`), der auf einen von 33 Katalogeinträgen verweist.
`components/Mascot` rendert ein `<canvas>` (240×240 Koordinatensystem, per
`devicePixelRatio` skaliert) statt verschachtelter `div`s. `MascotPicker` zeigt alle 33
Entwürfe als scrollbares, nach Tierart gruppiertes Raster.

**Konsequenzen:** Canvas ist imperativ (Neuzeichnen per `useEffect` bei ID-/Grössenwechsel)
statt deklarativ wie die vorherige CSS-Lösung; die "Redet"-Animation pulsiert jetzt das ganze
Canvas-Element statt nur den Mund zu bewegen (kein isoliertes DOM-Element für den Mund
vorhanden). In Vitest/jsdom loggt `HTMLCanvasElement.getContext('2d')` eine harmlose
"not implemented"-Warnung (kein `canvas`-npm-Paket installiert); die Komponente behandelt das
über eine `null`-Prüfung, Tests bleiben grün. Der Katalog liegt bewusst in `components`, nicht
in `domain` - `domain/profile.ts` kennt nur den `MascotId`-String, keine Zeichen- oder
Farblogik.

## ADR-016: Stempel-Animation als CSS-Overlay, nicht als Canvas-Neuzeichnung

**Status:** Angenommen (Sprint 4, dritte Feedback-Runde)

**Kontext:** Elena wünschte sich eine sichtbare Animation, bei der eine zum gewählten
Maskottchen passende Pranke den gewählten Stempel aufs Tagebuch-Blatt drückt. Zur Ideenfindung
wurden zunächst drei Konzepte (Stempel-Schlag, Schwung-Stempel, Zauber-Stempel) und danach eine
verfeinerte "Hand-Stempel"-Variante als eigenständige HTML/CSS-Prototypen gezeigt und
gemeinsam mit der Familie ausgewählt.

**Entscheidung:** `components/StampAnimation.tsx` reproduziert den zuletzt gezeigten Prototyp
nahezu 1:1 (gleiche Klassenstruktur, gleiche Keyframes) statt neu mit der
Canvas-Maskottchen-Engine (`mascotArt.ts`) zu arbeiten. Farbe/Fell der Pranke kommen aus
`PALETTES[entry.palette]`, Blutstropfen werden nur bei `entry.gore === true` gerendert - beides
über `getMascotEntry(mascotId)` aus dem bestehenden Maskottchen-Katalog. Der dargestellte
Stempel ist dynamisch (`domain/rating.STAMPS`), nicht mehr das Platzhalter-🔮 aus dem
Prototyp.

**Konsequenzen:** Zwei parallele Darstellungstechniken für "Maskottchen-Grafik" existieren jetzt
nebeneinander: `Mascot`/`mascotArt.ts` zeichnet ganze Maskottchen auf `<canvas>`,
`StampAnimation` zeichnet nur eine Pranke rein über CSS-Formen (kein Canvas). Bewusst so belassen,
weil die Pranke eine andere Perspektive/Pose ist als die Maskottchen-Porträts und ein
Canvas-Umbau keinen echten Vorteil gebracht, aber Wiederholungsaufwand verursacht hätte. Bei
einer künftigen grösseren Überarbeitung der Maskottchen-Grafik sollten beide Stellen gemeinsam
betrachtet werden.

## ADR-017: Lokale HTTPS via mkcert statt öffentlichem Hosting

**Status:** Angenommen (Sprint 5)

**Kontext:** Service-Worker-Registrierung und `crypto.randomUUID()` benötigen einen sicheren
Kontext (siehe ADR-006); die bisherige Behelfslösung über `http://<lokale-IP>` verhinderte damit
eine echte Offline-Prüfung. Zwei Wege standen zur Wahl: (a) lokal bleiben und ein selbstsigniertes
Zertifikat per mkcert auf Elenas iPhone als Profil installieren, oder (b) den Produktions-Build
auf einem öffentlichen kostenlosen Host (z. B. Cloudflare Pages) mit echter HTTPS-URL
veröffentlichen. Michael hat sich explizit für Option (a) entschieden ("Lokal bleiben, Zertifikat
installieren").

**Entscheidung:** `mkcert` erzeugt eine lokale CA sowie ein Blatt-Zertifikat für
`192.168.1.106`/`localhost`/`127.0.0.1` unter `certs/` (gitignored, siehe unten).
`vite.config.ts` lädt Zertifikat/Key bedingt über `existsSync` und aktiviert HTTPS für `server`
und `preview` mit `host: true`. Die CA-Root-Datei (`rootCA.pem`, unkritisch) wurde per AirDrop an
Elenas iPhone übertragen und dort als Konfigurationsprofil installiert UND zusätzlich unter
Einstellungen → Allgemein → Info → Zertifikatsvertrauenseinstellungen manuell auf "voll
vertrauenswürdig" gestellt (zwei getrennte Schritte, der zweite wird leicht übersehen).

**Konsequenzen:** Kein externes Hosting, keine öffentlich erreichbare URL, keine Abhängigkeit von
einem Drittanbieter - passend zum MVP-Grundsatz "kein Backend". Nachteil: das Zertifikat
(`certs/crazylab-key.pem`) ist ein privater Schlüssel und darf nie ins Repository gelangen -
`.gitignore` wurde entsprechend ergänzt. Jede neue IP-Adresse (z. B. neues WLAN) erfordert ein
neu ausgestelltes Zertifikat. Das Browser-Automatisierungs-Pane dieses Projekts kann
selbstsignierte Zertifikatswarnungen nicht wegklicken - lokale Vorschau-Verifizierung mit
aktiven Zertifikaten läuft daher über `curl -sk` bzw. wird auf das reale iPhone verlagert; für
UI-Interaktionstests werden die Zertifikate vorübergehend beiseitegelegt (dev-Server fällt dann
automatisch auf HTTP zurück).

## ADR-018: Backup/Restore als manueller Datei-Export statt automatischer Cloud-Sync

**Status:** Angenommen (Sprint 5, Datenverlust-Vorfall)

**Kontext:** Nach dem Umstieg von `http://` auf `https://` (ADR-017) verlor die Familie beim
Neuinstallieren alle lokalen Daten (Maskottchen, Geburtstage, erledigte Missionen) - IndexedDB ist
Origin-gebunden, ein Protokollwechsel zählt als neuer Origin. Zwar ist das ein einmaliger Vorgang,
der bei künftigen Neuinstallationen auf demselben `https://`-Origin nicht mehr auftreten sollte,
doch die Familie erwartet unabhängig von der genauen Ursache einen echten Schutz vor Datenverlust,
bevor der nächste Sprint startet. Eine vollständige Cloud-Synchronisation ist explizit erst für
Sprint 19 vorgesehen (Backend-Auswahl, Auth, Konfliktlösung) und für dieses MVP-Stadium zu
aufwändig.

**Entscheidung:** `storage/backup.ts` bündelt Profil, Tagebuch, Geheimfach und Verlauf eines
Profils in ein versioniertes JSON-Envelope (`format: 'crazylab-backup'`, `version: 1`) mit
Typ-Guard `isBackupData`. Export läuft rein clientseitig über `Blob` + `<a download>`, Import über
`<input type="file">` + `FileReader`. Auf der Profilseite (`/profil`) gibt es dafür einen neuen
Abschnitt "📦 Datensicherung" mit den Aktionen "Backup herunterladen"/"Backup wiederherstellen".
`restoreBackup` schreibt Profil und Tagebucheinträge mit ihren ursprünglichen IDs/Zeitstempeln
zurück (`save`/`saveEntry`), nutzt für Geheimfach und Verlauf aber bewusst die bestehenden
High-Level-Repository-Methoden (`save`, `hide`) statt roher `db.put`-Aufrufe - das
Verstecken-Datum wird dabei korrekt aus dem Backup übernommen, IDs für Geheimfach-Einträge werden
neu vergeben (unkritisch, da sie nur intern referenziert werden).

**Konsequenzen:** Kein automatischer Schutz (die Familie muss aktiv ein Backup herunterladen),
aber sofort verfügbar, ohne Backend, ohne Konto, ohne Netzwerk - passend zum MVP-Grundsatz. Die
Backup-Datei ist unverschlüsselt lesbares JSON; für diese private Familien-App bewusst in Kauf
genommen. Das native Herunterladen/Hochladen einer Datei löst im Browser einen echten
OS-Dialog aus, den das Browser-Automatisierungs-Pane dieses Projekts nicht bedienen kann -
verifiziert wurde die Geschäftslogik daher über 3 Modul-Tests (`backup.test.ts`, inkl.
vollständigem Restore-Rundlauf nach simuliertem IndexedDB-Reset) und 3 Komponenten-Tests
(`ProfilePage.test.tsx`), die reale Dateidialog-Interaktion bleibt der Familientest auf dem
iPhone vorbehalten.

## ADR-019: Automatisches Cloud-Backup (vorgezogener, abgespeckter Sprint 19)

**Status:** Angenommen (Sprint 5, auf expliziten Wunsch nach ADR-018)

**Kontext:** Der manuelle Datei-Export (ADR-018) hat Michael nicht überzeugt - er möchte, dass die
App den Stand automatisch sichert, ohne dass jemand aktiv einen Knopf drücken muss:
"automatisch... alle zehn Minuten... in die Cloud... jedes Mal, wenn ich die App neu öffne und
Internet habe, wird automatisch der neueste Stand geladen... wenn kein Internet, bleibt der letzte
lokale Stand... bei Konflikt zählt lokal." Eine vollständige Mehrgeräte-Synchronisation mit Login,
Konfliktauflösung usw. ist bewusst erst für Sprint 19 vorgesehen - das würde diese Anforderung
massiv überdimensionieren, weil Elena die App aktuell nur auf einem einzigen Gerät nutzt. Michael
wurde genau dieser Unterschied erklärt und hat einer abgespeckten Vorziehung explizit zugestimmt
("Ja, das ist okay... nicht erst bis Sprint neunzehn... wenn wir das dann in Sprint neunzehn
nochmals überarbeiten, ist das okay").

**Entscheidung:** Kein echtes Sync-Protokoll, sondern "automatisches Backup + automatisches
Wiedereinspielen bei leerem Gerät":

- Neuer Cloudflare Worker (`cloud-worker/`, separates Deployment, siehe dortige README.md) mit
  einer KV-Datenbank, erreichbar über genau zwei Endpunkte: `PUT /:key` (Stand speichern) und
  `GET /:key` (Stand laden). Kein Login - der lange, zufällige `key` selbst ist das einzige
  Geheimnis (gleiche Risikoklasse wie die unverschlüsselte lokale Backup-Datei aus ADR-018).
- `storage/cloudSync.ts` liest Worker-URL und Schlüssel aus Vite-Umgebungsvariablen
  (`VITE_CLOUD_SYNC_URL`/`VITE_CLOUD_SYNC_KEY`, siehe `.env.local.example`). Fehlen sie, ist
  Cloud-Sync komplett deaktiviert (kein Fetch-Aufruf, kein Fehler) - die App funktioniert dann
  genau wie vor diesem ADR.
- Nach jeder erfolgreichen Änderung (Profil speichern, Tagebucheintrag anlegen/ändern, Geheimfach
  umschalten, Mission verstecken - fünf Aufrufstellen in `features/*`/`app/MissionFlowPage.tsx`)
  wird `scheduleCloudBackup(profileId)` aufgerufen: baut über `createBackup` (ADR-018) den
  kompletten aktuellen Stand und lädt ihn "fire and forget" hoch. Netzwerkfehler werden bewusst
  verschluckt - ein fehlgeschlagener Cloud-Upload darf die App nie stören, IndexedDB bleibt die
  alleinige Quelle der Wahrheit auf dem Gerät.
- Beim App-Start (`App.tsx`) wird - nur solange lokal **kein** abgeschlossenes Profil existiert -
  einmalig `downloadBackupFromCloud()` versucht; findet sich ein gültiger Stand, wird er über
  `restoreBackup` (ADR-018) eingespielt, bevor das Onboarding gezeigt würde. Existiert lokal
  bereits ein Profil, wird die Cloud gar nicht erst angefragt - das ist die "bei Konflikt zählt
  lokal"-Regel aus der Anforderung, hier als bewusst denkbar einfachste Umsetzung: kein
  Merge, kein Zeitstempel-Vergleich, einfach "leeres Gerät gewinnt nie gegen echte lokale Daten".

**Konsequenzen:** Das ist **keine** echte Mehrgeräte-Synchronisation - Änderungen auf einem
zweiten Gerät würden nie automatisch auf ein Gerät mit bereits vorhandenen lokalen Daten
übertragen (das deckt Sprint 19 später ab, mit echter Konfliktauflösung). Für den aktuellen
Ein-Gerät-Alltag ist das aber genau richtig und deutlich einfacher als echtes Sync: kein Login,
keine Konfliktauflösungs-UI, kein Zeitstempel-Vergleich nötig. Neuer, bewusster Bruch mit dem
bisherigen "kein Backend, keine Internet-Abhängigkeit"-Grundsatz: Elenas Daten verlassen jetzt
automatisch das Gerät (an einen privaten, nur Michael gehörenden Cloudflare-Account) - Michael hat
das explizit bestätigt. Die App bleibt aber voll funktionsfähig, wenn der Worker nicht erreichbar
oder nicht konfiguriert ist (z. B. frischer Checkout ohne `.env.local`). Getestet über 6 Modul-
Tests (`cloudSync.test.ts`, Upload/Download/Fehlerfälle/deaktivierter Zustand) und 2
Integrationstests (`App.test.tsx`, Cloud-Restore bei leerem Profil bzw. wenn auch die Cloud nichts
liefert); der Worker selbst (`cloud-worker/`) braucht ein echtes Cloudflare-Konto zum Deployen,
das nur Michael selbst anlegen kann (siehe `cloud-worker/README.md`) - das reale Ende-zu-Ende-
Verhalten wird daher erst nach seinem Deployment auf dem echten iPhone bestätigt.

Beim Testen dieser Änderung fiel ausserdem eine unabhängige, vorbestehende Lücke auf: schlägt das
Öffnen der lokalen Datenbank nach den Wiederholungsversuchen aus ADR-005 endgültig fehl, blieb
`useProfile` für immer bei "loading" hängen (unbehandelte Promise-Ablehnung). Da genau dieser
Zustand jetzt auch das neue Cloud-Restore-Gate blockieren würde, wurde das im selben Zug behoben:
ein endgültig fehlgeschlagenes Öffnen wird wie "kein Profil vorhanden" behandelt, damit die App
zumindest das Onboarding erreicht statt für immer zu hängen.

## ADR-020: Strukturierter Getränkekatalog vor Familienabnahme

**Status:** Angenommen (Sprint 6, 2026-08-30)

**Kontext:** Die letzten Punkte von Sprint 5 benötigen Elena. Michael hat deshalb ausdrücklich
freigegeben, Sprint 6 parallel technisch umzusetzen. Der Katalog soll 15 sichere Getränke, fünf
Vorschläge, Zutatenmerkmale, Varianten und vorhandene Vorlieben unterstützen; Bitteres, Scharfes,
Pfeffer und Kardamom sind ausgeschlossen.

**Entscheidung:** Die bestehende Beispielmission und vierzehn neue Missionen bilden den
Getränkekatalog. Ein validiertes `drinkProfile` beschreibt Geschmack, Temperatur, Optik, Geräte
und mindestens zwei Varianten. Die Varianten sind in der Detailansicht sichtbar; Vorschlagslogik
und Präferenzprofil werden weiterverwendet.

**Konsequenzen:** Sprint 6 ist technisch testbar, aber erst nach Elenas Praxistest abgeschlossen.
Sprint 5 bleibt in Arbeit, Sprint 7 ist nicht automatisch freigegeben. Es wurde keine Cloud-Lösung
bereitgestellt und kein Konto oder Abo abgeschlossen.

## ADR-021: iPhone als Hauptspeicher, manuelles Mac-Backup statt Cloud und Offline

**Status:** Angenommen (Sprint 5, 2026-08-30; ersetzt ADR-019)

**Entscheidung:** Persönliche Daten bleiben primär in IndexedDB auf Elenas iPhone. Die App fragt
WebKit nach persistentem Speicher. Eine zweite Kopie wird über den bestehenden manuellen Export
auf der Profilseite auf dem Mac aufbewahrt. Eine automatische lokale Sicherung wurde nach einem
Sicherheitscheck verworfen: Ihr Zugriffsschlüssel würde im öffentlichen JavaScript-Build sichtbar
und wäre damit kein belastbarer Schutz. Cloudflare wird vollständig entfernt.
Die Familie verzichtet bewusst auf Offline-Betrieb; der Programmcode soll kostenlos öffentlich
bereitgestellt werden, enthält aber keine persönlichen Daten.

**Konsequenzen:** Ohne Mac funktioniert die App online und speichert auf dem iPhone. Michael lädt
gelegentlich bewusst eine Backup-Datei herunter; ohne Time Machine ist diese Mac-Kopie nicht
nochmals abgesichert. Die öffentliche Bereitstellung benötigt ein kostenloses Hostingkonto, erhält
aber keine persönlichen Daten und keine geheimen Zugriffsschlüssel.

## ADR-022: Variantenlernen direkt aus Tagebuchbewertungen

**Status:** Angenommen (Sprint 7, 2026-08-30)

**Kontext:** Sprint 7 soll Getränke nach Geschmack, Optik, Gruseligkeit und Dekoration bewerten
und daraus lernende Variantenempfehlungen ableiten. Für ein zehnjähriges Kind muss sichtbar
bleiben, warum eine Variante empfohlen wird.

**Entscheidung:** Jede Bewertung speichert die konkret gewählte Variante und vier Sternwerte im
bestehenden Tagebucheintrag. Beim nächsten Öffnen derselben Mission wird pro Variante der einfache
Durchschnitt dieser Werte berechnet. Die beste bereits bewertete Variante steht zuerst und erhält
„Für dich empfohlen“. Ohne Bewertungen gilt unverändert die redaktionelle Reihenfolge.

**Konsequenzen:** Keine Black-Box-KI und kein zusätzlicher IndexedDB-Store. Alte Einträge bleiben
gültig, weil alle neuen Felder optional sind. Die Empfehlung lernt nur aus Elenas tatsächlich
abgeschlossenen Varianten und lässt sich jederzeit aus den Tagebucheinträgen erklären.

## ADR-023: Abgeschlossene Missionen machen Platz, gemerkte bleiben wiederholbar

**Status:** Angenommen (Sprint 7, Familienfeedback 2026-08-30)

**Entscheidung:** Die Startseite schlägt abgeschlossene Missionen nicht erneut vor. Dadurch rückt
je Kategorie automatisch die nächste noch offene Mission nach. Die Tagesmission ist zusätzlich
immer von den Kategorie-Listen ausgeschlossen. Hat Elena eine Mission gemerkt, bleibt sie auch
nach dem Abschluss im Bereich „Gemerkte Missionen“ und kann dort über „Nochmals machen“ erneut
gestartet werden. Alle abgeschlossenen Missionen bleiben ausserdem im Tagebuch sichtbar.

**Konsequenzen:** Vorschläge wirken frisch, ohne Elenas Favoriten zu verlieren. Kategorien mit
noch kleinem Katalog können nach Abschluss vorübergehend leer werden; neue Inhalte kommen in den
bereits geplanten Inhaltssprints und werden nicht als ungeplanter Zwischensprint eingeschoben.

## ADR-024: Laborschrank als profilbezogener Materialbestand mit komprimierten Fotos

**Status:** Angenommen (Sprint 8, 2026-08-30)

**Entscheidung:** Die vorbereitete Materialliste wird aus den vorhandenen Missionskatalogen
erzeugt. Nur Materialien, die Elena ausdrücklich übernimmt, werden profilbezogen in einem neuen
IndexedDB-Store gespeichert. Jeder Eintrag behält die allgemeine Katalogbezeichnung und kann eine
genaue Sorte/Marke, einen Bereich, einen Bastelkistennamen, einen groben Mengenstatus und ein Foto
erhalten. Fotos werden auf höchstens 800 Pixel verkleinert. Laborschrank-Einträge sind Bestandteil
des manuellen Backups; das neue Feld bleibt optional, sodass alte Backups kompatibel sind.

**Konsequenzen:** Kein doppelter statischer Materialkatalog und keine Cloud. Grobe Mengenstufen
sind für Elena leichter als exakte Inventurzahlen und genügen als Grundlage für Sprint 9. Fotos
verbrauchen lokalen Speicher, werden durch die Verkleinerung aber begrenzt.

## ADR-025: Richtpreise und Ladenwahl lokal statt Produktdaten-Schnittstelle

**Status:** Angenommen (Sprint 9, 2026-08-30)

**Entscheidung:** Die Einkaufsliste verwendet einfache lokale Richtpreise und eine transparente
Ladenregel: Coop für normale Lebensmittel, Jumbo für typische Bastelmaterialien, Migros als
wählbare Alternative. Elena oder Michael können Laden und Preis jederzeit korrigieren. Es werden
keine aktuellen Produktkataloge, Konten oder externen Schnittstellen angebunden.

**Konsequenzen:** Preise sind ausdrücklich Schätzungen und nicht tagesaktuell, dafür bleibt die
App schnell, privat und kostenlos. Die Datenstruktur kann später genauere Produktdaten aufnehmen,
ohne Sprint 9 von einem Händlerkonto abhängig zu machen.

## ADR-026: Situative Filter bleiben flüchtig, Vielfalt bleibt erklärbar

**Status:** Angenommen (Sprint 10, 2026-08-31)

**Entscheidung:** Zeit, Budget, Ort, Unordnung, Erwachsenen-Verfügbarkeit und Personenanzahl
werden als gemeinsamer Filter vor Tagesmission und Kategorie-Vorschlägen angewendet. Diese Werte
werden nicht gespeichert, weil sie die heutige Situation und nicht Elenas langfristige Vorlieben
beschreiben. Erwachsenenbedarf wird aus Sicherheitsstufe und expliziten Hilfehinweisen abgeleitet;
Schwestern-Missionen benötigen mindestens zwei Personen. Nach der bestehenden Präferenzsortierung
wählt ein deterministisches Verfahren möglichst verschiedene Kombinationen aus Dauer, Kosten und
Unordnung, wobei Primärkategorien immer vor Sekundärkategorien stehen.

**Konsequenzen:** Die Logik bleibt lokal, kostenlos, testbar und für Elena nachvollziehbar. Ein
Neustart beginnt wieder mit allen Missionen. Die heuristische Ableitung ersetzt kein neues
redaktionelles Datenfeld; falls spätere Inhalts-Sprints genauere Personen- oder Hilfsangaben
benötigen, kann das Missionsmodell kompatibel erweitert werden.

## ADR-027: Lokale Sicherungsstände als Hauptbedienung, Datei nur für den Notfall

**Status:** Angenommen (Sprint 11, 2026-08-31)

**Entscheidung:** Crazy Lab erzeugt automatisch vollständige lokale Sicherungsstände beim Start,
alle fünf Minuten und beim Wechsel in den Hintergrund. Ein Fingerabdruck verhindert identische
Dubletten; maximal zehn Stände werden in IndexedDB aufbewahrt. Die Profilseite zeigt eine normale
Liste mit Datum, „Jetzt sichern“ und „Laden“. Der JSON-Datei-Export bleibt technisch erhalten,
ist aber nur noch als „Notfallkopie ausserhalb der App“ sichtbar.

**Konsequenzen:** Der normale Alltag fühlt sich wie eine App und nicht wie ein Dateieditor an.
Lokale Sicherungsstände helfen bei Fehlbedienung, liegen aber im gleichen Browserspeicher wie die
App-Daten und gehen bei vollständiger Löschung gemeinsam verloren. Nur die weiterhin mögliche
externe Notfallkopie schützt vor diesem Fall; ohne Cloud, Server oder Nutzerinteraktion kann eine
Browser-PWA keine unabhängige Kopie auf dem Mac oder in iCloud ablegen.

## ADR-028: Eigene Materialien lokal und transparent einordnen

**Status:** Angenommen (Sprint 11, 2026-08-31)

**Entscheidung:** Freitext-Materialien werden lokal normalisiert und durch nachvollziehbare
Wortregeln als Lebensmittel, Bastelmaterial, Werkzeug, Behälter oder Sonstiges eingeordnet. Daraus
folgt ein sinnvoller Startbereich; Elena kann ihn anschließend ändern. Quelle und Materialtyp
werden optional am Laborschrank-Eintrag gespeichert und damit automatisch mitgesichert.

**Konsequenzen:** Beispiele wie „Wattestäbchen“ funktionieren sofort, ohne Konto, API-Schlüssel,
Kosten oder Übertragung von Elenas Eingaben. Es ist bewusst keine behauptete Cloud-KI: unbekannte
Begriffe bleiben sicher als „Sonstiges Material“ erhalten, statt möglicherweise falsch erfundene
Informationen zu erzeugen. Die Regelmenge kann anhand echten Familienfeedbacks erweitert werden.

## ADR-029: Langzeitversuche speichern Schritte, keine laufenden Timer

**Status:** Angenommen (Sprint 12, 2026-09-01)

**Entscheidung:** Mehrtägige Experimente speichern profilbezogen die erledigten Schritt-IDs und
Zeitpunkte in einem eigenen IndexedDB-Store. Sie können bewusst pausiert und über „Laufende
Versuche“ fortgesetzt werden. Es läuft kein Hintergrund-Timer; echte Wartezeiten beschreibt die
Mission in Tagen und Elena bestätigt den nächsten Schritt selbst.

**Konsequenzen:** Ein Schliessen der App verliert den Versuchsstand nicht und verbraucht keine
Hintergrundressourcen. Der neue Stand wird im Backup mitgesichert. Alte Backups ohne dieses
optionale Feld bleiben gültig.

## ADR-030: Missionsfotos lokal, begrenzt und vor dem Speichern verkleinert

**Status:** Angenommen (Sprint 13, 2026-09-01)

**Entscheidung:** Eine Foto-Challenge darf höchstens fünf Bilder speichern. Jedes Bild wird im
Browser auf maximal 1000 Pixel verkleinert und zusammen mit einem einfachen CSS-Rahmen und
CSS-Effekt in den Tagebucheintrag geschrieben. Die Auswahl erfolgt über die iPhone-Kamera oder
Fotomediathek; Crazy Lab lädt nichts zu einem Server hoch.

**Konsequenzen:** Fotos funktionieren privat und ohne Konto, belegen aber mehr lokalen Speicher
als reine Textdaten und werden Teil der Backups. Rahmen und Effekte verändern das Original nicht,
sondern nur seine Darstellung und lassen sich ohne Bildbearbeitungsdienst reproduzieren.

## ADR-031: Geheime Teilaufgaben durch bewusstes Aufklappen

**Status:** Angenommen (Sprint 14, 2026-09-01)

**Entscheidung:** Jede Schwestern-Mission enthält eine gemeinsame Anleitung, zwei getrennte
geheime Teilaufgaben und ein gemeinsames Finale. Die beiden Geheimnisse sind in geschlossenen,
einzeln aufklappbaren Bereichen statt in getrennten Konten gespeichert. Optionale
Zeit-Challenges verwenden den vorhandenen lokalen Missionstimer.

**Konsequenzen:** Zwei Kinder können dasselbe iPhone nacheinander nutzen, ohne Einrichtung oder
Login. Die Geheimhaltung ist spielerisch und nicht technisch: Wer absichtlich beide Bereiche
öffnet, kann beide Aufgaben lesen. Das ist für den Familiengebrauch verständlicher als Profile,
Passwörter oder eine zweite Geräteverbindung.

## ADR-032: Eigene Missionen nutzen denselben Ablauf wie der redaktionelle Katalog

**Status:** Angenommen (Sprint 15, 2026-09-01)

**Entscheidung:** Eigene Missionen werden profilbezogen als vollständige `Mission`-Objekte mit
zusätzlichen Erstell- und Änderungszeitpunkten in IndexedDB gespeichert. Der
Maskottchen-Assistent erzeugt sie aus wenigen verständlichen Feldern; Materialien und Schritte
werden je Zeile erfasst. Kopieren erzeugt beim Speichern eine neue Mission, Bearbeiten erhöht die
Inhaltsversion. Gelbe und rote Missionen sind ohne konkreten Sicherheitshinweis nicht speicherbar.
Fürs Spielen wird die eigene Mission in den bestehenden Missionsablauf eingespeist.

**Konsequenzen:** Eigene Missionen funktionieren ohne zweite Ausführungslogik mit Einkaufsliste,
Bewertung und Tagebuch. Sie verlassen das iPhone nicht, ausser als Bestandteil einer ausdrücklich
erstellten Sicherung. Der Assistent ist bewusst lokale Formular- und Sicherheitslogik, keine
behauptete KI und kein Cloud-Dienst. Eine redaktionelle Sicherheitsprüfung ersetzt er nicht;
Michael bleibt bei ungewöhnlichen Materialien oder Werkzeugen verantwortlich.

## ADR-033: Tagebuchbearbeitung bleibt auf persönliche Anzeigefelder begrenzt

**Status:** Angenommen (Sprint 16, 2026-09-01)

**Entscheidung:** Elena darf eigenen Namen, freie Notiz, Status, Stempel und die Auswahl bereits
gespeicherter Fotos nachträglich ändern. Missions-Snapshot, Abschlusszeitpunkt und strukturierte
Bewertungen bleiben unverändert, damit Verlauf und gelernte Empfehlungen nachvollziehbar sind.
Löschen benötigt eine ausdrückliche Rückfrage. Maximal zehn komprimierte Fotos bleiben erlaubt.

**Konsequenzen:** Das Tagebuch ist flexibel, ohne historische Missionsdaten unbemerkt
umzuschreiben. Gelöschte Einträge beeinflussen anschließend auch Präferenz- und
Variantenempfehlungen nicht mehr. Eine Wiederherstellung ist nur über einen vorhandenen lokalen
Sicherungsstand oder eine Notfallkopie möglich.

## ADR-034: Atmosphäre wird lokal synthetisiert und startet nur nach Berührung

**Status:** Angenommen (Sprint 17, 2026-09-01)

**Entscheidung:** Crazy Lab bündelt keine fremden Musikstücke und streamt nichts. Der Browser
erzeugt aus drei sehr leisen Sinustönen je Missionskategorie eine dezente Tonfolge. Wegen der
iOS-Autoplay-Regeln beginnt sie erst nach „Labormusik an“. Ein Drei-Sekunden-Countdown bleibt
überspringbar. Musik und Animationen besitzen Profil-Schalter; `prefers-reduced-motion` schaltet
Bewegung unabhängig davon faktisch ab.

**Konsequenzen:** Keine Lizenzkosten, Abos, Netzwerkanfragen oder großen Audiodateien. Die
Atmosphäre ist bewusst einfach und kein fertiger Soundtrack. Audio funktioniert nur, wenn das
iPhone Web Audio zulässt und nicht stumm beziehungsweise zu leise eingestellt ist. Alle wichtigen
Missionselemente bleiben ohne Ton und Animation vollständig bedienbar.

## ADR-035: Ein gemeinsamer Safari-12-kompatibler Produktions-Build

**Status:** Angenommen (Kompatibilitätskorrektur, 2026-09-01)

**Entscheidung:** Crazy Lab behält genau einen Produktions-Build, dessen JavaScript-Syntax von
Vite gezielt für Safari 12 erzeugt wird. Direkte Verwendungen von `String.replaceAll` und
`Array.flat`, die iOS 12 nicht bereitstellt, werden durch semantisch gleichwertige ältere
Operationen ersetzt. Weil React Router intern weiterhin `Array.flat` verwendet, ergänzt ein kleiner
Start-Kompatibilitätsbaustein diese Methode ausschliesslich in Browsern, die sie nicht besitzen.
Es gibt weder eine zweite App noch eine abweichende Speicherung für das alte iPad.

**Konsequenzen:** Das Familien-iPad mit iOS 12.5.8 kann denselben Codepfad starten. Neue iPhones
behalten alle Funktionen, das gleiche Datenformat und die gleiche lokale IndexedDB; die ältere
Ausgabesyntax vergrössert das komprimierte Programmpaket nur geringfügig. Jedes Gerät besitzt
weiterhin einen getrennten lokalen Datenspeicher. Die automatischen Prüfungen decken die gemeinsame
Anwendungslogik ab; die Darstellung auf dem echten alten iPad muss die Familie einmal bestätigen.

## ADR-036: Responsive Erweiterung statt eigener Tablet-App

**Status:** Angenommen (Sprint 18, 2026-09-01)

**Entscheidung:** Crazy Lab bleibt eine einzige Web-App. Ab Tabletbreite ordnen CSS-Raster
Missions- und Tagebuchkarten mehrspaltig an; ab 900 Pixeln ergänzt `AppShell` eine feste
Seitennavigation. Unterhalb dieser Schwelle bleibt die bestehende iPhone-Navigation unverändert.

**Konsequenzen:** Alle Geräte verwenden dieselben Komponenten, Routen, Daten und Tests. Es gibt
keine zweite Tablet-Version und keine Gefahr auseinanderlaufender Funktionen. Das alte iPad erhält
dieselben responsiven Regeln, soweit seine Bildschirmbreite sie auslöst; moderne iPhones werden
weder funktional noch in ihrer vertrauten einspaltigen Darstellung eingeschränkt.

## ADR-037: Lokale Profilauswahl über eine aktive Profil-ID

**Status:** Angenommen (Sprint 20, 2026-09-01)

**Entscheidung:** Mehrere Personen teilen dieselbe Installation ohne Login oder Passwort. In
`localStorage` liegt nur die zuletzt aktive Profil-ID; alle eigentlichen Profildaten und Inhalte
bleiben in IndexedDB und werden über die bestehenden `profileId`-Felder getrennt. Elenas bisherige
ID `elena` wird nicht migriert oder ersetzt. Detailansichten akzeptieren nur Daten des aktiven
Profils. Ein neues Profil durchläuft denselben Maskottchen- und Namensdialog wie Elena.

**Konsequenzen:** Der bestehende Datenbestand bleibt kompatibel und neue Personen beginnen leer.
Die Trennung schützt vor versehentlicher Vermischung, ist aber keine Sicherheitsbarriere gegen
absichtliches Wechseln: Familienmitglieder können jedes lokale Profil ohne Passwort öffnen. Eine
Cloud oder geräteübergreifende Synchronisation entsteht dadurch ausdrücklich nicht.

## ADR-038: Neue Inhalte bleiben versionierter Bestandteil der App

**Status:** Angenommen (Sprint 21, 2026-09-01)

**Entscheidung:** Die 25 neuen Missionen werden redaktionell im Repository gepflegt und durch
dieselbe automatische Inhaltsvalidierung wie der bestehende Katalog geprüft. Es gibt keinen
Online-Import, keine fremde Inhaltsquelle und keine automatisch veröffentlichte KI-Ausgabe.
Kategorie-spezifische Strukturen bleiben Pflicht.

**Konsequenzen:** Alle Familiengeräte erhalten beim nächsten Öffnen denselben geprüften Katalog
kostenlos mit dem normalen App-Update. Neue Inhalte verändern bestehende Tagebuch-Snapshots nicht.
Weitere Mengen oder externe Importe benötigen weiterhin eine eigene Prüfung und Freigabe.

## ADR-039: Kurze Videos verwenden den nativen Dateiwähler und bleiben im Tagebucheintrag

**Status:** Angenommen (Sprint 22, 2026-09-01)

**Entscheidung:** Jede abgeschlossene Mission darf bis zu zehn komprimierte Fotos und genau ein
Video enthalten. Das Video wird vor dem Speichern über seine Metadaten auf höchstens drei Sekunden
und zusätzlich auf 15 MB geprüft. Aufnahme und Auswahl erfolgen über den nativen Apple-Dateiwähler
statt über `MediaRecorder`, weil dieser Weg auch auf dem alten iPad verfügbar ist. Die Daten-URL
wird als optionales Feld des vorhandenen `CompletionRating` gespeichert.

**Konsequenzen:** Es gibt keinen Upload, Server, Cloud-Dienst oder neue Berechtigung ausser der vom
Nutzer bewusst geöffneten Kamera beziehungsweise Mediathek. Medien bleiben profilbezogen und sind
automatisch in Sicherungen enthalten. Daten-URLs benötigen mehr Speicher als reine Texte; die sehr
kurze Dauer, Dateigrenze und ein Video pro Eintrag begrenzen das Risiko. Ein abgelehntes längeres
Video muss in der Kamera kürzer neu aufgenommen werden.
