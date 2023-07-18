import { useContext } from "react";
import { SocketContext } from "../App";

export default function Pong() {

	// Here will be the frontend logic for the game
	
	const socket = useContext(SocketContext);

	socket?.on('game state', () => {
		// Update the game state
	});

	let tick = Date.now();

	while (true) {
		// Send the game input to the backend once every 30 ticks

		if (Date.now() - tick >= 1/30)
		{
			tick = Date.now();
			socket?.emit('game input', {
				// Game input
			});
		}

		return (
			<div>
				<h1>Pong</h1>
			</div>
		);
	}
}
