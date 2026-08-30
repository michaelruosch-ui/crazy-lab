import { createServer } from 'node:https'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const projectDir = resolve(import.meta.dirname, '..')
const backupDir = resolve(projectDir, 'local-backups')
const certFile = resolve(projectDir, 'certs/crazylab-cert.pem')
const keyFile = resolve(projectDir, 'certs/crazylab-key.pem')
const latestFile = resolve(backupDir, 'latest.json')
const port = 4175
const backupToken = process.env.CRAZYLAB_BACKUP_TOKEN
const allowedOrigins = new Set(
  (process.env.CRAZYLAB_ALLOWED_ORIGINS ?? 'https://192.168.1.106:4173')
    .split(',')
    .map((origin) => origin.trim()),
)

if (!existsSync(certFile) || !existsSync(keyFile)) {
  throw new Error('Lokale HTTPS-Zertifikate fehlen im Ordner certs/.')
}
if (!backupToken) throw new Error('CRAZYLAB_BACKUP_TOKEN fehlt.')
mkdirSync(backupDir, { recursive: true })

function send(response, status, body = '', origin) {
  response.writeHead(status, {
    ...(origin && allowedOrigins.has(origin) ? { 'access-control-allow-origin': origin } : {}),
    'access-control-allow-methods': 'GET, PUT, OPTIONS',
    'access-control-allow-headers': 'authorization, content-type',
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8',
  })
  response.end(body)
}

createServer({ cert: readFileSync(certFile), key: readFileSync(keyFile) }, (request, response) => {
  const origin = request.headers.origin
  if (origin && !allowedOrigins.has(origin)) {
    return send(response, 403, '{"error":"Origin nicht erlaubt"}')
  }
  if (request.method === 'OPTIONS') return send(response, 204, '', origin)
  if (request.url !== '/backup') {
    return send(response, 404, '{"error":"Nicht gefunden"}', origin)
  }
  if (request.headers.authorization !== `Bearer ${backupToken}`) {
    return send(response, 401, '{"error":"Nicht autorisiert"}', origin)
  }

  if (request.method === 'GET') {
    if (!existsSync(latestFile)) {
      return send(response, 404, '{"error":"Noch kein Backup"}', origin)
    }
    return send(response, 200, readFileSync(latestFile, 'utf8'), origin)
  }

  if (request.method !== 'PUT') {
    return send(response, 405, '{"error":"Methode nicht erlaubt"}', origin)
  }
  let body = ''
  request.setEncoding('utf8')
  request.on('data', (chunk) => {
    body += chunk
    if (body.length > 5_000_000) request.destroy()
  })
  request.on('end', () => {
    try {
      const backup = JSON.parse(body)
      if (backup?.format !== 'crazylab-backup' || backup?.version !== 1) {
        return send(response, 400, '{"error":"Ungültiges Backup"}', origin)
      }
      const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
      const temporaryFile = resolve(backupDir, '.latest.tmp')
      writeFileSync(temporaryFile, JSON.stringify(backup, null, 2), { mode: 0o600 })
      renameSync(temporaryFile, latestFile)
      writeFileSync(
        resolve(backupDir, `backup-${timestamp}.json`),
        JSON.stringify(backup, null, 2),
        {
          mode: 0o600,
        },
      )
      send(response, 204, '', origin)
    } catch {
      send(response, 400, '{"error":"Ungültiges JSON"}', origin)
    }
  })
}).listen(port, '0.0.0.0', () => {
  console.log(`Crazy-Lab-Sicherung läuft auf https://192.168.1.106:${port}/backup`)
})
