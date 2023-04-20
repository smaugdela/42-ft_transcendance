import "../styles/FriendsList.css"
import { IUser, users } from "../data";
import { useEffect, useState } from 'react';

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
			<h1>FRIENDS LIST</h1>
			<br />
			<br />
			<p>Looking for someone to add ? Try this search bar! </p>
			<input type="text" placeholder="Search.."/>
			<br />
			<br />
			<div className="friends-btn">
				<button 
					onClick={ () => handleClick(allFriends, "allFriends")}
					className={buttonStates.allFriends ? "clicked-btn" : "btn"}>
					All
				</button>
				<button 
					onClick={ () => handleClick(activeFriends, "activeFriends")}
					className={buttonStates.activeFriends ? "clicked-btn" : "btn"}>
					Active
				</button>
				<button 
					onClick={ () => handleClick(blocked, "blocked")}
					className={buttonStates.blocked ? "clicked-btn" : "btn"}>
					Blocked
				</button>
				<button 
					onClick={ () => handleClick(pendingRequests, "pendingRequests")}
					className={buttonStates.pendingRequests ? "clicked-btn" : "btn"}>
					Pending
				</button>
			</div>
			<DisplayConnections
				profilesToDisplay={groupToDisplay}
			/>
		</div>
	);
};
