// -----------------------------------------------------------
//  [*] Tikrinti — cookie-compliance lookup page
//
//  The "/tikrinti" page: the visitor types a site address and
//  gets the cookies the scanner recorded for it, each graded
//  against the BDAR-allowed categories. One page, five
//  screens, switched by `website`, `result` and `error`:
//    - ShowSearchSection — the address form (website === '')
//    - ShowLoading       — "tikrinama…" while the request
//                          is in flight
//    - ShowError         — the request failed; retry button
//    - ShowPendingCheck  — "tikrinimas užregistruotas": the
//                          domain is not on the scanner's
//                          list (isscanned 0)
//    - ShowResults       — the cookie table, or the green
//                          "nesukuria slapukų" tick when the
//                          list is empty (isscanned 1)
//  Every result screen has a "Tikrinti kitą svetainę" button
//  that returns to the form.
//
//  Backend contract — GET /api/getresults/<domain> (Flask,
//  same origin through the endpoint Caddy):
//    { "isscanned": 0|1,
//      "cookies": [ { "cookiename", "category",
//                     "datechecked",
//                     "isallowedbdar": 0|1 } ] }
//  The body is SQLite's json_object, so the flags are
//  INTEGERS — hence the `=== 1` checks, never truthiness.
//  "category" is "?" when the Open Cookie Database has no
//  entry (such a cookie is graded 0 = not allowed). The
//  backend lowercases the domain and logs every query; an
//  unknown domain answers isscanned 0 with an empty cookies
//  list. A domain that is on the list but not crawled yet
//  also answers isscanned 1 with an empty list — and gets
//  the green tick.
//
//  Split into (root component last):
//
//    toHost            — typed address → bare lowercase host
//    ShowSearchSection — the address form (screen 1)
//    ShowLoading       — in-flight notice
//    ShowError         — failure notice + retry
//    ResetButton       — "Tikrinti kitą svetainę"
//    ShowPendingCheck  — "check registered" notice
//    CookieRow         — one row, verdict by integer flag
//    ShowResults       — table or green tick, link
//    Tikrinti          — state + request (default export)
// -----------------------------------------------------------

import { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import SeoMeta from '@/components/SeoMeta';
import Content from '@/components/Content';
import { BTN_PRIMARY, BTN_OUTLINE, FORM_INPUT } from '@/utils/uiClasses';







// -----------------------------------------------------------
// toHost
// -----------------------------------------------------------
//
// "  HTTPS://WWW.Pavyzdys.lt/kelias?x " → "pavyzdys.lt":
// trims, lowercases, drops a leading scheme and "www.", and
// everything from the first "/" on. An empty or
// whitespace-only input yields "" and the caller skips the
// request.
//
// Used by:
//   - Tikrinti (below) — handleSubmit
// -----------------------------------------------------------

function toHost(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];
}







// -----------------------------------------------------------
// ShowSearchSection
// -----------------------------------------------------------
//
// Screen 1. A controlled input; autoFocus so the page opens
// ready to type. Enter submits through the form, same as the
// icon button.
//
// Used by:
//   - Tikrinti (below)
// -----------------------------------------------------------

