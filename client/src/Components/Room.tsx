import React from "react";
import { Params, useParams } from "react-router-dom";

type RouterParams = Readonly<Params<string>>;

const Room = () => {
	const params: RouterParams = useParams();
	const { roomId } = params;

	return (
		<div>
			<h1>Room ID: {roomId}</h1>
		</div>
	);
};

export default Room;
