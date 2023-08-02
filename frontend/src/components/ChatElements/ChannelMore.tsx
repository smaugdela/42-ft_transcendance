import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IChannel } from "../../api/types";
import '../../styles/Tab_channels.css';
import { fetchMe, updateMeInChannel, verifyPasswords } from "../../api/APIHandler";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';

export default function ChannelMore({ channel }: { channel: IChannel }) {

	const [convName, setConvName] = useState<string>(channel.roomName);
	const [askForPassword, setAskForPassword] = useState<boolean>(false);
	const [password, setPassword] = useState<string>('');
	const queryClient = useQueryClient();

	const {data, error, isLoading, isSuccess } = useQuery({queryKey: ['user'], queryFn: fetchMe});
	
	const joinChannelRequest = useMutation({
		mutationFn: (channel: IChannel) => updateMeInChannel(channel.id, "joinedUsers", "connect"),
		onSuccess: () => { 
			queryClient.invalidateQueries(['channels']);
			toast.success(`You joined the channel!`) 
		},
		onError: () => { toast.error('Error : cannot join channel') }
	})

	const { mutate: verifyPassword} = useMutation({
		mutationFn: (pwd: string) => verifyPasswords(channel.id, pwd),
		onSuccess: () => { 
			toast.success("Correct password!");
			joinChannelRequest.mutate(channel); },
		onError: () => { toast.error("Incorrect password!") }
	})

	useEffect(() => {
		if (channel.type === 'DM' && data) {
			setConvName(channel.roomName.replace(data?.nickname, '').trim());
		}
	}, [data, channel.type, channel.roomName]);

	if (error) {
		return <div>Error</div>;
	}
	if (isLoading || !isSuccess) {
		return <div>Loading...</div>;
	}

	const handleClick = (event: React.FormEvent<HTMLDivElement>, channel: IChannel) => {
		event.preventDefault();
		if (channel.type === 'PROTECTED') {
			setAskForPassword(true);
		}  else {
			joinChannelRequest.mutate(channel);
		}
	};

	const handlePasswordCheck = () => {
		if (password !== '') {
			verifyPassword(password);
			setPassword('');
		}
		setAskForPassword(false);
	}

	return (
		<div>
			<div  className="channel-link-card" onClick={(event) => handleClick(event, channel)}>
				<div className="channel-link-header">
					<div>
						<span className='channel-link-name'>{convName} </span>
						<span className="channel-link-span">{channel.type}</span>
						{
							channel.type !== 'DM' && channel.joinedUsers &&
							<span>{channel.joinedUsers.length} member(s)</span>
						}
					</div>
				</div>
				<div className="channel-link-messenger">Click to join this channel!</div> 
			</div>
			{
				askForPassword === true &&
				<div className='channel-link-password-card' onClick={(event) => event.stopPropagation()}>
					This channel is protected!
					<input	type="password" 
							placeholder="Please enter the password"
							onChange={(event) => setPassword(event.target.value)}
							className="text_input"
					/>
					<button className="text_settings_btn" onClick={handlePasswordCheck}>
						<FontAwesomeIcon icon={faCircleCheck} className="text_checkbox"/>
					</button>
				</div>
			}
		</div>
	);
}