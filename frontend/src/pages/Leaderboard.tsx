import "../styles/Leaderboard.css"
import { useEffect } from "react";
import { 
	// deleteOneUser, 
	// getOneUser, 
	fetchUsers } from "../APIHandler";
import { useQuery } from 'react-query'

interface IUser {
	id: number;
	avatar: string;
	nickname: string;
	mailAddress: string;
	bio: string;
	password: string;
	coalition: string;
	wins: number;
	loses: number;
	aces: number;
	accessToken: number;

	score: number;
	rank: number;
	isActive : boolean;
	isLogged: boolean;

	friendsList : IUser[];
	blockList : IUser[];
	pendingList : IUser[];
}

export function TopThreeDetail(props: { user: IUser }) {
	let podium;
	if (props.user.rank === 1)
		podium = "first";
	else if (props.user.rank === 2)
		podium = "second";
	else
		podium = "third";

	return (
		<div key={props.user.id} className="podium" id={podium}>
			<img 
				src={props.user.avatar}
				alt={props.user.nickname}
			/>
			<h3>{props.user.score}</h3>
			<h1>{props.user.nickname}</h1>
			<p>{props.user.coalition}</p>
		</div>
		);
}

export function PerformanceDetail(props: {users: IUser[]}) {
	
	const listRanks = props.users.sort((a, b) => a.rank > b.rank ? 1 : -1)
						   .map(user => {
		if (user.rank < 4)
			return (null);
		return <div key={user.id} className="stats" id={user.isLogged ? "myRank" : "other"}>
			<img 
				src={user.avatar}
				alt={user.nickname}
			/>
			<div className="user-ids">
				<h2 >{user.nickname}</h2>
				<p >{user.coalition}</p>
			</div>
			<div id="vertical-sep"></div>
			<div className="one-stat">
				<h4>Rank</h4>
				<p>{user.rank}</p>
			</div>
			<div className="one-stat">
				<h4>Score</h4>
				<p>{user.score}</p>
			</div>
			<div className="one-stat">
				<h4>Games Played</h4>
				<p>{user.wins + user.loses}</p>
			</div>
		</div>
		});

	return (
		<div>
			{listRanks}
		</div>
	);
};

export function Leaderboard() {

	const query = useQuery<IUser[]>({ queryKey: ['users'], queryFn: fetchUsers });

	if (query.error instanceof Error){
		return <div>Error: {query.error.message}</div>
	}
	if (query.isLoading || query.data === undefined){
		return <div>Loading</div>
	}
	
	const rank1 = query.data.filter( user => user.rank === 1);
	const rank2 = query.data.filter( user => user.rank === 2);
	const rank3 = query.data.filter( user => user.rank === 3);
	
	return (
		<div id="body-leaderboard">
			<div id="gradient-bg"></div>
			<div className="leaderboard">
				<section id="top-three"> 
					<TopThreeDetail user={rank2[0]}/>
					<TopThreeDetail user={rank1[0]}/>
					<TopThreeDetail user={rank3[0]}/>
				</section>
				<h1>Other performances</h1>
				<section> 
					<PerformanceDetail users={query.data}/>
				</section>
			</div>
		</div>
	);
};

	
	// const oneuser = getOneUser(8).then((result) => console.log("result one", result));

	// useEffect( () => {
	// 	const abortController = new AbortController();

	// 	deleteOneUser(13, abortController);
		
	// 	return () => abortController.abort();
	// }, []);


	// VERSION OU LE FETCH EST DANS LE COMPONENT :
	// const [test, setUsers] = useState()
	// // to store the data when it returns from our data request to the API
	// useEffect( () => {
	// 	fetch('http://localhost:3001/users')
	// 	.then(response => {
	// 		// console.log(response.json())
	// 		return response.json();
	// 	})
	// 	.then((data) => setUsers(data))
	// 	.catch( error => console.error(error));
	// }, []);