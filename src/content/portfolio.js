export const projects = [
	{
		id: "audio-transcoding-pipeline",
		title: "Audio Transcoding Pipeline",
		description:
			"An event-driven audio processing system with a concurrent Go processor, FastAPI gateway, AWS SQS job queue, SQLAlchemy persistence, and S3 asset storage.",
		link: "https://github.com/Nuzaim/distributed-audio-transcoder"
	},
	{
		id: "personal-ai-chef",
		title: "Personal AI Chef",
		description:
			"A multimodal AI recipe assistant that analyzes text and ingredient photos, searches for culinary context, and generates structured recipes with substitutions.",
		link: "https://github.com/Nuzaim/AI-Chef"
	},
	{
		id: "telegram-content-hub",
		title: "Telegram Content Hub",
		description:
			"A modular NestJS backend for Telegram content ingestion, asynchronous BullMQ processing, FFmpeg audio conversion, S3 uploads, LLM enrichment, and authenticated content management.",
		link: "https://github.com/Nuzaim"
	},
	{
		id: "textbook-rag-assistant",
		title: "Textbook RAG Assistant",
		description:
			"A full-stack retrieval-augmented generation application using Flask, React, and MongoDB Atlas Vector Search to provide citation-aware answers from academic textbooks.",
		link: "https://github.com/Nuzaim"
	},
	{
		id: "k9s-launcher",
		title: "k9s-launcher",
		description:
			"A Go-based K9s wrapper for selecting a target Kubernetes cluster before launch, with configurable authentication and environment setup through Cobra and Viper.",
		link: "https://github.com/Nuzaim/k9s-launcher"
	},
	{
		id: "pharmacy-management-system",
		title: "Pharmacy Management System",
		description:
			"A web-based pharmacy management system built with HTML, CSS, and PHP for inventory, prescriptions, sales, and customer record management.",
		link: "https://github.com/nuzaim/pharmacy-management-system"
	},
	{
		id: "tenzies",
		title: "Tenzies",
		description:
			"A fast-paced React dice game where players race to roll and hold matching dice combinations.",
		link: "https://tenzies-nuzaim.vercel.app/"
	},
	{
		id: "confusion-server",
		title: "conFusion Server",
		description:
			"A backend API for recipe management with authentication, comments, and favorites, designed for secure user-driven interactions.",
		link: "https://github.com/Nuzaim/conFusionServer/"
	},
	{
		id: "studymate",
		title: "StudyMate",
		description:
			"A web platform for KTU students to quickly discover and access study materials.",
		link: "https://ministudymate.web.app/"
	}
];

export const skillGroups = [
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

export const experienceHighlights = [
	"Built and enhanced distributed web scraping infrastructure with Kubernetes HPA autoscaling, gRPC worker communication, and pluggable Redis/Kafka-backed job queues, improving CPU efficiency by 10%.",
	"Contributed to Kafka-backed queuing with manual offset management and failure recovery mechanisms for reliable message processing.",
	"Developed a decentralized, containerized LLM-powered code review system integrated into reusable CI workflows with locally deployed models and LiteLLM controls.",
	"Developed and maintained a Django-based platform for orchestrating and monitoring distributed scraping workloads using Kubernetes, Celery, and Redis.",
	"Led the migration of 600+ customer-facing API services from Mesosphere DC/OS to HashiCorp Nomad within two months with minimal downtime.",
	"Maintained and enhanced a centralized scraping management platform for scraper configuration lifecycle management and proxy health monitoring, reducing proxy-related costs by over 50% through improved proxy selection and utilization.",
	"Implemented Redis Pub/Sub-based event propagation to synchronize configuration changes across distributed scraping services in real time.",
	"Developed pytest end-to-end tests and implemented Prometheus, Grafana, and Elasticsearch tooling for workflow validation and observability."
];

export const education = [
	"B.Tech in Information Technology - Government Engineering College Palakkad (2021 - 2024)",
	"B.Tech in Information Technology - Government Engineering College Idukki (2020 - 2021)"
];
