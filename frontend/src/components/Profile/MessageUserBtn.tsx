import "../../styles/UserProfile.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useContext} from "react";
import { manageDirectMessages } from "../../api/APIHandler";
import { IUser } from "../../api/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import '../../styles/Tab_channels.css';
import toast from 'react-hot-toast';
import { SocketContext, ChatStatusContext } from "../../context/contexts";
import { sendNotificationToServer } from '../../sockets/sockets';

export default function MessageUserBtn( { loggedInUser, userToContact} : { loggedInUser: string , userToContact : IUser}) {
	
	const { setActiveTab, setActiveConv } = useContext(ChatStatusContext);
	const [roomName, setRoomName] = useState<string>('');
	const socket = useContext(SocketContext);
	const queryClient = useQueryClient();
	
	useEffect(() => {
		if (loggedInUser !== undefined) {
			setRoomName(loggedInUser + ' ' + userToContact.nickname);
		}	
	}, [loggedInUser, userToContact.nickname])
	
	const { mutate } = useMutation({
		mutationFn: () => manageDirectMessages(roomName, userToContact.nickname, loggedInUser),
		onSuccess: (data) => {
			queryClient.invalidateQueries(['channels']);
			if (socket && data) {
				sendNotificationToServer(socket, 'Create Lobby', data?.roomName);
				setActiveConv(null);
				// setActiveConv(data);
				setActiveTab(0);
				// setIsExpanded(true);
				toast.success("You can now talk to the other person!");
			}
		},
		onError: () => { toast.error('Error : you may have been blocked !') }
	})
	
	// Creates conv if not existant, join both users and displays chat with conv on right tab
	const handleClick = (event: React.FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (roomName) {
			mutate();
		}
	};

	return (
		<>
			<button className="msgUserBtn" onClick={(event) => handleClick(event)} ><FontAwesomeIcon icon={faComment} className="msgUserBtn-icon"/></button>
		</>
	);
}