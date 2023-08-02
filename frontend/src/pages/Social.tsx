import "../styles/Social.css"
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus} from '@fortawesome/free-solid-svg-icons';
import { fetchMe, postSearchQuery } from "../api/APIHandler";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IUser } from "../api/types";
import {AllFriends} from "../components/Social/AllFriends";
import { PendingList } from "../components/Social/PendingList";
import {BlockedUser} from "../components/Social/BlockedUser";
import {ActiveFriends} from "../components/Social/ActiveFriends";

export function SearchBar() {

	const [userInput, setUserInput] = useState("");
	const [searchedUser, setSearchResults] = useState<IUser>();

	useEffect( () => {
		if (userInput.length > 2){
			postSearchQuery(userInput)
			.then( (response) => {
				const copy = {...response};
				setSearchResults(copy.data.hits[0]._formatted);
			})
			.catch(() => {
				setSearchResults(undefined);
			});
		}
		if (userInput === "") {
			setSearchResults(undefined);
		}
	}, [userInput]);
	
	return (
		<div>
			<p className="text_serachBar">Looking for someone to add ? Try this search bar!</p>
			<div className="search_bar">
				<input 
					type="text" 
					id="search_input"
					name="search"
					onChange={(event) => setUserInput(event.target.value)}
					placeholder="Type the nickname of the person you want to find..."
				/>
				<>
					{ searchedUser && (<div key={searchedUser.id} className="searched_user">
						<div className="search_user_infos">
							<img id="search_user_avatar" src={searchedUser.avatar} alt={searchedUser.nickname} />
							<h5 id="title" dangerouslySetInnerHTML={{__html: searchedUser.nickname}}></h5>
							<a href= {process.env.REACT_APP_BACKEND_URL + "/social"}>
								<FontAwesomeIcon icon={faUserPlus} />
							</a>
						</div>
					</div>)
					}
				</>
			</div>
		</div>
	);
}

// export function DisplayConnections( props: { profilesToDisplay : IUser[], userIsSuccess: boolean }) {
// 	const queryClient = useQueryClient();
// 	const acceptRequest = useMutation({ 
// 		mutationFn: (id: number) => acceptFriendRequest(id),
// 		onSuccess: () => {
// 			queryClient.invalidateQueries(['user']);	
// 		}
// 	});
// 	useEffect(() => {
// 		if (props.userIsSuccess) {
// 		  queryClient.invalidateQueries(['user']); // Refetch the user data if the userIsSuccess prop changes
// 		}
// 	  }, [props.userIsSuccess]);

// 	const handleacceptRequest = (id: number) => {
// 		acceptRequest.mutate(id);
// 	}
// 	const displayProfiles = props.profilesToDisplay.map(profile => {
// 		return <div key={profile.id} className="profile">
// 					<div className="img-container">
// 						<img 
// 						src={profile.avatar}
// 						alt={profile.nickname}
// 						/>
// 					</div>
// 					<div className="profile_infos">
// 						<h5>{profile.nickname}</h5>
// 						<div><FontAwesomeIcon icon={faUserPlus} onClick={() =>handleacceptRequest(profile.id)}/></div>
// 						<div><FontAwesomeIcon icon={faUserMinus} /></div>
// 						<div><FontAwesomeIcon icon={faBan} /></div>
// 					</div>
// 		</div>
// 	})
// 	return (
// 		<div className="all-current">
// 			{displayProfiles}
// 		</div>
// 	);
// };
 
export function Social() {

	const [groupToDisplay, setGroupToDisplay] = useState<IUser[]>([]);

	const [activeList, setActiveList] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const { data: loggedUser, error, isLoading, isSuccess } = useQuery({ queryKey: ['user'], queryFn: fetchMe});
	
	const handleClickComponent = (listType: string) => {
		setActiveList(listType); // Update the active list when a button is clicked
	  };

	const [buttonStates, setButtonStates] = useState({
		allFriends: false,
		activeFriends: false,
	// 	blocked: false,
	// 	pendingRequests: false,
	  });


	// useEffect( () => {
	// 	if (activeFriends|| allFriends || blocked || pendingRequests) {

	// 		switch (groupToDisplay) {
	// 			case activeFriends:
	// 				setGroupToDisplay(activeFriends);
	// 				break;
	// 			case allFriends:
	// 				setGroupToDisplay(allFriends);
	// 				break;
	// 			case blocked:
	// 				setGroupToDisplay(blocked);
	// 				break;
	// 			case pendingRequests:
	// 				setGroupToDisplay(pendingRequests);
	// 				break;
	// 				default:
	// 					break;
	// 				}
					
	// 			}
	// 		},[groupToDisplay]);
			
	// useEffect( () => {
	// 	if (allFriends) {

	// 		setGroupToDisplay(allFriends);
	// 	}
	// });

	

	const allFriends:		IUser[] = loggedUser?.friendsList || [];
	const activeFriends:	IUser[] = allFriends?.filter(friend => friend.isActive === true) || [];
	// const blocked:			IUser[] = loggedUser?.blockList || [];
	// const pendingRequests:	IUser[] = loggedUser?.pendingList || [];

	

	const handleClick = (group: IUser[] | undefined, id: string) => {
		setGroupToDisplay(group || []);
		console.log(loggedUser);
		setButtonStates({
			allFriends: false,
			activeFriends: false,
			// blocked: false,
			// pendingRequests: false,
			[id]: true,
		});
	}

	if (error) {
		return <div>Error</div>;
	}
	if (isLoading || !isSuccess) {
		return <div>Loading...</div>;
	}

	return (
		<div  id="social-dashboard">
			<SearchBar />
			<div className="social-btn">
				<button 
					// onClick={ () => handleClick(allFriends, "allFriends")}
					// className={buttonStates.allFriends ? "clicked-btn" : "btn"}>
					onClick={() => handleClickComponent('allFriends')} className={activeList === 'allFriends' ? 'clicked-btn' : 'btn'}>
					All friends
				</button>
				<button 
					// onClick={ () => handleClick(activeFriends, "activeFriends")}
					// className={buttonStates.activeFriends ? "clicked-btn" : "btn"}>
					 onClick={() => handleClickComponent('activeFriends')} className={activeList === 'activeFriends' ? 'clicked-btn' : 'btn'}> 
					Active friends
				</button>
				<button 
					// onClick={ () => handleClick(blocked, "blocked")}
					// className={buttonStates.blocked ? "clicked-btn" : "btn"}>
					onClick={() => handleClickComponent('blocked')} className={activeList === 'blocked' ? 'clicked-btn' : 'btn'}>
					Blocked users
				</button>
				<button 
					// onClick={ () => handleClick(pendingRequests, "pendingRequests")}
					// className={buttonStates.pendingRequests ? "clicked-btn" : "btn"}>
					onClick={() => handleClickComponent('pendingRequests')} className={activeList === 'pendingRequests' ? 'clicked-btn' : 'btn'}>
					Pending requests
				</button>
			</div>
				{activeList === 'allFriends' && loggedUser.friendsList ? (<AllFriends profilesToDisplay={loggedUser.friendsList} userIsSuccess={isSuccess} />) : null}
				{activeList === 'pendingRequests' && loggedUser.pendingList ? (<PendingList profilesToDisplay={loggedUser.pendingList} userIsSuccess={isSuccess} />) : null}
      			{activeList === 'blocked' && loggedUser.blockList ? (<BlockedUser profilesToDisplay={loggedUser.blockList} userIsSuccess={isSuccess} />) : null}
      			{activeList === 'activeFriends' && activeFriends ? (<ActiveFriends profilesToDisplay={activeFriends} />) : null}
			</div>
  );
};

