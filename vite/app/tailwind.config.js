// -----------------------------------------------------------
//  [*] Tailwind configuration — theme.json as utilities
//
//  Tailwind v3, loaded by the `tailwindcss` PostCSS plugin
//  (postcss.config.js). The colour and type tokens are
//  DERIVED from src/config/theme.json here, at build time —
//  nothing in src/ reads that file:
//    - colors     — the one dark palette: body, surface,
//                   border, text, heading, muted, ink and
//                   primary (text-text, bg-surface …)
//    - fontSize   — text-base (16px) and the heading scale
//                   text-h1 … text-h6, with 80 % -sm sizes
//                   for h1–h3
//    - fontFamily — font-primary (Heebo), font-secondary
//                   (Signika); the families are self-hosted:
//                   @font-face in main.css, files in
//                   public/fonts
//
//  Knobs that do NOT come from theme.json: screens (sm at
//  540 px where Tailwind's stock is 640; md 768 is where
//  Home shows the hero GIF and the -sm heading sizes end),
//  boxShadow.custom (the white glow on /apie's image) and
//  the fade-out animation of SubscribeForm's success line.
//  Tailwind's core .container is unused: the pages centre
//  themselves with mx-auto max-w-[1320px] px-4.
//
//  Plugins:
//    - typography     — the `prose` behind the Content
//                       wrapper (components/Content.jsx)
//    - forms          — no options, so BOTH strategies run:
//                       the base reset for the two FORM_INPUT
//                       fields (Tikrinti's domain box,
//                       SubscribeForm's e-mail field), plus
//                       the class half (.form-input etc.),
//                       which nothing in the markup uses
//    - bootstrap-grid — .row / .col-* (generateContainer:
//                       false). gridGutterWidth 2rem is the
//                       gutter every .row's negative margins
//                       and column padding come from (Home,
//                       Apie, Footer, Tikrinti). Every column
//                       class carries a breakpoint prefix
//                       (md:col-N, lg:col-N …)
//
//  An ES module like the rest of the package; Tailwind loads
//  it through jiti, which also resolves the theme.json
//  import.
//
//  Used by:
//    - postcss.config.js — its tailwindcss plugin finds this
//      file by its default name; the tokens surface through
//      main.css's element defaults (@apply) and the classes
//      in the JSX
// -----------------------------------------------------------

import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import bootstrapGrid from "tailwind-bootstrap-grid";
import theme from "./src/config/theme.json";


// Heading scale: h6 is 1 rem, every step up multiplies by
// theme.json font_size.scale (1.25 → h5 1.25, h4 1.56, h3
// 1.95, h2 2.44, h1 3.05 rem). base is the bare string "16";
// parseFloat also accepts "16px"
const font_base = parseFloat(theme.fonts.font_size.base);
const font_scale = parseFloat(theme.fonts.font_size.scale);
const h6 = 1;
const h5 = h6 * font_scale;
const h4 = h5 * font_scale;
const h3 = h4 * font_scale;
const h2 = h3 * font_scale;
const h1 = h2 * font_scale;


// Family names as main.css declares them, each with its
// generic fallback
const { primary, primary_type, secondary, secondary_type } = theme.fonts.font_family;


export default {
  // JSX plus index.html is the whole scan: the JSONs under
  // src/config carry no class names and main.css only
  // @applies element defaults. The scanner reads comments
  // too, so a class-like word in a comment costs an unused
  // utility
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    // sm is set earlier than Tailwind's stock breakpoint; md
    // is where Home's hero GIF appears (hidden md:block) and
    // the -sm heading sizes switch off
    screens: {
      sm: "540px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      // White-tinted glow — a dark shadow is invisible on the
      // black page. One consumer: the image on /apie
      boxShadow: {
        custom:
          "5px 10px 15px 3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05)",
      },
      // theme.json colors become utilities one to one:
      // bg-body, bg-surface, border-border, text-text,
      // text-heading, text-muted, text-ink, bg-primary …
      colors: theme.colors,
      // Overriding base with a bare string drops Tailwind's
      // default [size, lineHeight] pair, so text-base sets
      // the font-size only (body carries leading-relaxed
      // itself). The heading utilities feed main.css's h1–h6
      // defaults, Content's prose-h* overrides and Apie's
      // greeting; -sm is the below-md size of h1–h3
      fontSize: {
        base: font_base + "px",
        h1: h1 + "rem",
        "h1-sm": h1 * 0.8 + "rem",
        h2: h2 + "rem",
        "h2-sm": h2 * 0.8 + "rem",
        h3: h3 + "rem",
        "h3-sm": h3 * 0.8 + "rem",
        h4: h4 + "rem",
        h5: h5 + "rem",
        h6: h6 + "rem",
      },
      // body → font-primary and headings → font-secondary in
      // main.css; Content's blockquotes → font-secondary
      fontFamily: {
        primary: [primary, primary_type],
        secondary: [secondary, secondary_type],
      },
      // SubscribeForm's success line fades over the 5 s it is
      // shown (SUCCESS_VISIBLE_MS there) and stays invisible
      // until it unmounts
      keyframes: {
        fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        "fade-out": "fadeOut 5s forwards",
      },
    },
  },
  // typography (Content's prose), forms (the input reset) and
  // the bootstrap grid — see the header's Plugins list
  plugins: [
    typography,
    forms,
    bootstrapGrid({
      generateContainer: false,
      gridGutterWidth: "2rem",
    }),
  ],
};
