// -----------------------------------------------------------
//  [*] Apie — the "Apie mus" company page
//
//  Static Lithuanian prose about Atakos Vektorius, the
//  company behind the tool: cover image, a greeting heading
//  and the three-service pitch (Fuzzing, DAST, OWASP pentest)
//  ending in an invitation to atakosvektorius.lt. Nothing is
//  fetched and nothing is interactive — the only side effect
//  is SeoMeta rewriting the <head> tags.
//
//  The prose sits inside <Content>, the Tailwind-typography
//  wrapper: paragraph colour, underlined links and <strong>
//  colour all come from there, not from this file.
//  Typography already spaces the paragraphs and headings —
//  the bare <br /> elements between the prose groups add one
//  more line of air on top and are part of the design.
//
//  Unlike Pro and PrivatumoPolitika this page skips
//  PageHeader: it draws its own <h2> under the cover image,
//  so there are no breadcrumbs.
//
//  Two layout facts the markup does not show:
//  `justify-center` centres the column only because `.row` (a
//  tailwind-bootstrap-grid class) supplies the display:flex
//  it acts on; `shadow-custom` is a whitish glow from
//  tailwind.config.js — the page is black, a dark shadow
//  would be invisible.
// -----------------------------------------------------------

import SeoMeta from '@/components/SeoMeta';
import Content from '@/components/Content';







// -----------------------------------------------------------
// Apie (default export)
// -----------------------------------------------------------
//
// Used by:
//   - App.jsx — route "/apie"
// -----------------------------------------------------------

export default function Apie() {
  return (
    <>

      {/* Head tags — `image` becomes og:image = base_url +
          path, the same cover.png rendered further down */}
      <SeoMeta
        title="Atakos Vektorius - Apie mus"
        description="Lietuviško kapitalo įmonė, įkurta 2022 metais, specializuojasi kibernetinio saugumo testavime."
        image="/images/av/cover.png"
      />

      <section className="py-16 xl:py-20">
        <div className="mx-auto max-w-[1320px] px-4">
          <div className="row justify-center">
            <div className="text-left md:col-10">

              {/* Cover image — public/images/av/cover.png,
                  full column width */}
              <img
                className="mb-6 w-full rounded-lg shadow-custom"
                src="/images/av/cover.png"
                alt="Atakos Vektorius"
              />

              {/* Greeting — an h2 dressed as `h3` (one scale
                  step smaller); the bare 60 is React
                  shorthand for "60px", pushing the heading
                  clear of the image */}
              <h2 className="text-h3-sm md:text-h3 mb-6" style={{ marginTop: 60 }}>
                Sveiki, mes esame Atakos Vektorius!
              </h2>

              {/* Prose — everything below is styled by
                  Content's typography classes */}
              <Content>

                {/* Who the company is */}
                <p>
                  <strong><em>Atakos vektorius –</em></strong> tai ne tik paprasta įmonė, bet ir
                  komanda, kuri yra pasiryžusi užtikrinti jūsų verslo kibernetinį saugumą. Įkurta
                  2022 metais, mūsų įmonė didžiuojasi būdama viena iš nedaugelio Lietuvoje, kuri
                  specializuojasi būtent kibernetinio saugumo testavime.
                </p>
                <p>
                  Per trumpą veiklos laikotarpį mes jau įrodėme savo profesionalumą ir patikimumą,
                  atlikdami informacinių sistemų techninių saugumo priemonių tikrinimus pagal
                  valstybinės duomenų apsaugos inspekcijos parengtas gaires. Tačiau mes nuolat
                  tobulėjame, mokomės ir plečiame savo paslaugų spektrą, kad galėtume pasiūlyti dar
                  daugiau.
                </p>
                <br />

                {/* Services — one <strong><em> lead-in per
                    offering; the OWASP paragraph also carries
                    the vision statement */}
                <h5>Mūsų paslaugos apima:</h5>
                <p>
                  <strong><em>Atsitiktinių duomenų testai (Fuzzing):</em></strong> Ši paslauga
                  padeda atskleisti netikėtus programinės įrangos klaidų elgesius ir
                  pažeidžiamumus, kuriuos gali išnaudoti potencialūs puolėjai.
                </p>
                <p>
                  <strong><em>Pažeidžiamumų tikrinimas (DAST):</em></strong> Mes naudojame
                  pažangias priemones ir metodikas, kad atskleistumėme bet kokias pažeidžiamas
                  vietas jūsų informacinėse sistemose.
                </p>
                <p>
                  <strong><em>Įsilaužimo testavimas (OWASP Testing Guide):</em></strong> Mūsų
                  ekspertai atlieka išsamius testus pagal tarptautinius OWASP standartus, kad
                  įvertintų jūsų tinklo atsparumą įvairiems išpuoliams. Mūsų vizija yra tapti
                  lyderiais kibernetinio saugumo srityje Lietuvoje ir už jos ribų. Mes esame
                  įsipareigoję ne tik teikti aukščiausios kokybės paslaugas, bet ir mokyti bei
                  šviesti visuomenę apie kibernetinį saugumą. Mes suprantame, kad technologijų
                  pasaulyje nuolat kintantys saugumo iššūkiai reikalauja ne tik techninių žinių, bet
                  ir nuolatinio mokymosi.
                </p>
                <br />

                {/* Invitation and contact — the
                    atakosvektorius.lt link is a plain <a>, a
                    full navigation away from the SPA, no
                    target/rel; the e-mail address is plain
                    text, not a mailto:. The {' '} keeps the
                    space before the link that the JSX line
                    break would otherwise swallow. */}
                <h6>
                  Mes kviečiame jus prisijungti prie mūsų ir kartu užtikrinti saugesnę informacinę
                  erdvę!
                </h6>
                <br />
                <h6>
                  Apsilankykite mūsų{' '}
                  <a href="https://atakosvektorius.lt">atakosvektorius.lt</a> svetainėje arba
                  susisiekite el. paštu saugu@atakosvektorius.lt
                </h6>

              </Content>

            </div>
          </div>
        </div>
      </section>

    </>
  );
}
