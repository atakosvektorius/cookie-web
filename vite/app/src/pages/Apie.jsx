import SeoMeta from '@/components/SeoMeta';

const Apie = () => {
  return (
    <>
      <SeoMeta
        title="Sveiki, mes esame Atakos Vektorius!"
        meta_title="Atakos Vektorius - Apie mus"
        description="Lietuviško kapitalo įmonė, įkurta 2022 metais, specializuojasi kibernetinio saugumo testavime."
        image="/images/av/cover.png"
      />
      <section className="section-sm">
        <div className="container">
          <div className="row justify-center">
            <div className="text-left md:col-10 lg:col-10 xl:col-10">
              <img
                className="mx-auto mb-6 rounded-lg shadow-custom"
                src="/images/av/cover.png"
                alt="Atakos Vektorius"
                style={{ width: '100%' }}
              />
              <h2 className="h3 mb-6" style={{ marginTop: 60 }}>
                Sveiki, mes esame Atakos Vektorius!
              </h2>
              <div className="content">
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Apie;
