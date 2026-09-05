// -----------------------------------------------------------
//  [*] Social — the footer's social-icon row
//
//  One <li> per social.json `main` entry: an external link
//  (new tab) wrapped around a react-icons glyph, the entry
//  name given to screen readers through aria-label. Each
//  item is a white h-9/w-9 square with an h-5/w-5 glyph; the
//  <ul> itself only gets whatever `className` the parent
//  passes — Footer passes "space-x-4" to space the squares
//  out.
//
//  Icon names ("FaGithub", "FaLinkedin", "FaEnvelope") are
//  resolved by DynamicIcon from react-icons/fa6 (^5 in
//  package.json); all three exist there.
//
//  Split into (root component last):
//
//    SocialItem — one <li>: external link + icon
//    Social     — the <ul> over `source` (default export)
// -----------------------------------------------------------

import DynamicIcon from './DynamicIcon';







// -----------------------------------------------------------
// SocialItem
// -----------------------------------------------------------
//
// Props are one social.json entry ({ name, icon, link }).
// `rel="noreferrer"` (which implies noopener) also lands on
// the mailto: entry — harmless.
//
// Used by:
//   - Social (below)
// -----------------------------------------------------------

function SocialItem({ name, icon, link }) {
  return (
    <li className="inline-block">
      <a
        aria-label={name}
        href={link}
        target="_blank"
        rel="noreferrer"
        className="flex h-9 w-9 items-center justify-center rounded bg-primary text-center leading-9 text-ink"
      >
        {/* react-icons spreads className onto the <svg> —
            that is how the inline-block and the h-5/w-5
            sizing reach it */}
        <DynamicIcon className="inline-block h-5 w-5" icon={icon} />
      </a>
    </li>
  );
}







// -----------------------------------------------------------
// Social (default export)
// -----------------------------------------------------------
//
// `source` is the social.json `main` array; entry names are
// unique lowercase slugs ("github", "linkedin", "email"),
// hence they double as the React key.
//
// Used by:
//   - components/Footer — the icon row in the right-hand
//     column (source = social.json main, className
//     "space-x-4")
// -----------------------------------------------------------

export default function Social({ source, className }) {
  return (
    <ul className={className}>
      {source.map((social) => (
        <SocialItem key={social.name} name={social.name} icon={social.icon} link={social.link} />
      ))}
    </ul>
  );
}
