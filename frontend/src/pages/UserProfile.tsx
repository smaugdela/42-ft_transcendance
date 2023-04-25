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
						<h1>Bio</h1>

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
				<h1>Past Matches</h1>
				<div>1 match</div>
				<div>1 match</div>
				<div>1 match</div>
			</aside>

		</div>
	);
}