import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../App";
import { Stage, Graphics, AppConsumer, useApp } from "@pixi/react";
import toast from "react-hot-toast";
import { Ticker } from "pixi.js";

export function Pong() {
	const socket = useContext(SocketContext);
	const navigate = useNavigate();
	const [running, setRunning] = useState(true);
	const fps = 30;
	const width = 800;
	const height = 600;
	const paddleLength = 100;
	const paddleWidth = 10;
	const ballRadius = 10;
	let userId = -1;

	const [gameState, setGameState] = useState({
		leftPaddleY: height / 2,
		rightPaddleY: height / 2,
		ballX: width / 2,
		ballY: height / 2,
	});

	const [rightPaddle, setRightPaddle] = useState(gameState.rightPaddleY);
	const [leftPaddle, setLeftPaddle] = useState(gameState.leftPaddleY);

	const app = useApp();
	
	useEffect(() => {
		socket?.emit("accept match");
	}, [socket]);

	useEffect(() => {

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowUp") {
				setGameInput((prevInput) => ({
					...prevInput,
					up: true,
				}));
			} else if (event.key === "ArrowDown") {
				setGameInput((prevInput) => ({
					...prevInput,
					down: true,
				}));
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.key === "ArrowUp") {
				setGameInput((prevInput) => ({
					...prevInput,
					up: false,
				}));
			} else if (event.key === "ArrowDown") {
				setGameInput((prevInput) => ({
					...prevInput,
					down: false,
				}));
			}
		};

		// Add event listeners for keydown and keyup
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		// Clean up event listeners on component unmount
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [socket, gameInput]);

	useEffect(() => {
		// Game update loop with PixiJS ticker
		const gameLoop = (delta: number) => {
			// Your game logic and update loop can go here
			// For example, update the game state, move objects, etc.

			// Send the game input to the backend
			socket?.emit("game input", gameInput);
		};

		// Add the game loop to the PixiJS ticker
		Ticker.shared.add(gameLoop);
		Ticker.shared.maxFPS = fps;

		// Clean up the game loop on component unmount
		return () => {
			Ticker.shared.remove(gameLoop);
		};
	}, [socket, gameInput]);

	// Update game state whenever new data arrives from the server
	useEffect(() => {
		socket?.on("game state", (matchClass: any) => {
			// Update the game state and convert the data to the correct format
			setGameState({
				leftPaddleY: matchClass.p1posY * (height / 2) + height / 2,
				rightPaddleY: matchClass.p2posY * (height / 2) + height / 2,
				ballX: matchClass.ballX * (width / 2) + width / 2,
				ballY: matchClass.ballY * (height / 2) + height / 2,
			});
		});

		// Log when the match starts and get payload
		socket?.on("match started", (payload: number) => {
			userId = payload;
			console.log("Match started");
			toast.success("FIGHT ON!", {
				id: "matchmaking",
				icon: "🎉",
				position: "bottom-center",
				duration: 3000,
			});
		});

		// Handle match cancellation
		socket?.on("match canceled", () => {
			console.log("Match canceled");
			setRunning(false);

			toast.error("Player disconnected.", {
				id: "matchmaking",
				icon: "❌",
				position: "bottom-center",
				duration: 2000,
			});

			setTimeout(() => {
				// Redirect to the home page
				toast.dismiss("matchmaking");
				navigate("/");
			}, 2500);
		});
	}, [socket, navigate]);

	return (
		<AppConsumer>
			{(app) => (
				<Stage
					width={width}
					height={height}
					options={{ backgroundColor: 0x000000 /*, backgroundAlpha: 0.5 */}}
				>
					{/* Render the ball */}
					<Graphics
						x={0} // X position for the ball
						y={0} // Y position for the ball
						draw={(graphics) => {
							graphics.clear();
							graphics.beginFill(0xff0000); // Red color
							graphics.drawCircle(gameState.ballX, gameState.ballY, ballRadius); // Ball radius
							graphics.endFill();
						}}
					/>

					{/* Render the paddles */}
					<Graphics
						x={30} // X position for the left paddle
						y={gameState.leftPaddleY} // Y position for the left paddle
						draw={(graphics) => {
							graphics.beginFill(0xffffff); // White color
							graphics.drawRect(0, 0, paddleWidth, paddleLength); // Paddle dimensions
							graphics.endFill();
						}}
					/>
					<Graphics
						x={760} // X position for the right paddle
						y={gameState.rightPaddleY} // Y position for the right paddle
						draw={(graphics) => {
							graphics.beginFill(0xffffff); // White color
							graphics.drawRect(0, 0, paddleWidth, paddleLength); // Paddle dimensions
							graphics.endFill();
						}}
					/>

					{/* Render the arena contour as two lines above and below the terrain */}
					<Graphics
						draw={(graphics) => {
							graphics.lineStyle(paddleWidth, 0xffffff); // White color
							graphics.moveTo(0, 0); // Start at the top left corner
							graphics.lineTo(width, 0); // Draw a line to the top right corner
							graphics.moveTo(0, height); // Start at the bottom left corner
							graphics.lineTo(width, height); // Draw a line to the bottom right corner
						}}
					/>
				</Stage>
			)}
		</AppConsumer>
	);
}
