import { useBoard } from "../Context/BoardProvider";
import Cell from "./Cell";

const Board = () => {
	const board = useBoard();

	return (
		<div className="board">
			{board.map((mark, idx) => (
				<Cell key={idx} mark={mark} />
			))}
		</div>
	);
};

export default Board;
