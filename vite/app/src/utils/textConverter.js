// -----------------------------------------------------------
//  [*] textConverter — slug and plain-text helpers
//
//  Two pure string transforms shared by the components in
//  src/components/ — Breadcrumbs and SeoMeta: no state, no
//  React, and each turns a falsy input into '' instead of
//  throwing.
//
//  Split into (no root component — a utils module):
//
//    humanize — "-"/"_" → spaces, then Title Case
//    plainify — HTML → its visible text
// -----------------------------------------------------------







// -----------------------------------------------------------
// humanize
// -----------------------------------------------------------
//
// Slug → heading: "privatumo-politika" →
// "Privatumo Politika". Dashes and underscores become
// spaces, then every letter
// that does not follow a letter, digit or underscore is
// upper-cased — Unicode-aware, so "įmonė" → "Įmonė" and
// "Įrankis" stays as it is. Nothing is lower-cased, so
// "BDAR" survives and Title Case input passes through
// unchanged.
//
// Used by:
//   - components/Breadcrumbs — one label per URL segment
// -----------------------------------------------------------

export function humanize(content) {
  if (!content) return '';
  return String(content)
    .replace(/[-_]/g, ' ')
    .replace(/(^|[^\p{L}\p{N}_])(\p{L})/gu, (match, before, letter) => before + letter.toUpperCase());
}







// -----------------------------------------------------------
// plainify
// -----------------------------------------------------------
//
// Text for document.title and meta content attributes: the
// browser's own HTML parser reads the string and hands back
// its text content — tags are gone, every entity (named or
// numeric) is decoded, and a stray "<" in prose survives the
// way a browser would render it. Browser-only, like the rest
// of this SPA.
//
// Used by:
//   - components/SeoMeta — resolvedTitle / resolvedDesc,
//                          before they reach document.title
//                          and the tags
// -----------------------------------------------------------

export function plainify(content) {
  if (!content) return '';
  return new DOMParser().parseFromString(String(content), 'text/html').body.textContent || '';
}
