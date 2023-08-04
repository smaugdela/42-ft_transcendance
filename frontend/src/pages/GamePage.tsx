import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/contexts'; 
import '../App.css';
import'../styles/GamePage.css';
import { toast } from 'react-hot-toast';

export default function GamePage() {
	const socket = useContext(SocketContext);
	const navigate = useNavigate();

	socket?.on("match ready", (mode: string) => {
			const duration = 2500; // 2.5 seconds

			setTimeout(() => {
				// Only send "match declined" if the match is still in the waiting state
				// toast.dismiss("matchmaking");
				socket.off("match ready");
				if (mode === "Custom") {
					navigate("/custompong");
				} else {
					navigate("/pong");
				}
			}, duration + 500);

			toast.success("Match found! Redirecting to game...",
				{
					id: "matchmaking",
					icon: "🎉",
					duration: duration,
				}
			);
		}
	);

	const leaveQueueButton = (
		<button
			className="button3"
			onClick={() => {
				socket?.emit("Leave Queue");
				toast.success("Left queue.", {
					id: "matchmaking",
					duration: 3000,
				});
			}}>
			Cancel
		</button>
	);

	const handleCustom = () => {
		if (socket) {
			socket.emit("Join Queue", "Custom");
			toast.loading(<span>Looking for a custom match... {leaveQueueButton} </span>, {
				id: "matchmaking",
				icon: "🔍",
			
			});
		} else {
			console.log("Socket is null");
		}
	};

	const handleClassic = () => {
		if (socket) {
			socket.emit("Join Queue", "Classic");
			toast.loading(<span>Looking for a classic match... {leaveQueueButton} </span>, {
				id: "matchmaking",
				icon: "🔍",
			});
		} else {
			console.log("Socket is null");
		}
	};

	return (
		<div id="play-screen2">
				<div className="button1" onClick={handleClassic} data-text="MODE CLASSIC"
				title="Use the up and down arrows of your keyboard to play !">
					CLASSIC MODE
				</div>
				<div className="button2" onClick={handleCustom} data-text="MODE CUSTOM"
				title="Use the powerup to change de direction of the arrows !">
					CUSTOM MODE
				</div>
		</div>
	);
}
