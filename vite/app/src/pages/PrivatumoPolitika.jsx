import SeoMeta from '@/components/SeoMeta';
import PageHeader from '@/components/PageHeader';

const PrivatumoPolitika = () => {
  return (
    <>
      <SeoMeta
        title="Privatumo Politika"
        meta_title="BDAR Vektorius - Privatumo Politika"
        description="Sužinokite apie mūsų įsipareigojimą užtikrinti jūsų privatumą naudojant 'BDAR Vektorius' įrankį."
      />
      <PageHeader title="Privatumo Politika" />
      <div className="flex justify-center">
        <section className="section lg:col-10 xl:col-10">
          <div className="container">
            <div className="content">
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

              <p>Įsigaliojimo data: 2023-11-03</p>

              <p>
                Jei turite klausimų ar pastabų apie mūsų privatumo politiką, prašome susisiekti su
                mumis: saugu@atakosvektorius.lt
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PrivatumoPolitika;
