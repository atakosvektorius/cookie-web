// -----------------------------------------------------------
//  [*] SeoMeta — per-page title and social meta tags
//
//  Sits at the top of every page's JSX and renders nothing:
//  an effect writes document.title plus the description,
//  author, Open Graph and Twitter card tags straight into
//  document.head (no react-helmet). index.html ships only a
//  static description tag (for crawlers that run no
//  JavaScript); the first page visited updates it and CREATES
//  the rest, and every later page updates them in place —
//  they persist across client-side navigation and are never
//  removed on unmount. That is fine: every value has a
//  config.json fallback and every route renders a SeoMeta, so
//  a navigation always rewrites all eleven tags and nothing
//  stale survives.
//
//  Resolution (config = src/config/config.json):
//    title       — title || site.title, through plainify
//                  (HTML tags stripped, entities decoded)
//    description — description || metadata.meta_description,
//                  through plainify
//    image       — site.base_url + (image ||
//                  metadata.meta_image)
//    og:url      — site.base_url + pathname
//    author      — metadata.meta_author, as-is
//
//  Split into (root component last):
//
//    setMeta — find-or-create a <meta> tag, set its content
//    SeoMeta — per-page title/meta effect (default export)
// -----------------------------------------------------------

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import config from '@/config/config.json';
import { plainify } from '@/utils/textConverter';







// -----------------------------------------------------------
// setMeta
// -----------------------------------------------------------
//
// Finds the <meta attr="key"> tag in document.head or creates
// it on first use, then (re)sets its content — so each tag is
// created once per page load and updated in place on every
// later navigation. `attr` is "name" for the plain and
// Twitter tags and "property" for Open Graph, which is how
// each family is looked up by crawlers.
//
// Used by:
//   - SeoMeta (below)
// -----------------------------------------------------------

function setMeta(attr, key, content) {

  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}







// -----------------------------------------------------------
// SeoMeta (default export)
// -----------------------------------------------------------
//
//   <SeoMeta />                            — site defaults
//   <SeoMeta title="…" />                  — tab + og title
//   <SeoMeta title="…" description="…" />  — plus summary
//   <SeoMeta … image="/images/av/x.png" /> — own og image
//
// Used by:
//   - pages/Home              — no props, site defaults only
//   - pages/Tikrinti          — title + description
//   - pages/Apie              — title, description and image
//   - pages/Pro               — title + description
//   - pages/PrivatumoPolitika — title + description
//   - pages/NotFound          — title only
// -----------------------------------------------------------

export default function SeoMeta({ title, description, image }) {

  // Site-wide fallbacks come from config.json; pathname only
  // feeds og:url
  const { meta_image, meta_author, meta_description } = config.metadata;
  const { base_url } = config.site;
  const { pathname } = useLocation();


  const resolvedTitle = plainify(title || config.site.title);
  const resolvedDesc = plainify(description || meta_description);
  const resolvedImage = `${base_url}${image || meta_image}`;
  const resolvedUrl = `${base_url}${pathname}`;


  // Every write is idempotent, so StrictMode's double run in
  // dev just sets the same values twice
  useEffect(() => {
    document.title = resolvedTitle;

    setMeta('name', 'description', resolvedDesc);
    setMeta('name', 'author', meta_author);
    setMeta('property', 'og:title', resolvedTitle);
    setMeta('property', 'og:description', resolvedDesc);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', resolvedUrl);
    setMeta('property', 'og:image', resolvedImage);
    setMeta('name', 'twitter:title', resolvedTitle);
    setMeta('name', 'twitter:description', resolvedDesc);
    setMeta('name', 'twitter:image', resolvedImage);
    setMeta('name', 'twitter:card', 'summary_large_image');
  }, [resolvedTitle, resolvedDesc, resolvedImage, resolvedUrl, meta_author]);


  // Nothing to render — the work is the side effect above
  return null;
}
