import "../styles/UserProfile.css"
import { IAchievement, achievements } from "../data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faBan, faComment, faDice, faHeart, faTrophy } from '@fortawesome/free-solid-svg-icons';
// import { faBaby, faJetFighterUp, faLemon, faUserSlash, faViruses, faUserAstronaut, faFrog, faRobot, faShieldDog, faHandSpock, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import WinrateCircularBar from "../components/WinrateCircularBar";
import StatDisplay from "../components/StatDisplay";


export function Achievement( props: { userAchievements: IAchievement[] }) {
	// TODO : css du isAchieved ou pas
	// TODO : faire filter du nb des isAchieved/All
	
	const displayAchievements = props.userAchievements.map( achievement => {
		return <div  className="one-achievement">
			<FontAwesomeIcon icon={achievement.icon} className="fa-icon-achievements"/>
			<h3>{achievement.title}</h3>
			<h4>{achievement.description}</h4>
		</div>
	})
	return (
		<article id="achievements">
			<h1>ACHIEVEMENTS (11/11)</h1>
			<div className="all-achievements">
				{displayAchievements}
			</div>
		</article>
	);
}

export function UserProfile() {
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
			<aside>
				<h1>MATCH HISTORY (last 3)</h1>
				<div className="match-card">
					<h5>24 avril 2023 22h48 - 6''03</h5>
					<h4 className="match-outcome defeat"> DEFEAT !</h4>
					<div className="match-detail">
						<div className="opponent">
							<img src="/assets/jinx.png" alt="av" />
							<h4>marine</h4>
						</div>
						<div>
							<h2>1 - 2</h2>
						</div>
						<div className="opponent">
							<img src="/assets/temp.png" alt="av2" />
							<h4>John</h4>
						</div>
					</div>
				</div>
				<div className="match-card">
				<h5>22 avril 2023 19h36 - 3''22</h5>
				<h4 className="match-outcome victory"> VICTORY !</h4>
					<div className="match-detail">
						<div className="opponent">
							<img src="/assets/jinx.png" alt="av" />
							<h4>marine</h4>
						</div>
						<div>
							<h2>3 - 2</h2>
						</div>
						<div className="opponent">
							<img src="/assets/tmp.png" alt="av2" />
							<h4>Krug</h4>
						</div>
					</div>
				</div>
				<div className="match-card">
				<h5>21 avril 2023 14h26 - 2''14</h5>
				<h4 className="match-outcome ace"> ACE !</h4>
					<div className="match-detail">
						<div className="opponent">
							<img src="/assets/jinx.png" alt="av" />
							<h4>marine</h4>
						</div>
						<div>
							<h2>2 - 0</h2>
						</div>
						<div className="opponent">
							<img src="/assets/avatar3.png" alt="av2" />
							<h4>Caitlyn</h4>
						</div>
					</div>
				</div>
			</aside>
		</div>
	);
}