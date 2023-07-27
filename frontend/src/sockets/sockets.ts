import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

export function createSocketConnexion(){
	const base_url: string = process.env.REACT_APP_BACKEND_URL || "https://localhost:3001";

	const newSocket = io(base_url, {
	  withCredentials: true,
	});
	return (newSocket);
}

/**
 * 
 * @param socket connexion du client avec notre serveur
 * @param event  par exemple: 'Game', 'Chat', 'Create Lobby'
 * @param payload par exemple: un msg du client, son move dans le jeu
 */
export function sendNotificationToServer(socket: Socket, event: string, payload: string) {
	if (socket) {
		socket.emit(event, payload);
  }
};