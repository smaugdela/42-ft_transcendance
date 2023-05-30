import "../styles/Social.css"
import { IUser, users } from "../data";
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faBan, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { postSearchQuery } from "../api/APIHandler";

export function SearchBar() {

	const [userInput, setUserInput] = useState("");
	const [searchedUser, setSearchResults] = useState<IUser>();

	useEffect( () => {
		if (userInput.length > 2){
			postSearchQuery(userInput).then( (response) => {
				const copy = {...response};
				setSearchResults(copy.data.hits[0]._formatted);
			});
		}
		if (userInput === "") {
			setSearchResults(undefined);
		}
	}, [userInput]);
	
	return (
		<div>
			<p>Looking for someone to add ? Try this search bar! </p>
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
							<a href="http://localhost:3000/social">
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

export function DisplayConnections( props: { profilesToDisplay : IUser[] }) {
	
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
						<div><FontAwesomeIcon icon={faBan} /></div>
						<div><FontAwesomeIcon icon={faEnvelope} /></div>
					</div>
		</div>
	})
	return (
		<div className="all-current">
			{displayProfiles}
		</div>
	);
};
 
export function Social() {

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
		<div  id="social-dashboard">
			<h1>SOCIAL</h1>
			<SearchBar />
			<div className="social-btn">
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
