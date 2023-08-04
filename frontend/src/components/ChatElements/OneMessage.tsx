import '../../styles/Tab_Chat.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { fetchMe, updateUserInChannel } from "../../api/APIHandler";
import { IChannel, IMessage } from "../../api/types";
import {AdminOptions} from './AdminOptions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { SocketContext } from '../../context/contexts';

const getDate = (message: IMessage) => {
	const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit' } as const;
	const date = (typeof message.date === 'string') ? new Date(message.date) : message.date;
	const formattedDate = date.toLocaleDateString('en-US', options);
	return formattedDate;
}

export function OneMessage({ conv, message, index, myNickname } : 
{ conv:IChannel, message: IMessage, index: number, myNickname: string}) {

	const [isMe, setIsMe] = useState<boolean>(myNickname === message.from.nickname);
	const [displayInviteChoice, setdisplayInviteChoice] = useState<boolean>(true);
	const {data: userMe, error, isLoading, isSuccess } = useQuery({queryKey: ['user'], queryFn: fetchMe});
	const queryClient = useQueryClient();
	const socket = useContext(SocketContext);

	useEffect(() => {
		if (userMe?.nickname === message.from.nickname) {
			setIsMe(true)
		}
	}, [userMe, message.from, setIsMe, conv])
	
	const makeUserJoinChan = useMutation({
		mutationFn: ([myId, group, action, channelId]: [number, string, string, string]) => updateUserInChannel(myId, Number(channelId), group, action),
		onSuccess: () => { 
			queryClient.invalidateQueries(['channels']);
			toast.success('You joined the channel!')
		},
		onError: () => { toast.error(`An error occured`) }
	});
	if (error) {
		return <div>Error while sending your message. Please retry.</div>
	}
	if (isLoading || !isSuccess || userMe === undefined) {
		return <div>Fetching your message...</div>
	}

	// Invite to a game of Pong!
	const handleInvitation = () => {
		console.log(`Invite ${message.from.nickname} to game`);
		socket?.emit('invite match', message.from.nickname);
		toast.success('Invitation sent', {id: 'invite'});
	}
	socket?.on('match invitation declined', (nickname: string) => {
		toast.error(`${nickname} declined your invitation.`, {id: 'invite'});
	});

	const handleAcceptInvite = (event: React.FormEvent, channelId: string) => {
		event.preventDefault();
		if (userMe) {
			makeUserJoinChan.mutate([userMe.id, "joinedUsers", "connect", channelId]);
			setdisplayInviteChoice(false);
		}
	}

	if (userMe?.blockList && userMe.blockList.some((user) => user.nickname === message.from.nickname) === true) {
		console.log("chat",userMe.blockList.some((user) => user.nickname === message.from.nickname) === true);
		
		return (
			<div key={index + 2} className='one__msg_role'>
				<div key={index + 1} className='one__msg_header_info'>
					<h6>{getDate(message)}</h6>
				</div>
				<p className='one_msg_announcement' key={index}>You blocked {message.from.nickname} so this message is censored.</p>
			</div>
		);
	}
	if (message.content.startsWith('#INFO# ') === true) {

		const content = message.content.replace('#INFO# ', '');
		const channelId: string = content.slice(content.lastIndexOf(' ') + 1, content.indexOf('.'));
		const censoredContent = content.replace(channelId, '');
		if (content.includes(" been invited to the channel") && isMe === true) {
			return (
				<div key={index + 2} className='one__msg_role'>
						<div key={index + 1} className='one__msg_header_info'>
							<h6>Initiated by: {message.from.nickname} on {getDate(message)}</h6>
						</div>
						<p className='one_msg_announcement' key={index}>{censoredContent}</p>
						{
							displayInviteChoice === true &&
							<div className='one_msg_invitation'>
								<FontAwesomeIcon icon={faCheck} className='one_msg_check' onClick={(e) => handleAcceptInvite(e, channelId)}/>
								<FontAwesomeIcon icon={faXmark} className='one_msg_xmark' onClick={() => setdisplayInviteChoice(false)}/>
							</div>
						}
				</div>
			);
		} else {
			return (
				<div key={index + 2} className='one__msg_role'>
						<div key={index + 1} className='one__msg_header_info'>
							<h6>Initiated by: {message.from.nickname} on {getDate(message)}</h6>
						</div>
						<p className='one_msg_announcement' key={index}>{censoredContent}</p>
				</div>
			);
		}
	}
	return (
	<div key={index + 2} className={`${isMe === true ? 'one__msg_me' : 'one__msg'}`} >
		<div className="one__msg_avatar_container">
			<Link to={`/user/${message.from.nickname}`} >
			<img src={message.from.avatar} title="See profile" className='one__msg_avatar' alt="Avatar"/>
			</Link >
		</div>
		<div className='one__msg_info'>
			<div key={index + 1} className='one__msg_header'>
				<h4>{message.from.nickname}</h4>
				<h6>{getDate(message)}</h6>
			</div>
			<p className={`${isMe === true ? 'one__msg_content_me' : 'one__msg_content'}`} key={index}>{message.content}</p>
		</div>
		{
			isMe === false &&
			<FontAwesomeIcon className='options__icon' title="Invite to game" icon={faGamepad} onClick={handleInvitation}/>
		}
		{
			conv.type !== 'DM' && isMe === false && 
			conv.admin.filter((admin) => admin.nickname === userMe?.nickname).length === 1 && 
			<AdminOptions channelName={conv.roomName}  userTalking={message.from}/>
		}
	</div>
	);
}