import "../styles/UserProfile.css"
// import { IUser, users } from "../data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserPlus, faBan, faComment } from '@fortawesome/free-solid-svg-icons';

library.add(faUserPlus);

export function UserProfile() {
	return (
		<div id="whole-profile">
			<section id="main-dashboard">
				<div>
					<article id="bio">
						<div id="hexagon-avatar"></div>
						<div className="user-infos">
							<div className="titles">
								<h2>Marinozaure</h2>
								<h1 id="status">ONLINE</h1>
							</div>
							
							<button><FontAwesomeIcon icon={faUserPlus} /></button>
							<button><FontAwesomeIcon icon={faBan} /></button>
							<button><FontAwesomeIcon icon={faComment} /></button>
							<h5>Member since April 25, 2023</h5>
						</div>
					</article>
					<article>
						<h1>Bio</h1> <span> Just a random bio</span>

					</article>
					<hr />
					<article>
						<h1>Most importants stats</h1>
					</article>
					<hr />
					<article>
						<h1>Achievements</h1>

					</article>
				</div>
				<div id="stats">
					<h1>Stats column</h1>
				</div>
			</section>
			<aside>
				<h1>Match History (last 3)</h1>
				<div>
					<h5>24 avril 2023 22h48 - 6''03</h5>
					<h4 className="match-outcome defeat"> DEFEAT !</h4>
					<div className="match-detail">
						<div className="opponent">
							<img src="/assets/jinx.png" alt="av" />
							<h4>Marinozaure</h4>
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
				<div>
				<h5>22 avril 2023 19h36 - 3''22</h5>
				<h4 className="match-outcome victory"> VICTORY !</h4>
					<div className="match-detail">
						<div className="opponent">
							<img src="/assets/jinx.png" alt="av" />
							<h4>Marinozaure</h4>
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
				<div>
				<h5>21 avril 2023 14h26 - 2''14</h5>
				<h4 className="match-outcome ace"> ACE !</h4>
					<div className="match-detail">
						<div className="opponent">
							<img src="/assets/jinx.png" alt="av" />
							<h4>Marinozaure</h4>
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