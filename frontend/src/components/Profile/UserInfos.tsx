import "../../styles/UserProfile.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faBan } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchMe } from "../../api/APIHandler";
import { IUser } from "../../api/types";
import MessageUserBtn from "./MessageUserBtn";

export default function UserInfos( { user } : {user: IUser}) {
	
	const [enableSocials, setEnableSocials] = useState<boolean>(true);
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
	

	if (userQuery.isLoading || !userQuery.isSuccess){
		return <div>Loading</div>
	}
	
	if (userQuery.error){
		return <div>Error</div>
    }
	
	return (
		<div className="user-infos">
			<div className="titles">
				<h2>{user.nickname}</h2>
				<h1 id="status">ONLINE</h1>
			</div>
			{
				enableSocials === true &&
				<>
					<button><FontAwesomeIcon icon={faUserPlus} /></button>
					<button><FontAwesomeIcon icon={faBan} /></button>
					<MessageUserBtn loggedInUser={userQuery.data?.nickname} userToContact={user} />
				</>
			}
			<h5>Member since {creationDate}</h5>
		</div>
	);

}
