// -----------------------------------------------------------
//  [*] Vite configuration
//
//  Read for both `vite build` (dist/ is copied into the
//  slapukai-vite Caddy image, served with an SPA fallback)
//  and `vite dev` (Dockerfile.dev). Tailwind v3 is NOT a
//  plugin here — postcss.config.js brings it in, and Vite
//  picks that file up on its own.
//
//  Plugins:
//    - react — JSX + fast refresh
//
//  Also sets up:
//    - '@' → src alias — App.jsx, every page and the
//      config-reading components import through it
//      ('@/components/...', '@/config/config.json');
//      jsconfig.json mirrors it for the editor. Resolved
//      from import.meta.url, which is what an ESM config
//      file has (package.json is "type": "module").
//    - dev server on 0.0.0.0:80 — the "Dev" toggles in
//      docker-compose.yml swap the slapukai-vite service to
//      Dockerfile.dev (./vite/app mounted); the endpoint
//      Caddy keeps proxying to slapukai-vite:80 as in prod.
//      allowedHosts: true lets the public hostname the
//      endpoint forwards as Host through Vite's host check,
//      which otherwise admits only localhost, *.localhost and
//      IP literals. The `server` block is dev-only —
//      production is Caddy's file_server, never this process.
// -----------------------------------------------------------

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 80,
    allowedHosts: true,
  },
});
