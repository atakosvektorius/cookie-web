// -----------------------------------------------------------
//  [*] PageHeader — the title band of the text pages
//
//  The hero of the prose pages (/pro, /privatumo-politika):
//  the page title inside a rounded vertical-gradient card,
//  with the breadcrumb trail under it. Breadcrumbs reads the
//  route itself (useLocation), so the only prop is `title`,
//  rendered verbatim. The card fades from the body black to
//  the surface grey (theme.json).
// -----------------------------------------------------------

import Breadcrumbs from './Breadcrumbs';







// -----------------------------------------------------------
// PageHeader (default export)
// -----------------------------------------------------------
//
// The bare <section> carries no class — the card's own py-14
// gives the band its height; the mx-auto max-w-[1320px]
// column centres it at 1320 px.
//
// Used by:
//   - pages/PrivatumoPolitika — title "Privatumo Politika"
//   - pages/Pro — title
//     "Profesionalus BDAR Atitikties Įrankis"
// -----------------------------------------------------------

export default function PageHeader({ title }) {
  return (
    <section>

      <div className="mx-auto max-w-[1320px] px-4 text-center">
        {/* Gradient card — body black into surface grey */}
        <div className="rounded-2xl bg-gradient-to-b from-body to-surface px-8 py-14">

          {/* Title — the h1 takes its size/font from the
              main.css element defaults, no class of its
              own */}
          <h1>{title}</h1>

          {/* Trail — className is forwarded to
              Breadcrumbs' <nav> */}
          <Breadcrumbs className="mt-6" />

        </div>
      </div>

    </section>
  );
}
