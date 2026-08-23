/// <reference types="vitest/config" />
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

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
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        id: '/',
        name: 'Crazy Lab',
        short_name: 'Crazy Lab',
        description:
          'Geheimnisvolles Labor für Getränke, Basteleien, Experimente und Foto-Challenges.',
        lang: 'de',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#071018',
        theme_color: '#071018',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
      },
    }),
  ],
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
