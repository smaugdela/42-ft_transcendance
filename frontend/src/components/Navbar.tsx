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

const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Leaderboard',
    path: '/leaderboard',
    icon: <GiIcons.GiRank3 />,
    cName: 'nav-text'
  },
  {
    title: 'Friends',
    path: '/friends',
    icon: <FaIcons.FaUsers />,
    cName: 'nav-text'
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <FiIcons.FiSettings />,
    cName: 'nav-text'
  },
];

function Navbar(props: { theme: string, toggleTheme: ChangeEventHandler }) {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          	<Link to='#' className='menu-bars'>
            	<CgIcons.CgMenuLeft onClick={showSidebar} />
          	</Link>
			<div className="navbar__center">
				<Link to="/" className="navbar__title">
					PONG GAME
				</Link>
			</div>
			<div className="nav-elements nav-right-side">
				<Avatar />
			</div>

        </div>
        
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
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
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
