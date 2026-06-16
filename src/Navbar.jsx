import "./Navbar.css"
import logo from "./assets/logo.png"

function Navbar(props) {
	return (
		<nav className={props.scroll ? "scrolled" : ""} >
			<img src={logo} alt="Logo" />
			<ul>
				<li> <a href="#">Home</a> </li>
				<li> <a href="#experience">Experience</a> </li>
				<li> <a href="#skills">Skills</a> </li>
				<li> <a href="#projects">Personal</a> </li>
				<li> <a href="#about">About</a> </li>
			</ul>
		</nav >
	)
}

export default Navbar;
