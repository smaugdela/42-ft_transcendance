import React, { useEffect, useState } from 'react';
import '../styles/Tab_Chat.css';
import io from 'socket.io-client';

function TabChat() {

	const [messages, setMessages] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [socket, setSocket] = useState<any>(null); // Set any as the type for socket
  
	const sendMessage = (message: string) => {
	console.log("Sending Message");
	  if (socket) {
		console.log("socket defined");
		socket.emit('sendMessage', message);
		setInputValue('');
	  }
	};

	useEffect(() => {

	  const newSocket = io('http://localhost:3001', {
		withCredentials: true,
	  });
	  setSocket(newSocket);
  
	  newSocket.on('receiveMessage', (message: string) => {
		console.log("Message received");
		setMessages((prevMessages) => [...prevMessages, message]);
	  });
  
	  return () => {
		newSocket.disconnect();
	  };
	}, []);
  
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
