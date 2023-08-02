import React, {  useContext } from 'react';
import ChannelLink from './ChannelLink';
import { IChannel } from '../../api/types';
import '../../styles/Tab_channels.css'
import { SocketContext, ChatStatusContext } from '../../context/contexts';
import { sendNotificationToServer } from "../../sockets/sockets";
import { useQuery } from '@tanstack/react-query';
import { getAllUserChannels } from '../../api/APIHandler';

export default function TabChannels() {
	const { setActiveTab, setActiveConv } = useContext(ChatStatusContext);
	const socket = useContext(SocketContext);

	const { data: joinedChannels, error, isLoading, isSuccess } = useQuery({queryKey: ['channels'], queryFn: getAllUserChannels,});
	
	const handleClick = (event: React.FormEvent<HTMLDivElement>, channel: IChannel) => {
		event.preventDefault();
		if (socket && channel.roomName) {
			sendNotificationToServer(socket, 'Create Lobby', channel.roomName);
		}
		setActiveConv(channel);
		setActiveTab(1);
	};

	if (error){
		return <div>Error</div>
	}
	if (isLoading || !isSuccess ){
		return <div>Loading...</div>
	}
	
	return (
	<div className='channels_page' >
		<h3 id='channels_page_title'>Your channels</h3>
	  <>
	  {
		joinedChannels && (
			joinedChannels.map((chan) => {
				
				return (
					<div key={(chan.id + 1).toString()} onClick={(event) => handleClick(event, chan)} >
						<ChannelLink key={chan.id.toString()} 
									channel={chan}/>
					</div>
				);
		})
		)
	}
	</>
	</div>
  )
}
