import { IChannel } from "../../api/types";
import React, { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import '../../styles/Tab_Chat.css';
import { updateMeInChannel } from "../../api/APIHandler";
import toast from 'react-hot-toast';
import { ChatStatusContext } from "../../context/contexts";

export function TabChatHeader({ conv }: { conv: IChannel}) {

	const { setActiveTab, setActiveConv } = useContext(ChatStatusContext);
	const convName: string = (conv.type === 'DM') ? conv.roomName.replace(' ', ' , ').trim() : conv.roomName;
	const queryClient = useQueryClient();

	const leaveChannelRequest = useMutation({
		mutationFn: (group: string) => updateMeInChannel(conv.id, group, "disconnect"),
		onSuccess: () => { queryClient.invalidateQueries(['channels']) },
		onError: () => { toast.error(`Error : cannot leave channel (tried to leave chan or group you weren't a part of)`) }
	});

	const handleClick = (event: React.FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		leaveChannelRequest.mutate("joinedUsers");
		leaveChannelRequest.mutate("kickedUsers");
		leaveChannelRequest.mutate("admin");
		leaveChannelRequest.mutate("kickedUsers");
		toast.success(`You left the channel!`);
		setActiveTab(0);
		setActiveConv(null);
	};

	return (
	
	<div className='convo__header'>
		<div className='convo__header_title'>
			<h1 id="convo__name">{convName}</h1>
			<button onClick={handleClick}>Leave Conversation</button>
		</div>
		<p>{conv?.joinedUsers.length} member(s), {conv?.admin.length} admin(s) </p>
	</div>
	);
}