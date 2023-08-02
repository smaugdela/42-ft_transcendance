import { useEffect } from 'react';
import "../../styles/Social.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark} from '@fortawesome/free-solid-svg-icons';
import { removeFromBlock } from "../../api/APIHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IUser } from "../../api/types";

export function BlockedUser( props: { profilesToDisplay : IUser[], userIsSuccess: boolean }) {
	const queryClient = useQueryClient();
	const removefromblock = useMutation({ 
		mutationFn: (id: number) => removeFromBlock(id),
		onSuccess: () => {
			queryClient.invalidateQueries(['user']);	
		}
	});
	useEffect(() => {
		if (props.userIsSuccess) {
		  queryClient.invalidateQueries(['user']); // Refetch the user data if the userIsSuccess prop changes
		}
	  }, [props.userIsSuccess]);

	const handleremovefromblock = (id: number) => {
		removefromblock.mutate(id);
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
						<div><FontAwesomeIcon icon={faXmark} onClick={() =>handleremovefromblock(profile.id)}/></div>
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