import "../../styles/UserProfile.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faBan, faComment } from '@fortawesome/free-solid-svg-icons';
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchMe } from "../../api/APIHandler";
import { IUser } from "../../api/types";

export default function UserInfos( { user } : {user: IUser}) {
	
	const [enableSocials, setEnableSocials] = useState<boolean>(true);
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' } as const;
	const creationDate = new Date(user.createdAt).toLocaleDateString('en-US', options);

	const userQuery : UseQueryResult<IUser>= useQuery({ 
		queryKey: ['user'], 	 				
		queryFn: () => fetchMe		
	});

	useEffect(() => {
	  /* Si la personne connectée est la personne dont on affiche le profil */
	  if (userQuery.data) {
		  (userQuery.data?.nickname === user.nickname) ? setEnableSocials(false) : setEnableSocials(true);
	  }
	 
	}, [userQuery.data, userQuery.data?.nickname , user.nickname])

    if (userQuery.error instanceof Error){
      return <div>Error: {userQuery.error.message}</div>
    }
    if (userQuery.isLoading || !userQuery.isSuccess){
      return <div>Loading</div>
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
					<button><FontAwesomeIcon icon={faComment} /></button>
				</>
			}
			<h5>Member since {creationDate}</h5>
		</div>
	);
}