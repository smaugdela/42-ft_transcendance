import React, {  useContext } from 'react';
import ChannelLink from './ChannelLink';
import { IChannel, IUser } from '../../api/types';
import '../../styles/Tab_channels.css'
import { SocketContext, ChatStatusContext } from '../../context/contexts';
import { sendNotificationToServer } from "../../sockets/sockets";
import { useQuery } from '@tanstack/react-query';
import { getAllUserChannels } from '../../api/APIHandler';

function isBlockedInDM(channel: IChannel): boolean {
	if (channel.type !== 'DM') {
		return false;
	}
	const [userA, userB] = channel.joinedUsers;

	if (isBlockedByUser(userA, userB) === false && isBlockedByUser(userB, userA) === false)
		return false;
	else
		return true;
}

function isBlockedByUser(targetUser: IUser, user: IUser): boolean {
	return user.blockList.some((blockedUser) => blockedUser.id === targetUser.id);
}

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

	if (error ){
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
					(chan.type !== 'DM' ||  (chan.type === 'DM' && isBlockedInDM(chan) === false)) &&
					<div key={(chan.id + 1).toString()} onClick={(event) => handleClick(event, chan)} >
						<ChannelLink key={chan.id.toString()} 
									channel={chan}/>
					</div>
				);
			})
			)
		}
		{ (!joinedChannels || (joinedChannels && joinedChannels.length === 0)) && 
			<div className='channels_page-noconv'>
				<h3>You have not joined any channels yet!</h3>
				<h6>Don't be shy, start talking to someone or join a group conversation!</h6>
			</div>
		}
	</>
	</div>
  )
}
