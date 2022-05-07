export interface GameContextType {
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

export interface User {
	id: string;
	name: string;
}

export interface Opponent {
	user: User;
	turn: string;
}
