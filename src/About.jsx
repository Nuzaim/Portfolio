import "./About.css";
import profPic from "./assets/Nuzaim_Noushad_Thappi.png";

export default function About() {
	return (
		<>
			<div id="about">
				<h1> About </h1>
				<img src={profPic} alt="Profile Picture" />
				<p>
					Backend-focused software engineer with hands-on experience building distributed systems, event-driven pipelines, and automation tooling.
					I enjoy solving reliability and scalability challenges across scraping platforms, CI/CD workflows, and cloud-native services. <br />
					Reach out at <a href="mailto:nuzaim.t123@gmail.com">nuzaim.t123@gmail.com</a> or connect on <a href="https://linkedin.com/in/nuzaim" target="_blank" rel="noreferrer">LinkedIn</a>.
				</p>
			</div >
		</>
	)
}
