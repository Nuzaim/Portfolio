import { useEffect, useState } from "react";
import "./App.css";
import Tile from "./Tile.jsx";
import Navbar from "./Navbar.jsx";
import About from "./About.jsx";
import Footer from "./Footer.jsx";
import MobileNav from "./MobileNav.jsx";

function App() {
	const projects = [
		{
			id: 1,
			title: "Kube CLI Wrapper",
			description:
				"Built a Go-based wrapper around K9s to select target clusters before startup, with optional auth script execution and configurable workflows using Cobra and Viper.",
			link: "https://github.com/Nuzaim"
		},
		{
			id: 2,
			title: "Pharmacy Management System",
			description:
				"A web-based pharmacy management system built with HTML, CSS, and PHP for inventory, prescriptions, sales, and customer record management.",
			link: "https://github.com/nuzaim/pharmacy-management-system"
		},
		{
			id: 3,
			title: "Tenzies",
			description:
				"A fast-paced React dice game where players race to roll and hold matching dice combinations.",
			link: "https://tenzies-nuzaim.vercel.app/"
		},
		{
			id: 4,
			title: "conFusion Server",
			description:
				"A backend API for recipe management with authentication, comments, and favorites, designed for secure user-driven interactions.",
			link: "https://github.com/Nuzaim/conFusionServer/"
		},
		{
			id: 5,
			title: "StudyMate",
			description:
				"A web platform for KTU students to quickly discover and access study materials.",
			link: "https://ministudymate.web.app/"
		}
	];

	const skillGroups = [
		{
			title: "Languages",
			items: ["Python", "JavaScript", "Go"]
		},
		{
			title: "Frameworks",
			items: ["FastAPI", "Django", "Pydantic", "SQLAlchemy", "Dynaconf"]
		},
		{
			title: "DevOps",
			items: ["Docker", "Kubernetes", "Nomad", "GitLab CI/CD", "HAProxy", "AWS", "Azure"]
		},
		{
			title: "Data",
			items: ["PostgreSQL", "MySQL", "Redis", "Kafka", "RabbitMQ"]
		},
		{
			title: "Architecture",
			items: ["Microservices", "Event-Driven Systems", "Distributed Systems", "Async Programming"]
		}
	];

	const experienceHighlights = [
		"Built and enhanced distributed scraping systems with dynamic RPS scaling, Kubernetes HPA, and gRPC worker communication as part of the platform team.",
		"Implemented Kafka-based asynchronous content streaming to reduce crawler latency and database write pressure under high load.",
		"Maintained a centralized scraping management platform with Redis Pub/Sub synchronization and Celery-based async job distribution.",
		"Created end-to-end test frameworks for crawler workflows and data processing pipelines.",
		"Improved CI/CD delivery with automated code review checks and release-note generation.",
		"Led customer API migrations from Mesosphere DC/OS to Nomad with minimal downtime."
	];

	const education = [
		"B.Tech in Information Technology - Government Engineering College Palakkad (2021 - 2024)",
		"B.Tech in Information Technology - Government Engineering College Idukki (2020 - 2021)"
	];

	const [isScroll, setIsScroll] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 515);

	useEffect(() => {
		const handleScroll = () => setIsScroll(window.scrollY > 10);
		const handleResize = () => setIsMobile(window.innerWidth <= 515);

		window.addEventListener("scroll", handleScroll);
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const tiles = projects.map((item) => (
		<Tile key={item.id} id={item.id} title={item.title} description={item.description} link={item.link} />
	));

	return (
		<>
			<header>
				<h1 className="name"><span>Hi,<span className="emoji">👋</span></span><span>I'm Nuzaim Noushad Thappi.</span></h1>
				<p>Associate Software Engineer building resilient backend systems.</p>
			</header>
			{isMobile ? <MobileNav /> : <Navbar scroll={isScroll} />}
			<div id="experience" className="contentSection">
				<h1>Experience</h1>
				<div className="textCard">
					<h3>Associate Software Engineer · Turbolab Technologies</h3>
					<span>June 2024 - Present</span>
					<p>Professional contributions delivered as part of engineering teams.</p>
					<ul>
						{experienceHighlights.map((highlight) => (
							<li key={highlight}>{highlight}</li>
						))}
					</ul>
				</div>
			</div>
			<div id="skills" className="contentSection">
				<h1>Skills</h1>
				<div className="skillsGrid">
					{skillGroups.map((group) => (
						<div key={group.title} className="skillsCard">
							<h3>{group.title}</h3>
							<p>{group.items.join(" • ")}</p>
						</div>
					))}
				</div>
			</div>
			<h1 id="projects">Personal Projects</h1>
			<div className="slider">
				<section>
					{tiles}
				</section>
			</div>
			<div id="education" className="contentSection">
				<h1>Education</h1>
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
		</>
	);
}

export default App;
