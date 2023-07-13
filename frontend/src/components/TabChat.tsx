import React, { useContext, useEffect, useState } from 'react';
import '../styles/Tab_Chat.css';
// import { createSocketConnexion } from '../sockets/sockets';
import { SocketContext } from '../App';
import { Socket } from 'socket.io-client';

function TabChat({ setSocket }: { setSocket: React.Dispatch<React.SetStateAction<Socket | null>> }) {

	const [messages, setMessages] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState('');
	const socket = useContext(SocketContext);

	const sendMessage = (message: string) => {
	console.log("Sending Message");


	  if (socket) {
		socket.emit('Chat', message);
		setInputValue('');
	  }
	};

	useEffect(() => {
		// const newSocket: Socket = createSocketConnexion();
		// setSocket(newSocket);

		if (socket) {
			/* For debug: any event received by the client will be printed in the console.*/
				socket.onAny((event:any, ...args: any[]) => {
					console.log("socket: ", event, args);
			  });
		  
			  /* Listen tous les messages de l'event receiveMessage */
				socket.on('receiveMessage', (message: string) => {
					console.log("Message received");
					setMessages((prevMessages) => [...prevMessages, message]);
			  });
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
		</div>
	  );

//   return (
//     <div>
//        <input type="text" className="text-input" placeholder="Envoyer un message" />
//     </div>
//   )
}

export default TabChat
