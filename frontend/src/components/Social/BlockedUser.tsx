import { useEffect, useState } from 'react';
import "../../styles/Social.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faBan, faUserXmark, faXmark} from '@fortawesome/free-solid-svg-icons';
import { blockUser } from "../../api/APIHandler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IUser } from "../../api/types";

export function BlockedUser( props: { profilesToDisplay : IUser[], userIsSuccess: boolean }) {
	const queryClient = useQueryClient();
	const blockuser = useMutation({ 
		mutationFn: (nickname: string) => blockUser(nickname),
		onSuccess: () => {
			queryClient.invalidateQueries(['user']);	
		}
	});
	useEffect(() => {
		if (props.userIsSuccess) {
		  queryClient.invalidateQueries(['user']); // Refetch the user data if the userIsSuccess prop changes
		}
	  }, [props.userIsSuccess]);

	const handleblockuser = (nickname: string) => {
		blockuser.mutate(nickname);
	}
	const displayProfiles = props.profilesToDisplay.map(profile => {
		return <div key={profile.id} className="profile">
					<div className="img-container">
						<img 
						src={profile.avatar}
						alt={profile.nickname}
						/>
					</div>
					<div className="profile_infos">
						<h5>{profile.nickname}</h5>
						<div><FontAwesomeIcon icon={faXmark} onClick={() =>handleblockuser(profile.nickname)}/></div>
					</div>
		</div>
	})
	return (
		<div className="all-current">
			{displayProfiles}
		</div>
	);
};

export default BlockedUser