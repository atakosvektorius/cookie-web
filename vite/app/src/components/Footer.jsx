// -----------------------------------------------------------
//  [*] Footer — the three-column site footer + copyright bar
//
//  Rendered by App.jsx under every route. The top row sits on
//  the tailwind-bootstrap-grid (`row` / `lg:col-*`, inside
//  the centred 1320 px column): the Logo link out to
//  atakosvektorius.lt on the left, the footer menu in the
//  middle and the Social icon row on the right. Below the lg
//  breakpoint the columns stack and centre. Everything shown
//  is data from src/config: menu.json "footer" (one link at
//  the moment, Privatumo Politika), social.json "main"
//  (github, linkedin, email) and config.json
//  params.copyright.
//
//  The copyright line is " © Atakos Vektorius, XXXX": XXXX is
//  swapped for the CURRENT year on every render (the
//  visitor's clock, new Date().getFullYear()) and rendered
//  as plain text.
//
//  Split into (root component last):
//
//    FooterMenu   — the menu.json "footer" links
//    CopyrightBar — the bottom border-t line with the year
//    Footer       — the <footer> itself (default export)
// -----------------------------------------------------------

// Router
import { Link } from 'react-router-dom';

// Layout
import Logo from './Logo';
import Social from './Social';

// Site config — src/config/*.json, bundled at build time
import config from '@/config/config.json';
import menu from '@/config/menu.json';
import social from '@/config/social.json';







// -----------------------------------------------------------
// FooterMenu
// -----------------------------------------------------------
//
// One inline <li> per menu.json "footer" entry, as router
// Links — the entries are SPA routes (/privatumo-politika
// today), so navigation stays client-side. Keyed by the
// Lithuanian label, which is unique within the list.
//
// Used by:
//   - Footer (below)
// -----------------------------------------------------------

function FooterMenu() {
  return (
    <ul>
      {menu.footer.map((item) => (
        <li className="m-3 inline-block" key={item.name}>
          <Link to={item.url}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}







// -----------------------------------------------------------
// CopyrightBar
// -----------------------------------------------------------
//
// Used by:
//   - Footer (below)
// -----------------------------------------------------------

function CopyrightBar() {

  const { copyright } = config.params;


  return (
    <div className="border-t border-border py-7">
      <div className="mx-auto max-w-[1320px] px-4 text-center text-text">
        {/* String.replace with a string pattern swaps only
            the FIRST XXXX — fine, the config has one */}
        <p>{copyright.replace('XXXX', String(new Date().getFullYear()))}</p>
      </div>
    </div>
  );
}







// -----------------------------------------------------------
// Footer (default export)
// -----------------------------------------------------------
//
// Used by:
//   - App.jsx — rendered below the routed page
// -----------------------------------------------------------

export default function Footer() {
  return (
    <footer className="bg-surface">

      {/* Three columns on lg (3 / 6 / 3), stacked and centred
          below it — the mb-8 / lg:mb-0 pairs are the stacked
          spacing. Logo is a plain <a> out of the SPA. */}
      <div className="mx-auto max-w-[1320px] px-4">
        <div className="row items-center py-10">
          <div className="mb-8 text-center lg:col-3 lg:mb-0 lg:text-left">
            <Logo />
          </div>
          <div className="mb-8 text-center lg:col-6 lg:mb-0">
            <FooterMenu />
          </div>
          {/* social.json "main" → Social → one DynamicIcon
              per entry; space-x-4 spaces them out */}
          <div className="mb-8 text-center lg:col-3 lg:mb-0 lg:text-right">
            <Social source={social.main} className="space-x-4" />
          </div>
        </div>
      </div>

      <CopyrightBar />

    </footer>
  );
}
