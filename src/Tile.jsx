import PropTypes from "prop-types";
import "./Tile.css";

function Tile({ as: Component = "div", children, className = "", ...props }) {
	return (
		<Component className={`tile ${className}`.trim()} {...props}>
			{children}
		</Component>
	);
}

Tile.propTypes = {
	as: PropTypes.elementType,
	children: PropTypes.node,
	className: PropTypes.string
};

export default Tile;
