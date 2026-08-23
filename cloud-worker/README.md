# Crazy Lab - Cloud-Sync-Worker

Winziger Cloudflare Worker, der genau zwei Dinge kann: einen JSON-Blob unter einem geheimen
Schlüssel speichern (`PUT /:key`) und wieder auslesen (`GET /:key`). Das ist die Cloud-Gegenseite
zum automatischen Backup in der App (siehe `../DECISIONS.md`, ADR-019). Kein Login, keine
Nutzerverwaltung - der lange, zufällige Schlüssel selbst ist das einzige "Passwort".

## Einmaliges Setup (nur beim allerersten Mal nötig)

1. Falls noch nicht vorhanden: kostenloses Konto auf https://dash.cloudflare.com/sign-up
   anlegen (keine Kreditkarte nötig für die genutzte Free-Stufe).
2. In diesem Ordner (`cloud-worker/`):
   ```bash
   npm install
   npx wrangler login
   ```
   Das öffnet den Browser - dort einloggen bzw. das neue Konto bestätigen.
3. Eine KV-Datenbank (der eigentliche Speicherplatz) anlegen:
   ```bash
   npx wrangler kv namespace create CRAZYLAB_KV
   ```
   Die Ausgabe enthält eine `id = "..."` - diese in `wrangler.toml` bei
   `REPLACE_WITH_KV_NAMESPACE_ID` eintragen.
4. Deployen:
   ```bash
   npm run deploy
   ```
   Die Ausgabe zeigt die fertige URL, z. B. `https://crazylab-sync.<dein-name>.workers.dev`.

## Nach dem Deployen: App verbinden

In `../.env.local` (im Hauptordner, nicht hier - Datei ggf. neu anlegen, siehe
`../.env.local.example`) eintragen:

```
VITE_CLOUD_SYNC_URL=https://crazylab-sync.<dein-name>.workers.dev
VITE_CLOUD_SYNC_KEY=<ein langer, zufälliger Schlüssel>
```

Einen zufälligen Schlüssel erzeugen z. B. mit:

```bash
openssl rand -hex 24
```

Danach die App neu bauen (`npm run build`) bzw. den Dev-/Preview-Server neu starten, damit die
neuen Umgebungsvariablen greifen.

## Spätere Änderungen

Nach jeder Änderung an `src/worker.ts` erneut `npm run deploy` ausführen - die URL und der
`VITE_CLOUD_SYNC_KEY` bleiben dabei gleich.
