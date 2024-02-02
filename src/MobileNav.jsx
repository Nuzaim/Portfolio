import { useState } from "react"
import "./MobileNav.css"

function mobileNav() {
  const [isNavToggle, setIsNavToggle] = useState(false);
  return (
    <>
      <div className={isNavToggle ? "mobileNav cross" : "mobileNav"} onClick={() => { setIsNavToggle(prevState => !prevState) }}>
        <div />
        <div />
        <div />
        <div />
      </div>
      <div className={isNavToggle ? "navToggle toggle" : "navToggle"} >
        {isNavToggle ? <ul>
          <li> <a href="#" onClick={() => { setIsNavToggle(prevState => !prevState) }}>Home</a> </li>
          <li> <a href="#projects" onClick={() => { setIsNavToggle(prevState => !prevState) }}>Projects</a> </li>
          <li> <a href="#about" onClick={() => { setIsNavToggle(prevState => !prevState) }}>About</a> </li>
        </ul> : <></>}
      </div>
    </>
  )
}

export default mobileNav;
