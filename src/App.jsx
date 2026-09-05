import { useEffect, useState } from "react";
import "./App.css";
import Tile from "./Tile.jsx";
import Navbar from "./Navbar.jsx";
import About from "./About.jsx";
import Footer from "./Footer.jsx";
import MobileNav from "./MobileNav.jsx";
import { Analytics } from "@vercel/analytics/react";

function App() {
	const projects = [
		{
			id: 1,
			title: "Audio Transcoding Pipeline",
			description:
				"An event-driven audio processing system with a concurrent Go processor, FastAPI gateway, AWS SQS job queue, SQLAlchemy persistence, and S3 asset storage.",
			link: "https://github.com/Nuzaim/distributed-audio-transcoder"
		},
		{
			id: 2,
			title: "Personal AI Chef",
			description:
				"A multimodal AI recipe assistant that analyzes text and ingredient photos, searches for culinary context, and generates structured recipes with substitutions.",
			link: "https://github.com/Nuzaim/AI-Chef"
		},
		{
			id: 3,
			title: "Telegram Content Hub",
			description:
				"A modular NestJS backend for Telegram content ingestion, asynchronous BullMQ processing, FFmpeg audio conversion, S3 uploads, LLM enrichment, and authenticated content management.",
			link: "https://github.com/Nuzaim"
		},
		{
			id: 4,
			title: "Textbook RAG Assistant",
			description:
				"A full-stack retrieval-augmented generation application using Flask, React, and MongoDB Atlas Vector Search to provide citation-aware answers from academic textbooks.",
			link: "https://github.com/Nuzaim"
		},
		{
			id: 5,
			title: "k9s-launcher",
			description:
				"A Go-based K9s wrapper for selecting a target Kubernetes cluster before launch, with configurable authentication and environment setup through Cobra and Viper.",
			link: "https://github.com/Nuzaim/k9s-launcher"
		},
		{
			id: 6,
			title: "Pharmacy Management System",
			description:
				"A web-based pharmacy management system built with HTML, CSS, and PHP for inventory, prescriptions, sales, and customer record management.",
			link: "https://github.com/nuzaim/pharmacy-management-system"
		},
		{
			id: 7,
			title: "Tenzies",
			description:
				"A fast-paced React dice game where players race to roll and hold matching dice combinations.",
			link: "https://tenzies-nuzaim.vercel.app/"
		},
		{
			id: 8,
			title: "conFusion Server",
			description:
				"A backend API for recipe management with authentication, comments, and favorites, designed for secure user-driven interactions.",
			link: "https://github.com/Nuzaim/conFusionServer/"
		},
		{
			id: 9,
			title: "StudyMate",
			description:
				"A web platform for KTU students to quickly discover and access study materials.",
			link: "https://ministudymate.web.app/"
		}
	];

	const skillGroups = [
		{
			title: "Languages",
			items: ["Python (asyncio)", "Go", "JavaScript"]
		},
		{
			title: "Frameworks",
			items: ["FastAPI", "Django", "NestJS", "Pydantic", "SQLAlchemy", "Dynaconf"]
		},
		{
			title: "DevOps",
			items: ["Docker", "Kubernetes", "Nomad", "GitLab CI/CD", "HAProxy", "AWS", "Azure"]
		},
		{
			title: "Data",
			items: ["PostgreSQL", "MySQL", "Redis", "Kafka", "RabbitMQ", "AWS SQS", "Prisma"]
		},
		{
			title: "Architecture",
			items: ["Microservices", "Event-Driven Systems", "Distributed Systems", "Object-Oriented Programming"]
		},
		{
			title: "AI & LLM",
			items: ["AI Agent Development", "Claude Code", "Prompt Engineering", "Open-Source LLMs"]
		}
	];

	const experienceHighlights = [
		"Built and enhanced distributed web scraping infrastructure with Kubernetes HPA autoscaling, gRPC worker communication, and pluggable Redis/Kafka-backed job queues, improving CPU efficiency by 10%.",
		"Contributed to Kafka-backed queuing with manual offset management and failure recovery mechanisms for reliable message processing.",
		"Developed a decentralized, containerized LLM-powered code review system integrated into reusable CI workflows with locally deployed models and LiteLLM controls.",
		"Developed and maintained a Django-based platform for orchestrating and monitoring distributed scraping workloads using Kubernetes, Celery, and Redis.",
		"Led the migration of 600+ customer-facing API services from Mesosphere DC/OS to HashiCorp Nomad within two months with minimal downtime.",
		"Maintained and enhanced a centralized scraping management platform for scraper configuration lifecycle management and proxy health monitoring, reducing proxy-related costs by over 50% through improved proxy selection and utilization.",
		"Implemented Redis Pub/Sub-based event propagation to synchronize configuration changes across distributed scraping services in real time.",
		"Developed pytest end-to-end tests and implemented Prometheus, Grafana, and Elasticsearch tooling for workflow validation and observability."
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
			<Analytics />
			<header>
				<h1 className="name"><span>Hi,<span className="emoji">👋</span></span><span>I&apos;m Nuzaim Noushad Thappi.</span></h1>
				<p>Software Engineer building resilient backend systems.</p>
			</header>
			{isMobile ? <MobileNav /> : <Navbar scroll={isScroll} />}
			<div id="experience" className="contentSection">
				<h1>Experience</h1>
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
			<div id="projects" className="projectsSection">
				<h1>Personal Projects</h1>
				<div className="slider">
					<section>
						{tiles}
					</section>
				</div>
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
