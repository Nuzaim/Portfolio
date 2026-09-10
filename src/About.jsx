import "./About.css";
import profPic from "./assets/Nuzaim_Noushad_Thappi.png";

export default function About() {
	return (
		<>
			<section id="contact" className="contentSection revealSection">
                <span id="about" className="fragmentAlias" />
				<div className="sectionHeading"><span className="sectionKicker">04 / Keep in touch</span><h2 className="sectionTitle">Contact</h2></div>
                <div className="contactBody">
				<img src={profPic} alt="Nuzaim Noushad Thappi" loading="lazy" />
				<p>
					Backend-focused software engineer with hands-on experience building distributed systems, event-driven pipelines, and automation tooling.
					I enjoy solving reliability and scalability challenges across scraping platforms, CI/CD workflows, and cloud-native services. <br />
					Reach out at <a href="mailto:nuzaim.t123@gmail.com">nuzaim.t123@gmail.com</a> or connect on <a href="https://linkedin.com/in/nuzaim" target="_blank" rel="noreferrer">LinkedIn</a>.
				</p>
			</div></section>
		</>
	)
}
