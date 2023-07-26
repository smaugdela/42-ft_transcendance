import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../App";
import { Stage, Graphics, AppConsumer, useApp, Text, Container } from "@pixi/react";
import toast from "react-hot-toast";
import { Ticker } from "pixi.js";
import * as PIXI from "pixi.js";
import "../styles/Pong.css"

export function Pong() {
	const socket = useContext(SocketContext);
	const navigate = useNavigate();
	// const [running, setRunning] = useState(true);
	const fps = 60;
	const sps = 10;
	const width = 800;
	const height = 600;
	const paddleSpeed = 400;
	const paddleLength = 100;
	const paddleWidth = 10;
	const ballRadius = 10;
	let lastTime = useRef(Date.now());
	let lastCall = useRef(Date.now());

	const [leftUser, setLeftUser] = useState(true);

	const [gameState, setGameState] = useState({
		leftPaddleY: height / 2,
		rightPaddleY: height / 2,
		ballX: width / 2,
		ballY: height / 2,
		ballSpeedX: 0,
		ballSpeedY: 0,
		p1Score: 0,
		p2Score: 0,
		p1Username: "",
		p2Username: "",
	});

	const [downKeyPressed, setDownKeyPressed] = useState(false);
	const [upKeyPressed, setUpKeyPressed] = useState(false);

	const app = useApp();
	void app;

	useEffect(() => {
		socket?.emit("accept match");
	}, [socket]);

	useEffect(() => {

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowUp") {
				event.preventDefault();
				setUpKeyPressed(true);
			} else if (event.key === "ArrowDown") {
				event.preventDefault();
				setDownKeyPressed(true);
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.key === "ArrowUp") {
				setUpKeyPressed(false);
			} else if (event.key === "ArrowDown") {
				setDownKeyPressed(false);
			}
		};

		// Add event listeners for keydown and keyup
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		console.log("event listeners added");

		// Clean up event listeners on component unmount
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};

	}, [upKeyPressed, downKeyPressed] );

	useEffect(() => {
		// Game update loop with PixiJS ticker
		const gameLoop = () => {

			// Calculate delta time
			const now = Date.now();
			const delta = (now - lastTime.current) / 1000; // In seconds

			// Update paddle position
			switch (leftUser) {
				case true:
				{
					if (upKeyPressed && gameState.leftPaddleY > 0) {
						// setLeftPaddle(leftPaddle - (paddleSpeed * delta));
						gameState.leftPaddleY -= (paddleSpeed * delta);
					}

					if (downKeyPressed && gameState.leftPaddleY < height - paddleLength) {
						// setLeftPaddle(leftPaddle + (paddleSpeed * delta));
						gameState.leftPaddleY += (paddleSpeed * delta);
					}
					break;
				}
				case false:
				{
					if (upKeyPressed && gameState.rightPaddleY > 0) {
						// setRightPaddle(rightPaddle - (paddleSpeed * delta));
						gameState.rightPaddleY -= (paddleSpeed * delta);
					}

					if (downKeyPressed && gameState.rightPaddleY < height - paddleLength) {
						// setRightPaddle(rightPaddle + (paddleSpeed * delta));
						gameState.rightPaddleY += (paddleSpeed * delta);
					}
					break;
				}
				default:
					break;
			}

			// Check paddle bounds
			if (gameState.leftPaddleY < 0) {
				gameState.leftPaddleY = 0;
			} else if (gameState.leftPaddleY > height - paddleLength) {
				gameState.leftPaddleY = height - paddleLength;
			}
			if (gameState.rightPaddleY < 0) {
				gameState.rightPaddleY = 0;
			} else if (gameState.rightPaddleY > height - paddleLength) {
				gameState.rightPaddleY = height - paddleLength;
			}

			// Actuate ball state here

			// Check collisions first
			if (gameState.ballY + (gameState.ballSpeedY * delta) - ballRadius < 0 || gameState.ballY + (gameState.ballSpeedY * delta) + ballRadius > height) {
				gameState.ballSpeedY *= -1;
			}
			if (gameState.ballX + (gameState.ballSpeedX * delta) - ballRadius - paddleWidth < 0) {
				if (gameState.ballY > gameState.leftPaddleY && gameState.ballY < gameState.leftPaddleY + paddleLength) {
					// It bounces on the paddle
					gameState.ballSpeedX *= -1.8;
				}
				else {
					gameState.ballSpeedX *= -0.5;
				}
			}
			else if (gameState.ballX + (gameState.ballSpeedX * delta) + ballRadius + paddleWidth > width) {
				if (gameState.ballY > gameState.rightPaddleY && gameState.ballY < gameState.rightPaddleY + paddleLength) {
					// It bounces on the paddle
					gameState.ballSpeedX *= -1.8;
				}
				else {
					gameState.ballSpeedX *= -0.5;
				}
			}

			gameState.ballX += gameState.ballSpeedX * delta;
			gameState.ballY += gameState.ballSpeedY * delta;

			// Send the game input to the backend every sps tick
			if (now - lastCall.current >= 1 / sps)
			{
				switch (leftUser){
					case true:
						socket?.emit("game input", gameState.leftPaddleY);
						break;
					case false:
						socket?.emit("game input", gameState.rightPaddleY);
						break;
					default:
						break;
				}
				lastCall.current = now;
			}

			// Update the last time
			lastTime.current = now;
		};

		// Add the game loop to the PixiJS ticker
		Ticker.shared.add(gameLoop);
		Ticker.shared.maxFPS = fps;

		// Clean up the game loop on component unmount
		return () => {
			Ticker.shared.remove(gameLoop);
		};
	}, [socket, leftUser, upKeyPressed, downKeyPressed, gameState]);

	// Update game state whenever new data arrives from the server
	useEffect(() => {
		socket?.on("game state", (matchClass: any) => {
			// Update the game state and convert the data to the correct format
			setGameState({
				leftPaddleY: matchClass.p1posY,
				rightPaddleY: matchClass.p2posY,
				ballX: matchClass.ballX,
				ballY: matchClass.ballY,
				ballSpeedX: matchClass.ballSpeedX,
				ballSpeedY: matchClass.ballSpeedY,
				p1Score: matchClass.player1.score,
				p2Score: matchClass.player2.score,
				p1Username: matchClass.player1.username,
				p2Username: matchClass.player2.username,
			});
		});

		// Log when the match starts and get payload
		socket?.on("match started", (payload: boolean) => {

			setLeftUser(payload);

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
			// setRunning(false);

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
	}, [socket, navigate, leftUser]);

	return (
		<AppConsumer>
			{(app) => (
				<div className="pong-terrain">
				<Stage
					width={width}
					height={height}
					options={{ backgroundColor: 0x000000 /*, backgroundAlpha: 0.5 */}}
				>
					<Container>
					{/* Render a dashed line in the middle of the terrain */}
					<Graphics
						draw={(graphics) => {
							graphics.lineStyle(5, 0xffffff, 1, 0.5, true); // White color, 5px width, 50% alpha, 50% spacing
							graphics.moveTo(width / 2, 0); // Start at the top middle
							graphics.lineTo(width / 2, height); // Draw a line to the bottom middle
						}}
					/>

					{leftUser && <><Graphics
								draw={(graphics) => {
									graphics.lineStyle(paddleWidth, 0xff0000, 0.8, 0.5); // White color
									graphics.moveTo(0, 0); // Start at the top left corner
									graphics.lineTo(0, height); // Draw a line to the top right corner
								}}
							/>
							<Graphics
								draw={(graphics) => {
									graphics.lineStyle(paddleWidth, 0x00ff00, 0.8, 0.5); // White color
									graphics.moveTo(width, 0); // Start at the top left corner
									graphics.lineTo(width, height); // Draw a line to the top right corner
								}}
						/></>
					}
					{!leftUser && <><Graphics
								draw={(graphics) => {
									graphics.lineStyle(paddleWidth, 0x00ff00, 0.8, 0.5); // White color
									graphics.moveTo(0, 0); // Start at the top left corner
									graphics.lineTo(0, height); // Draw a line to the top right corner
								}}
							/>
							<Graphics
								draw={(graphics) => {
									graphics.lineStyle(paddleWidth, 0xff0000, 0.8, 0.5); // White color
									graphics.moveTo(width, 0); // Start at the top left corner
									graphics.lineTo(width, height); // Draw a line to the top right corner
								}}
						/></>
					}

					{/* Write the usernames on the terrain */}
					<Text
						text={gameState.p1Username + " " + gameState.p1Score}
						anchor={0.5}
						x={width / 4}
						y={height / 10}
						style={
						new PIXI.TextStyle({
							align: 'center',
							fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
							fontSize: 30,
							fontWeight: 'normal',
							fill: ['#ffffff'], // gradient
							// stroke: '#01d27e',
							// strokeThickness: 5,
							// letterSpacing: 20,
							// dropShadow: true,
							// dropShadowColor: '#ccced2',
							// dropShadowBlur: 4,
							// dropShadowAngle: Math.PI / 6,
							// dropShadowDistance: 6,
							wordWrap: true,
							wordWrapWidth: width / 4,
						})
						}
					/>
					<Text
						text={gameState.p2Username + " " + gameState.p2Score}
						anchor={0.5}
						x={width * 3 / 4}
						y={height / 10}
						style={
						new PIXI.TextStyle({
							align: 'center',
							fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
							fontSize: 30,
							fontWeight: 'normal',
							fill: ['#ffffff'], // gradient
							// stroke: '#01d27e',
							// strokeThickness: 5,
							// letterSpacing: 20,
							// dropShadow: true,
							// dropShadowColor: '#ccced2',
							// dropShadowBlur: 4,
							// dropShadowAngle: Math.PI / 6,
							// dropShadowDistance: 6,
							wordWrap: true,
							wordWrapWidth: width / 4,
						})
						}
					/>

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
						x={0} // X position for the left paddle
						y={gameState.leftPaddleY} // Y position for the left paddle
						draw={(graphics) => {
							graphics.clear();
							graphics.beginFill(0xffffff); // White color
							graphics.drawRect(0, 0, paddleWidth, paddleLength); // Paddle dimensions
							graphics.endFill();
						}}
					/>
					<Graphics
						x={width - paddleWidth} // X position for the right paddle
						y={gameState.rightPaddleY} // Y position for the right paddle
						draw={(graphics) => {
							graphics.clear();
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
					</Container>
				</Stage>
			</div>
			)}
		</AppConsumer>
	);
}
