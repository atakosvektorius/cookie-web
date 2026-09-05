// -----------------------------------------------------------
//  [*] DynamicIcon — a react-icons icon picked by its name
//
//  social.json stores each social link's icon as the bare
//  react-icons export name ("FaGithub", "FaLinkedin",
//  "FaEnvelope"); Social hands that string here and gets the
//  rendered icon back, so adding a link to the Footer's icon
//  row is a JSON edit, not a code change. The name's leading
//  capitalised word ("Fa") selects the icon set, then the
//  full name is looked up inside that set.
//
//  Only Font Awesome 6 (react-icons/fa6) is registered. A
//  name from any other set, a typo or a wrong-case name
//  renders nothing and logs a console warning, so a broken
//  entry never shows visitors placeholder text.
//
//  The namespace import pulls the WHOLE fa6 set into the
//  bundle: a lookup by runtime string cannot be tree-shaken.
//  That is the price of JSON-driven icon names.
//
//  Split into (root component last):
//
//    getIconLibrary — "FaGithub" → iconLibraries.fa
//    DynamicIcon    — resolve + render (default export)
// -----------------------------------------------------------

import * as FaIcons6 from 'react-icons/fa6';


// Icon sets keyed by the lowercase name prefix getIconLibrary
// derives — only "fa" (Font Awesome 6) is registered; another
// react-icons set must be added here before its names work
const iconLibraries = { fa: FaIcons6 };







// -----------------------------------------------------------
// getIconLibrary
// -----------------------------------------------------------
//
// The registry key is the name's first capitalised word,
// lowercased — "FaGithub" → "fa", "FaEnvelope" → "fa".
// Returns the icon-set namespace, or undefined for a missing
// name, a name without a leading capital or a prefix that is
// not in iconLibraries.
//
// Used by:
//   - DynamicIcon (below)
// -----------------------------------------------------------

function getIconLibrary(icon) {

  const prefix = /^[A-Z][a-z]*/.exec(icon ?? '');


  return prefix ? iconLibraries[prefix[0].toLowerCase()] : undefined;
}







// -----------------------------------------------------------
// DynamicIcon (default export)
// -----------------------------------------------------------
//
// `icon` is the react-icons export name, looked up with its
// exact case ("FaGithub", not "FaGitHub"). Every other prop
// is forwarded to the icon component — Social's className
// lands on the <svg>.
//
// Used by:
//   - components/Social — one icon per social.json entry
// -----------------------------------------------------------

export default function DynamicIcon({ icon, ...props }) {

  const IconLibrary = getIconLibrary(icon);
  const Icon = IconLibrary ? IconLibrary[icon] : undefined;


  // Both misses land here: an unregistered set and a name the
  // set does not export. Nothing renders; the warning names
  // the offending JSON value
  if (!Icon) {
    console.warn(`DynamicIcon: no icon named "${icon}"`);
    return null;
  }


  return <Icon {...props} />;
}
