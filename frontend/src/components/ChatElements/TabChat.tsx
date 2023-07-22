import React, { useContext, useEffect, useState } from 'react';
import '../../styles/Tab_Chat.css';
import { SocketContext } from '../../context/contexts';
import { IChannel, IMessage } from '../../api/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createMessage, getAllMsgsofChannel } from '../../api/APIHandler';
import { OneMessage } from './OneMessage';

function TabChat({ conv }: { conv: IChannel }) {
		
	const convName: string = (conv.type === 'DM') ? conv.roomName.replace(' ', ' , ').trim() : conv.roomName;
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [inputValue, setInputValue] = useState<string>('');
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
			setMessages(data);
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
					setMessages([...data, message]);
				}
			});
			return () => {
			socket.off('receiveMessage');
			};
		}
	}, [socket, mutate, data, IMessages, messages]);
  
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
	
	return (
		<div className='convo__card'>
			<div className='convo__header'>
				<div className='convo__header_title'>
					<h1 id="convo__name">{convName}</h1>
					<button>Leave Conversation</button>
				</div>
				<p>{conv?.joinedUsers.length} member(s), {conv?.admin.length} admin(s) </p>
			</div>
			<div id='convo__messages'>
			{
				messages.map((message, index) => (
					<OneMessage conv={conv} message={message} index={index} />
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
