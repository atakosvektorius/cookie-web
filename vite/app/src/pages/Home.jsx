// -----------------------------------------------------------
//  [*] Home — the landing page
//
//  Route "/": a full-viewport hero — title, tagline, the
//  "Tikrinti domeną" button and the animated GIF — followed
//  by two image + text feature sections that lead on to
//  /tikrinti and /pro. All copy sits in the two config tables
//  at the top of the file: HomeHero reads `banner` directly,
//  HomeFeature gets one `features` entry as a prop.
//  <SeoMeta /> is rendered without props, so the tab title
//  and description fall back to config.json (site.title,
//  metadata.meta_description).
//
//  Layout facts worth knowing:
//    - the hero is sized with inline styles (90vw × 100vh),
//      not Tailwind classes
//    - `banner.video` is a GIF shown in an <img>; its
//      wrapper is `hidden md:block`, so the mobile hero is
//      text only
//    - feature sections alternate the image side and the
//      FEATURE_GRADIENT background by index parity; the
//      image column's mb-6 gap applies only while the
//      columns are stacked (md:mb-0 from md up)
//
//  Split into (root component last):
//
//    features    — copy for the two feature sections
//    HomeHero    — the full-viewport hero with the GIF
//    HomeFeature — one image + text + check-list section
//    Home        — SEO tags, hero, features (default export)
// -----------------------------------------------------------

import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa6';
import SeoMeta from '@/components/SeoMeta';
import { BTN_PRIMARY, BTN_OUTLINE } from '@/utils/uiClasses';


// Hero copy. `video` is a GIF that goes into a plain <img>
// (nothing to autoplay or mute); at 6 MB it is the heaviest
// asset on the site. `button.enable` gates the hero button
const banner = {
  title: 'Visa Lietuva Tavo Delne!',
  content: 'Atrask įmones, kurioms reikia Tavo skubios pagalbos BDAR atitikties klausimais!',
  video: '/videos/avektoriusmain.gif',
  button: { enable: true, label: 'Tikrinti domeną', link: '/tikrinti' },
};

// Background of every even-indexed feature section: surface
// grey fading into the body black
const FEATURE_GRADIENT = 'bg-gradient-to-b from-surface from-[0.53%] to-body to-[83.28%]';







// -----------------------------------------------------------
// features
// -----------------------------------------------------------
//
// Copy for the two feature sections, in page order. The array
// position decides the layout (HomeFeature's index parity),
// so reordering entries also swaps image sides and
// backgrounds. `bulletpoints` double as React keys — they
// must stay unique within one entry. `button.enable` gates
// the section's link; both links point inside the app
// (/tikrinti, /pro).
//
// Used by:
//   - Home (below) — mapped onto HomeFeature
// -----------------------------------------------------------

const features = [
  {
    title: 'BDAR Atitikties Problematiką',
    image: '/images/av/bdar.jpg',
    content:
      'Net pusė Lietuvos interneto svetainių, valdomų juridinių asmenų, susiduria su BDAR atitikties iššūkiais, dažnai dėl nebūtinų slapukų, kurie įrašomi be lankytojų sutikimo. Nors šios įmonės supranta ir brangina klientų privatumą, jos neretai ieško sprendimų, kaip užtikrinti tinkamą duomenų tvarkymą. Mūsų įrankis padeda teisės specialistams dirbantiems su BDAR techniškai įvertinti slapukų atitiktį reglamentui pateikiant įrašus apie svetainės būseną pagal:',
    bulletpoints: [
      'įmonę ar jų grupę, bei kitas jai priklausančias svetainės pavadinimus',
      'sukuriamų slapukų tipą, bei jų atiktį',
      'tikrinimo istoriją',
    ],
    button: { enable: true, label: 'Tikrinti domeną', link: '/tikrinti' },
  },
  {
    title: 'Profesionalus BDAR Atitikties įrankis',
    image: '/images/av/computerPhoto.jpeg',
    content:
      '2023-aisiais Lietuvoje registruota apie 200.000 juridinių asmenų, iš kurių apie 50.000 valdo savo interneto svetaines. Panaudojant išplėstinius duomenų analizės metodus, dabar galime sudaryti detalius įmonių profilius ir įvertinti jų atitiktį BDAR reikalavimams. Tai leidžia ne tik atskleisti bendras tendencijas, bet ir identifikuoti konkrečias sritis, kuriose įmonėms reikalinga papildoma pagalba ir konsultacijos, siekiant užtikrinti duomenų apsaugos reglamento laikymąsi. Įrankio suteikiami paieškos kriterijai:',
    bulletpoints: [
      'juridinio asmens veiklos pobūdis',
      'panašios įmonės',
      'tiekimo grandinė',
      'partneriai ar klientai',
      'teisinės bylos',
    ],
    button: { enable: true, label: 'Profesionalus įrankis', link: '/pro' },
  },
];







