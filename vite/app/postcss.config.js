// -----------------------------------------------------------
//  [*] PostCSS configuration
//
//  Nothing imports this file — Vite finds it by name and runs
//  the plugin chain over every stylesheet it bundles, which
//  here is only src/main.css (imported once by main.jsx), in
//  the dev server and the production build alike. The chain:
//    - tailwindcss  — Tailwind v3 as a PostCSS plugin: it
//                     expands the @tailwind / @apply
//                     directives of main.css and emits the
//                     utilities the JSX uses, configured by
//                     tailwind.config.js (which in turn reads
//                     src/config/theme.json)
//    - autoprefixer — vendor prefixes for the finished CSS
//
//  Order is load-bearing: autoprefixer must run AFTER
//  tailwindcss so it sees the generated utilities rather than
//  the bare directives. There is no browserslist config
//  anywhere (no .browserslistrc, no "browserslist" key in
//  package.json), so autoprefixer targets Browserslist's
//  built-in defaults.
//
//  ESM (`export default`), like every file in this package
//  ("type": "module").
// -----------------------------------------------------------

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
