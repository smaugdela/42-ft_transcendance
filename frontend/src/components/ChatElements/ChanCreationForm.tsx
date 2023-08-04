import React, { useContext, 
	// useEffect, 
	useState } from 'react';
import { 
	// useQuery, 
	useQueryClient, 
	useMutation } from "@tanstack/react-query";
import '../../styles/Tab_channels.css';
import toast from 'react-hot-toast';
import { createChannel } from '../../api/APIHandler';
import { SocketContext } from '../../context/contexts';
import { sendNotificationToServer } from '../../sockets/sockets';

export default function ChanCreationForm() {
	const [channelType, setChannelType] = useState<string>('PUBLIC');
	const [channelPassword, setChannelPassword] = useState<string>('');
	const [channelName, setChannelName] = useState<string>('');
	const socket = useContext(SocketContext);
	const queryClient = useQueryClient();

	// Pour récupérer le nom du Channel
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value.length > 10) {
			toast.error('Channel name length must be under 10!');
		} else {
			setChannelName(event.target.value);
		}
	};

	// La requête de création de Chan et ses aboutissants (success ou error)
	const createChannelRequest = useMutation({
		mutationFn: () => createChannel(channelName, channelPassword, channelType),
		onSuccess: () => { 
			queryClient.invalidateQueries(['channels']);
			toast.success(`Your channel ${channelName} was successfully created!`) },
		onError: () => { toast.error('Error during creation of channel') }
	})

	// Pour créer le channel et faire la connexion websocket
	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		createChannelRequest.mutate();
		if (socket) {
			sendNotificationToServer(socket, 'Create Lobby', channelName);
		}
	};

	return (
	   <form id="create-chan-form" onSubmit={handleFormSubmit}>
			<input
			  id="create-chan-input"
			  className="text_input"
			  type="text"
			  value={channelName}
			  onChange={handleInputChange}
			  placeholder="Choose your channel name! (max 10 characters)"
			/>
			<label htmlFor="select-type-label">Choose your channel type!</label>
			<select name="type" id="select-chan-type" onChange={(event) => setChannelType(event.target.value)}>
				<option value="PUBLIC">Public</option>
				<option value="PRIVATE">Private</option>
				<option value="PROTECTED">Protected</option>
			</select>
			{channelType === 'PROTECTED' && (
			<input
				type="password"
				value={channelPassword}
				id="create-chan-password-input"
				// className="text_input"
				onChange={(event) => setChannelPassword(event.target.value)}
				placeholder="Enter channel password"
			/>
			)}
			<button id='tabmore-btn' type="submit">Create a channel</button>
		</form>
  )
}