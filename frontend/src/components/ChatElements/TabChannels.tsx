import React, {  useContext } from 'react';
import toast from 'react-hot-toast';
import ChannelLink from './ChannelLink';
import { IChannel } from '../../api/types';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import '../../styles/Tab_channels.css'
import { updateUserInChannel } from '../../api/APIHandler';
import { SocketContext } from '../../App';
import { sendNotificationToServer } from "../../sockets/sockets";

export default function TabChannels({ joinedChannels, setActiveConv, setActiveTab }: { 
	joinedChannels: IChannel[] | undefined,
	setActiveTab: React.Dispatch<React.SetStateAction<number>> 
	setActiveConv: React.Dispatch<React.SetStateAction<IChannel | null>> }) {

		const socket = useContext(SocketContext);
		const queryClient = useQueryClient();
	
		const joinChannelRequest = useMutation({
			mutationFn: (channel: IChannel) => updateUserInChannel(channel.id, "joinedUsers", "connect"),
			onSuccess: () => { 
				queryClient.invalidateQueries(['channels']);
				toast.success(`You joined the channel!`) },
			onError: () => { toast.error('Error : cannot join channel') }
		})
	
		const handleClick = (event: React.FormEvent<HTMLDivElement>, channel: IChannel) => {
			event.preventDefault();
			joinChannelRequest.mutate(channel);
			if (socket && channel.roomName) {
				sendNotificationToServer(socket, 'Create Lobby', channel.roomName);
			}
			setActiveConv(channel);
			setActiveTab(1);
		};
	return (
	<div className='channels_page' >
	  <>
	  {
		joinedChannels && (
			joinedChannels.map((chan) => {
				return (
					<div key={(chan.id + 1).toString()} onClick={(event) => handleClick(event, chan)}>
						<ChannelLink key={chan.id.toString()} channel={chan}/>
					</div>
				);
		})
		)
	  }
	  </>
	</div>
  )
}
