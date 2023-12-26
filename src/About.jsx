import "./About.css";
import profPic from "./assets/Nuzaim_Noushad_Thappi.png";

export default function About() {
	return (
		<>
			<div id="about">
				<h1> About </h1>
				<img src={profPic} alt="Profile Picture" />
				<p>
					Dedicated and passionate engineer with strong <span style={{ whiteSpace: "nowrap" }}> problem-solving </span> skills, known for being a team player who is honest and reliable, and committed to continuous learning and innovation.
					Currently studying for B.Tech in Information Technology. <br />
					Contact me if you want anything 😊.
				</p>
			</div >
		</>
	)
}
