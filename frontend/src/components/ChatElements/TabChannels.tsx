import React, {  useContext } from 'react';
import ChannelLink from './ChannelLink';
import { IChannel } from '../../api/types';
import '../../styles/Tab_channels.css'
import { SocketContext, ChatStatusContext } from '../../context/contexts';
import { sendNotificationToServer } from "../../sockets/sockets";

export default function TabChannels({ joinedChannels }: { joinedChannels: IChannel[] }) {
	const { setActiveTab, setActiveConv } = useContext(ChatStatusContext);
	const socket = useContext(SocketContext);

	console.log('joinedChannels:', joinedChannels);

	const handleClick = (event: React.FormEvent<HTMLDivElement>, channel: IChannel) => {
		event.preventDefault();
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
