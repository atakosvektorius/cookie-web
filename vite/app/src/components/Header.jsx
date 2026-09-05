// -----------------------------------------------------------
//  [*] Header — the blurred sticky top bar
//
//  Rendered above every routed page: the Logo brand (a plain
//  <a> out to atakosvektorius.lt), the menu.json "main" links
//  and, below lg, a hamburger that opens them. config.json
//  settings.sticky_header (true) pins the bar to the top; the
//  translucent dark background and the backdrop blur are
//  inline styles, and translate3d(0,0,0) promotes the bar to
//  its own compositing layer — the usual fix for a
//  backdrop-filter that flickers on a sticky element.
//
//  The menu is data-driven: an item with `hasChildren`
//  becomes a hover dropdown, everything else a leaf Link.
//  menu.json has no such item today, so no dropdown renders.
//  The right-hand navigation_button is disabled in
//  config.json, so its slot renders empty.
//
//  The mobile menu is plain React state (`menuOpen`): the
//  hamburger toggles it, every link click closes it, and from
//  lg up `lg:flex` on the list shows the links regardless.
//
//  Two effects fire on every pathname change: scroll to the
//  top, and — if the URL carries a hash — scroll to that
//  element 300 ms later, giving the new page time to render.
//  Neither fires for a hash-only change, which is why the
//  shared click handler `smoothScroll` deals with "/#…" links
//  itself: it closes the mobile menu, navigates to Home when
//  needed, and smooth-scrolls to the anchor (or the top for
//  the bare "/#" that "Pradžia" uses). Ordinary page links
//  are left to react-router's Link.
//
//  Split into (root component last):
//
//    NavToggle        — the hamburger button (below lg)
//    NavDropdown      — a branch and its children
//    NavLeafLink      — one leaf link, underlined when active
//    NavigationButton — the right-hand CTA slot (disabled)
//    Header           — the bar itself (default export)
// -----------------------------------------------------------

// React + router
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Layout
import Logo from './Logo';

// Site config
import config from '@/config/config.json';
import menu from '@/config/menu.json';







// -----------------------------------------------------------
// NavToggle
// -----------------------------------------------------------
//
// The hamburger, shown below lg only (from lg up the links
// are laid out inline anyway). A plain button: the open /
// closed state lives in Header, this just reports clicks and
// swaps the icon. Tailwind's preflight strips the button
// chrome, so it renders as the bare icon.
//
// Used by:
//   - Header (below)
// -----------------------------------------------------------

function NavToggle({ open, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Meniu"
      aria-expanded={open}
      className="order-3 cursor-pointer flex items-center lg:hidden text-heading lg:order-1"
    >
      {open ? (
        <svg className="h-6 fill-current" viewBox="0 0 20 20">
          <title>Menu Close</title>
          <polygon
            points="11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2"
            transform="rotate(45 10 10)"
          />
        </svg>
      ) : (
        <svg className="h-6 fill-current" viewBox="0 0 20 20">
          <title>Menu Open</title>
          <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V15z" />
        </svg>
      )}
    </button>
  );
}







// -----------------------------------------------------------
// NavDropdown
// -----------------------------------------------------------
//
// A menu branch: the item's name with a chevron, and its
// `children` in a list that opens on hover (`group-hover`) —
// in-flow under the label on mobile (block on hover),
// absolutely positioned from lg up. The child links go
// through the same `smoothScroll` as the leaves. No entry in
// menu.json carries `hasChildren` today, so it renders for
// none of them.
//
// Used by:
//   - Header (below) — items with `hasChildren`
// -----------------------------------------------------------

function NavDropdown({ item, smoothScroll }) {
  return (
    <div className="group relative">

      <span className="inline-flex cursor-pointer items-center p-3 font-semibold text-heading transition lg:px-2 lg:py-3">
        {item.name}
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </span>
      <ul className="z-10 min-w-[180px] rounded bg-body p-4 shadow hidden group-hover:block lg:invisible lg:absolute lg:block lg:opacity-0 lg:group-hover:visible lg:group-hover:opacity-100">
        {item.children?.map((child) => (
          <li className="mb-2" key={child.url}>
            <Link
              to={child.url}
              onClick={(e) => smoothScroll(e, child.url)}
              className="block py-1 font-semibold text-text transition hover:text-primary"
            >
              {child.name}
            </Link>
          </li>
        ))}
      </ul>

    </div>
  );
}







// -----------------------------------------------------------
// NavLeafLink
// -----------------------------------------------------------
//
// One ordinary menu link. "Active" means the current pathname
// equals the link's path part (everything before "#", so
// "/#" → "/"), with or without a trailing slash — then
// `underline` is appended. Hover is white pill + black text.
// The inline style pins the horizontal padding to 20 px over
// p-3.
//
// Used by:
//   - Header (below) — every item without `hasChildren`
// -----------------------------------------------------------

