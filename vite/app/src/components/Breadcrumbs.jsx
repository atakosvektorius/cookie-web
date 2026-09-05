// -----------------------------------------------------------
//  [*] Breadcrumbs — the "Pradžia / Page" trail under a title
//
//  Built purely from the current URL: a fixed "Pradžia" root
//  crumb linking to "/", then one crumb per path segment
//  linking to that segment's prefix ("/a/b" → "/a", "/a/b").
//  Every crumb but the last is a router Link; the last one
//  is the current page and renders as plain text. No route
//  table is consulted, so any URL gets a trail.
//
//  Labels come from humanize() (utils/textConverter): "-"
//  and "_" become spaces and the first letter of every word
//  is upper-cased, Lithuanian letters included.
//
//  Split into (root component last):
//
//    buildCrumbs — pathname → [{ label, href }], root first
//    Breadcrumbs — the <nav> itself (default export)
// -----------------------------------------------------------

import { Link, useLocation } from 'react-router-dom';
import { humanize } from '@/utils/textConverter';







// -----------------------------------------------------------
// buildCrumbs
// -----------------------------------------------------------
//
// Splits the pathname on "/" (empty pieces dropped, so a
// trailing slash adds no crumb) and puts the fixed "Pradžia"
// root crumb in front. Each segment's href is the joined
// prefix up to and including that segment.
//
// Used by:
//   - Breadcrumbs (below)
// -----------------------------------------------------------

function buildCrumbs(pathname) {

  const paths = pathname.split('/').filter(Boolean);


  const parts = [{ label: 'Pradžia', href: '/' }];
  paths.forEach((segment, i) => {
    parts.push({ label: humanize(segment), href: `/${paths.slice(0, i + 1).join('/')}` });
  });


  return parts;
}







// -----------------------------------------------------------
// Breadcrumbs (default export)
// -----------------------------------------------------------
//
// `className` is forwarded to the <nav> — PageHeader passes
// the spacing ("mt-6") from outside. The explicit
// role="list"/"listitem" are not redundant: Tailwind's
// preflight resets list-style to none, and Safari/VoiceOver
// then stops treating such lists as lists unless the role is
// spelled out. Hrefs are unique along one trail, hence the
// keys.
//
// Used by:
//   - components/PageHeader — under the h1 (pages Pro,
//     PrivatumoPolitika)
// -----------------------------------------------------------

export default function Breadcrumbs({ className }) {

  const { pathname } = useLocation();
  const parts = buildCrumbs(pathname);


  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="inline-flex" role="list">
        {parts.map(({ label, href }, index) => (
          <li className="mx-1" role="listitem" key={href}>
            {/* Separator before every crumb but the root */}
            {index > 0 && <span className="inline-block mr-1">/</span>}
            {/* The last crumb is the current page — plain
                text, no link */}
            {index !== parts.length - 1 ? (
              <Link className="text-primary" to={href}>
                {label}
              </Link>
            ) : (
              <span className="text-text">{label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
