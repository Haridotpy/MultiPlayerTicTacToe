import React, { useState, createContext, useContext, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import useUser from "../hooks/useUser";
import { isDraw, isWin } from "../utils";
import { GameContextType, Opponent } from "../types/types";
import useTimeout from "../hooks/useTimeout";

interface Props {
	children: React.PropsWithChildren<React.ReactNode>;
}

const defaultBoard: string[] = Array.from<string>({ length: 9 }).fill("");

const GameContext = createContext<GameContextType>({
	board: defaultBoard,
	currentTurn: "",
	hasEnded: true,
	roomId: "",
	message: "",
	loading: false,
	disableBoard: true,
	mark: "",
	winner: "",
	opponent: null,
	play: (): void => {},
	restartGame: (): void => {}
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
	const [winner, setWinner] = useState<string>("");
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
				roomId
			}
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
	}, [navigate, roomId, user]);

	const updateBoard = useCallback(
		(pos: number, turn: string) =>
			board.map((cell: string, idx: number) => (idx === pos ? turn : cell)),
		[board]
	);

	const play = useCallback(
		(pos: number, turn: string): void => {
			if (!!board[pos]) return;

			socket?.emit("play", pos, turn);

			const updatedBoard = updateBoard(pos, turn);
			setBoard(updatedBoard);

			if (isWin(updatedBoard, currentTurn)) {
				socket?.emit("stop", `${currentTurn.toUpperCase()} Wins`);
				setEnd(true);
				return;
			}

			if (isDraw(updatedBoard)) {
				socket?.emit("stop", "Draw!!");
				setEnd(true);
				return;
			}

			setCurrentTurn(prev => (prev === "x" ? "o" : "x"));
		},
		[socket, updateBoard, currentTurn, board]
	);

	const restartGame = useCallback(() => {
		if (!socket) return;

		socket.emit("restart", { userId: user.id, roomId });
		setMark(prev => (prev === "x" ? "o" : "x"));
		setOpponent(prev => {
			if (!prev) return prev;
			return { ...prev, turn: prev.turn === "x" ? "o" : "x" };
		});
		setBoard(defaultBoard);
		setCurrentTurn("x");
		setEnd(false);
	}, [socket, user.id, roomId]);

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
			play(pos, turn);
		});

		socket.on("end", (msg: string) => {
			setWinner(msg);
		});

		socket.on("player-disconnected", (name: string) => {
			setMessage(`${name} disconnected`);
		});

		socket.on("restart", opponent => {
			setMark(prev => (prev === "x" ? "o" : "x"));
			setOpponent(opponent);
			setBoard(defaultBoard);
			setCurrentTurn("x");
			setEnd(false);
		});

		return () => {
			socket.off("turn");
			socket.off("player-joined");
			socket.off("opponent");
			socket.off("played");
			socket.off("player-disconnected");
			socket.off("end");
			socket.off("restart");
		};
	}, [socket, updateBoard, play]);

	const value = useMemo<GameContextType>(
		() => ({
			board,
			play,
			opponent,
			mark,
			currentTurn,
			hasEnded: end,
			roomId,
			message,
			loading,
			winner,
			disableBoard,
			restartGame
		}),
		[
			board,
			play,
			currentTurn,
			end,
			roomId,
			message,
			loading,
			winner,
			disableBoard,
			opponent,
			mark,
			restartGame
		]
	);

	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
