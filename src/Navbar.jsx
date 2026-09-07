import { useEffect, useRef } from "react"
import "./Navbar.css"
import logo from "./assets/logo.png"

function Navbar(props) {
	const navRef = useRef(null);

	useEffect(() => {
		const nav = navRef.current;
		if (!nav || !window.ResizeObserver) return;

		const updateOverflowState = () => {
			props.onOverflowChange(nav.scrollWidth > nav.clientWidth);
		};

		const observer = new ResizeObserver(updateOverflowState);
		observer.observe(nav);
		updateOverflowState();

		return () => observer.disconnect();
	}, [props.onOverflowChange]);

	return (
		<nav ref={navRef} className={`portfolioNav${props.scroll ? " scrolled" : ""}${props.isMobileMode ? " mobile-mode" : ""}`} >
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
