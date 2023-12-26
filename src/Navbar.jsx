import "./Navbar.css"

function Navbar(props) {
	return (
		<nav className={props.scroll ? "scroll" : ""}>
			<ul>
				<li> <a href="#">Home</a> </li>
				<li> <a href="#projects">Projects</a> </li>
				<li> <a href="#about">About Me</a> </li>
			</ul>
		</nav>
	)
}

export default Navbar;
