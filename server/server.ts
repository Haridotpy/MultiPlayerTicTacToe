import express, { Request, Response } from "express";
import { createServer, Server } from "http";
import { nanoid } from "nanoid";
import cors from "cors";
import { Server as SocketServer, Socket } from "socket.io";

const app = express();
const httpServer: Server = createServer(app);

const CORS_OPTION = {
	origin: process.env.CLIENT_URI,
};

const rooms: any = {};

app.use(cors(CORS_OPTION));
app.use(express.json());

app.post("/create-room", (req: Request, res: Response) => {
	const { id, name } = req.body as { id: string; name: string };
	const roomId: string = nanoid(8);
	rooms[roomId] = { [id]: { name, turn: "x" } };

	res.status(201).json({
		message: "Successfully created room",
		roomId,
	});
});

app.post("/join-room/:roomId", (req: Request, res: Response) => {
	const { roomId } = req.params as { roomId: string };
	const { name, id } = req.body as { name: string; id: string };

	if (!rooms.hasOwnProperty(roomId)) {
		return res.status(404).json({
			error: `Cannot find the room with id ${roomId}`,
		});
	}
	rooms[roomId] = { ...rooms[roomId], [id]: { name, turn: "y" } };
	res.status(200).json({
		message: "Successfully joined room",
	});
});

const io = new SocketServer(httpServer, {
	cors: CORS_OPTION,
});

io.on("connection", (socket: Socket) => {
	const { user, roomId } = socket.handshake.auth;

	if (!rooms[roomId]) {
		return io.emit("connect-err", "Room does exits!");
	}

	socket.join(roomId);

	socket.on("disconnect", () => {
		console.log("socket disconnected!");
	});
});

httpServer.listen(5000, () => {
	console.log("Server started on port 5000");
});
