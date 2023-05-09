import React, { useState } from 'react';
import * as CgIcons from 'react-icons/cg';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as GiIcons from 'react-icons/gi';
import * as FiIcons from 'react-icons/fi';
import { ChangeEventHandler } from 'react';
import Avatar from './Avatar';
import Header from './Header';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadSideMask, faHandsHoldingChild, faComments, faUsers, faRobot, faOtter} from "@fortawesome/free-solid-svg-icons";

const SidebarData = [
  {
    title: 'About Us',
    path: '/aboutus',
    icon: <AiIcons.AiOutlineInfoCircle />,
    cName: 'nav-text'
  },
  {
    title: 'Home',
    path: '/',
	image: <FontAwesomeIcon className='item_image' icon={faOtter} />,
    cName: 'nav-text'
  },
  {

    title: 'Leaderboard',
    path: '/leaderboard',
    // icon: <GiIcons.GiRank3 />,
	image: <FontAwesomeIcon className='item_image' icon={faHandsHoldingChild} />,
    cName: 'nav-text'
  },
  {
    title: ' Friends',
    path: '/friends',
    // image: '/assets/friends2.png',
	image: <FontAwesomeIcon className='item_image' icon={faHeadSideMask} />,
    cName: 'nav-text'
  },
  {
    title: ' Settings',
    path: '/settings',
    // icon: <FiIcons.FiSettings />,
	image: <FontAwesomeIcon className='item_image' icon={faRobot} />,
    cName: 'nav-text'
  },
  {
    title: 'FAQ',
    path: '/faq',
    icon: <AiIcons.AiOutlineQuestionCircle />,
    cName: 'nav-text'
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
			<div className="nav-elements nav-right-side">
				<Avatar />
			</div>

        </div> 
	
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            
            {SidebarData.map((item, index) => {
				return (
					<li key={index} className={item.cName}>
                  <Link to={item.path} >

					<div>{item.image}
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