function ShowSearchSection({ value, onChange, onSubmit }) {
  return (
    <section className="py-24 xl:py-28">

      <div className="mx-auto max-w-[1320px] px-4">
        <div className="row justify-center">
          <div className="text-left md:col-10 lg:col-7">
            <h1 className="text-center" style={{ marginBottom: 20 }}>
              Tikrinti slapukų atitikimą
            </h1>
            <div className="text-center" style={{ marginBottom: 30 }}>
              Sužinokite, ar svetainės slapukų politika atitinka BDAR reglamentavimą
            </div>

            {/* Address form — input and button share one
                pill (rounded-r-none / rounded-l-none join
                them) */}
            <div className="row mb-10 justify-center">
              <div className="lg:col-12">
                <form onSubmit={onSubmit}>
                  <div className="flex flex-nowrap">
                    <input
                      className={`${FORM_INPUT} rounded-r-none`}
                      placeholder="Svetainės adresas (pvz: pavyzdys.lt)"
                      type="search"
                      name="search"
                      value={value}
                      onChange={onChange}
                      autoComplete="off"
                      autoFocus
                    />
                    <button className={`${BTN_PRIMARY} rounded-l-none`} type="submit">
                      <FaSearch />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}







// -----------------------------------------------------------
// ShowLoading
// -----------------------------------------------------------
//
// Shown between submit and response.
//
// Used by:
//   - Tikrinti (below)
// -----------------------------------------------------------

function ShowLoading({ website }) {
  return (
    <section className="py-24 xl:py-28">
      <Content>
        <div className="row justify-center">
          <div className="text-left md:col-10 lg:col-7">
            <h2 className="text-center" style={{ marginBottom: 20 }}>
              Tikrinama svetainė <u>{website}</u>…
            </h2>
          </div>
        </div>
      </Content>
    </section>
  );
}







// -----------------------------------------------------------
// ShowError
// -----------------------------------------------------------
//
// The request failed (network, or a non-2xx such as the 404
// the backend gives an address it cannot parse). One red
// line and a way back to the form.
//
// Used by:
//   - Tikrinti (below)
// -----------------------------------------------------------

function ShowError({ message, onReset }) {
  return (
    <section className="py-24 xl:py-28">
      <Content>
        <div className="row justify-center">
          <div className="text-center md:col-10 lg:col-7">
            <h2 className="text-red-500" style={{ marginBottom: 20 }}>
              {message}
            </h2>
            <ResetButton onReset={onReset} />
          </div>
        </div>
      </Content>
    </section>
  );
}







// -----------------------------------------------------------
// ResetButton
// -----------------------------------------------------------
//
// "Tikrinti kitą svetainę" — back to the empty form.
//
// Used by:
//   - ShowError, ShowPendingCheck, ShowResults (below)
// -----------------------------------------------------------

function ResetButton({ onReset }) {
  return (
    <button type="button" className={BTN_OUTLINE} onClick={onReset}>
      Tikrinti kitą svetainę
    </button>
  );
}







// -----------------------------------------------------------
// ShowPendingCheck
// -----------------------------------------------------------
//
// isscanned came back 0: the domain is not on the scanner's
// list. All the backend did is log the query, which is what
// "užregistruotas" amounts to. Wrapped in <Content> (the
// typography wrapper, so the h2 gets the prose sizes).
//
// Used by:
//   - Tikrinti (below)
// -----------------------------------------------------------

function ShowPendingCheck({ website, onReset }) {
  return (
    <section className="py-24 xl:py-28">
      <Content>
        <div className="row justify-center">
          <div className="text-center md:col-10 lg:col-7">
            <h2 style={{ marginBottom: 20 }}>
              Svetainės <u>{website}</u> slapukų tikrinimas užregistruotas
            </h2>
            <ResetButton onReset={onReset} />
          </div>
        </div>
      </Content>
    </section>
  );
}







// -----------------------------------------------------------
// CookieRow
// -----------------------------------------------------------
//
// One cookie of the results table. The verdict icon reads
// `isallowedbdar`, a SQLite INTEGER: 1 means the cookie's
// Open Cookie Database category is in the BDAR-allowed set →
// green tick; anything else → red cross. A cookie the
// database does not know (category "?") is 0, so it shows as
// non-compliant. Column alignment is Tailwind text-* classes
// — they outrank the typography wrapper's `th, td {
// text-align: start }`.
//
// Used by:
//   - ShowResults (below)
// -----------------------------------------------------------

function CookieRow({ cookie }) {
  return (
    <tr>
      <td className="text-left">{cookie.cookiename}</td>
      <td className="text-center">{cookie.category}</td>
      <td className="text-center">{cookie.datechecked}</td>
      <td className="text-center">
        {cookie.isallowedbdar === 1 ? (
          <FaCheckCircle style={{ color: 'green', fontSize: 24, display: 'inline' }} />
        ) : (
          <FaTimesCircle style={{ color: 'red', fontSize: 24, display: 'inline' }} />
        )}
      </td>
    </tr>
  );
}







// -----------------------------------------------------------
// ShowResults
// -----------------------------------------------------------
//
// isscanned came back 1. With cookies: the table (one
// CookieRow each; a name can repeat, so the key carries the
// position too). Without: the green "nesukuria slapukų be
// sutikimo" tick. Both end with the reset button and
// "Skaityti Daugiau Straipsnyje", a plain <a> to
// atakosvektorius.lt — a full navigation out of the SPA.
//
// Used by:
//   - Tikrinti (below)
// -----------------------------------------------------------

function ShowResults({ website, cookieData, onReset }) {
  return (
    <section className="py-24 xl:py-28">

      <Content>
        <div className="row justify-center">
          <div className="sm:col-10 md:col-10 lg:col-8">
            {cookieData.cookies.length > 0 ? (
              <div>
                <h2 className="text-center" style={{ marginBottom: 50 }}>
                  Slapukų atitikimas svetainėje: <u>{website}</u>
                </h2>
                <h4 className="text-left" style={{ marginBottom: 10 }}>
                  Sukuriami slapukai:
                </h4>
                <table>
                  <thead>
                    <tr>
                      <th className="text-left">Slapuko vardas</th>
                      <th className="text-center">Tipas</th>
                      <th className="text-center">Tikrinimo laikas</th>
                      <th className="text-center">Atitiktis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookieData.cookies.map((cookie, index) => (
                      <CookieRow key={`${cookie.cookiename}-${index}`} cookie={cookie} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <h2 className="text-center" style={{ marginBottom: 50 }}>
                Svetainė <u>{website}</u> nesukuria slapukų be sutikimo{' '}
                <FaCheckCircle style={{ color: 'green', fontSize: 48, display: 'inline' }} />
              </h2>
            )}

            {/* Back to the form, and the article on the main
                site — a plain <a>, not a router Link */}
            <div className="mt-8 flex flex-wrap gap-3">
              <ResetButton onReset={onReset} />
              <a
                className={`${BTN_OUTLINE} no-underline text-center`}
                href="https://atakosvektorius.lt/slapukai.html"
              >
                Skaityti Daugiau Straipsnyje
              </a>
            </div>
          </div>
        </div>
      </Content>

    </section>
  );
}







// -----------------------------------------------------------
// Tikrinti (default export)
// -----------------------------------------------------------
//
// Owns the state and the one request; the JSX is only the
// screen switch. Reached through the "Tikrinti Slapukus" menu
// entry (menu.json) and the Home page's "Tikrinti domeną"
// buttons — all router links to /tikrinti.
//
// Used by:
//   - App.jsx — route "/tikrinti"
// -----------------------------------------------------------

export default function Tikrinti() {

  // `website` doubles as the screen switch ('' = the form);
  // `result` is the parsed response, `error` the red line
  const [inputVal, setInputVal] = useState('');
  const [website, setWebsite] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);


  const handleChange = (e) => setInputVal(e.target.value);


  // Normalises the address and fires the request; an empty
  // host is ignored. The host is URL-encoded so a stray
  // character cannot change the request path
  const handleSubmit = (e) => {
    e.preventDefault();

    const host = toHost(inputVal);
    if (!host) return;

    setWebsite(host);
    setResult(null);
    setError(null);

    axios
      .get(`/api/getresults/${encodeURIComponent(host)}`)
      .then((response) => setResult(response.data))
      .catch(() => setError('Nepavyko gauti rezultatų. Bandykite dar kartą.'));
  };


  // Back to the empty form
  const reset = () => {
    setInputVal('');
    setWebsite('');
    setResult(null);
    setError(null);
  };


  return (
    <div>

      <SeoMeta
        title="Atakos Vektorius - Tikrinti"
        description="Atakos Vektoriaus įrankis tikrinti slapukų atitikimui BDAR"
      />

      {/* Screen switch — form, in-flight notice, error, then
          results or the pending notice by the integer
          flag */}
      {website === '' ? (
        <ShowSearchSection value={inputVal} onChange={handleChange} onSubmit={handleSubmit} />
      ) : error ? (
        <ShowError message={error} onReset={reset} />
      ) : !result ? (
        <ShowLoading website={website} />
      ) : result.isscanned === 1 ? (
        <ShowResults website={website} cookieData={result} onReset={reset} />
      ) : (
        <ShowPendingCheck website={website} onReset={reset} />
      )}

    </div>
  );
}
