import { useEffect } from 'react';
import "../../styles/Social.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faBan, faUserXmark} from '@fortawesome/free-solid-svg-icons';
import { acceptFriendRequest, rejectFriendRequest, blockUser } from "../../api/APIHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IUser } from "../../api/types";

export function PendingList( props: { profilesToDisplay : IUser[], userIsSuccess: boolean }) {
	const queryClient = useQueryClient();
    const blockuser = useMutation({ 
		mutationFn: (nickname: string) => blockUser(nickname),
		onSuccess: () => {queryClient.invalidateQueries(['user']);}
	});
	const acceptRequest = useMutation({ 
		mutationFn: (id: number) => acceptFriendRequest(id),
		onSuccess: () => {
			queryClient.invalidateQueries(['user']);	
		}
	});
    const rejectRequest = useMutation({ 
		mutationFn: (id: number) => rejectFriendRequest(id),
		onSuccess: () => {
			queryClient.invalidateQueries(['user']);	
		}
	});
	useEffect(() => {
		if (props.userIsSuccess) {
		  queryClient.invalidateQueries(['user']); // Refetch the user data if the userIsSuccess prop changes
		}
	  }, [props.userIsSuccess]);

	const handleacceptRequest = (id: number) => {
		acceptRequest.mutate(id);
	}
    const handlerejectRequest = (id: number) => {
		rejectRequest.mutate(id);
	}
    const handleblockuser = (nickname: string) => {
		blockuser.mutate(nickname);
	}
	const displayProfiles = props.profilesToDisplay.map(profile => {
		return <div key={profile.id} className="profile">
					<div className="img-container">
						<img src={profile.avatar} alt={profile.nickname}/>
					</div>
					<div className="profile_infos">
						<h5>{profile.nickname}</h5>
						<div><FontAwesomeIcon icon={faUserPlus} onClick={() =>handleacceptRequest(profile.id)}/></div>
						<div><FontAwesomeIcon icon={faUserXmark} onClick={() =>handlerejectRequest(profile.id)}/></div>
                        <div><FontAwesomeIcon icon={faBan} onClick={() =>handleblockuser(profile.nickname)}/></div>					
					</div>
				</div>
	})
	return (<div className="all-current">{displayProfiles}</div>);
};

export default PendingList
