import '../../styles/Tab_Chat.css';
import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faGamepad, faBan, faPersonWalkingArrowRight, faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { fetchMe } from '../../api/APIHandler';
import { IChannel } from '../../api/types';
import toast from 'react-hot-toast';
import { SocketContext } from '../../context/contexts';
import { Socket } from 'socket.io-client';

export function AdminOptions({ channel }: { channel: IChannel}) {
	const [enableOptions, setEnableOptions] = useState<boolean>(false);
	const [toggleDisplay, setToggleDisplay] = useState<boolean>(false);
	const userQuery = useQuery({ queryKey: ['user'], queryFn: fetchMe });

	useEffect(() => {
		const isAdmin = channel.admin.filter((admin) => admin.nickname === userQuery.data?.nickname);
		if (isAdmin.length > 0) {
			setEnableOptions(true);
		}
	}, [channel.admin, userQuery.data]);

	const handleClick = () => {
		setToggleDisplay(!toggleDisplay);
	}

	const socket = useContext(SocketContext);

	const handleInvitation = () => {

		console.log('Invite to game');

		socket?.emit('invite match', /* Insert the username of the user you want to invite here */);

		toast.success('Invitation sent');
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
					<FontAwesomeIcon className='options__icon' title="Ban" icon={faBan} />
					<FontAwesomeIcon className='options__icon' title="Kick" icon={faPersonWalkingArrowRight} />
					<FontAwesomeIcon className='options__icon' title="Mute" icon={faCommentSlash} />
				</>
			}
			</>
		}
	</>
	);
}