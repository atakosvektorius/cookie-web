// -----------------------------------------------------------
//  [*] ErrorBoundary — the last line before a blank page
//
//  A render-time throw anywhere below an unguarded root
//  unmounts the whole app: no header, no message. This
//  boundary catches it and shows a short notice with a reload
//  button in place of the page. `resetKey` (the route, for
//  the page boundary) clears the error when it changes, so
//  navigating away through the Header recovers without a
//  reload.
//
//  A class on purpose: React has no hook for
//  componentDidCatch.
// -----------------------------------------------------------

import { Component } from 'react';
import { BTN_OUTLINE } from '@/utils/uiClasses';







// -----------------------------------------------------------
// ErrorBoundary (default export)
// -----------------------------------------------------------
//
//   <ErrorBoundary resetKey={location.pathname}>
//     …
//   </ErrorBoundary>
//
// Used by:
//   - App.jsx — around the routed page
// -----------------------------------------------------------

export default class ErrorBoundary extends Component {

  constructor(props) {
    super(props);
    this.state = { error: null };
  }


  static getDerivedStateFromError(error) {
    return { error };
  }


  componentDidCatch(error, info) {
    console.error('Render failed:', error, info?.componentStack);
  }


  componentDidUpdate(previousProps) {
    if (this.state.error && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }


  render() {
    if (!this.state.error) return this.props.children;

    return (
      <section className="py-24 xl:py-28">
        <div className="mx-auto max-w-[1320px] px-4 text-center">
          <h2 className="mb-6">Puslapio nepavyko atvaizduoti.</h2>
          <button type="button" className={BTN_OUTLINE} onClick={() => window.location.reload()}>
            Perkrauti
          </button>
        </div>
      </section>
    );
  }
}
