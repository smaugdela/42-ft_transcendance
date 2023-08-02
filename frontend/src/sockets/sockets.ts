import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { IChannel } from '../api/types';

export function createSocketConnexion() {
	const base_url: string = import.meta.env.VITE_BACKEND_URL || "https://localhost:3001";

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
export function handleRequestFromUser(socket: Socket, group: string, action: string, channelName: string, userTalking: string) {
	var role: string;
	var info: string;
	switch (group) {
		case "bannedUsers":
			role = "/ban";
			info = (action === "connect") ?
				`#INFO# ${userTalking} has been banned from this channel.`
				: `#INFO# ${userTalking} is unbanned from this channel.`
			break;
		case "kickedUsers":
			role = "/kick";
			info = (action === "connect") ?
				`#INFO# ${userTalking} has been kicked from this channel.`
				: `#INFO# ${userTalking} is not kicked anymore from this channel.`
			break;
		case "mutedUsers":
			role = "/mute";
			info = (action === "connect") ?
				`#INFO# ${userTalking} has been muted from this channel.`
				: `#INFO# ${userTalking} is not muted anymore in this channel.`
			break;
		case "admin":
			role = "/admin";
			info = (action === "connect") ?
				`#INFO# ${userTalking} was made Admin of this channel.`
				: `#INFO# ${userTalking} is not an Admin anymore.`
			break;
		default:
			role = "/msg";
			info = `#INFO# ${userTalking} is quoted in this channel.`
	}
	const payload: string = role + "  " + channelName + "  " + userTalking;
	console.log("Info payload ", payload);

	sendNotificationToServer(socket, 'Chat', payload);
	return (info);
}

export function sendInviteToUser(socket: Socket, dmName: string, userInvited: string, channelToJoin: IChannel) {
	const payload: string = "/invite  " + dmName + "  " + userInvited + " " + channelToJoin.roomName
	const info: string = `#INFO# ${userInvited} has been invited to the channel ${channelToJoin.roomName} ${channelToJoin.id}.`;

	sendNotificationToServer(socket, 'Chat', payload);
	return (info);
}