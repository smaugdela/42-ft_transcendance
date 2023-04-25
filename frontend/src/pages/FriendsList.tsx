import "../styles/FriendsList.css"
import { IUser, users } from "../data";
import { useEffect, useState } from 'react';
import Fuse from "fuse.js";

export function SearchBar() {

	// Utilisation d'une librairie pour la search
	const options = {
		isCaseSensitive: false,
		findAllMatches: false,
		minMatchCharLength: 1,
		keys: ["nickname"]
	};

	const fuse = new Fuse(users, options);
	const [input, setSearch] = useState("");
	const [searchedUser, setSearchedUSer] = useState<IUser>();
	
	// Récupérer l'input value de la search bar
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
		const searchResult = fuse.search(input)[0];
		(searchResult) ? setSearchedUSer(searchResult.item) : setSearchedUSer(undefined);
		if (event.target.value === "")
			setSearchedUSer(undefined); // pour pouvoir reset le component qd on a fini la search
	}

	return (
		<div>
			<p>Looking for someone to add ? Try this search bar! </p>
			<div className="search_bar">
				<input 
				type="text" 
				id="search_input"
				name="search"
				onChange={handleChange}
				placeholder="Type the nickname of the person you want to find..."/>
				<>
					{ searchedUser && (<div key={searchedUser.id} className="searched_user">
						<div className="search_user_infos">
							<img id="search_user_avatar" src={searchedUser.avatar} alt={searchedUser.nickname} />
							<h5 id="title" >{searchedUser.nickname} <a href="http://localhost:3000/friends">+</a></h5>
							
						</div>
					</div>)
					}
				</>
			</div>
		</div>
	);
}

export function DisplayConnections( props: { profilesToDisplay : IUser[] }) {
	
	const displayProfiles = props.profilesToDisplay.map(profile => {
		return <div key={profile.id} className="profile">
					<img 
						src={profile.avatar}
						alt={profile.nickname}
					/>
					<div className="profile_infos">
						<h5>{profile.nickname}</h5>
						<span>🛇</span>
						<span>✉</span>
					</div>
		</div>
	})
	return (
		<div className="all-current">
			{displayProfiles}
		</div>
	);
};
 
export function FriendsList() {

	const loggedUser: IUser = users.filter( user => user.isLogged === true)[0];
	
	const allFriends:		IUser[] = loggedUser.friendsList;
	const activeFriends:	IUser[]	= allFriends.filter(friend => friend.isActive === true);
	const blocked:			IUser[]	= loggedUser.blockList;
	const pendingRequests:	IUser[]	= loggedUser.pendingList;
	
	const [buttonStates, setButtonStates] = useState({
		allFriends: false,
		activeFriends: false,
		blocked: false,
		pendingRequests: false,
	  });

	const [groupToDisplay, setGroupToDisplay] = useState(allFriends);

	useEffect( () => {

		switch (groupToDisplay) {
			case activeFriends:
				setGroupToDisplay(activeFriends);
				break;
			case allFriends:
				setGroupToDisplay(allFriends);
				break;
			case blocked:
				setGroupToDisplay(blocked);
				break;
			case pendingRequests:
				setGroupToDisplay(pendingRequests);
				break;
			default:
				break;
		}

		},[groupToDisplay, allFriends, activeFriends, blocked, pendingRequests]);
		
	const handleClick = (group: IUser[], id: string) => {
		setGroupToDisplay(group);
		setButtonStates({
			allFriends: false,
			activeFriends: false,
			blocked: false,
			pendingRequests: false,
			[id]: true,
		});
	}

	return (
		<div  id="friend-dashboard">
			<h1>SOCIAL</h1>
			<br />
			<br />
			<SearchBar />
			<br />
			<br />
			<div className="friends-btn">
				<button 
					onClick={ () => handleClick(allFriends, "allFriends")}
					className={buttonStates.allFriends ? "clicked-btn" : "btn"}>
					All friends
				</button>
				<button 
					onClick={ () => handleClick(activeFriends, "activeFriends")}
					className={buttonStates.activeFriends ? "clicked-btn" : "btn"}>
					Active friends
				</button>
				<button 
					onClick={ () => handleClick(blocked, "blocked")}
					className={buttonStates.blocked ? "clicked-btn" : "btn"}>
					Blocked users
				</button>
				<button 
					onClick={ () => handleClick(pendingRequests, "pendingRequests")}
					className={buttonStates.pendingRequests ? "clicked-btn" : "btn"}>
					Pending requests
				</button>
			</div>
			<DisplayConnections
				profilesToDisplay={groupToDisplay}
			/>
		</div>
	);
};
