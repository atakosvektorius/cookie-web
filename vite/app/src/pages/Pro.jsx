// -----------------------------------------------------------
//  [*] Pro — the "Pro version" pitch page
//
//  Static Lithuanian prose at route "/pro". First the
//  problem: of ~200,000 Lithuanian legal entities about
//  50,000 run a website, and a crawl of those found roughly
//  half setting cookies without the consent BDAR requires.
//  Then the pitch for a paid company-profiling tool aimed at
//  lawyers and BDAR consultants, with the four criteria it
//  would search by. The product does not exist yet, so the
//  page ends in SubscribeForm, which collects e-mails through
//  POST /api/subscribe.
//
//  Same skeleton as PrivatumoPolitika: SeoMeta (head tags
//  only, renders nothing), PageHeader (the gradient title
//  card: h1 + breadcrumbs), then the prose inside <Content>,
//  the Tailwind-typography wrapper Apie uses too (Apie
//  otherwise differs: no PageHeader, its own <h2>, the
//  shorter py-16 band). Width comes from the bootstrap-grid
//  plugin (`lg:col-10`), vertical padding from py-24.
// -----------------------------------------------------------

import SeoMeta from '@/components/SeoMeta';
import PageHeader from '@/components/PageHeader';
import Content from '@/components/Content';
import SubscribeForm from '@/components/SubscribeForm';







// -----------------------------------------------------------
// Pro (default export)
// -----------------------------------------------------------
//
// Used by:
//   - App.jsx — route "/pro"
// -----------------------------------------------------------

export default function Pro() {
  return (
    <>

      {/* Head tags only — <title> and og:title read
          "Atakos Vektorius - Pro" */}
      <SeoMeta
        title="Atakos Vektorius - Pro"
        description="Mūsų produktas, remiantis pažangiausiomis duomenų analitikos technologijomis, užtikrina, kad teisininkai ir kiti specialistai galėtų efektyviai nustatyti ir tvarkyti BDAR atitikties klausimus."
      />

      {/* The visible h1 and the breadcrumb trail */}
      <PageHeader title="Profesionalus BDAR Atitikties Įrankis" />

      <div className="flex justify-center">
        <section className="py-24 xl:py-28 lg:col-10">
          <div className="mx-auto max-w-[1320px] px-4">

            {/* The prose. Content is Tailwind typography,
                which already spaces paragraphs — the bare
                <br />s between blocks add one more line of
                air on top */}
            <Content>

              {/* The problem — the crawl figures */}
              <p>
                <strong><em>Problematika –</em></strong>
              </p>
              <p>
                2023 m. Lietuvoje užregistruota apie 200,000 juridinių asmenų, iš kurių maždaug
                50,000 yra interneto svetainių savininkai. Atsižvelgdami į interneto vartotojų
                išreikštus susirūpinimus dėl privatumo saugumo, mes atlikome tyrimą, kurio metu
                apsilankėme visose šiose svetainėse, siekdami išsiaiškinti, kaip yra tvarkomi
                nebūtinieji ir trečiųjų šalių slapukai. Tyrimo rezultatai atskleidė, kad beveik
                pusei, arba 50% tirtų svetainių, slapukai buvo sukurti nesilaikant BDAR nustatytų
                sutikimo procedūrų. Tai kelia grėsmę vartotojų privatumui, kadangi slapukai yra
                generuojami nepaisant to, ar vartotojas suteikė sutikimą, ar ne. Toks aukštas
                nesilaikymo procentas rodo rimtą atotrūkį tarp teisinio reglamentavimo ir praktinio
                jo įgyvendinimo.
              </p>
              <br />

              {/* The pitch — who the tool is for */}
              <h5>Apie įrankį:</h5>
              <p>
                Mes pristatome inovatyvų įrankį, skirtą teisininkams bei BDAR konsultacijų ir
                rizikos vertinimo specialistams. Šis produktas yra itin efektyvi priemonė, padedanti
                identifikuoti organizacijas, kurios galimai nesilaiko BDAR nustatytų asmens duomenų
                tvarkymo principų.
              </p>
              <br />
              <p>
                Mūsų plėtotas įrankis, naudodama pažangius duomenų analizės metodus, leidžia
                sudaryti išsamius įmonių profilius ir įvertinti jų atitikimą BDAR reikalavimams. Tai
                ne tik atskleidžia plačiąsias rinkos tendencijas, bet ir padeda nustatyti konkrečias
                sritis, kuriose įmonėms gali prireikti papildomos pagalbos ar konsultacijų. Šis
                įrankis leidžia vykdyti išsamią paiešką pagal šiuos kriterijus:
              </p>
              <br />

              {/* The four search criteria the tool would
                  offer */}
              <ul>
                <li>
                  Įmonių veiklos pobūdis: Analizuojama, kaip įmonės veikla susijusi su asmens
                  duomenų tvarkymu, ir kiek tai yra svarbu jų BDAR atitikčiai.
                </li>
                <li>
                  Veiklos apimtis: Didelėms įmonėms svarbu valdyti rizikas, susijusias su
                  potencialiomis sankcijomis dėl BDAR nesilaikymo.
                </li>
                <li>
                  Partneriai ir tiekimo grandinė: Atskleidžiami tiekimo grandinės ir partnerystės
                  aspektai, kurie gali turėti įtakos BDAR atitikčiai.
                </li>
                <li>
                  Teisinės bylos: Teikiama informacija apie esamas ar praeities bylas, susijusias su
                  duomenų apsauga, tai yra būtina įmonės atitikties BDAR įvertinimui.
                </li>
              </ul>
              <br />

            </Content>

            {/* No product yet — collect e-mails instead. The
                form POSTs {"email"} to /api/subscribe: 200
                {"message"} (INSERT OR IGNORE, so a repeated
                address succeeds too) or 400 {"error"} */}
            <SubscribeForm
              subscribe_text="Jei norite sužinoti pirmieji kada Pro versija taps prieinama, mes galime jums pranešti:"
              subscribe_input_form="El. paštas"
              subscribe_post_url="/api/subscribe"
            />

          </div>
        </section>
      </div>

    </>
  );
}
