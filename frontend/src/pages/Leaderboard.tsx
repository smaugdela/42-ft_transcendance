import "../styles/Leaderboard.css"
import { IUser } from "../api/types";
import { fetchUsers } from "../api/APIHandler";
import { useQuery } from "@tanstack/react-query";

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
		return <div key={user.id} className="stats" id={user.isActive ? "myRank" : "other"}>
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

	const usersQuery = useQuery<IUser[]>({ queryKey: ['users'], queryFn: fetchUsers });	

	if (usersQuery.error instanceof Error){
		return <div>Error: {usersQuery.error.message}</div>
	}
	if (usersQuery.isLoading || !usersQuery.isSuccess){
		return <div>Loading</div>
	}
	
	const rank1 = usersQuery.data.filter( user => user.rank === 1);
	const rank2 = usersQuery.data.filter( user => user.rank === 2);
	const rank3 = usersQuery.data.filter( user => user.rank === 3);
	
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
					<PerformanceDetail users={usersQuery.data}/>
				</section>
			</div>
		</div>
	);
};
