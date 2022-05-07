export interface GameContextType {
	board: string[];
	currentTurn: string;
	roomId: string;
	message: string;
	hasEnded: boolean;
	loading: boolean;
	disableBoard: boolean;
	play: (pos: number, turn: string) => void;
}

export interface User {
	id: string;
	name: string;
}

export interface Opponent extends User {
	turn: string;
}
