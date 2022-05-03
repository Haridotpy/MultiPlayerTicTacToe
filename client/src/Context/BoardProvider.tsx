import React, { useState, createContext, useContext } from "react";

interface Props {
	children: React.PropsWithChildren<React.ReactNode>;
}

const defaultBoard: string[] = Array.from<string>({ length: 9 }).fill("");

const BoardContext = createContext<string[]>(defaultBoard);

export const useBoard = (): string[] => useContext(BoardContext);

export const BoardProvider = ({ children }: Props) => {
	const [board, setBoard] = useState<string[]>(defaultBoard);

	return <BoardContext.Provider value={board}>{children}</BoardContext.Provider>;
};
