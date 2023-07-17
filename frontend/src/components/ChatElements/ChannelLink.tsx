import { IChannel } from "../../api/types";
// import toast from 'react-hot-toast';
// import React from 'react';
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import '../../styles/Tab_channels.css';
// import { updateUserInChannel } from '../../api/APIHandler';
// import { SocketContext } from '../../App';
// import { sendNotificationToServer } from "../../sockets/sockets";

export default function ChannelLink({ channel }: { channel: IChannel }) {
	// const socket = useContext(SocketContext);
	// const queryClient = useQueryClient();

	// const joinChannelRequest = useMutation({
	// 	mutationFn: () => updateUserInChannel(channel.id, "joinedUsers", "connect"),
	// 	onSuccess: () => { 
	// 		queryClient.invalidateQueries(['channels']);
	// 		toast.success(`You joined the channel!`) },
	// 	onError: () => { toast.error('Error : cannot join channel') }
	// })

	// const handleClick = (event: React.FormEvent<HTMLDivElement>) => {
	// 	event.preventDefault();
	// 	joinChannelRequest.mutate();
	// 	if (socket && channel.roomName) {
	// 		sendNotificationToServer(socket, 'Create Lobby', channel.roomName);
	// 	}
	// };
	
	return (
		<div className="channel-link-card">
			<h3>{channel.roomName} ({channel.type})</h3>
			<p>Last message...</p>
		</div>
	);
}