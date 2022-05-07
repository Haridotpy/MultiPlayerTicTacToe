import { useGame } from "../Context/GameProvider";
import Cell from "./Cell";

const Board = () => {
	const { board, play, currentTurn, hasEnded, isYourTurn } = useGame();

	return (
		<div className="board">
			{board.map((mark, idx) => (
				<Cell
					key={idx}
					mark={mark}
					onClick={() => play(idx, currentTurn)}
					disabled={hasEnded || !isYourTurn}
				/>
			))}
		</div>
	);
};

export default Board;