function NavLeafLink({ item, pathname, smoothScroll }) {

  const path = item.url.split('#')[0];
  const active = pathname === path || pathname === `${path}/`;


  return (
    <Link
      onClick={(e) => smoothScroll(e, item.url)}
      to={item.url}
      style={{ paddingLeft: 20, paddingRight: 20 }}
      className={`block p-3 font-semibold text-heading transition lg:px-2 lg:py-3 hover:bg-white hover:text-black rounded-md ${
        active ? 'underline' : ''
      }`}
    >
      {item.name}
    </Link>
  );
}







// -----------------------------------------------------------
// NavigationButton
// -----------------------------------------------------------
//
// The right-hand call-to-action slot, fed by config.json
// `navigation_button`. The wrapper <div> always renders — it
// keeps its place in the navbar's flex order — while the <a>
// inside appears only when `enable` is true. It is false in
// this project's config, so the slot renders EMPTY today;
// flipping the flag brings the button back with no code
// change. A plain <a>, not a router Link: the link is
// external. The classes are the small outlined button
// (rounded-[4px], px-4 py-1.5, text-sm), desktop only.
//
// Used by:
//   - Header (below)
// -----------------------------------------------------------

function NavigationButton() {
  return (
    <div className="order-1 ml-auto flex items-center md:order-2 lg:ml-0">
      {config.navigation_button.enable && (
        <a
          className="hidden lg:inline-block rounded-[4px] border border-primary bg-transparent px-4 py-1.5 text-sm font-semibold capitalize text-primary transition hover:bg-primary hover:text-ink"
          href={config.navigation_button.link}
        >
          {config.navigation_button.label}
        </a>
      )}
    </div>
  );
}







// -----------------------------------------------------------
// Header (default export)
// -----------------------------------------------------------
//
// Used by:
//   - App.jsx — rendered above the routed page
// -----------------------------------------------------------

export default function Header() {

  const { main } = menu;
  const { settings } = config;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Mobile menu open / closed; irrelevant from lg up, where
  // the list is always shown
  const [menuOpen, setMenuOpen] = useState(false);


  // Every route change starts at the top of the new page
  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);


  // Deep links with a hash ("/#pradzia" arriving from
  // another page): the target element does not exist until
  // the new page has rendered, hence the 300 ms delay. Reads
  // window.location.hash rather than the router's hash, and
  // runs after the scroll-to-top above. Only re-runs when the
  // pathname changes — a hash-only change never gets here,
  // smoothScroll covers that case.
  useEffect(() => {
    const { hash } = window.location;
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      }
    }
  }, [pathname]);


  // Closes the mobile menu after a link click
  const closeNav = () => setMenuOpen(false);


  // Click handler shared by every menu link (leaves and
  // dropdown children). Plain page links are left to
  // react-router's Link, which navigates once. A "/#…" link
  // is handled here instead — default prevented, Home
  // navigated to when the visitor is elsewhere (the hash
  // effect above then scrolls once Home has rendered), and
  // a smooth scroll to the element, or to the very top for
  // the bare "/#" ("Pradžia").
  const smoothScroll = (e, href) => {
    closeNav();
    if (!href.startsWith('/#')) return;

    e.preventDefault();
    if (pathname !== '/') navigate(href);

    const id = href.substring(1);
    if (id !== '#') {
      const element = document.querySelector(id);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  return (
    <header
      className={`z-30 ${settings.sticky_header ? 'sticky top-0' : ''}`}
      style={{
        backgroundColor: 'rgba(20, 20, 20, 0.7)',
        WebkitBackdropFilter: 'blur(20px)',
        backdropFilter: 'blur(20px)',
        transform: 'translate3d(0,0,0)',
      }}
    >

      {/* The bar is the centred 1320 px column; the order-*
          classes on the toggle, menu and button rearrange
          them per breakpoint */}
      <nav className="relative mx-auto flex max-w-[1320px] flex-wrap items-center justify-between px-4">

        {/* Brand — an external <a> to atakosvektorius.lt, not
            a route */}
        <Logo />

        {/* Hamburger — below lg only */}
        <NavToggle open={menuOpen} onToggle={() => setMenuOpen((open) => !open)} />

        {/* Main menu — hidden below lg until the hamburger
            opens it (block), always inline from lg up */}
        <ul
          className={`${menuOpen ? 'block' : 'hidden'} order-3 w-full pb-6 text-center lg:order-1 lg:flex lg:w-auto lg:space-x-2 lg:pb-0 lg:text-left xl:space-x-8`}
        >
          {main.map((item) => (
            <li key={item.url}>
              {item.hasChildren ? (
                <NavDropdown item={item} smoothScroll={smoothScroll} />
              ) : (
                <NavLeafLink item={item} pathname={pathname} smoothScroll={smoothScroll} />
              )}
            </li>
          ))}
        </ul>

        <NavigationButton />

      </nav>

    </header>
  );
}
