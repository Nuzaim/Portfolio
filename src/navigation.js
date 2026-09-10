export const sections = ['experience', 'projects', 'knowledge', 'contact'];
const aliases = { skills: 'knowledge', education: 'knowledge', about: 'contact' };
export function readSection() {
  const fragment = window.location.hash.slice(1).toLowerCase();
  const section = aliases[fragment] || fragment;
  return [...sections, 'credits'].includes(section) ? section : null;
}
export function initialView() {
  try {
    const saved = sessionStorage.getItem('portfolio-view');
    if (saved === 'text' || saved === 'scene') return saved;
  } catch { /* Storage can be unavailable in privacy mode. */ }
  return window.innerWidth < 768 ? 'text' : 'scene';
}
