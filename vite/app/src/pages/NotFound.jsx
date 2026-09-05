// -----------------------------------------------------------
//  [*] NotFound — the CRT-terminal 404 page
//
//  Rendered for every URL the route table does not know
//  (App.jsx route "*"). It is a SOFT 404: the slapukai-vite
//  Caddy answers any unknown path with /index.html and HTTP
//  200 (try_files), so "page not found" is decided here in
//  the browser and crawlers never see a 404 status.
//
//  The look — green text on the dark page, scanlines and a
//  sweeping CRT beam — is carried entirely by the CSS string
//  below, rendered through an inline <style>. React 18 keeps
//  that <style> exactly where it is written — inside <main>,
//  right before the section (SeoMeta itself renders nothing
//  there, it writes to <head>) — so it is a GLOBAL stylesheet
//  while this page is mounted, and it leaves with the page.
//  The nf- prefix on every selector (and on the keyframes) is
//  the only thing keeping it clear of main.css and Tailwind.
//
//  The one way out is a router Link to "/" — a client-side
//  navigation, the SPA stays loaded.
//
//  Split into (root component last):
//
//    notFoundStyles — the CRT CSS string, rendered as <style>
//    NotFound       — SEO, <style>, terminal (default export)
// -----------------------------------------------------------

import { Link } from 'react-router-dom';
import SeoMeta from '@/components/SeoMeta';







// -----------------------------------------------------------
// notFoundStyles
// -----------------------------------------------------------
//
// One CSS string that NotFound renders as <style>{…}</style>.
// The rules are global while the page is mounted, so every
// selector and the keyframe name carry the nf- prefix — that
// prefix is the whole scoping mechanism; nothing else
// isolates them. Layers, back to front:
//
//   .nf-overlay  — the scanlines, painted OVER the text but
//                  transparent to the pointer, so the link
//                  under them still takes clicks.
//   ::before     — the CRT beam: a thin green band with a
//                  soft tail that the nf-scan keyframes move
//                  from -100vh to +100vh (top to bottom)
//                  during the first 35 % of a 7.5 s cycle —
//                  a ~2.6 s sweep, then ~4.9 s resting off
//                  the bottom edge before the next pass.
//   .nf-terminal — the 1000 px (max 100 %) text column, 4 rem
//                  padding. Its text-transform: uppercase is
//                  why the sentence-case Lithuanian source
//                  reads as CAPITALS on screen.
//
// The overlay is position: absolute at 100 % × 100 %, but it
// is a SIBLING of .nf-terminal, not its child, so the
// terminal's position: relative does not contain it — and no
// ancestor is positioned at all (.row and the centred column
// set no position, nor do <main> or App's shell div), so it
// sizes against the initial containing block: one viewport
// wide and one viewport tall, anchored at its static position
// at the top of the row.
//
// The prompt dressing is generated content: every .nf-output
// paragraph is prefixed "> " and links inside the terminal
// are wrapped in "[" … "]" — none of that text is in the JSX.
//
// Used by:
//   - NotFound (below)
// -----------------------------------------------------------

const notFoundStyles = `
  .nf-overlay {
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    background-size: auto 4px;
    z-index: 1;
  }
  .nf-overlay::before {
    content: "";
    pointer-events: none;
    position: absolute;
    display: block;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 100%; height: 100%;
    background-image: linear-gradient(
      0deg,
      transparent 0%,
      rgba(32, 128, 32, 0.2) 2%,
      rgba(32, 128, 32, 0.8) 3%,
      rgba(32, 128, 32, 0.2) 3%,
      transparent 100%
    );
    background-repeat: no-repeat;
    animation: nf-scan 7.5s linear 0s infinite;
  }
  @keyframes nf-scan {
    0% { background-position: 0 -100vh; }
    35%, 100% { background-position: 0 100vh; }
  }
  .nf-terminal {
    box-sizing: inherit;
    position: relative;
    height: 100%;
    width: 1000px;
    max-width: 100%;
    padding: 4rem;
    text-transform: uppercase;
  }
  .nf-output {
    color: rgba(128, 255, 128, 0.8);
    text-shadow: 0 0 1px rgba(51, 255, 51, 0.4), 0 0 2px rgba(255, 255, 255, 0.8);
  }
  .nf-output::before { content: "> "; }
  .nf-terminal a { color: #fff; text-decoration: none; }
  .nf-terminal a::before { content: "["; }
  .nf-terminal a::after { content: "]"; }
  .nf-errorcode { color: white; }
`;







// -----------------------------------------------------------
// NotFound (default export)
// -----------------------------------------------------------
//
// Used by:
//   - App.jsx — route "*"
// -----------------------------------------------------------

export default function NotFound() {
  return (
    <>
      {/* Tab title only — description and image fall back to
          config.json metadata. SeoMeta updates the tags in
          place, so they survive client-side navigation */}
      <SeoMeta title="Puslapis Nerastas" />

      {/* Global stylesheet while mounted — see
          notFoundStyles */}
      <style>{notFoundStyles}</style>

      {/* Section — py-28 xl:py-32 is the band's vertical
          padding, the inline 70vh its minimum presence on a
          tall viewport */}
      <section className="py-28 xl:py-32 text-left" style={{ height: '70vh' }}>

        <div className="mx-auto max-w-[1320px] px-4">

          {/* row = the tailwind-bootstrap-grid flex row, so
              justify-center centres the 1000 px terminal */}
          <div className="row justify-center">

            {/* Scanline overlay — a sibling of the terminal,
                not a child (see notFoundStyles) */}
            <div className="nf-overlay" />

            <div className="nf-terminal">

              <h1>
                Ups... <span className="nf-errorcode">404</span>
              </h1>

              {/* The <br />s ARE the vertical spacing —
                  Tailwind preflight zeroes h1/p margins and
                  the terminal sets none */}
              <br />
              <p className="nf-output">
                Rodos, šis sausainiukas iškrito iš dėžutės. Puslapis, kurį bandote rasti, nėra arba
                jis pasilėpęs.
              </p>
              <p className="nf-output">
                Nesibaiminkite, kartais ir sausainiukams patinka pasislėpti.
              </p>
              <br />
              <p className="nf-output">
                Nors puslapis dingo kaip sausainiukas prie arbatos, mes tikimės, kad Jūsų diena bus
                saldi!
              </p>
              <br />
              <br />

              {/* Router Link home; the "[ ]" around the link
                  text is CSS generated content */}
              <p className="nf-output">
                <Link to="/">užsukite į pradinį puslapį</Link>.
              </p>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}
