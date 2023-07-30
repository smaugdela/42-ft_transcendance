import React, { useContext, useEffect, useState } from 'react';
import '../../styles/Tab_Chat.css';
import { ChatStatusContext, SocketContext } from '../../context/contexts';
import { IChannel, IMessage, IUser } from '../../api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createMessage, getAllMsgsofChannel, leaveChannel } from '../../api/APIHandler';
import { OneMessage } from './OneMessage';
import { TabChatHeader } from './TabChatHeader';
import toast from 'react-hot-toast';

function TabChat({ conv, loggedUser }: { conv: IChannel, loggedUser: IUser }) {

	const [messages, setMessages] = useState<IMessage[]>([]);
	const [inputValue, setInputValue] = useState<string>('');
	const [isMuted, setIsMuted] = useState<boolean>(false);
	const { setActiveTab, setActiveConv } = useContext(ChatStatusContext);
	const socket = useContext(SocketContext);
	const queryClient = useQueryClient();

	// Queries pour récupérer les messages du channel, ou pour créer un message
	const { data: newMessage, mutate} = useMutation({
		mutationFn: (message: string) => createMessage(conv, message),
		onSuccess: () => {
			queryClient.invalidateQueries(['channels']);
		},
		onError: () => toast.error('Message not sent: retry')
	});
	const { data } = useQuery({
		queryKey: ['messages', conv.id],
		queryFn: () => getAllMsgsofChannel(conv.id),
		refetchInterval: 100,
	});

	const leaveChannelRequest = useMutation({
		mutationFn: ([user, channelId]: [IUser, number]) => leaveChannel(user.id, channelId),
		onSuccess: () => { 
			queryClient.invalidateQueries(['channels']);
		},
		onError: () => { toast.error(`Error : someone tried to make you quit the channel but cannot`) }
	});

	// A l'arrivée sur le chat, faire défiler les messages jusqu'aux plus récents (bas de la fenêtre)
	useEffect(() => {
		var scroll = document.getElementById("convo__messages");
		if (scroll) {
			scroll.scrollTop = scroll.scrollHeight;
		}
	}, []);

	// je regarde aussi si la personne a le droit de parler ou juste d'être là
	useEffect(() => {
		if (loggedUser && conv.mutedUsers.some((member) => member.id === loggedUser.id)) {
			setIsMuted(true);
		}
		if (loggedUser && conv.kickedUsers.some((member) => member.id === loggedUser.id)) {
			leaveChannelRequest.mutate([loggedUser, conv.id]);
			toast(`You have been kicked from this channel (${conv.roomName})!`, {
				icon: '👏',
			  }); 
			setActiveTab(0);
			setActiveConv(null);
		}
		if (loggedUser && conv.bannedUsers.some((member) => member.id === loggedUser.id)) {
			leaveChannelRequest.mutate([loggedUser, conv.id]);
			toast(`You have been banned from this channel (${conv.roomName})!`, {
				icon: '👏',
			  }); 
			setActiveTab(0);
			setActiveConv(null);
		}
	}, [loggedUser, conv, setIsMuted,setActiveConv, setActiveTab, leaveChannelRequest]);

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
				console.log("Message received", message);
				if (data) {
					console.log('je suis la');
					
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
			<TabChatHeader conv={conv} />
			<div id='convo__messages'>
			{
				messages.map((message, index) => (
					<OneMessage conv={conv} message={message} index={index} key={index}/>
				))
			}
			</div>
			{
				isMuted === false &&
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
			}
			{
				isMuted === true && <div className="convo__bottom">You're not allowed to speak here! (muted)</div>
			}
	</div>
	  );
}

export default TabChat
