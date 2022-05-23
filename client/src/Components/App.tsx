import { useState, useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import useUser from "../hooks/useUser";
import Header from "./Header";

const endPoint = process.env.REACT_APP_API_ENDPOINT;

const App = () => {
	const [name, setName] = useState<string>("");
	const [roomId, setRoomId] = useState<string>("");
	const [user, setUser] = useUser();
	const [error, setError] = useState<string>("");
	const navigate: NavigateFunction = useNavigate();

	useEffect(() => {
		return () => {
			setName("");
			setRoomId("");
			setError("");
		};
	}, []);

	const createUser = () => {
		setUser({
			id: uuidV4(),
			name
		});
	};

	const createRoom = async (): Promise<void> => {
		try {
			const response = await fetch(`${endPoint}/create-room`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(user)
			});
			const { roomId: rID }: { message: string; roomId: string } = await response.json();
			navigate(`/room/${rID}`);
		} catch (err: any) {
			console.error(err.message);
		}
	};

	const joinRoom = async (): Promise<void> => {
		setError("");
		if (!roomId) {
			setError("Please enter a valid Room ID");
			return;
		}
		try {
			const response = await fetch(`${endPoint}/join-room/${roomId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(user)
			});
			const data = await response.json();
			if (!response.ok) {
				const { error: e } = data;
				return setError(e);
			}
			navigate(`/room/${roomId}`);
		} catch (err: any) {
			console.error(err.message);
		}
	};

	return (
		<>
			<Header />
			<section>
				<div>
					{error && <span className="error center">{error}</span>}
					<div className="container">
						{user.name !== "" ? (
							<h2 className="center">Hello, {user.name}</h2>
						) : (
							<div className="input-group">
								<label htmlFor="name-input">Name</label>
								<input
									type="text"
									placeholder="eg: ABC"
									id="name-input"
									value={name}
									onChange={e => setName(e.target.value)}
								/>
								<button onClick={createUser} className="btn-primary">
									Submit
								</button>
							</div>
						)}
					</div>
					<div className="input-container">
						<div className="input-group">
							<h3 className="center">Join Room</h3>
							<label htmlFor="">Enter Room ID</label>
							<input
								type="text"
								placeholder="eg: fjB1P79Z"
								value={roomId}
								onChange={e => setRoomId(e.target.value)}
							/>
							<button className="btn-primary" onClick={joinRoom}>
								Join Room
							</button>
						</div>
						<div className="input-group">
							<h3 className="center">Create New Room</h3>
							<button className="btn-primary" onClick={createRoom}>
								Create Room
							</button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default App;
