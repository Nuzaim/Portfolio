import "./Navbar.css"
import logo from "./assets/logo.png"

function Navbar(props) {
	return (
		<nav className={props.scroll ? "scroll" : ""} >
			{<img src={logo} className={props.scroll ? "logo" : ""} />}
			<ul>
				<li> <a href="#" className={props.scroll ? "" : "special"}>Home</a> </li>
				<li> <a href="#projects" className={props.scroll ? "" : "special"}>Projects</a> </li>
				<li> <a href="#about" className={props.scroll ? "" : "special"}>About Me</a> </li>
			</ul>
		</nav >
	)
}

export default Navbar;
