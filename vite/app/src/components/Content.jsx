// -----------------------------------------------------------
//  [*] Content — the prose wrapper of the text pages
//
//  One <div> carrying @tailwindcss/typography's `prose` plus
//  the site's re-theming of it: paragraph, link, strong, list
//  and table colours from the palette, heading sizes from the
//  text-h* scale, the bordered rounded table. The pages put
//  bare <p> / <h4> / <ul> / <table> markup inside and this is
//  where its look comes from — Apie, Pro, PrivatumoPolitika
//  and Tikrinti's pending / results screens.
//
//  Precedence: the `prose-*` modifiers are utilities, so they
//  beat the plugin's own `.prose` rules (components layer),
//  and a `hover:` variant beats its plain twin.
//
//  Split into (root component last):
//
//    CONTENT_CLASSES — the prose class list, one group a line
//    Content         — the wrapper <div> (default export)
// -----------------------------------------------------------







// -----------------------------------------------------------
// CONTENT_CLASSES
// -----------------------------------------------------------
//
// `prose max-w-none` first (the plugin's 65ch cap is lifted),
// then one line per element family. The table lines draw the
// border as a ::before overlay on the <table>; relative +
// z-10 on th/td keep the cell text above it and selectable.
//
// Used by:
//   - Content (below)
// -----------------------------------------------------------

const CONTENT_CLASSES = [
  'prose max-w-none',
  'prose-headings:mb-[.3em] prose-headings:mt-[.6em]',
  'prose-h1:text-h1-sm md:prose-h1:text-h1',
  'prose-h2:text-h2-sm md:prose-h2:text-h2',
  'prose-h3:text-h3-sm md:prose-h3:text-h3',
  'prose-img:max-w-full prose-img:rounded',
  'prose-hr:border-border',
  'prose-p:text-base prose-p:text-text',
  'prose-blockquote:rounded-lg prose-blockquote:border prose-blockquote:border-l-[10px] prose-blockquote:border-primary prose-blockquote:bg-surface prose-blockquote:px-8 prose-blockquote:py-10 prose-blockquote:font-secondary prose-blockquote:text-2xl prose-blockquote:not-italic prose-blockquote:text-text',
  'prose-pre:rounded-lg prose-pre:bg-surface',
  'prose-code:px-1 prose-code:text-primary',
  'prose-strong:text-text',
  'prose-a:text-text prose-a:underline hover:prose-a:text-primary',
  'prose-li:text-text',
  'prose-table:relative prose-table:overflow-hidden prose-table:rounded-lg prose-table:before:absolute prose-table:before:left-0 prose-table:before:top-0 prose-table:before:h-full prose-table:before:w-full prose-table:before:rounded-[inherit] prose-table:before:border prose-table:before:border-border prose-table:before:content-[""]',
  'prose-thead:border-border prose-thead:bg-surface',
  'prose-th:relative prose-th:z-10 prose-th:px-4 prose-th:py-[18px] prose-th:text-text',
  'prose-tr:border-border',
  'prose-td:relative prose-td:z-10 prose-td:px-3 prose-td:py-[18px] prose-td:text-text',
].join(' ');







// -----------------------------------------------------------
// Content (default export)
// -----------------------------------------------------------
//
// Used by:
//   - pages/Apie — the company prose
//   - pages/Pro — the pitch prose
//   - pages/PrivatumoPolitika — the policy
//   - pages/Tikrinti — ShowPendingCheck and ShowResults
// -----------------------------------------------------------

export default function Content({ children }) {
  return <div className={CONTENT_CLASSES}>{children}</div>;
}
