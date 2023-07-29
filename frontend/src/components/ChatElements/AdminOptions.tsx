import '../../styles/Tab_Chat.css';
import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../context/contexts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faGamepad, faBan, faPersonWalkingArrowRight, faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { fetchMe, getOneChannelByName, updateUserInChannel } from '../../api/APIHandler';
import { IChannel, IUser } from '../../api/types';
import toast from 'react-hot-toast';

// TODO: refetch le channel dans ce component, grâce à un id passé pour que ça s'update
export function AdminOptions({ channelName, userTalking }: { channelName: string, userTalking: IUser}) {
	const [enableOptions, setEnableOptions] = useState<boolean>(false);
	const [toggleDisplay, setToggleDisplay] = useState<boolean>(false);
	const userQuery = useQuery({ queryKey: ['user'], queryFn: fetchMe });
	const { data: channel }= useQuery({ 
		queryKey: ['channels', channelName], 
		queryFn: () => getOneChannelByName(channelName) 
	});
	const queryClient = useQueryClient();

	useEffect(() => {
		if (channel) {
			const isAdmin = channel.admin.filter((admin) => admin.nickname === userQuery.data?.nickname);
			if (isAdmin.length > 0) {
				setEnableOptions(true);
			}
		}
		
	}, [channel, channel?.admin, userQuery.data, channel?.bannedUsers, channel?.kickedUsers, channel?.mutedUsers, channel?.joinedUsers]);
	const addToGroup = useMutation({
		mutationFn: ([group, action, channelId]: string[]) => updateUserInChannel(userTalking.id, Number(channelId), group, action),
		onSuccess: () => { 
			queryClient.invalidateQueries(['channels']);
		},
		onError: () => { toast.error(`Error : cannot change ${userTalking.nickname}'s role.`) }
	});

	const handleClick = () => {
		setToggleDisplay(!toggleDisplay);
	}

	const socket = useContext(SocketContext);

	const handleInvitation = () => {

		console.log('Invite to game');

		socket?.emit('invite match', /* Insert the username of the user you want to invite here */);

		toast.success('Invitation sent');
  }

	const handleRole = (group: keyof IChannel) => {
		if (channel) {
			// Est-ce que le user est dans ce rôle?
			const userInGroup: boolean = (Array.isArray(channel[group] as IUser[])) ?
				(channel[group] as IUser[]).some((member: IUser) => member.id === userTalking.id)
				: false;
	
			if (!userInGroup) {
				// Si c'est pas le cas, on l'ajoute
				addToGroup.mutate([group, "connect", String(channel?.id)]);
				toast.success(`${userTalking.nickname}'s role has been added!`);
			} else {
				// Sinon, on l'enlève
				addToGroup.mutate([group, "disconnect", String(channel?.id)]);
				toast.success(`${userTalking.nickname} has been removed from this role.`);
			}
		}

	if (userQuery.error) {
		return <div>Error</div>
	}
	if (userQuery.isLoading || !userQuery.isSuccess) {
		return <div>Loading...</div>
	}
	return (
	<>
		<FontAwesomeIcon className='options__icon' title="Invite to game" icon={faGamepad} onClick={handleInvitation}/>
		{
			enableOptions === true &&
			<>
			<FontAwesomeIcon className='options__icon' title="Click to see more" icon={faSquarePlus} onClick={handleClick}/>
			{
				toggleDisplay === true && 
				<>
					<FontAwesomeIcon className='options__icon' title="Ban" icon={faBan} onClick={() => handleRole("bannedUsers")}/>
					<FontAwesomeIcon className='options__icon' title="Kick" icon={faPersonWalkingArrowRight} onClick={() => handleRole("kickedUsers")}/>
					<FontAwesomeIcon className='options__icon' title="Mute" icon={faCommentSlash} onClick={() => handleRole("mutedUsers")}/>
				</>
			}
			</>
		}
	</>
	);
}