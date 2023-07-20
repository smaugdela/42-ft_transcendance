import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../App';
import '../App.css';
import'../styles/GamePage.css';
import { toast } from 'react-hot-toast';

export default function GamePage() {
	const socket = useContext(SocketContext);
	const navigate = useNavigate();

	socket?.on("match ready", () => {
			// Spawn a toast with a timer of 10 seconds and a button to accept the match
			const duration = 10000; // 10 seconds

			const handleAcceptMatch = () => {
				clearTimeout(id);
				toast.dismiss("matchmaking");
				socket.off("match canceled");
				navigate("/pong");
			};

			const id = setTimeout(() => {
				// Only send "match declined" if the match is still in the waiting state
				toast.dismiss("matchmaking");
				socket?.emit("decline match");
			}, duration + 10);

			const acceptButton = (
				<button className="toast-button" onClick={handleAcceptMatch} data-text="ACCEPT">
					ACCEPT
				</button>
			);

			toast.success(
				<span>
					Match found!{acceptButton}
				</span>,
				{
					id: "matchmaking",
					icon: "🎉",
					position: "bottom-center",
					duration: duration,
				}
			);
		}
	);

	socket?.on("match canceled", () => {
		toast.error("Players not ready in time.", {
			id: "matchmaking",
			icon: "❌",
			position: "bottom-center",
			duration: 3000,
		});
		navigate("/");
	});

	const handleMulti = () => {
		if (socket) {
			socket.emit("Join Queue");
			toast.loading("Searching for a match...", {
				id: "matchmaking",
				position: "bottom-center",
			});
		} else {
			console.log("Socket is null");
		}
	};

	return (
		<div id="play-screen2">
			<button className="button1" data-text="MODE SOLO">
				MODE SOLO
			</button>
			<button className="button2" onClick={handleMulti} data-text="MODE MULTI">
				MODE MULTI
			</button>
		</div>
	);
}
