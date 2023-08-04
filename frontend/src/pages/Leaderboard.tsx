import "../styles/Leaderboard.css"
import { IUser } from "../api/types";
import { fetchUsers } from "../api/APIHandler";
import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';

export function TopThreeDetail(props: { user: IUser}) {
	let podium;
	if (props.user.rank === 1)
		podium = "first";
	else if (props.user.rank === 2)
		podium = "second";
	else
		podium = "third";

	return (
		<div key={props.user.id} className="podium" id={podium}>
			<Link to={`/user/${props.user.nickname}`} >
			<img 
				src={props.user.avatar}
				alt={props.user.nickname}
			/>
			</Link>
			<h3>{props.user.score}</h3>
			<h1>{props.user.nickname}</h1>
			<p>Rank {props.user.rank}</p>
		</div>
		);
}

export function OnePerf( {user} : {user: IUser} ) {
	let nbGames = 0;

	if (user.matchAsP1) {
		nbGames += user.matchAsP1.length;
	}
	if (user.matchAsP2) {
		nbGames += user.matchAsP2.length;
	}
	return (
	<div key={user.id} className="stats" id="other">
			<Link to={`/user/${user.nickname}`} >
				<img 
					src={user.avatar}
					alt={user.nickname}
				/>
			</Link>
			<div className="user-ids">
				<h2 >{user.nickname}</h2>
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
				<p>{nbGames}</p>
			</div>
		</div>
	);
}

export function PerformanceDetail(props: {users: IUser[]}) {

	const listRanks = props.users.sort((a, b) => a.rank > b.rank ? 1 : -1)
							.map(user => {
		return <OnePerf user={user} key={user.id}/>
		});
	return (
		<div>
			{listRanks}
		</div>
	);
}

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
	const otherUsers: IUser[] = usersQuery.data.filter( user => user.rank > 3);
	
	return (
		<div id="body-leaderboard">
			<div className="leaderboard">
				<h1>Leaderboard</h1>
				<section id="top-three"> 
				{
					rank2 && rank2.length > 0 &&
					<TopThreeDetail user={rank2[0]}/>
				}
					<TopThreeDetail user={rank1[0]}/>
				{
					rank3 && rank3.length > 0 &&
					<TopThreeDetail user={rank3[0]}/>
				}
				</section>
				<h1>Other performances</h1>
				<section>
				{
					!otherUsers ||  otherUsers.length === 0 &&
					<h1 id="leaderboard_perf_none">There's no one else for now, come back later!</h1>
				}
				{
					(otherUsers && otherUsers.length > 1) &&
					<PerformanceDetail users={otherUsers}/>
				}
				{
					otherUsers && otherUsers.length === 1 &&
					<OnePerf user={otherUsers[0]}/>
				}
				</section>
			</div>
		</div>
	);
}
