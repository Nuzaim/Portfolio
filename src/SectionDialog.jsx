import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import PortfolioContent from './PortfolioContent';

export default function SectionDialog({ section, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected && previous !== document.body) previous.focus();
      else document.querySelector(`[data-section="${section}"]`)?.focus();
    };
  }, [section]);
  const containFocus = event => {
    if (event.key !== 'Tab') return;
    const items = [...ref.current.querySelectorAll('a[href], button, [tabindex="0"]')];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  return <dialog className="sectionDialog" ref={ref} aria-labelledby="dialog-title" onKeyDown={containFocus} onCancel={event => { event.preventDefault(); onClose(); }}>
    <header className="dialogHeader"><div><p className="eyebrow">Workspace / Open file</p><h2 id="dialog-title">{section}</h2></div><button onClick={onClose} aria-label="Close dialog">Close ×</button></header>
    <div className="dialogContent" tabIndex={0} role="region" aria-label={`${section} content`}><PortfolioContent section={section} /></div>
  </dialog>;
}
SectionDialog.propTypes = { section: PropTypes.string.isRequired, onClose: PropTypes.func.isRequired };
