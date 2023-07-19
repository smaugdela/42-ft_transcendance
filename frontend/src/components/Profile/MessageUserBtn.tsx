import "../../styles/UserProfile.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { useContext} from "react";
import { manageDirectMessages } from "../../api/APIHandler";
import { IUser } from "../../api/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import '../../styles/Tab_channels.css';
import toast from 'react-hot-toast';
import { SocketContext } from '../../App';
import { sendNotificationToServer } from '../../sockets/sockets';
// setActiveTab: React.Dispatch<React.SetStateAction<number>> 
// setActiveConv: React.Dispatch<React.SetStateAction<IChannel | null>> 

export default function MessageUserBtn( { loggedInUser, userToContact} : { 
	loggedInUser: IUser, 
	userToContact : IUser,
	
}) {

	const roomName = loggedInUser.nickname + ' ' + userToContact.nickname;
	
	const socket = useContext(SocketContext);
	const queryClient = useQueryClient();

	const { data, mutate } = useMutation({
		mutationFn: () => manageDirectMessages(roomName, userToContact.id),
		onSuccess: () => {
			queryClient.invalidateQueries(['channels']);
			toast.success("You can now talk to the other person!");
		},
		onError: () => { toast.error('Error during creation: channel name already in use') }
	})
	
	// Creates conv if not existant, join both users and displays chat with conv on right tab
	const handleClick = (event: React.FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		mutate();
		if (socket && data?.roomName) {
			console.log(data?.roomName);
			
			sendNotificationToServer(socket, 'Create Lobby', data?.roomName);
		}
		// setActiveConv(channel);
		// setActiveTab(1);
	};

	if (data === undefined) {
		console.log("data undefined");
		
	}

	return (
		<>
			<button onClick={(event) => handleClick(event)} ><FontAwesomeIcon icon={faComment} /></button>
		</>
	);
}