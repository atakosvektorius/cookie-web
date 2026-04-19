import SeoMeta from '@/components/SeoMeta';

const notFoundStyles = `
  .nf-noise {
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: -1;
    opacity: 0.02;
  }
  .nf-overlay {
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    background-size: auto 4px;
    z-index: 1;
  }
  .nf-overlay::before {
    content: "";
    pointer-events: none;
    position: absolute;
    display: block;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 100%; height: 100%;
    background-image: linear-gradient(
      0deg,
      transparent 0%,
      rgba(32, 128, 32, 0.2) 2%,
      rgba(32, 128, 32, 0.8) 3%,
      rgba(32, 128, 32, 0.2) 3%,
      transparent 100%
    );
    background-repeat: no-repeat;
    animation: nf-scan 7.5s linear 0s infinite;
  }
  @keyframes nf-scan {
    0% { background-position: 0 -100vh; }
    35%, 100% { background-position: 0 100vh; }
  }
  .nf-terminal {
    box-sizing: inherit;
    position: relative;
    height: 100%;
    width: 1000px;
    max-width: 100%;
    padding: 4rem;
    text-transform: uppercase;
  }
  .nf-output {
    color: rgba(128, 255, 128, 0.8);
    text-shadow: 0 0 1px rgba(51, 255, 51, 0.4), 0 0 2px rgba(255, 255, 255, 0.8);
  }
  .nf-output::before { content: "> "; }
  .nf-terminal a { color: #fff; text-decoration: none; }
  .nf-terminal a::before { content: "["; }
  .nf-terminal a::after { content: "]"; }
  .nf-errorcode { color: white; }
`;

const NotFound = () => {
  return (
    <>
      <SeoMeta title="Puslapis Nerastas" />
      <style>{notFoundStyles}</style>
      <section className="section-lg text-left" style={{ width: '100vw', height: '70vh' }}>
        <div className="container">
          <div className="row justify-center">
            <div className="nf-noise" />
            <div className="nf-overlay" />
            <div className="nf-terminal">
              <h1>
                Ups... <span className="nf-errorcode">404</span>
              </h1>
              <br />
              <p className="nf-output">
                Rodos, šis sausainiukas iškrito iš dėžutės. Puslapis, kurį bandote rasti, nėra arba
                jis pasilėpęs.
              </p>
              <p className="nf-output">
                Nesibaiminkite, kartais ir sausainiukams patinka pasislėpti.
              </p>
              <br />
              <p className="nf-output">
                Nors puslapis dingo kaip sausainiukas prie arbatos, mes tikimės, kad Jūsų diena bus
                saldi!
              </p>
              <br />
              <br />
              <p className="nf-output">
                <a href="/">užsukite į pradinį puslapį</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
