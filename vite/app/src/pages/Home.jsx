import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa6';
import SeoMeta from '@/components/SeoMeta';

const banner = {
  title: 'Visa Lietuva Tavo Delne!',
  content: 'Atrask įmones, kurioms reikia Tavo skubios pagalbos BDAR atitikties klausimais!',
  video: '/videos/avektoriusmain.gif',
  button: { enable: true, label: 'Tikrinti domeną', link: '/tikrinti' },
};

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

const HomeFeature = ({ feature, index }) => (
  <section className={`section-sm ${index % 2 === 0 ? 'bg-gradient' : ''}`}>
    <div className="container">
      <div className="row items-center justify-between">
        <div className={`mb:md-0 mb-6 md:col-5 ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
          <img
            src={feature.image}
            alt={feature.title}
            style={{ borderRadius: 15, width: '100%' }}
          />
        </div>
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
            <Link className="btn btn-primary mt-5" to={feature.button.link}>
              {feature.button.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  </section>
);

const Home = () => {
  return (
    <>
      <SeoMeta />

      <section
        id="pradzia"
        className="flex items-center"
        style={{ width: '90vw', height: '100vh', marginLeft: 'auto', marginRight: 'auto' }}
      >
        <div
          className="container"
          style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div className="lg:col-8 md:col-10 sm:col-10 z-10 pr-10">
                <h1 className="mb-4 text-white font-bold">{banner.title}</h1>
                <p className="mb-8 text-white">{banner.content}</p>
                {banner.button.enable && (
                  <Link className="btn btn-outline-primary" to={banner.button.link}>
                    {banner.button.label}
                  </Link>
                )}
              </div>

              {banner.video && (
                <div className="video-section relative lg:col-6 md:col-4 sm:col-0" style={{ marginLeft: '-10%' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <img src={banner.video} alt="" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center" style={{ paddingBottom: '5vh' }}>
            <FaChevronDown style={{ fontSize: 80, color: '#505050' }} />
          </div>
        </div>
      </section>

      {features.map((feature, index) => (
        <HomeFeature key={index} feature={feature} index={index} />
      ))}
    </>
  );
};

export default Home;
