/// <reference types="vitest/config" />
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const certDir = fileURLToPath(new URL('./certs', import.meta.url))
const certFile = `${certDir}/crazylab-cert.pem`
const keyFile = `${certDir}/crazylab-key.pem`

/**
 * Lokal per `mkcert` erzeugtes, vertrauenswürdiges HTTPS-Zertifikat für die LAN-IP dieses Macs
 * (siehe README.md, Abschnitt "Installation auf dem iPhone"). Mehrere Browser-APIs
 * (`crypto.randomUUID`, Service-Worker-Registrierung) funktionieren sonst nicht, weil eine
 * reine HTTP-Netzwerk-IP kein "sicherer Kontext" ist (siehe DECISIONS.md ADR-006).
 * Fehlen die Zertifikatsdateien (z. B. frischer Checkout ohne `mkcert`-Setup), läuft der Server
 * ganz normal über HTTP weiter.
 */
const https =
  existsSync(certFile) && existsSync(keyFile)
    ? { cert: readFileSync(certFile), key: readFileSync(keyFile) }
    : undefined

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https,
    host: true,
  },
  preview: {
    https,
    host: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
