import PropTypes from "prop-types";
import { useState } from "react"
import "./MobileNav.css"

function MobileNav({ isVisible }) {
  const [isNavToggle, setIsNavToggle] = useState(false);
  return (
    <>
      <div className={`${isVisible ? "mobileNav is-visible" : "mobileNav"}${isNavToggle ? " cross" : ""}`} onClick={() => { setIsNavToggle(prevState => !prevState) }}>
        <div />
        <div />
        <div />
        <div />
      </div>
      <div className={`${isVisible ? "navToggle is-visible" : "navToggle"}${isNavToggle ? " toggle" : ""}`} >
        {isNavToggle ? <ul>
          <li> <a href="#" onClick={() => { setIsNavToggle(prevState => !prevState) }}>Home</a> </li>
          <li> <a href="#experience" onClick={() => { setIsNavToggle(prevState => !prevState) }}>Experience</a> </li>
          <li> <a href="#skills" onClick={() => { setIsNavToggle(prevState => !prevState) }}>Skills</a> </li>
          <li> <a href="#projects" onClick={() => { setIsNavToggle(prevState => !prevState) }}>Personal</a> </li>
          <li> <a href="#about" onClick={() => { setIsNavToggle(prevState => !prevState) }}>About</a> </li>
        </ul> : <></>}
      </div>
    </>
  )
}

MobileNav.propTypes = { isVisible: PropTypes.bool };
export default MobileNav;
