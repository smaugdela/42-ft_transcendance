import React, { useContext, useEffect, useState } from 'react';
import '../../styles/Tab_Chat.css';
import { SocketContext } from '../../context/contexts';
import { IChannel, IMessage } from '../../api/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createMessage, getAllMsgsofChannel } from '../../api/APIHandler';
import { OneMessage } from './OneMessage';

function TabChat({ conv }: { conv: IChannel }) {
		
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [inputValue, setInputValue] = useState<string>('');
	const socket = useContext(SocketContext);
	const convName: string = (conv.type === 'DM') ? conv.roomName.replace(' ', ' , ').trim() : conv.roomName;
	
	// Queries pour récupérer les messages du channel, ou pour créer un message
	const { data: newMessage, mutate} = useMutation((message: string) => createMessage(conv, message));
	const { data } = useQuery({
		queryKey: ['messages', conv.id],
		queryFn: () => getAllMsgsofChannel(conv.id),
		refetchInterval: 100,
	});

	// A l'arrivée sur le chat, faire défiler les messages jusqu'aux plus récents (bas de la fenêtre)
	useEffect(() => {
		var scroll = document.getElementById("convo__messages");
		if (scroll) {
			scroll.scrollTop = scroll.scrollHeight;
		}
	}, []);

	// Avec les messages récupérés avec la query, je les attribue au setteur qui servira à les afficher
	useEffect(() => {
		if (data) {
			setMessages(data);
		}
	}, [data]);
	
	// Fonction pour envoyer son msg au serveur, pour être transféré aux destinataires
	const sendMessage = (message: string) => {
		const payload: string = "/msg  " + conv?.roomName + "  " + message;
		console.log("payload ", payload);
		
		if (socket) {
			socket.emit('Chat', payload);
			setInputValue('');
	  }
	};

	// Si la connexion est assurée, récupère tous les messages qui nous sont envoyés
	useEffect(() => {
		if (socket) {
			/* Listen tous les messages de l'event receiveMessage */
			socket.on('receiveMessage', (message: IMessage) => {
				console.log("Message received");
				if (newMessage && data) {
					setMessages([...data, message]);
				}
			});
			return () => {
			socket.off('receiveMessage');
			};
		}
	}, [socket, mutate, data, newMessage, messages]);

	// Quand on appuie sur entrée, créé un IMessage avec nos données et l'envoie
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
					onChange={(event) => setInputValue(event.target.value)}
					placeholder="Type Here"
					/>
					<button type="submit">Send</button>
				</form>
			</div>
	</div>
	  );

}

export default TabChat
