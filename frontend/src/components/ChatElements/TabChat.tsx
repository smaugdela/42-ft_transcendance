import React, { useContext, useEffect, useState } from 'react';
import '../../styles/Tab_Chat.css';
import { SocketContext } from '../../context/contexts';
import { Socket } from 'socket.io-client';
import { IChannel, IMessage } from '../../api/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createMessage, getAllMsgsofChannel } from '../../api/APIHandler';
import {AdminOptions} from './AdminOptions';

function TabChat({ setSocket, conv }: { 
	setSocket: React.Dispatch<React.SetStateAction<Socket | null>>, 
	conv: IChannel }) {

	const [testMsg, setTestMsg] = useState<IMessage[]>([]);
	const [inputValue, setInputValue] = useState('');
	const socket = useContext(SocketContext);
	
	const { data } = useQuery({
		queryKey: ['messages', conv.id],
		queryFn: () => getAllMsgsofChannel(conv.id),
		refetchInterval: 100,
	});

	useEffect(() => {
		var scroll = document.getElementById("convo__messages");
		if (scroll) {
			scroll.scrollTop = scroll.scrollHeight;
		}
	}, []);

	useEffect(() => {
		if (data) {
			setTestMsg(data);
		}
	}, [data]);
	
	const { data: IMessages, mutate} = useMutation((message: string) => createMessage(conv, message));

	const sendMessage = (message: string) => {
		const payload: string = "/msg  " + conv?.roomName + "  " + message;
		console.log("payload ", payload);
		
		if (socket) {
			socket.emit('Chat', payload);
			setInputValue('');
	  }
	};

	useEffect(() => {
		if (socket) {
			/* Listen tous les messages de l'event receiveMessage */
			socket.on('receiveMessage', (message: IMessage) => {
				console.log("Message received");
				if (IMessages && data) {
					setTestMsg([...data, message]);
				}
			});
			return () => {
			socket.off('receiveMessage');
			};
		}
	}, [socket, mutate, data, IMessages, testMsg]);
  
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	  setInputValue(event.target.value);
	};

	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>, message:string) => {
	  event.preventDefault();
	  mutate(message);
	  if (inputValue.trim() !== '') {
		sendMessage(inputValue);
	  }
	  var scroll = document.getElementById("convo__messages");
	  if (scroll) {
		  scroll.scrollTop = scroll.scrollHeight;
	  }
	};

	const getDate = (message: IMessage) => {
		const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit' } as const;
		const date = (typeof message.date === 'string') ? new Date(message.date) : message.date;
		const formattedDate = date.toLocaleDateString('en-US', options);
		return formattedDate;
	}
	
	return (
		<div className='convo__card'>
			<div className='convo__header'>
				<div className='convo__header_title'>
					<h1 id="convo__name">{conv?.roomName}</h1>
					<button>Leave Conversation</button>
				</div>
				<p>{conv?.joinedUsers.length} member(s), {conv?.admin.length} admin(s) </p>
			</div>
			<div id='convo__messages'>
			{
				testMsg.map((message, index) => (
					<div key={index + 2} className="one__msg" >
						<div className="one__msg_avatar_container">
							<img src={message.from.avatar} className='one__msg_avatar' alt="Avatar"/>
						</div>
						<div className="one__msg_info">
							<div key={index + 1} className='one__msg_header'>
								<h4>{message.from.nickname}</h4>
								<h6>{getDate(message)}</h6>
								{
									conv.type !== 'DM' &&
									<>
										<AdminOptions channel={conv}/>
									</>
								}
							</div>
							<p className="one__msg_content" key={index}>{message.content}</p>
						</div>
					</div>
				))
			}
			</div>
			<div className='convo__bottom'>
				<form id="convo__form" onSubmit={(event) => handleFormSubmit(event, inputValue)}>
					<input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					placeholder="Type Here"
					/>
					<button type="submit">Send</button>
				</form>
			</div>
	</div>
	  );

}

export default TabChat
