import '../styles/Navbar.css';
import Avatar from './Avatar';
import LoginBtn from './LoginBtn';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { ChangeEventHandler } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin, faSpaghettiMonsterFlying, faPeoplePulling, faPersonDrowning, faHandsHoldingChild, faRobot, faShieldCat, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import { checkIfLogged, logOut } from "../api/APIHandler";

const SidebarData = [
	{
		title: 'Home',
		path: '/',
		image: <FontAwesomeIcon className='item_image' icon={faMapPin} />,
		cName: 'nav-text'
	},
	{
		title: 'User',
		path: '/user',
		image: <FontAwesomeIcon className='item_image' icon={faSpaghettiMonsterFlying} />,		cName: 'nav-text'
	},
	{
		
		title: 'Leaderboard',
		path: '/leaderboard',
		image: <FontAwesomeIcon className='item_image' icon={faHandsHoldingChild} />,
		cName: 'nav-text'
	},
	{
		title: 'Social',
		path: '/social',
		image: <FontAwesomeIcon className='item_image' icon={faPeoplePulling} />,
		cName: 'nav-text'
	},
	{
		title: 'Settings',
		path: '/settings',
		image: <FontAwesomeIcon className='item_image' icon={faRobot} />,
		cName: 'nav-text'
	},
	{
		title: 'FAQ',
		path: '/faq',
		image: <FontAwesomeIcon className='item_image' icon={faPersonDrowning} />,		cName: 'nav-text'
	},
	{
		title: 'About us',
		path: '/aboutus',
		image: <FontAwesomeIcon className='item_image' icon={faShieldCat} />,	  cName: 'nav-text'
	},

];

export default function Navbar(props: { theme: string, toggleTheme: ChangeEventHandler }) {

	const [sidebar, setSidebar] = useState<boolean>(false);
	const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

	useEffect( () => {
		const fetchData = async () => {
			const userStatus = await checkIfLogged();
			setLoggedIn(userStatus);
		};
		fetchData();
	}, [isLoggedIn]);
	
	
	const handleLogout = async () => {
		try {
			await logOut();
		} catch (error) {
			console.log("logout error");
		}
	}
	
	const showSidebar = () => setSidebar(!sidebar);
  return (
	<>
			<div className='navbar'>
			<label className="nav-elements" id="burger-menu" htmlFor="check"  >
				<input type="checkbox" id="check" onClick={showSidebar}/> 
				<span className='span1'></span>
				<span className='span2'></span>
				<span className='span3'></span> 
			</label>
			<div className="navbar__center">
				<Link to="/" className="navbar__title" >
					CYBERPONG
				</Link>
			</div>
				<>
				{
					isLoggedIn === false && 
					<div className="nav-avatar">
						<LoginBtn />
					</div>
				}
				</>
				<>
				{
					isLoggedIn === true && 
					<div className="nav-avatar">
						<Avatar />
						<button onClick={handleLogout}>
							<FontAwesomeIcon className='nav-logout-icon' icon={faRightFromBracket} />
						</button>
					</div>
				}
				</>

		</div> 
	

		<nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
		  <ul className='nav-menu-items' /*onClick={showSidebar}*/>
			{SidebarData.map((item, index) => {
				return (
					<li key={index} className={item.cName}>
				  <Link to={item.path} >

					<div className='item_image' >{item.image}
					</div>
					<span className='item_title'> {item.title}</span>	
				  </Link>
				</li>
			  );
			})}
		  </ul>
		</nav> 
	</>
  );
}

//   <label id="test" className="theme-switch" htmlFor="checkbox">
// 		<input type="checkbox" id="checkbox" checked={props.theme === 'kawaii'} onChange={props.toggleTheme}/>
// 		<div className="slider round"></div>
//   </label>