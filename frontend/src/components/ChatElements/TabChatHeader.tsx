import { IChannel, IUser } from "../../api/types";
import React, { useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import '../../styles/Tab_Chat.css';
import { fetchMe, leaveChannel } from "../../api/APIHandler";
import toast from 'react-hot-toast';
import { ChatStatusContext } from "../../context/contexts";

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
	if (isLoading || !isSuccess) {
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
			<h1 id="convo__name">{convName}</h1>
			<button onClick={handleClick}>Leave Conversation</button>
		</div>
		<p>{conv?.joinedUsers.length} member(s), {conv?.admin.length} admin(s) </p>
	</div>
	);
}