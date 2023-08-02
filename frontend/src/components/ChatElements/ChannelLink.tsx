import React, {  useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IChannel } from "../../api/types";
import '../../styles/Tab_channels.css';
import { createMessage2, fetchMe, getAllMsgsofChannel, manageDirectMessages } from "../../api/APIHandler";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { SocketContext, ChatStatusContext } from '../../context/contexts';
import { sendInviteToUser, sendNotificationToServer } from "../../sockets/sockets";
import { toast } from 'react-hot-toast';

function getTimeSinceLastMsg(lastMessageDate: Date) {
	const date = (lastMessageDate instanceof Date) ? lastMessageDate : new Date(lastMessageDate);
	const formatter = new Intl.RelativeTimeFormat('en');
	const ranges = {
		years: 3600 * 24 * 365,
		months: 3600 * 24 * 30,
		weeks: 3600 * 24 * 7,
		days: 3600 * 24,
		hours: 3600,
		minutes: 60,
		seconds: 1
	};
	const secondsElapsed = (date.getTime() - Date.now()) / 1000;
	for (let key in ranges) {
		if (ranges[key as keyof typeof ranges] < Math.abs(secondsElapsed)) {
			const delta = secondsElapsed / ranges[key as keyof typeof ranges];
			return formatter.format(Math.round(delta), key as keyof typeof ranges);
		}
	}
}

export default function ChannelLink({ channel }: { channel: IChannel }) {

	const [convName, setConvName] = useState<string>(channel.roomName);
	const { setActiveTab, setActiveConv } = useContext(ChatStatusContext);
	const socket = useContext(SocketContext);
	const [openInvitePrompt, setOpenInvitePrompt] = useState<boolean>(false);
	const [inviteName, setInviteName] = useState<string>("");
	const queryClient = useQueryClient();

	const {data, error, isLoading, isSuccess } = useQuery({queryKey: ['user'], queryFn: fetchMe});
	const { data: messages, status: msgStatus } = useQuery({queryKey: ['messages', channel.id], queryFn: () => getAllMsgsofChannel(channel.id),});

	const { mutate: findOrCreateConv } = useMutation({
		mutationFn: () => manageDirectMessages((data?.nickname + ' ' + inviteName), inviteName),
		onSuccess: (data) => {
			queryClient.invalidateQueries(['channels']);
			if (socket && data) {
				sendNotificationToServer(socket, 'Create Lobby', data?.roomName);
			}
		},
		onError: () => { toast.error('Error during creation: channel name already in use') }
	})

	const createInfoMessage = useMutation({
		mutationFn: ([channel, message]: string[]) => createMessage2(channel, message),
		onSuccess: () => {
			queryClient.invalidateQueries(['channels']);
		},
		onError: () => toast.error('Message not sent: retry'),
	});

	useEffect(() => {
		if (channel.type === 'DM' && data) {
			setConvName(channel.roomName.replace(data?.nickname, '').trim());
		}
	}, [data, channel.type, channel.roomName]);
	
	if (error || msgStatus === "error") {
		return <div>Error</div>
	}
	if (isLoading || !isSuccess  || msgStatus === "loading" || msgStatus !== "success") {
		return <div>Loading...</div>
	}

	const handleClick = (event: React.FormEvent<HTMLDivElement>, channel: IChannel) => {
		event.preventDefault();
		if (socket && channel.roomName) {
			sendNotificationToServer(socket, 'Create Lobby', channel.roomName);
		}
		setActiveConv(channel);
		setActiveTab(1);
	};

	const handleInviteClick = (event: React.FormEvent) => {
		event.stopPropagation();
		setOpenInvitePrompt(!openInvitePrompt);
	}
	
	const handleUpdate = (event: React.FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		// Voir s'il y a déjà une conv entre les deux users, sinon la créer
		findOrCreateConv();
		// Envoyer à cette conv le message d'invit
		if (socket && data && inviteName !== '') {
			const dmName: string = data?.nickname + ' ' + inviteName;
			const msg:string = sendInviteToUser(socket, dmName, inviteName, channel);
			createInfoMessage.mutate([dmName, msg]);
		}
	}

	return (
		<div>
			<div  className="channel-link-card" onClick={(event) => handleClick(event, channel)}>
				<div className="channel-link-header">
					<div>
						<span className='channel-link-name'>{convName} </span>
						<span className="channel-link-span">{channel.type}</span>
					</div>
					{
						channel.type !== 'DM' &&
						<FontAwesomeIcon className='channel-link-invite' title="invite" icon={faUserPlus} onClick={handleInviteClick}/>
					}
				</div>
				{
					messages.length > 0 &&
					<>
						<div className='channel-link-preview'>
							<p > 
								<span className="channel-link-messenger">{messages[messages.length - 1].from.nickname} : </span> 
								<span className='channel-link-lastmsg'>{
									(messages[messages?.length - 1].content.length <= 40)? 
										messages[messages?.length - 1].content 
										: messages[messages?.length - 1].content.substring(0,37) + '...'
								}
								</span>
							</p>
							<p className='channel-link-date'>{getTimeSinceLastMsg(messages[messages?.length - 1].date)}</p>
						</div>
					</>
				}
				{
					messages.length === 0 &&
					<div className="channel-link-messenger">Click to write down your first message!</div> 
				}
			</div>
			{
				openInvitePrompt === true &&
				<div className='channel-link-invite-card'>
					Invite someone:
					<input	type="text" 
							placeholder="User's nickname"
							onChange={(event) => setInviteName(event.target.value)}
							className="text_input"
					/>
					<button className="text_settings_btn" onClick={handleUpdate}>
						<FontAwesomeIcon icon={faCircleCheck} className="text_checkbox"/>
					</button>
				</div>
			}
		</div>
	);
}