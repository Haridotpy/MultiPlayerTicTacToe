import React, { useState, createContext, useContext, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { isDraw, isWin } from "../utils";
import { io, Socket } from "socket.io-client";
import { useTimeout } from "../hooks/useTimeout";
import { GameContextType, Opponent } from "../types/types";

interface Props {
	children: React.PropsWithChildren<React.ReactNode>;
}

const defaultBoard: string[] = Array.from<string>({ length: 9 }).fill("");

const GameContext = createContext<GameContextType>({
	board: defaultBoard,
	currentTurn: "",
	hasEnded: false,
	roomId: "",
	message: "",
	loading: false,
	disableBoard: true,
	play: (pos: number, turn: string) => void 0,
});

const endpoit = process.env.REACT_APP_API_ENDPOINT! as string;

export const useGame = (): GameContextType => useContext(GameContext);

export const GameProvider = ({ children }: Props) => {
	const [opponent, setOpponent] = useState<Opponent | null>(null);
	const [currentTurn, setCurrentTurn] = useState<string>("x");
	const [board, setBoard] = useState<string[]>(defaultBoard);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");
	const [end, setEnd] = useState<boolean>(false);
	const [mark, setMark] = useState<string>("");
	const navigate = useNavigate();
	const params = useParams();
	const [user] = useUser();

	const isYourTurn = mark === currentTurn;
	const disableBoard: boolean = !isYourTurn || opponent === null || end;

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

	const updateBoard = useCallback(
		(pos: number, turn: string) => {
			return board.map((cell: string, idx: number) => (idx === pos ? turn : cell));
		},
		[board]
	);

	useEffect(() => {
		if (!socket) return;

		socket.on("turn", turn => {
			setMark(turn);
		});

		socket.on("player-joined", (player: Opponent) => {
			setOpponent(player);
			setMessage(`${player.name} Joined`);
		});

		socket.on("opponent", (player: Opponent) => {
			setOpponent(player);
		});

		socket.on("played", (pos, turn) => {
			setBoard(updateBoard(pos, turn));
			setCurrentTurn(turn === "x" ? "o" : "x");
		});

		socket.on("player-disconnected", (name: string) => {
			setMessage(name);
		});

		return () => {
			socket.off("turn");
			socket.off("player-joined");
			socket.off("opponent");
			socket.off("player-disconnected");
		};
	}, [socket, updateBoard]);

	const play = (pos: number, turn: string): void => {
		if (!!board[pos] || disableBoard) return;

		socket?.emit("play", pos, turn);

		const updatedBoard = updateBoard(pos, turn);
		setBoard(updatedBoard);

		if (isDraw(updatedBoard)) {
			socket?.emit("end", "Draw!!");
			setEnd(true);
			return;
		}

		if (isWin(updatedBoard, currentTurn)) {
			socket?.emit("end", `${currentTurn.toUpperCase()} Wins`);
			setEnd(true);
			return;
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
				loading,
				disableBoard,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};
