import "../styles/FriendsList.css"
import { IUser, users } from "../data";

// faire un composant DisplayConnections
// et selon les props qu'on passe, ça display tel
// ou tel profil 
export function DisplayConnections( props: { profilesToDisplay : IUser[] }) {
	
	const displayProfiles = props.profilesToDisplay.map(profile => {
		return <div key={profile.id}>
					<img 
						src={profile.avatar}
						alt={profile.nickname}
					/>
					<h5>{profile.nickname}</h5>
					<h5>🛇</h5>
					<h5>✉</h5>
		</div>
	})
	return (
		<div>
			{displayProfiles}
		</div>
	);
};
 
export function FriendsList() {

	const loggedUser: IUser = users.filter( user => user.isLogged === true)[0];
	
	const allFriends: IUser[] = loggedUser.friendsList;
	const activeFriends: IUser[] = allFriends.filter(friend => friend.isActive === true);
	console.log(activeFriends);
	
	const blocked: IUser[] = loggedUser.blockList;
	console.log(blocked);
	
	const pendingRequests: IUser[] = loggedUser.pendingList;
	console.log(pendingRequests);
	
	return (
		<div  id="friend-dashboard">
			<h1>FRIENDS LIST</h1>
			<input type="text" placeholder="Search.."/>
			<br />
			<br />
			<button>Active</button>
			<DisplayConnections
				profilesToDisplay={activeFriends}
			/>
			<button>All</button>
			<DisplayConnections
				profilesToDisplay={allFriends}
			/>
			
			<button>Blocked</button>
			<DisplayConnections
				profilesToDisplay={blocked}
			/>
			<button>Pending</button>
			<DisplayConnections
				profilesToDisplay={pendingRequests}
			/>
		</div>
	);
};
