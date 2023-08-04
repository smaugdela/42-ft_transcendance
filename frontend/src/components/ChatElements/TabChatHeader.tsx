import { IChannel, IUser } from "../../api/types";
import React, { useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import '../../styles/Tab_Chat.css';
import { fetchMe, leaveChannel } from "../../api/APIHandler";
import toast from 'react-hot-toast';
import { ChatStatusContext } from "../../context/contexts";
import { ChannelTitle } from "./ChannelTitle";
import { ChannelType } from "./ChannelType";

const getDate = (channel : IChannel) => {
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric'} as const;
	const date = (typeof channel.date === 'string') ? new Date(channel.date) : channel.date;
	const formattedDate = date.toLocaleDateString('en-US', options);
	return formattedDate;
}


export function TabChatHeader({ conv }: { conv: IChannel}) {

	const { setActiveTab, setActiveConv } = useContext(ChatStatusContext);
	const convName: string = (conv.type === 'DM') ? conv.roomName.replace(' ', ' , ').trim() : conv.roomName;
	const queryClient = useQueryClient();

	const {data: user, error, isLoading, isSuccess } = useQuery({queryKey: ['user'], queryFn: fetchMe});

	const leaveChannelRequest = useMutation({
		mutationFn: (user: IUser) => leaveChannel(user.id, conv.id),
		onSuccess: () => { 
			queryClient.invalidateQueries(['channels']);
			toast.success(`You left the channel!`) 
		},
		onError: () => { toast.error(`Error : cannot leave channel (tried to leave chan or group you weren't a part of)`) }
	});
	
	if (error) {
		return <div>Error</div>
	}
	if (isLoading || !isSuccess || conv === undefined || !conv) {
		return <div>Is Loading...</div>
	}

	const handleClick = (event: React.FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (user) {
			leaveChannelRequest.mutate(user);
			setActiveTab(0);
			setActiveConv(null);
		}
	};

	return (
	<div className='convo__header'>
		<div className='convo__header_title'>
			<ChannelTitle conv={conv} initialName={convName} />
			<button id="convo__header_leave-btn" onClick={handleClick}>Leave Conversation</button>
		</div>
		<p>Channel created on {getDate(conv)}</p>
		<p>Owner is: {conv?.owner.nickname} </p>
		<ChannelType channelId={conv.id} loggedUser={user}/>
		</div>
	);
}