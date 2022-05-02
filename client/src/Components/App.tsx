import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { v4 as uuidV4 } from "uuid";

interface User {
	id: string;
	name: string;
}

const defaultUser = {
	id: "",
	name: "",
};

const endPoint = process.env.REACT_APP_API_ENDPOINT;

const App = () => {
	const [name, setName] = useState<string>("");
	const [roomId, setRoomId] = useState<string>("");
	const [user, setUser] = useUser<User>(defaultUser);

	const createUser = () => {
		setUser({
			id: uuidV4(),
			name,
		});
	};

	const createRoom = async (): Promise<void> => {
		try {
			const response = await fetch(`${endPoint}/create-room`, {
				method: "POST",
				body: JSON.stringify(user),
			});
			const { roomId }: { message: string; roomId: string } = await response.json();
			console.log(roomId);
		} catch (err: any) {
			console.error(err.message);
		}
	};

	const joinRoom = async (): Promise<void> => {
		try {
			//
		} catch (err: any) {
			console.error(err.message);
		}
	};

	return (
		<>
			<header>
				<h1>Tic Tac Toe</h1>
			</header>
			<section>
				<span className="error"></span>
				{user.name !== "" ? (
					<h2>Hello, {user.name}</h2>
				) : (
					<div>
						<label htmlFor="">Name</label>
						<input
							type="text"
							placeholder="eg: ABC"
							value={name}
							onChange={e => setName(e.target.value)}
						/>
						<button onClick={createUser}>Submit</button>
					</div>
				)}
				<div>
					<h3>Join Room</h3>
					<label htmlFor="">Enter Room ID</label>
					<input
						type="text"
						placeholder="eg: "
						value={roomId}
						onChange={e => setRoomId(e.target.value)}
					/>
					<button onClick={joinRoom}>Join Room</button>
				</div>
				<div>
					<h3>Create New Room</h3>
					<button onClick={createRoom}>Create Room</button>
				</div>
			</section>
		</>
	);
};

export default App;
