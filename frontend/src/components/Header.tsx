import '../styles/Header.css';
import { ChangeEventHandler } from 'react';

export default function Header( props: { theme: string, toggleTheme: ChangeEventHandler } ) {
	
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
		<div className="nav-elements nav-title">NOTRE PONG</div>
		<div className="nav-elements nav-right-side">
			<label className="theme-switch" htmlFor="checkbox">
				<input type="checkbox" id="checkbox" checked={props.theme === 'kawaii'} onChange={props.toggleTheme}/>
				<div className="slider round"></div>
			</label>
			<div className="avatar"> </div> 
		</div>

		</header>
	);
}

// <header id="navbar"> 

// <div className="nav-elements">
// 	<label className="nav-elements" id="burger-menu" htmlFor="check">
// 		<input type="checkbox" id="check"/> 
// 		<span></span>
// 		<span></span>
// 		<span></span>
// 	</label>
// </div>
// <div className="nav-elements nav-title">NOTRE PONG</div>
// <div className="nav-elements nav-right-side">
// 	<label className="theme-switch" htmlFor="checkbox">
// 		<input type="checkbox" id="checkbox" checked={props.theme === 'kawaii'} onChange={props.toggleTheme}/>
// 		<div className="slider round"></div>
// 	</label>
// 	<div className="avatar"> </div> 
// </div>

// </header>
