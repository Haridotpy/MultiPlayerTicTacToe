import { useGame } from "../Context/GameProvider";
import { useNavigate } from "react-router-dom";

const Modal = () => {
	const { hasEnded, winner, restartGame } = useGame();
	const navigate = useNavigate();

	const leaveRoom = () => {
		navigate("/");
	};

	return (
		<div className={`modal ${hasEnded && "modal-open"}`}>
			<div className="modal-content">
				<div className="modal-title">
					<h1>{winner}</h1>
				</div>
				<div className="modal-body">
					<button className="btn btn-primary" onClick={restartGame}>
						Restart
					</button>
					<button className="btn btn-danger" onClick={leaveRoom}>
						Quit
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
