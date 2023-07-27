import '../../styles/Tab_Chat.css';
import { fetchMe } from "../../api/APIHandler";
import { IChannel, IMessage } from "../../api/types";
import {AdminOptions} from './AdminOptions';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const getDate = (message: IMessage) => {
	const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit' } as const;
	const date = (typeof message.date === 'string') ? new Date(message.date) : message.date;
	const formattedDate = date.toLocaleDateString('en-US', options);
	return formattedDate;
}

export function OneMessage({ conv, message, index } : 
{ conv:IChannel, message: IMessage, index: number}) {

	const [isMe, setIsMe] = useState<boolean>(false);
	const {data: userMe, error, isLoading, isSuccess } = useQuery({queryKey: ['user'], queryFn: fetchMe});

	useEffect(() => {
		if (userMe?.nickname !== message.from.nickname) {
			setIsMe(true)
		}
	}, [userMe, message.from, setIsMe])
	
	if (error) {
		<div>Error while sending your message. Please retry.</div>
	}
	if (isLoading || !isSuccess || userMe === undefined) {
		<div>Fetching your message...</div>
	}
	return (
	<div key={index + 2} className={`${isMe === true ? 'one__msg' : 'one__msg_me'}`} >
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
			<p className={`${isMe === true ? 'one__msg_content' : 'one__msg_content_me'}`} key={index}>{message.content}</p>
		</div>
		{
			conv.type !== 'DM' && isMe === true && 
			conv.admin.filter((admin) => admin.nickname === userMe?.nickname).length === 1 && 
			<AdminOptions channel={conv}/>
		}
	</div>
	);
}