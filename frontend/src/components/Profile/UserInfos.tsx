import "../../styles/UserProfile.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faBan } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchMe } from "../../api/APIHandler";
import { IUser } from "../../api/types";
import MessageUserBtn from "./MessageUserBtn";

import { friendRequest,  blockUser } from "../../api/APIHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function UserInfos( { user } : {user: IUser}) {
	
	const [enableSocials, setEnableSocials] = useState<boolean>(true);
	const [currentStatus, setCurrentStatus] = useState<string>('OFFLINE');
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' } as const;
	const creationDate = new Date(user.createdAt).toLocaleDateString('en-US', options);
	const userQuery = useQuery({ queryKey: ['user'], queryFn: fetchMe });
	
	useEffect(() => {;
		if (userQuery.data && userQuery.data.nickname) {
			(userQuery.data.nickname === user.nickname)
			  ? setEnableSocials(false)
			  : setEnableSocials(true);
		}
	  }, [userQuery.isSuccess, userQuery.data, user.nickname, setEnableSocials]);	
	
	useEffect(() => {
		if (user && user.isActive) {
			setCurrentStatus('ONLINE');
		}
	}, [user]);

	if (userQuery.isLoading || !userQuery.isSuccess){
		return <div>Loading</div>
	}
	
	if (userQuery.error){
		return <div>Error</div>
    }

	const queryClient = useQueryClient();
    const blockuser = useMutation({ 
		mutationFn: (nickname: string) => blockUser(nickname),
		onSuccess: () => {queryClient.invalidateQueries(['user']);}
	});
	const friendrequest = useMutation({ 
		mutationFn: (nickname : string) => friendRequest(nickname),
		onSuccess: () => {
			queryClient.invalidateQueries(['user']);	
		}
	});
	const handleblockuser = (nickname: string) => {
		blockuser.mutate(nickname);
	}
	const handlefriendRequest = (nickname : string) => {
		friendrequest.mutate(nickname);
	}
	
	return (
		<div className="user-infos">
			<div className="titles">
				<h2>{user.nickname}</h2>
				<h1 id="status" className={`${currentStatus}`}>{currentStatus}</h1>
			</div>
			{
				enableSocials === true &&
				<>
					<button><FontAwesomeIcon icon={faUserPlus} onClick={() =>handlefriendRequest(user.nickname)} /></button>
					<button><FontAwesomeIcon icon={faBan} onClick={() =>handleblockuser(user.nickname)}/></button>
					<MessageUserBtn loggedInUser={userQuery.data.nickname} userToContact={user} />
				</>
			}
			<h5>Member since {creationDate}</h5>
		</div>
	);

}
