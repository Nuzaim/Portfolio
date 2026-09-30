import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { experienceHighlights, projects } from '../content/portfolio';
import './LaptopTerminal.css';

export default function LaptopTerminal({ section, onClose, onSelect, style, active }) {
  const [entries, setEntries] = useState([section]);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const input = useRef(null);
  const output = useRef(null);
  useEffect(() => { setEntries([section]); }, [section]);
  useEffect(() => { if (active) input.current?.focus({ preventScroll: true }); }, [active]);
  useEffect(() => { output.current?.scrollTo(0, entries.length <= 1 ? 0 : output.current.scrollHeight); }, [entries]);
  const run = raw => {
    const value = raw.trim().toLowerCase();
    if (!value) return;
    setHistory(items => [...items, raw]); setHistoryIndex(history.length + 1); setCommand('');
    if (value === 'exit') { onClose(); return; }
    if (value === 'clear') { setEntries([]); return; }
    if (value === 'experience' || value === 'projects') {
      if (value !== section) onSelect(value);
      else setEntries(items => [...items, value]);
    } else setEntries(items => [...items, value === 'help' ? 'help' : { unknown: raw }]);
    input.current?.focus();
  };
  return <section className={`laptopTerminal${active ? " isActive" : ""}`} inert={active ? undefined : ""} aria-hidden={!active} style={style} aria-label="Laptop portfolio terminal" onKeyDown={event => {
    if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
  }}>
    <header><span className="terminalLights" aria-hidden="true">● ● ●</span><span>nuzaim@workspace: ~</span><button onClick={onClose} aria-label="Back to workspace">×</button></header>
    <nav aria-label="Terminal commands">{['experience', 'projects', 'help', 'clear'].map(value => <button key={value} onClick={() => run(value)}>{value}</button>)}<button onClick={onClose}>exit ↗</button></nav>
    <div ref={output} className="terminalOutput" tabIndex={0} aria-label="Terminal output">
      <p className="terminalWelcome">Welcome to my workspace. Choose a command or type help.</p>
      {entries.map((entry, index) => <div key={index} className="terminalEntry"><p className="terminalPrompt">nuzaim@workspace ~ $ <span>{typeof entry === 'string' ? entry : entry.unknown}</span></p>
        {entry === 'experience' ? <><h2>Software Engineer · Turbolab Technologies</h2><p className="terminalMuted">June 2024 — Aug 2026 / Professional contributions</p><ul>{experienceHighlights.map(item => <li key={item}>{item}</li>)}</ul></> : entry === 'projects' ? <><h2>Selected projects</h2>{projects.map((item, i) => <article key={item.id}><h3><span className="terminalMuted">{String(i + 1).padStart(2, '0')} / </span>{item.title}</h3><p>{item.description}</p><a href={item.link} target="_blank" rel="noreferrer">Open project ↗</a></article>)}</> : entry === 'help' ? <p>experience — work history<br />projects — builds and source links<br />clear — clear output<br />exit — back to workspace<br />↑ / ↓ — command history · Escape — exit</p> : <p role="status">Unknown command: {entry.unknown}. Type help for available commands.</p>}
      </div>)}
    </div>
    <form onSubmit={event => { event.preventDefault(); run(command); }}><label htmlFor="terminal-command">~ $</label><input ref={input} id="terminal-command" autoComplete="off" spellCheck="false" aria-label="Terminal command" value={command} onChange={event => setCommand(event.target.value)} onKeyDown={event => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault(); const next = Math.max(0, Math.min(history.length, historyIndex + (event.key === 'ArrowUp' ? -1 : 1)));
        setHistoryIndex(next); setCommand(history[next] || '');
      }
    }} /><button type="submit">Run ↵</button></form>
  </section>;
}
LaptopTerminal.propTypes = { active: PropTypes.bool.isRequired, section: PropTypes.string.isRequired, onClose: PropTypes.func.isRequired, onSelect: PropTypes.func.isRequired, style: PropTypes.object };
