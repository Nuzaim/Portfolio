import PropTypes from "prop-types";
import "./Navbar.css";

export default function Navbar({ scroll }) {
  return <nav className={`portfolioNav${scroll ? " scrolled" : ""}`} aria-label="Main navigation">
    <a className="navBrand" href="#top" aria-label="Nuzaim — home">N<span> / </span>T</a>
    <ul>{[["Home", "top"], ["Experience", "experience"], ["Knowledge", "knowledge"], ["Projects", "projects"], ["Contact", "contact"]].map(([label, id]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ul>
  </nav>;
}
Navbar.propTypes = { scroll: PropTypes.bool };
