// -----------------------------------------------------------
//  [*] PrivatumoPolitika — the privacy policy text page
//
//  Static Lithuanian prose under the PageHeader title band:
//  five short <h4> sections (who we are, no personal data
//  collected, what the checker does, data protection, policy
//  changes), the effective date and a contact e-mail. Nothing
//  fetches and nothing is interactive — the whole page is
//  markup inside <Content> (the Tailwind-typography wrapper),
//  so the headings and paragraphs carry no classes of their
//  own.
//
//  The tab reads "BDAR Vektorius - Privatumo Politika"
//  (SeoMeta); PageHeader shows "Privatumo Politika" with a
//  "Pradžia / Privatumo Politika" breadcrumb derived from the
//  URL.
// -----------------------------------------------------------

import SeoMeta from '@/components/SeoMeta';
import PageHeader from '@/components/PageHeader';
import Content from '@/components/Content';







// -----------------------------------------------------------
// PrivatumoPolitika (default export)
// -----------------------------------------------------------
//
// Used by:
//   - App.jsx — route "/privatumo-politika"
// -----------------------------------------------------------

export default function PrivatumoPolitika() {
  return (
    <>

      {/* Head tags */}
      <SeoMeta
        title="BDAR Vektorius - Privatumo Politika"
        description="Sužinokite apie mūsų įsipareigojimą užtikrinti jūsų privatumą naudojant 'BDAR Vektorius' įrankį."
      />

      {/* Title band with the breadcrumb trail */}
      <PageHeader title="Privatumo Politika" />

      {/* Reading column — py-24 xl:py-28 is the band's
          vertical padding; lg:col-10 = 10/12 width from lg
          up */}
      <div className="flex justify-center">

        <section className="py-24 xl:py-28 lg:col-10">

          <div className="mx-auto max-w-[1320px] px-4">

            {/* The policy itself — Content is the Tailwind
                typography wrapper, which is where the h4/p
                spacing and colours come from */}
            <Content>

              <h4>Privatumo Politika</h4>
              <p>
                MB "Atakos Vektorius" yra įsipareigojęs užtikrinti savo klientų privatumą. Mūsų
                teikiamas įrankis skirtas įvertinti, ar svetainės atitinka slapukų politikos
                reikalavimus pagal BDAR, nerenkant ar nekaupiant jokių asmeninių duomenų.
              </p>

              <h4>Asmens Duomenų Rinkimas</h4>
              <p>
                Mes suprantame, kad privatumas yra svarbus, todėl mūsų "BDAR Vektorius" įrankis
                buvo sukurtas taip, kad nevykdytų jokio asmens duomenų rinkimo. Naudodamiesi mūsų
                įrankiu, galite būti tikri, kad jokie jūsų duomenys nebus fiksuojami, kaupiami ar
                perduodami trečiosioms šalims.
              </p>

              <h4>Slapukų Politikos Tikrinimas</h4>
              <p>
                Mūsų įrankis automatiškai patikrina, ar svetainėse nekuriami slapukai prieš gavus
                vartotojo sutikimą. Mes nekaupiame jokios informacijos apie jūsų svetainės lankymą
                ar naudojimąsi mūsų įrankiu.
              </p>

              <h4>Duomenų Apsauga</h4>
              <p>
                Mes rimtai žiūrime į informacijos saugumą ir esame įsipareigoję užtikrinti, kad mūsų
                paslaugos būtų saugios. Kadangi mūsų įrankis nekaupia jokių duomenų, nėra asmens
                duomenų, kuriuos reikėtų saugoti.
              </p>

              <h4>Privatumo Politikos Pakeitimai</h4>
              <p>
                Mes pasiliekame teisę bet kada atnaujinti šią privatumo politiką, kad atspindėtume
                paslaugų ar teisės aktų pakeitimus. Visus atnaujinimus skelbsime mūsų svetainėje.
                Rekomenduojame periodiškai peržiūrėti šią politiką, kad žinotumėte, kaip saugome
                jūsų privatumą.
              </p>

              {/* Effective date and contact are hardcoded
                  prose — the e-mail is plain text, not a
                  mailto: link */}
              <p>Įsigaliojimo data: 2023-11-03</p>

              <p>
                Jei turite klausimų ar pastabų apie mūsų privatumo politiką, prašome susisiekti su
                mumis: saugu@atakosvektorius.lt
              </p>

            </Content>

          </div>

        </section>

      </div>

    </>
  );
}
