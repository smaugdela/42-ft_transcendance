import "../styles/UserProfile.css"
import { IUser, users } from "../data";
import { Component, useEffect, useState } from 'react';

export function UserProfile() {
	return (
		<div id="whole-profile">
			<section id="main-dashboard">
				<div>
					<article id="bio">
						<div id="hexagon-avatar"></div>
						<div className="user-infos">
							<span>Marinozaure</span> 
							<span>ONLINE</span>
							<br />
							<button>+</button>
							<button>🛇</button>
							<button>✉</button>
						</div>
					</article>
					<div id="separation"></div>
					<article>Most importants stats</article>
					<article>Achievements</article>
				</div>
				<div id="stats">Stats column</div>
			</section>
			<aside>
				Past Matches
			</aside>

		</div>
	);
}