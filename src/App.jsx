import { useState } from "react";
import "./App.css";
import Tile from "./Tile.jsx";
import Navbar from "./Navbar.jsx";
import About from "./About.jsx";
import Footer from "./Footer.jsx";
import MobileNav from "./MobileNav.jsx"

function App() {

	const [data, setData] = useState([
		{ id: 1, title: "Pharmacy Management System", description: "This Pharmacy Management System is a solution designed to streamline and optimize the operations of a pharmacy.The system is built using HTML, CSS, and PHP, offering a user-friendly interface and backend functionalities for managing inventory, prescriptions, sales, and customer records.", link: "https://github.com/nuzaim/pharmacy-management-system" },
		{ id: 2, title: "Tenzies", description: "Tenzies is an exhilarating and dynamic dice game that captivates players with its simplicity, speed, and infectious energy, where the race to achieve a uniform dice configuration. Designed using ReactJS.", link: "https://tenzies-nuzaim.vercel.app/" },
		{ id: 3, title: "conFusion Server", description: "The Backend API is a comprehensive solution tailored for managing recipe-related functionalities in a web environment. This API provides a range of endpoints to seamlessly add, retrieve, and modify recipes, as well as enable users to interact with each other through comments and the creation of a personalized list of favorite dishes. Robust user authentication mechanisms ensure secure access to these features.", link: "https://github.com/Nuzaim/conFusionServer/" },
		{ id: 4, title: "StudyMate", description: "StudyMate is a simple and easy-to-use web-based platform for retrieving study materials. It is designed for students of APJ Abdul Kalam Technological University (KTU).", link: "https://ministudymate.web.app/" }
	]);
	const [isScroll, setIsScroll] = useState(false);

	window.addEventListener("scroll", () => { setIsScroll(true); });

	const tiles = data.map(item => <Tile id={item.id} title={item.title} description={item.description} link={item.link} />);

	return (
		<>
			<header>
				<h1 className="name"><span>Hi,<span className="emoji">👋</span></span><span>I'm Nuzaim Noushad.</span></h1>
				<p>A Fullstack Developer.</p>
			</header>
			{window.innerWidth > 515 ? <Navbar scroll={isScroll} /> : <MobileNav />}
			<h1 id="projects">Projects</h1>
			<section style={{ marginTop: "6rem" }}>
				{tiles}
			</section>
			<About />
			<Footer />
		</>
	)
}

export default App;
