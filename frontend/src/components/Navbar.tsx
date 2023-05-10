import React, { useState } from 'react';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { ChangeEventHandler } from 'react';
import Avatar from './Avatar';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin, faSpaghettiMonsterFlying, faPeoplePulling, faPersonDrowning, faHeadSideMask, faHandsHoldingChild, faComments, faUsers, faRobot, faOtter, faShieldCat} from "@fortawesome/free-solid-svg-icons";

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
		// icon: <GiIcons.GiRank3 />,
		image: <FontAwesomeIcon className='item_image' icon={faHandsHoldingChild} />,
		cName: 'nav-text'
	},
	{
		title: 'Friends',
		path: '/friends',
		// image: '/assets/friends2.png',
		image: <FontAwesomeIcon className='item_image' icon={faPeoplePulling} />,
		cName: 'nav-text'
	},
	{
		title: 'Settings',
		path: '/settings',
		// icon: <FiIcons.FiSettings />,
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

function Navbar(props: { theme: string, toggleTheme: ChangeEventHandler }) {
  const [sidebar, setSidebar] = useState(false);

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
				<Link to="/" className="navbar__title">
					CYBERPONG
				</Link>
			</div>
			<div className="nav-avatar">
				<Avatar />
			</div>

        </div> 
	
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            
            {SidebarData.map((item, index) => {
				return (
					<li key={index} className={item.cName}>
                  <Link to={item.path} >

					<div className='item_image' >{item.image}
					</div>
				  {/* <FontAwesomeIcon icon={item.image} className='item_image'/> */}
                    {/* <img className='item_image' src={item.image}/> */}
                    <span className='item_title'> {item.title}</span>	
                  </Link>
                </li>
              );
            })}
          </ul>
		  <label id="test" className="theme-switch" htmlFor="checkbox">
				<input type="checkbox" id="checkbox" checked={props.theme === 'kawaii'} onChange={props.toggleTheme}/>
				<div className="slider round"></div>
		  </label>
        </nav> 
    </>
  );
}

export default Navbar;
