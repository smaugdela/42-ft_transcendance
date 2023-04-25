import '../styles/Header.css';
import { ChangeEventHandler } from 'react';

export default function Header() {
	
	return (
		<header id="navbar"> 

		<div className="nav-elements">
			<label className="nav-elements" id="burger-menu" htmlFor="check">
				<input type="checkbox" id="check"/> 
				<span></span>
				<span></span>
				<span></span>
			</label>
		</div>
		<div className="nav-elements nav-title">TEST PONG</div>
		</header>
	);
}