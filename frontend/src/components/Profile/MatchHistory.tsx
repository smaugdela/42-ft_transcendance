import "../../styles/UserProfile.css"
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getUserMatches } from "../../api/APIHandler";
import { IUser, IMatch } from "../../api/types";
import { Link } from 'react-router-dom';

export function MatchHistory(props: { user: IUser }) {
	
	const matchesQuery : UseQueryResult<IMatch[]>= useQuery({ 
		queryKey: ['match', props.user.id],
		queryFn: () => getUserMatches(props.user.id)
	});

	if (matchesQuery.error instanceof Error){
		return <div>Error: {matchesQuery.error.message}</div>
	}
	if (matchesQuery.isLoading || !matchesQuery.isSuccess || !props.user){
		return <div>Loading</div>
	}

	const matches: IMatch[] = matchesQuery.data;
	const matchesSortedByDate: IMatch[] = matches.sort((a, b) => b.date.getTime() - a.date.getTime());	

	const displayMatchHistory = matchesSortedByDate.map(match => {

		let banner: string = "ACE !";
		let banner_style: string = "ace";

		if (match.loserId === props.user.id) {
			banner = "DEFEAT!";
			banner_style = "defeat";
		}
		else if (match.winnerId === props.user.id && match.scoreLoser !== 0) {
			banner = "VICTORY !";
			banner_style = "victory";
		}	
		else if (match.scoreWinner === match.scoreLoser) {
			banner = "EQUALITY !";
			banner_style = "equality";
		}
		
		const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
		const date = match.date.toLocaleDateString('en-US', options);
		
		const userScore: number = (match.winnerId === props.user.id) ? match.scoreWinner: match.scoreLoser;
		const opponentScore: number = (match.winnerId === props.user.id) ? match.scoreLoser : match.scoreWinner;
		const opponent: IUser = (match.winnerId === props.user.id) ? match.loser : match.winner;

		return <div key={match.id} className="match-card">
					<h5>{date}</h5>
					<h4 className={`match-outcome ${banner_style}`}>{banner}</h4>
					<div className="match-detail">
						<div className="opponent">
							<img src={props.user.avatar} alt={props.user.nickname} />
							<h4>{props.user.nickname}</h4>
						</div>
						<div>
							<h2>{userScore} - {opponentScore}</h2>
						</div>
						<div className="opponent">
							<Link to={`/user/${opponent?.nickname}`} >
							<img src={opponent?.avatar} alt={opponent?.nickname} />
							</Link>
							<h4>{opponent?.nickname}</h4>
						</div>
					</div>
				</div>
	})
	return (
		<aside>
			<h1>MATCH HISTORY</h1>
			{displayMatchHistory}
		</aside>
	);
}
