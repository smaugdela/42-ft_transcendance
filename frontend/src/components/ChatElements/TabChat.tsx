import React, { useContext, useEffect, useState } from 'react';
import '../../styles/Tab_Chat.css';
import { SocketContext } from '../../context/contexts';
import { Socket } from 'socket.io-client';
import { IChannel } from '../../api/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createMessage, getAllMsgsofChannel } from '../../api/APIHandler';

function TabChat({ setSocket, conv }: { 
	setSocket: React.Dispatch<React.SetStateAction<Socket | null>>, 
	conv: IChannel }) {

	const [messages, setMessages] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState('');
	const socket = useContext(SocketContext);
	
	const { data } = useQuery({
		queryKey: ['messages', conv.id],
		queryFn: () => getAllMsgsofChannel(conv.id),
	});

	useEffect(() => {
		if (data) {
			setMessages(data.map((message) => message.content));
		}
	}, [data]);
	
	const storeMessage = useMutation((message: string) => createMessage(conv, message));

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
			socket.on('receiveMessage', (message: string) => {
				console.log("Message received");
				setMessages((prevMessages) => [...prevMessages, message]);
			});
			return () => {
			socket.off('receiveMessage');
			};
		}
	}, [socket, storeMessage]);
  
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	  setInputValue(event.target.value);
	};
  
	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>, message:string) => {
	  event.preventDefault();
	  storeMessage.mutate(message);
	  if (inputValue.trim() !== '') {
		sendMessage(inputValue);
	  }
	};

	return (
		<div>
		  <h1>{conv?.roomName}</h1>
		  <ul>
			{messages.map((message, index) => (
			  <li key={index}>{message}</li>
			))}
		  </ul>
		  <form onSubmit={(event) => handleFormSubmit(event, inputValue)}>
			<input
			  type="text"
			  value={inputValue}
			  onChange={handleInputChange}
			  placeholder="Type your message..."
			/>
			<button type="submit">Send</button>
		  </form>
		 
		</div>
	  );

}

export default TabChat