// -----------------------------------------------------------
// HomeHero
// -----------------------------------------------------------
//
// The full-viewport opening: text column on the left, the GIF
// overlapping it from the right (marginLeft -10%), and a grey
// chevron pinned to the bottom as a "scroll on" hint. Sizing
// is inline — 90vw wide, 100vh tall, the container itself
// 100vh as a flex column — rather than Tailwind. The
// `id="pradzia"` anchor has no in-app link: menu.json's
// "Pradžia" entry is "/#", which Header scrolls to the top,
// so the id only serves a hand-typed /#pradzia URL.
//
// Used by:
//   - Home (below)
// -----------------------------------------------------------

function HomeHero() {
  return (
    <section
      id="pradzia"
      className="flex items-center"
      style={{ width: '90vw', height: '100vh', marginLeft: 'auto', marginRight: 'auto' }}
    >

      {/* Full-height flex column: the text/GIF row grows to
          fill it, the chevron sits at the bottom */}
      <div
        className="mx-auto max-w-[1320px] px-4"
        style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >

        <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

            {/* Text column — z-10 keeps it above the
                overlapping GIF; white is the heading
                colour */}
            <div className="lg:col-8 md:col-10 sm:col-10 z-10 pr-10">
              <h1 className="mb-4 text-white font-bold">{banner.title}</h1>
              <p className="mb-8 text-white">{banner.content}</p>
              {banner.button.enable && (
                <Link className={BTN_OUTLINE} to={banner.button.link}>
                  {banner.button.label}
                </Link>
              )}
            </div>

            {/* GIF column — decorative, so the alt stays
                empty */}
            {banner.video && (
              <div className="relative hidden md:col-4 md:block lg:col-6" style={{ marginLeft: '-10%' }}>
                <div style={{ overflow: 'hidden' }}>
                  <img src={banner.video} alt="" />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Scroll hint — decorative only, not a link */}
        <div className="flex justify-center" style={{ paddingBottom: '5vh' }}>
          <FaChevronDown style={{ fontSize: 80, color: '#505050' }} />
        </div>

      </div>

    </section>
  );
}







// -----------------------------------------------------------
// HomeFeature
// -----------------------------------------------------------
//
// One feature section: image in one column, heading + prose +
// check-list + button in the other. `index` parity drives the
// alternation — even (0-based) entries get FEATURE_GRADIENT
// behind them with the image on the left, odd ones are plain
// and swap the columns with md:order-2 / md:order-1. The
// check icon is the FA5 pack (react-icons/fa) while the hero
// chevron is FA6 — both ship inside react-icons.
//
// Used by:
//   - Home (below) — once per `features` entry
// -----------------------------------------------------------

function HomeFeature({ feature, index }) {
  return (
    <section className={`py-16 xl:py-20 ${index % 2 === 0 ? FEATURE_GRADIENT : ''}`}>
      <div className="mx-auto max-w-[1320px] px-4">
        <div className="row items-center justify-between">

          {/* Image column — first in the DOM, so it leads
              once the columns stack below md */}
          <div className={`mb-6 md:col-5 md:mb-0 ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
            <img
              src={feature.image}
              alt={feature.title}
              style={{ borderRadius: 15, width: '100%' }}
            />
          </div>

          {/* Text column — only 6 of 12 columns at lg, so
              the row's justify-between opens a gutter beside
              the image */}
          <div className={`md:col-7 lg:col-6 ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
            <h2 className="mb-4">{feature.title}</h2>
            <p className="mb-8 text-lg">{feature.content}</p>
            <ul>
              {feature.bulletpoints.map((bullet) => (
                <li className="relative mb-4 pl-6" key={bullet}>
                  <FaCheck className="absolute left-0 top-1.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            {feature.button.enable && (
              <Link className={`${BTN_PRIMARY} mt-5`} to={feature.button.link}>
                {feature.button.label}
              </Link>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}







// -----------------------------------------------------------
// Home (default export)
// -----------------------------------------------------------
//
// Used by:
//   - App.jsx — route "/"
// -----------------------------------------------------------

export default function Home() {
  return (
    <>
      {/* No props: title/description fall back to
          config.json */}
      <SeoMeta />

      <HomeHero />

      {/* Feature sections — titles are unique, hence the
          keys */}
      {features.map((feature, index) => (
        <HomeFeature key={feature.title} feature={feature} index={index} />
      ))}
    </>
  );
}
