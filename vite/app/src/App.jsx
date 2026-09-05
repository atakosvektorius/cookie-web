// -----------------------------------------------------------
//  [*] App — the router shell around every page
//
//  Mounted once by main.jsx (inside StrictMode). One route
//  table, one shell: whatever the URL, the page renders in
//  the same flex column — Header on top, the routed page in
//  <main>, Footer below. <main> is flex-1, so on a page
//  shorter than the viewport it stretches and the Footer
//  sits on the bottom edge.
//
//  Routes:
//
//    /                    → Home
//    /tikrinti            → Tikrinti
//    /apie                → Apie
//    /pro                 → Pro
//    /privatumo-politika  → PrivatumoPolitika
//    *                    → NotFound
//
//  Deep links and reloads work in production because the
//  slapukai-vite Caddy falls back to /index.html for any
//  unknown path (try_files) — so "*" → NotFound is decided
//  here, in the browser, never by the web server.
//
//  Split into (root component last):
//
//    PageArea — the routes inside an ErrorBoundary
//    App      — router + shell (default export)
// -----------------------------------------------------------

// Router
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Layout — wraps every route
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

// Pages — one per route, in route-table order
import Home from '@/pages/Home';
import Tikrinti from '@/pages/Tikrinti';
import Apie from '@/pages/Apie';
import Pro from '@/pages/Pro';
import PrivatumoPolitika from '@/pages/PrivatumoPolitika';
import NotFound from '@/pages/NotFound';







// -----------------------------------------------------------
// PageArea
// -----------------------------------------------------------
//
// The routed page inside its own ErrorBoundary, reset on
// every route change so navigating away from a page that
// threw recovers. Header and Footer stay outside it, so the
// menu keeps working while the notice is shown.
//
// Used by:
//   - App (below)
// -----------------------------------------------------------

function PageArea() {

  const location = useLocation();


  return (
    <ErrorBoundary resetKey={location.pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tikrinti" element={<Tikrinti />} />
        <Route path="/apie" element={<Apie />} />
        <Route path="/pro" element={<Pro />} />
        <Route path="/privatumo-politika" element={<PrivatumoPolitika />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}







// -----------------------------------------------------------
// App (default export)
// -----------------------------------------------------------
//
// Used by:
//   - main.jsx — mounted into #root inside StrictMode
// -----------------------------------------------------------

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">

        <Header />

        {/* flex-1 keeps the Footer on the bottom edge of
            short pages; every page brings its own padding */}
        <main className="flex-1">
          <PageArea />
        </main>

        <Footer />

      </div>
    </BrowserRouter>
  );
}
