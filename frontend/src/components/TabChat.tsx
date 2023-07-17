import React, { useContext, useEffect, useState } from 'react';
import '../styles/Tab_Chat.css';
import { SocketContext } from '../App';
import { Socket } from 'socket.io-client';
import { IChannel } from '../api/types';

function TabChat({ setSocket, conv }: { setSocket: React.Dispatch<React.SetStateAction<Socket | null>>, conv: IChannel | null }) {

	const [messages, setMessages] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState('');
	const socket = useContext(SocketContext);

	const sendMessage = (message: string) => {
		if (socket) {
			socket.emit('Chat', message);
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
	}, [socket]);
  
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	  setInputValue(event.target.value);
	};
  
	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
	  event.preventDefault();
	  if (inputValue.trim() !== '') {
		sendMessage(inputValue);
	  }
	};

	return (
		<div>
		  <ul>
			{messages.map((message, index) => (
			  <li key={index}>{message}</li>
			))}
		  </ul>
		  <form onSubmit={handleFormSubmit}>
			<input
			  type="text"
			  value={inputValue}
			  onChange={handleInputChange}
			  placeholder="Type your message..."
			/>
			<button type="submit">Send</button>
		  </form>
		  <h1>{conv?.roomName}</h1>
		</div>
	  );

}

export default TabChat
