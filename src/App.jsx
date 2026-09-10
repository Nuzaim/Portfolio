import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Analytics } from '@vercel/analytics/react';
import PortfolioContent from './PortfolioContent';
import SectionDialog from './SectionDialog';
import { initialView, readSection, sections } from './navigation';
import './App.css';

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}
SceneBoundary.propTypes = { children: PropTypes.node, onFailure: PropTypes.func.isRequired };

export default function App() {
  const [view, setView] = useState(initialView);
  const [section, setSection] = useState(readSection);
  const [attempt, setAttempt] = useState(0);
  const [reset, setReset] = useState(0);
  const [error, setError] = useState(false);
  const viewButton = useRef(null);
  // A fresh lazy wrapper also permits retrying a failed JS chunk download.
  const [Workspace, setWorkspace] = useState(() => lazy(() => import('./scene/Workspace')));
  const fail = useCallback(() => { setError(true); setView('text'); }, []);
  useEffect(() => {
    const sync = () => setSection(readSection());
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
  }, []);
  useEffect(() => {
    if (view === 'text' && section && section !== 'credits') {
      document.getElementById(section)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [section, view]);
  const navigate = (next) => {
    if (readSection() !== next) {
      window.history.pushState(null, '', next ? `#${next}` : window.location.pathname + window.location.search);
    }
    setSection(next);
    if (view === 'text' && next) document.getElementById(next)?.scrollIntoView({ behavior: 'instant' });
  };
  const chooseView = (next) => {
    try { sessionStorage.setItem('portfolio-view', next); } catch { /* View still works without storage. */ }
    setView(next);
    if (next === 'scene') { setError(false); setAttempt(value => value + 1); setWorkspace(() => lazy(() => import('./scene/Workspace'))); window.scrollTo(0, 0); }
    requestAnimationFrame(() => viewButton.current?.focus());
  };
  const dialogSection = view === 'scene' ? section : section === 'credits' ? section : null;
  return <div className={`portfolio ${view === 'scene' ? 'sceneView' : 'textView'}`}>
    <Analytics />
    <a className="skipLink" href="#experience" onClick={event => { event.preventDefault(); navigate('experience'); if (view === 'text') document.getElementById('experience')?.focus(); }}>Skip to content</a>
    <header className="siteHeader"><a className="monogram" href="#top" aria-label="Home" onClick={event => { event.preventDefault(); navigate(null); window.scrollTo(0, 0); }}>N / N / T<span>Engineer’s workspace</span></a>
      <nav aria-label="Portfolio sections">{sections.map((id, index) => <a key={id} data-section={id} href={`#${id}`} aria-current={section === id ? 'location' : undefined} onClick={event => { event.preventDefault(); navigate(id); }}><small>0{index + 1}</small>{id}</a>)}</nav>
      <button ref={viewButton} className="viewButton" onClick={() => chooseView(view === 'scene' ? 'text' : 'scene')}>{view === 'scene' ? 'Text view ↗' : 'Explore in 3D ↗'}</button>
    </header>
    <main id="top">
      <div className="intro"><p className="eyebrow">Portfolio / 2026</p><h1>Nuzaim<br />Noushad Thappi<span>®</span></h1><p className="role">Software Engineer</p><p className="introSentence">Building resilient backend systems.</p></div>
      {view === 'scene' ? <>
        <div className="sceneStage" role="region" aria-label="Interactive 3D desk. Drag to orbit, scroll to zoom. Use section navigation for keyboard access.">
          <SceneBoundary key={attempt} onFailure={fail}><Suspense fallback={<p className="loadingStatus" role="status">Opening the workspace…</p>}><Workspace paused={Boolean(dialogSection)} reset={reset} onSelect={navigate} onFailure={fail} /></Suspense></SceneBoundary>
        </div>
        <div className="sceneFooter"><p><span className="liveDot" /> A workspace, open to explore.<small>Drag to orbit · Scroll to zoom · Select an object</small></p><button onClick={() => setReset(value => value + 1)}>Reset view ↺</button></div>
      </> : <>
        {error && <div className="errorNotice" role="status">The 3D workspace could not be displayed. All portfolio content is available below. <button onClick={() => chooseView('scene')}>Retry 3D</button></div>}
        <div className="textSections">{sections.map((id, index) => <section key={id} id={id} tabIndex={-1} className="contentSection" aria-labelledby={`${id}-title`}><div className="sectionHeading"><p className="eyebrow">0{index + 1} / {['Work log', 'Selected builds', 'Field notes', 'Keep in touch'][index]}</p><h2 id={`${id}-title`}>{id}</h2></div><PortfolioContent section={id} /></section>)}</div>
      </>}
    </main>
    <footer className="creditsFooter"><span>Nuzaim Noushad Thappi © 2026</span><a data-section="credits" href="#credits" onClick={event => { event.preventDefault(); navigate('credits'); }}>Credits</a></footer>
    {dialogSection && <SectionDialog key={dialogSection} section={dialogSection} onClose={() => navigate(null)} />}
  </div>;
}
