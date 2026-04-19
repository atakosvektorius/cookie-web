import SeoMeta from '@/components/SeoMeta';
import PageHeader from '@/components/PageHeader';
import SubscribeForm from '@/components/SubscribeForm';

const Pro = () => {
  return (
    <>
      <SeoMeta
        title="Profesionalus BDAR Atitikties Įrankis"
        meta_title="Atakos Vektorius - Pro"
        description="Mūsų produktas, remiantis pažangiausiomis duomenų analitikos technologijomis, užtikrina, kad teisininkai ir kiti specialistai galėtų efektyviai nustatyti ir tvarkyti BDAR atitikties klausimus."
      />
      <PageHeader title="Profesionalus BDAR Atitikties Įrankis" />
      <div className="flex justify-center">
        <section className="section lg:col-10 xl:col-10">
          <div className="container">
            <div className="content">
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
            </div>
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
};

export default Pro;
