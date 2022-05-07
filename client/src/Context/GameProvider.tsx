import React, { useState, createContext, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { isDraw, isWin } from "../utils";
import { io, Socket } from "socket.io-client";
import { useTimeout } from "../hooks/useTimeout";

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
	loading: boolean;
	isYourTurn: boolean;
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
	loading: false,
	isYourTurn: false,
	play: (pos: number, turn: string) => void 0,
});

const endpoit = process.env.REACT_APP_API_ENDPOINT! as string;

export const useGame = (): GameContextType => useContext(GameContext);

export const GameProvider = ({ children }: Props) => {
	const [board, setBoard] = useState<string[]>(defaultBoard);
	const [currentTurn, setCurrentTurn] = useState<string>("x");
	const [mark, setMark] = useState<string>("");
	const [end, setEnd] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");
	const [socket, setSocket] = useState<Socket | null>(null);
	const [result, setResult] = useState<string>("");
	const navigate = useNavigate();
	const params = useParams();
	const [user] = useUser();

	const isYourTurn = mark === currentTurn;

	const { roomId } = params as { roomId: string };

	useTimeout(
		() => {
			setMessage("");
		},
		3000,
		[message]
	);

	useEffect(() => {
		setLoading(true);
		const s = io(endpoit, {
			auth: {
				user,
				roomId,
			},
		});

		setSocket(s);

		s.on("connect", () => {
			setLoading(false);
		});

		s.on("connect-err", msg => {
			navigate("/", { state: { message: msg } });
		});

		return () => {
			s.close();
		};
	}, []);

	useEffect(() => {
		if (!socket) return;

		socket.on("turn", turn => {
			setMark(turn);
		});

		return () => {
			socket.off("turn");
		};
	}, [socket]);

	const updateBoard = (board: string[], pos: number, turn: string) => {
		return board.map((cell: string, idx: number) => (idx === pos ? turn : cell));
	};

	const play = (pos: number, turn: string): void => {
		if (end || !!board[pos] || !isYourTurn) return;

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
				loading,
				isYourTurn,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};
