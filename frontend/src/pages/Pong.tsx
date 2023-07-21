import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../App";
import { Stage, Graphics } from "@pixi/react";
import toast from "react-hot-toast";

export function Pong() {

	const socket = useContext(SocketContext);
	const navigate = useNavigate();
	let running = true;
	void running;

	socket?.on('match started', () => {
		// Launch the logic for the game
		console.log('Match started');
		toast.success('FIGHT ON!', {
			id: 'matchmaking',
			icon: '🎉',
			position: 'bottom-center',
			duration: 3000,
		});
	});

	socket?.on('match canceled', () => {

		console.log('Match canceled');
		running = false;

		toast.error('Player disconnected.', {
			id: 'matchmaking',
			icon: '❌',
			position: 'bottom-center',
			duration: 2000,
		});

		setTimeout(() => {
			// Redirect to the home page
			toast.dismiss('matchmaking');
			navigate('/');
		}, 2500);

	});

	socket?.emit('accept match');

	useEffect(() => {
		// Your game logic and update loop can go here

		const fps = 30;

		// Send the game input to the backend once every 'fps' ticks
		const tick = Date.now();
		if (Date.now() - tick >= 1/fps)
		{
			socket?.emit('game input', {
				// Game input
			});
		}

	return () => {
		// Cleanup if needed
	  };
	}, [socket]);

	return (
	  <Stage width={800} height={600} options={{ backgroundColor: 0x000000 }}>
		{/* Render the paddles */}
		<Graphics
		  x={30} // X position for the left paddle
		  y={250} // Y position for the left paddle
		  draw={graphics => {
			graphics.beginFill(0xffffff); // White color
			graphics.drawRect(0, 0, 10, 100); // Paddle dimensions
			graphics.endFill();
		  }}
		/>
		<Graphics
		  x={760} // X position for the right paddle
		  y={250} // Y position for the right paddle
		  draw={graphics => {
			graphics.beginFill(0xffffff); // White color
			graphics.drawRect(0, 0, 10, 100); // Paddle dimensions
			graphics.endFill();
		  }}
		/>

		{/* Render the ball */}
		<Graphics
		  x={400} // X position for the ball
		  y={300} // Y position for the ball
		  draw={graphics => {
			graphics.beginFill(0xff0000); // Red color
			graphics.drawCircle(0, 0, 10); // Ball radius
			graphics.endFill();
		  }}
		/>

		{/* Render the arena contour */}
		<Graphics
		  draw={graphics => {
			graphics.lineStyle(2, 0xffffff); // White color for the contour
			graphics.drawRect(0, 0, 800, 600); // Arena dimensions
		  }}
		/>
		</Stage>
	);
};
