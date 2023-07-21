import React, { useContext, useEffect, useState } from 'react';
import '../../styles/Tab_Chat.css';
import { SocketContext } from '../../context/contexts';
import { Socket } from 'socket.io-client';
import { IChannel } from '../../api/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createMessage, getAllMsgsofChannel } from '../../api/APIHandler';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faGamepad, faBan, faPersonWalkingArrowRight, faCommentSlash } from "@fortawesome/free-solid-svg-icons";

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
		// console.log("convv: ", conv);
		
		if (data) {
			setMessages(data.map((message) => message.content));
		}
	}, [data, conv]);
	
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
		<div className='convo__card'>
			<div className='convo__header'>
			<div className='convo__header_title'>
				<h1 id="convo__name">{conv?.roomName}</h1>
				<button>Leave Conversation</button>
			</div>
				<p>{conv?.joinedUsers.length} member(s), {conv?.admin.length} admin(s) </p>
			</div>
			{
				messages.map((message, index) => (
					<div key={index + 2} className="one__msg" >
						<div className="one__msg_avatar"><img src="" alt="Avatar"/></div>
						<div className="one__msg_info">
							<div key={index + 1} className='one__msg_header'>
								<h4>Name of the person</h4>
								<h6>Date of the message</h6>
								<FontAwesomeIcon icon={faSquarePlus} />
								<FontAwesomeIcon icon={faGamepad} />
								<FontAwesomeIcon icon={faBan} />
								<FontAwesomeIcon icon={faPersonWalkingArrowRight} />
								<FontAwesomeIcon icon={faCommentSlash} />
							</div>
							<p className="one__msg_content" key={index}>{message}</p>
						</div>
					</div>
				))
			}
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
