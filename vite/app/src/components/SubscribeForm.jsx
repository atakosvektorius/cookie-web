// -----------------------------------------------------------
//  [*] SubscribeForm — the Pro-page e-mail sign-up
//
//  One input and a chevron button under the Pro prose: "tell
//  me first when Pro is available". The address is regex-
//  checked in the browser, then POSTed as { "email": ... } to
//  the URL the page passes in — Pro gives "/api/subscribe",
//  which the endpoint Caddy routes to the Flask backend. The
//  backend does INSERT OR IGNORE, so a repeat address is also
//  a 200 (the user is not told they are already listed).
//
//  Feedback: a 2xx clears the field and shows the green
//  "Prenumerata sėkminga!" line, which fades out over the
//  SUCCESS_VISIBLE_MS it stays mounted; a failed format check
//  or any request failure shows one red line, which clears as
//  soon as the visitor edits the field again. The backend's
//  own 400 { "error": ... } text is not surfaced.
// -----------------------------------------------------------

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaChevronRight } from 'react-icons/fa';
import { BTN_PRIMARY, FORM_INPUT } from '@/utils/uiClasses';


// Client-side format check: something@something.tld. The
// browser's own type="email" check runs before it (the form
// has no noValidate), so this mostly catches an EMPTY field
// and dot-less hosts like a@b that browsers accept
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// How long the green line stays; the animate-fade-out
// keyframes in tailwind.config.js run over the same 5 s
const SUCCESS_VISIBLE_MS = 5000;







// -----------------------------------------------------------
// SubscribeForm (default export)
// -----------------------------------------------------------
//
// Props are the Pro page's copy and target — nothing is read
// from config.json here:
//   subscribe_text       — the h6 line above the field
//   subscribe_input_form — the input's placeholder
//   subscribe_post_url   — where { "email": ... } is POSTed
//
// Used by:
//   - pages/Pro — bottom of the page, under the prose
// -----------------------------------------------------------

export default function SubscribeForm({ subscribe_text, subscribe_input_form, subscribe_post_url }) {

  // `status` is null, 'success' or 'error'; `error` is the
  // red line's text. The success timer lives in a ref so it
  // can be cancelled on unmount and on a new submit
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const successTimer = useRef(null);


  // A pending hide-the-green-line timer dies with the form
  useEffect(() => () => clearTimeout(successTimer.current), []);


  // Editing the address dismisses a red line
  const handleChange = (e) => {
    setEmail(e.target.value);
    if (status === 'error') {
      setStatus(null);
      setError(null);
    }
  };


  // Format check, then POST; axios rejects every non-2xx, so
  // a backend 400 and a network failure both land in the
  // catch
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!EMAIL_RE.test(email)) {
      setStatus('error');
      setError('Neteisingas el. pašto formatas.');
      return;
    }

    try {
      await axios.post(subscribe_post_url, { email });
      setStatus('success');
      setEmail('');
      clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setStatus(null), SUCCESS_VISIBLE_MS);
    } catch {
      setStatus('error');
      setError('Nepavyko prenumeruoti. Prašome bandyti vėliau.');
    }
  };


  return (
    <>

      <h6 className="flex justify-center" style={{ marginBottom: 20 }}>{subscribe_text}</h6>
      <div className="flex justify-center">
        <div className="sm:col-12 md:col-8 xl:col-6 2xl:col-6">
          <form onSubmit={handleSubmit}>

            {/* Field + button joined into one pill: the
                input drops its right radius, the button its
                left. The inline black overrides FORM_INPUT's
                themed background */}
            <div className="flex flex-nowrap">
              <input
                type="email"
                className={`${FORM_INPUT} rounded-r-none`}
                style={{ backgroundColor: 'black' }}
                placeholder={subscribe_input_form}
                value={email}
                onChange={handleChange}
              />
              <button className={`${BTN_PRIMARY} rounded-l-none`} type="submit">
                <FaChevronRight />
              </button>
            </div>

            {/* Fixed-height slot for the feedback lines so
                the page does not jump when they come and
                go */}
            <div style={{ height: 50, marginTop: 5 }}>
              {status === 'success' && (
                <p className="animate-fade-out text-center text-green-500">Prenumerata sėkminga!</p>
              )}
              {status === 'error' && (
                <p className="text-center text-red-500">{error}</p>
              )}
            </div>

          </form>
        </div>
      </div>

    </>
  );
}
