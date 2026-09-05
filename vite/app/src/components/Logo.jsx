// -----------------------------------------------------------
//  [*] Logo — the "Aplankyti" link out to atakosvektorius.lt
//
//  The brand mark in the header's navbar and the footer's
//  left column: the word from config.site.logo_text next to
//  the Atakos Vektorius icon, wrapped in a plain <a> to
//  config.site.logo_url (https://atakosvektorius.lt). It is
//  deliberately NOT a router Link — the target is the parent
//  site, so a click is a full navigation away from the SPA.
//
//  Everything is read from config.json "site":
//    - logo — the image
//    - logo_width / logo_height — the icon's box in px,
//      stored as bare numbers ("50", "40")
//    - logo_text — "Aplankyti"; logo_url — the href;
//      title — the img alt
//
//  The word renders in the heading colour (white) at text-xl
//  font-semibold.
// -----------------------------------------------------------

import config from '@/config/config.json';







// -----------------------------------------------------------
// Logo (default export)
// -----------------------------------------------------------
//
// Used by:
//   - components/Header — the navbar brand
//   - components/Footer — the left column
// -----------------------------------------------------------

export default function Logo() {

  const { logo, logo_width, logo_height, logo_text, logo_url, title } = config.site;


  return (
    <a href={logo_url} className="inline-block text-xl font-semibold text-heading">
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div style={{ paddingRight: 5, paddingLeft: 5 }}>{logo_text}</div>
        {/* Sized by inline style from the config numbers;
            parseInt also tolerates a "50px"-style value and
            React appends the px */}
        <img
          src={logo}
          alt={title}
          style={{
            height: parseInt(logo_height, 10),
            width: parseInt(logo_width, 10),
            borderRadius: 10,
          }}
        />
      </div>
    </a>
  );
}
