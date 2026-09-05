// -----------------------------------------------------------
//  [*] uiClasses — the shared Tailwind class strings
//
//  The three looks that recur across components, as plain
//  strings so every element still reads as Tailwind on the
//  spot (no stylesheet recipes): the two button variants
//  and the big search / e-mail input. Extra utilities are
//  appended per use (`${BTN_PRIMARY} rounded-l-none`); a
//  side-specific radius such as rounded-l-none comes after
//  the base `rounded` in Tailwind's output, so it wins.
//
//  Split into (no root component — a constants module):
//
//    BTN_PRIMARY — white filled button
//    BTN_OUTLINE — white outlined button, fills on hover
//    FORM_INPUT  — the full-width pill input
// -----------------------------------------------------------







// -----------------------------------------------------------
// BTN_PRIMARY
// -----------------------------------------------------------
//
// The filled button: primary (white) fill and border, ink
// (near-black) label. `capitalize` title-cases the label in
// display only.
//
// Used by:
//   - pages/Home — the feature-section links
//   - pages/Tikrinti — the search submit
//   - components/SubscribeForm — the e-mail submit
// -----------------------------------------------------------

export const BTN_PRIMARY =
  'inline-block rounded border border-primary bg-primary px-5 py-2 font-semibold capitalize text-ink transition';







// -----------------------------------------------------------
// BTN_OUTLINE
// -----------------------------------------------------------
//
// The outlined button: primary border and label on
// transparent, inverting to a primary fill with ink text on
// hover.
//
// Used by:
//   - pages/Home — the hero "Tikrinti domeną" link
//   - pages/Tikrinti — the external article link
// -----------------------------------------------------------

export const BTN_OUTLINE =
  'inline-block rounded border border-primary bg-transparent px-5 py-2 font-semibold capitalize text-primary transition hover:bg-primary hover:text-ink';







// -----------------------------------------------------------
// FORM_INPUT
// -----------------------------------------------------------
//
// The full-width pill input that sits flush against a
// BTN_PRIMARY submit (each use adds rounded-r-none, the
// button rounded-l-none). @tailwindcss/forms resets the raw
// input with a grey border that turns blue on focus plus a
// focus ring; focus:border-border and focus:ring-transparent
// keep the palette border and no ring on focus.
//
// Used by:
//   - pages/Tikrinti — the domain box
//   - components/SubscribeForm — the e-mail field
// -----------------------------------------------------------

export const FORM_INPUT =
  'w-full rounded border-border bg-surface px-6 py-4 text-text placeholder:text-muted focus:border-border focus:ring-transparent';
