import { useEffect, useState } from "react";
import "./App.css";
import Tile from "./Tile.jsx";
import Navbar from "./Navbar.jsx";
import About from "./About.jsx";
import Footer from "./Footer.jsx";
import MobileNav from "./MobileNav.jsx";
import { Analytics } from "@vercel/analytics/react";
import { education, experienceHighlights, projects, skillGroups } from "./content/portfolio.js";

function App() {
	const [isScroll, setIsScroll] = useState(false);
	const [isMobileNav, setIsMobileNav] = useState(false);

	useEffect(() => {
		const handleScroll = () => setIsScroll(window.scrollY > 10);

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const tiles = projects.map((item) => (
		<Tile key={item.id} id={item.id} title={item.title} description={item.description} link={item.link} />
	));

	return (
		<div className={`portfolio${isMobileNav ? " mobile-nav-active" : ""}`}>
			<Analytics />
			<header className="hero">
				<h1 className="heroTitle name"><span>Hi,<span className="emoji">👋</span></span><span>I&apos;m Nuzaim Noushad Thappi.</span></h1>
				<p>Software Engineer building resilient backend systems.</p>
			</header>
			<Navbar scroll={isScroll} isMobileMode={isMobileNav} onOverflowChange={setIsMobileNav} />
			<MobileNav isVisible={isMobileNav} />
			<div id="experience" className="contentSection">
				<h1 className="sectionTitle">Experience</h1>
				<div className="textCard">
					<h3>Software Engineer · Turbolab Technologies</h3>
					<span>June 2024 - Aug 2026</span>
					<p>Professional contributions delivered as part of engineering teams.</p>
					<ul>
						{experienceHighlights.map((highlight) => (
							<li key={highlight}>{highlight}</li>
						))}
					</ul>
				</div>
			</div>
			<div id="skills" className="contentSection">
				<h1 className="sectionTitle">Skills</h1>
				<div className="skillsGrid">
					{skillGroups.map((group) => (
						<div key={group.title} className="skillsCard">
							<h3>{group.title}</h3>
							<p>{group.items.join(" • ")}</p>
						</div>
					))}
				</div>
			</div>
			<div id="projects" className="projectsSection">
				<h1 className="sectionTitle">Personal Projects</h1>
				<div className="slider">
					<section className="projectGrid">
						{tiles}
					</section>
				</div>
			</div>
			<div id="education" className="contentSection">
				<h1 className="sectionTitle">Education</h1>
				<div className="textCard">
					<ul>
						{education.map((entry) => (
							<li key={entry}>{entry}</li>
						))}
					</ul>
				</div>
			</div>
			<About />
			<Footer />
		</div>
	);
}

export default App;
