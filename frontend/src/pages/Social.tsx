import "../styles/Social.css"
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus} from '@fortawesome/free-solid-svg-icons';
import { fetchMe, postSearchQuery, friendRequest } from "../api/APIHandler";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "../api/types";
import {AllFriends} from "../components/Social/AllFriends";
import { PendingList } from "../components/Social/PendingList";
import {BlockedUser} from "../components/Social/BlockedUser";
import {ActiveFriends} from "../components/Social/ActiveFriends";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

	const queryClient = useQueryClient();
	const friendrequest = useMutation({ 
		mutationFn: (nickname : string) => friendRequest(nickname),
		onSuccess: () => {queryClient.invalidateQueries(['user']);}
	});
	const handlefriendRequest = (nickname : string) => {
		friendrequest.mutate(nickname);
	}
	
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
							<a><FontAwesomeIcon icon={faUserPlus} onClick={() =>handlefriendRequest(searchedUser.nickname)}/></a>
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
// 		 queryClient.invalidateQueries(['user']); // Refetch the user data if the userIsSuccess prop changes
// 		}
// 	 }, [props.userIsSuccess]);
 
export function Social() {

	const [activeList, setActiveList] = useState<string | null>(null);
	const { data: loggedUser, error, isLoading, isSuccess } = useQuery({ queryKey: ['user'], queryFn: fetchMe});
	
	const handleClickComponent = (listType: string) => {
		setActiveList(listType); // Update the active list when a button is clicked
	};

	

	const allFriends:		IUser[] = loggedUser?.friendsList || [];
	const activeFriends:	IUser[] = allFriends?.filter(friend => friend.isActive === 'ONLINE') || [];
	// const blocked:			IUser[] = loggedUser?.blockList || [];
	// const pendingRequests:	IUser[] = loggedUser?.pendingList || [];

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
					onClick={() => handleClickComponent('allFriends')} className={activeList === 'allFriends' ? 'clicked-btn' : 'btn'}>
					All friends
				</button>
				<button 
					 onClick={() => handleClickComponent('activeFriends')} className={activeList === 'activeFriends' ? 'clicked-btn' : 'btn'}> 
					Active friends
				</button>
				<button 
					onClick={() => handleClickComponent('blocked')} className={activeList === 'blocked' ? 'clicked-btn' : 'btn'}>
					Blocked users
				</button>
				<button 
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
}
