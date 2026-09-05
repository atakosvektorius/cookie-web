// -----------------------------------------------------------
//  [*] Entry point — mounts <App /> into #root
//
//  The one script index.html loads. Startup is a SINGLE
//  synchronous step — nothing is fetched before the first
//  paint: the site config is bundled JSON (src/config/*),
//  so createRoot(...).render(...) runs on module load and
//  App.jsx (BrowserRouter with Header/Footer around the
//  routed pages) takes it from there. Deep links such as
//  /tikrinti still land here: the slapukai-vite Caddy
//  falls back to /index.html for any unknown path (Vite's
//  dev server does the same).
//
//  <React.StrictMode> is a dev-only aid — it double-invokes
//  renders and effects to flush out impure ones, and is a
//  no-op in the production build. Safe here: nothing
//  fetches on mount, and SeoMeta's effect is idempotent (it
//  looks each meta tag up before creating it, so the second
//  pass only rewrites `content`).
//
//  main.css is imported ONCE, here — the single global
//  stylesheet: the three Tailwind layers, the @font-face
//  rules for the self-hosted Heebo and Signika (files in
//  public/fonts) and the element defaults (body, headings).
//  Everything else is Tailwind classes on the components;
//  the family names behind font-primary / font-secondary
//  come from src/config/theme.json via tailwind.config.js.
//
//  Used by:
//    - index.html — its one <script type="module"> tag
// -----------------------------------------------------------

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './main.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
