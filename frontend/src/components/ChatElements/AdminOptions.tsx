import '../../styles/Tab_Chat.css';
import /*React,*/ { useEffect, useState, useContext } from 'react';
// import { SocketContext } from '../../context/contexts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faBan, faPersonWalkingArrowRight, faCommentSlash, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { fetchMe, getOneChannelByName, updateUserInChannel, createMessage } from '../../api/APIHandler';
import { IChannel, IUser } from '../../api/types';
import toast from 'react-hot-toast';
import { handleRequestFromUser } from '../../sockets/sockets';
import { SocketContext } from '../../context/contexts';

export function AdminOptions({ channelName, userTalking }: { channelName: string, userTalking: IUser}) {
	const [enableOptions, setEnableOptions] = useState<boolean>(false);
	const [toggleDisplay, setToggleDisplay] = useState<boolean>(false);
	const userQuery = useQuery({ queryKey: ['user'], queryFn: fetchMe });
	// const { setIsMuted, muteExpiration, setMuteExpiration } = useContext(MuteContext);
	const socket = useContext(SocketContext);
	const { data: channel }= useQuery({ 
		queryKey: ['channels', channelName], 
		queryFn: () => getOneChannelByName(channelName) 
	});
	const queryClient = useQueryClient();
	
	useEffect(() => {
		if (channel) {
			const isAdmin = channel.admin.filter((admin) => admin.nickname === userQuery.data?.nickname);
			const isTargetStillInChan = channel.joinedUsers.some((member) => member.nickname === userTalking.nickname);
			if (isAdmin.length > 0 && isTargetStillInChan === true) {
				setEnableOptions(true);
			}
		}
	}, [channel, channel?.admin, userQuery.data, channel?.bannedUsers, channel?.kickedUsers, channel?.mutedUsers, channel?.joinedUsers, userTalking.nickname]);
	
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
	const createInfoMessage = useMutation({
		mutationFn: ([channel, message]: [IChannel, string]) => createMessage(channel, message),
		onSuccess: () => {
			queryClient.invalidateQueries(['channels']);
		},
		onError: () => toast.error('Message not sent: retry'),
	});

	const sendInfo = (group: string, action: string) => {
		if (socket) {
			const msg: string = handleRequestFromUser(socket, group, action, channelName, userTalking.nickname);
			if (channel)
				createInfoMessage.mutate([channel, msg]);
		}
	};

	//const socket = useContext(SocketContext); // déjà déclaré ligne 19

	/* const handleInvitation = () => {

		console.log('Invite to game');

		socket?.emit('invite match', userTalking.nickname);

		toast.success('Invitation sent');
	}

	socket?.on('match invitation declined', (nickname: string) => {
		toast.error(`${nickname} declined your invitation.`);
	});
  
  // Le fontawesome est dans oneMessage, faudra juste rajouter le onClick!
  <FontAwesomeIcon className='options__icon' title="Invite to game" icon={faGamepad} onClick={handleInvitation}/>
  */
	// const handleMute = () => {
	// 	setIsMuted(true);
	// 	const muteDurationInMinutes = 1;
	// 	const currentTime = Date.now();
	// 	console.log("currentTime is: ", currentTime);
		
	// 	const expirationTime = currentTime + muteDurationInMinutes * 60 * 1000;
	// 	setMuteExpiration(expirationTime);
	// 	console.log("Admin options, muteExpiration is : ", expirationTime, muteExpiration);
	// };

	const handleRole = (group: keyof IChannel) => {
		if (channel) {
			// Est-ce que le user est dans ce rôle?
			const userInGroup: boolean = (Array.isArray(channel[group] as IUser[])) ?
				(channel[group] as IUser[]).some((member: IUser) => member.id === userTalking.id)
				: false;
	
			if (!userInGroup && userTalking.id !== channel.ownerId) {
				// Si c'est pas le cas, on l'ajoute
				addToGroup.mutate([group, "connect", String(channel?.id)]);
				toast.success(`${userTalking.nickname}'s role has been added!`);
				sendInfo(group, "connect");
				console.log("jai send l'info");
				
			} else {
				// Sinon, on l'enlève
				if (userTalking.id !== channel.ownerId) {
					addToGroup.mutate([group, "disconnect", String(channel?.id)]);
					toast.success(`${userTalking.nickname} has been removed from this role.`);
					sendInfo(group, "disconnect");
				} else {
					toast.error(`Can't do that to ${userTalking.nickname}, as the owner of this channel!`)
				}
			}
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
		{
			enableOptions === true &&
			<>
			<FontAwesomeIcon className='options__icon' title="Click to see more" icon={faSquarePlus} onClick={handleClick}/>
			{
				toggleDisplay === true && 
				<>
					<FontAwesomeIcon className='options__icon' title="Make admin" icon={faUserShield} onClick={() => handleRole("admin")} />
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