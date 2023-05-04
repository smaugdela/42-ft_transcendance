import "../styles/UserProfile.css"
import { IAchievement, achievements } from "../data";
// import { IMatch, matches } from "../data";
import { IUser, users } from "../data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faBan, faComment, faDice, faHeart, faTrophy } from '@fortawesome/free-solid-svg-icons';
// import { faBaby, faJetFighterUp, faLemon, faUserSlash, faViruses, faUserAstronaut, faFrog, faRobot, faShieldDog, faHandSpock, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import WinrateCircularBar from "../components/WinrateCircularBar";
import StatDisplay from "../components/StatDisplay";


export function Achievement( props: { userAchievements: IAchievement[] }) {
	const completedAchievements: number = props.userAchievements.filter(elt => elt.wasAchieved === true).length;

	const displayAchievements = props.userAchievements.map( achievement => {
		return <div  className="one-achievement" id={achievement.wasAchieved === true ? "completed_achievement" : "one-achievement"}>
			<FontAwesomeIcon icon={achievement.icon} className="fa-icon-achievements"/>
			<h3>{achievement.title}</h3>
			<h4>{achievement.description}</h4>
		</div>
	})
	return (
		<article id="achievements">
			<h1>ACHIEVEMENTS ({completedAchievements}/{props.userAchievements.length})</h1>
			<div className="all-achievements">
				{displayAchievements}
			</div>
		</article>
	);
}

export function MatchHistory(props: { user: IUser, users: IUser[]}) {
	
	
	const displayMatchHistory = props.user.matchHistory.map(match => {

		let banner: string = "ACE !";
		let banner_style: string = "ace";
		let outcome : number = match.score_p1 - match.score_p2;
		if (outcome < 0) {
			banner = "DEFEAT!";
			banner_style = "defeat";
		}
		else if (outcome > 0 && match.score_p2 !== 0) {
			banner = "VICTORY !";
			banner_style = "victory";
		}	
		else if (outcome === 0) {
			banner = "EQUALITY !";
			banner_style = "equality";
		}
		
		const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
		const date = match.date.toLocaleDateString('en-US', options);
		const opponent: IUser = props.users.filter(player => player.id === match.id_p2)[0];

		return <div className="match-card">
					<h5>{date}</h5>
					<h4 className={`match-outcome ${banner_style}`}>{banner}</h4>
					<div className="match-detail">
						<div className="opponent">
							<img src={props.user.avatar} alt={props.user.nickname} />
							<h4>{props.user.nickname}</h4>
						</div>
						<div>
							<h2>{match.score_p1} - {match.score_p2}</h2>
						</div>
						<div className="opponent">
							<img src={opponent.avatar} alt={opponent.nickname} />
							<h4>{opponent.nickname}</h4>
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


export function UserProfile() {

	const loggedUser: IUser = users.filter( user => user.isLogged === true)[0];

	return (
		<div id="whole-profile">
			<section id="main-dashboard">
				<div id="top-dashboard">
					<div>
						<article id="bio">
							<div id="hexagon-avatar"></div>
							<div className="user-infos">
								<div className="titles">
									<h2>marinozaure</h2>
									<h1 id="status">ONLINE</h1>
								</div>
								
								<button><FontAwesomeIcon icon={faUserPlus} /></button>
								<button><FontAwesomeIcon icon={faBan} /></button>
								<button><FontAwesomeIcon icon={faComment} /></button>
								<h5>Member since April 25, 2023</h5>
							</div>
						</article>
						<article className="user_bio">
							<h1>BIO</h1> 
							<span> Just a random bio</span>
						</article>
						<hr />
						<article id="main-stats">
							<div className="one-stat">
								<div>
									<FontAwesomeIcon icon={faDice} className="fa-icon"/>
								</div>
								<div  className="one-stat_txt">
									<h2>12</h2>
									<h5>Total Matches</h5>
								</div>
								
							</div>
							<div className="one-stat">
								<div>
									<FontAwesomeIcon icon={faTrophy} className="fa-icon"/>
								</div>
								<div className="one-stat_txt">
									<h2>9</h2>
									<h5>Victories</h5>
								</div>
								
							</div>
							<div className="one-stat">
								<div>
									<FontAwesomeIcon icon={faHeart} className="fa-icon"/>
								</div>
								
								<div  className="one-stat_txt">
									<h2>3</h2>
									<h5>Friends</h5>
								</div>
							</div>
		
						</article>
						<hr />
					</div>
					<div id="stats">
						<h1>COMPETITIVE OVERVIEW</h1>
						<div className="winratio_stats">
							<WinrateCircularBar winRate={70} />
							<div className="statdisplay">
								<StatDisplay title={"Wins"} stat={21} />
								<StatDisplay title={"Lose"} stat={7} />
							</div>
						</div>
						<div className="statdisplay">
							<StatDisplay title={"(Rank)"} stat={1} />
							<StatDisplay title={"Aces"} stat={14} />
						</div>
						<button className="challenge-btn">Challenge</button>
					</div>
				
				</div>
				<Achievement 
					userAchievements={achievements}
				/>
			</section>
			<MatchHistory
				user={loggedUser} 
				users={users}
			/>
		</div>
	);
}