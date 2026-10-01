import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { education, skillGroups } from '../content/portfolio';
import './KnowledgeBook.css';

export default function KnowledgeBook({ active, leftStyle, rightStyle, onClose }) {
  const [page, setPage] = useState(0);
  const close = useRef(null);
  useEffect(() => { if (active) close.current?.focus({ preventScroll: true }); }, [active]);
  const chapters = [...skillGroups.map(group => group.title), 'Education'];
  const group = skillGroups[page];
  const keyDown = event => {
    if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
  };
  return <>
    <section className={`knowledgePage bookContents${active ? ' isActive' : ''}`} style={leftStyle} inert={active ? undefined : ''} aria-hidden={!active} aria-label="Knowledge contents" onKeyDown={keyDown}>
      <p className="bookEyebrow">Field notes / 03</p><h2>Knowledge</h2><p>Tools I work with and where I learned.</p>
      <nav aria-label="Knowledge chapters">{chapters.map((title, index) => <button key={title} aria-current={index === page ? 'page' : undefined} onClick={() => setPage(index)}><span>{String(index + 1).padStart(2, '0')}</span>{title}</button>)}</nav>
    </section>
    <section className={`knowledgePage bookChapter${active ? ' isActive' : ''}`} style={rightStyle} inert={active ? undefined : ''} aria-hidden={!active} aria-label="Knowledge book page" onKeyDown={keyDown}>
      <header><span className="bookEyebrow">{page < skillGroups.length ? 'Skills' : 'Education'}</span><button ref={close} onClick={onClose} aria-label="Close knowledge book">×</button></header>
      <div className="bookPageBody" tabIndex={0}><h2>{chapters[page]}</h2>{group ? <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul> : education.map(entry => <p key={entry}>{entry}</p>)}</div>
      <footer><button disabled={page === 0} onClick={() => setPage(value => value - 1)} aria-label="Previous knowledge page">←</button><span aria-live="polite">{page + 1} / {chapters.length}</span><button disabled={page === chapters.length - 1} onClick={() => setPage(value => value + 1)} aria-label="Next knowledge page">→</button></footer>
    </section>
  </>;
}
KnowledgeBook.propTypes = { active: PropTypes.bool.isRequired, leftStyle: PropTypes.object, rightStyle: PropTypes.object, onClose: PropTypes.func.isRequired };
