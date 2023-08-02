import { faMapPin, faSpaghettiMonsterFlying, faPeoplePulling, faPersonDrowning, faHandsHoldingChild, faRobot, faShieldCat} from "@fortawesome/free-solid-svg-icons";
import SidebarElem from './SidebarElem';
import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../api/APIHandler";
import '../styles/Navbar.css';

export default function Sidebar( props : {sidebar: boolean, isLoggedIn: boolean}) {

	const userQuery = useQuery({ 
		queryKey: ['user'], 
		queryFn: () => fetchMe(),
		enabled: !!props.isLoggedIn // The query will not execute until the user is logged
	});
	
	const createUserPath = () => {
		if (userQuery && userQuery.error instanceof Error){
			return <div>Error: {userQuery.error.message}</div>
		}
		if ((userQuery && userQuery.isLoading) || (userQuery && !userQuery.isSuccess)){
			return <div></div>
		}
		else {
			const userPath = `/user/${userQuery.data?.nickname}`;
			return (
				<SidebarElem	title="User" 
								path={userPath}
								image={faSpaghettiMonsterFlying}
				/>
			)
		}
	}
	return (
		<nav className={props.sidebar ? 'nav-menu active' : 'nav-menu'}>
		  <ul className='nav-menu-items' >
			<SidebarElem title="Home"			path="/"			image={faMapPin}/>
			{createUserPath()}
			<SidebarElem title="Leaderboard"	path="/leaderboard" image={faHandsHoldingChild}/>
			<SidebarElem title="Social"			path="/social"		image={faPeoplePulling}/>
			<SidebarElem title="Settings"		path="/settings"	image={faRobot}/>
			<SidebarElem title="FAQ"			path="/faq"			image={faPersonDrowning}/>
			<SidebarElem title="About us"		path="/aboutus"		image={faShieldCat}/>
		  </ul>
		</nav> 
	);
}


//   <label id="test" className="theme-switch" htmlFor="checkbox">
// 		<input type="checkbox" id="checkbox" checked={props.theme === 'kawaii'} onChange={props.toggleTheme}/>
// 		<div className="slider round"></div>
//   </label>