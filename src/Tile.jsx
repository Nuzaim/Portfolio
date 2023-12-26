import "./Tile.css";

function Tile(props) {
	return (
		<a id={props.id} href={props.link} >
			<h2>{props.title}</h2>
			<p>{props.description}</p>
		</a>
	)
}

export default Tile;
