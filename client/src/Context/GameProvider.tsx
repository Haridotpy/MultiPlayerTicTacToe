import React, { useState, createContext, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { isDraw, isWin } from "../utils";

interface Props {
	children: React.PropsWithChildren<React.ReactNode>;
}

interface GameContextType {
	board: string[];
	currentTurn: string;
	roomId: string;
	message: string;
	result: string;
	hasEnded: boolean;
	play: (pos: number, turn: string) => void;
}

const defaultBoard: string[] = Array.from<string>({ length: 9 }).fill("");

const GameContext = createContext<GameContextType>({
	board: defaultBoard,
	currentTurn: "",
	hasEnded: false,
	roomId: "",
	message: "",
	result: "",
	play: (pos: number, turn: string) => void 0,
});

export const useGame = (): GameContextType => useContext(GameContext);

export const GameProvider = ({ children }: Props) => {
	const [board, setBoard] = useState<string[]>(defaultBoard);
	const [currentTurn, setCurrentTurn] = useState<string>("x");
	const [end, setEnd] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");
	const [result, setResult] = useState<string>("");
	const params = useParams();
	const user = useUser();
	const { roomId } = params as { roomId: string };

	useEffect(() => {
		if (!message) return;

		const timeout = setTimeout(() => {
			setMessage("");
		}, 2000);

		return () => {
			clearTimeout(timeout);
		};
	}, [message]);

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
			setResult("Draw!!");
			return;
		}

		if (isWin(updatedBoard, currentTurn)) {
			setEnd(true);
			setResult(`${turn.toUpperCase()} Wins!`);
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
				message,
				result,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};
