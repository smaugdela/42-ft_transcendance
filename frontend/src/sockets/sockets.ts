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

/**
 * @abstract Special handling for MUTE/KICK/BAN/ADMIN requests
 * @param socket connexion du client avec notre serveur
 * @param payload <Action <Concerned user's nickname>. Ex: '/mute  Joe'
 */
export function handleRequestFromUser(socket: Socket, group: string, channelName: string, userTalking: string) {
	var action: string;
	var info: string;
		switch (group) {
			case "bannedUsers":
				action = "/ban";
				info = `#INFO# ${userTalking} has been banned from this channel.`
				break;
			case "kickedUsers":
				action = "/kick";
				info = `#INFO# ${userTalking} has been kicked from this channel.`
				break;
			case "mutedUsers":
				action = "/mute";
				info = `#INFO# ${userTalking} has been muted in this channel.`
				break;
			case "admin":
				action = "/admin";
				info = `#INFO# ${userTalking} was made Admin of this channel!`
				break;
			default:
				action = "/msg";
				info = `#INFO# ${userTalking} is quoted in this channel.`
		}
	const payload: string = action + "  " + channelName + "  " + userTalking;
	console.log("Info payload ", payload);
	
	sendNotificationToServer(socket, 'Chat', payload);
	return (info);
}