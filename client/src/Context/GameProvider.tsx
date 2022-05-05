import React, { useState, createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import { isDraw, isWin } from "../utils";

interface Props {
	children: React.PropsWithChildren<React.ReactNode>;
}

interface User {
	id: string;
	name: string;
}

interface GameContextType {
	board: string[];
	currentTurn: string;
	roomId: string;
	hasEnded: boolean;
	play: (pos: number, turn: string) => void;
}

const defaultBoard: string[] = Array.from<string>({ length: 9 }).fill("");

const GameContext = createContext<GameContextType>({
	board: defaultBoard,
	currentTurn: "",
	hasEnded: false,
	roomId: "",
	play: (pos: number, turn: string) => void 0,
});

export const useGame = (): GameContextType => useContext(GameContext);

export const GameProvider = ({ children }: Props) => {
	const [board, setBoard] = useState<string[]>(defaultBoard);
	const [currentTurn, setCurrentTurn] = useState<string>("x");
	const [end, setEnd] = useState<boolean>(false);
	const params = useParams();
	const { roomId } = params as { roomId: string };

	const updateBoard = (board: string[], pos: number, turn: string) => {
		return board.map((cell: string, idx: number) => (idx === pos ? turn : cell));
	};

	const play = (pos: number, turn: string): void => {
		if (end || !!board[pos]) return;

		const updatedBoard = updateBoard(board, pos, turn);
		setBoard(updatedBoard);

		console.log(updatedBoard);

		if (isDraw(updatedBoard)) {
			setEnd(true);
			return console.log("Draw!!");
		}

		if (isWin(updatedBoard, currentTurn)) {
			setEnd(true);
			return console.log(`${currentTurn} Wins`);
		}

		setCurrentTurn(prev => (prev === "x" ? "o" : "x"));
	};

	return (
		<GameContext.Provider
			value={{
				board,
				play,
				currentTurn,
				hasEnded: end,
				roomId,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};
