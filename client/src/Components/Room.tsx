import React from "react";
import { Params, useParams, useNavigate } from "react-router-dom";
import Board from "./Board";
import { useGame } from "../Context/GameProvider";

type RouterParams = Readonly<Params<string>>;

const Room = () => {
	const params: RouterParams = useParams();
	const { roomId } = params;
	const navigate = useNavigate();
	const { message, loading } = useGame();

	const leaveRoom = () => {
		navigate("/");
	};

	return (
		<div>
			{loading ? (
				<h1>Loading....</h1>
			) : (
				<>
					<h4 className="center">Room ID: {roomId}</h4>
					{message && <h4 className="center">{message}</h4>}
					<section>
						<Board />
					</section>
					<div>
						<button onClick={leaveRoom}>Leave Room</button>
					</div>
				</>
			)}
		</div>
	);
};

export default Room;
