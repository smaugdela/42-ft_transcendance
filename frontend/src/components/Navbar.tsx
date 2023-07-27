import '../styles/Navbar.css';
import Avatar from './Avatar';
import LoginBtn from './LoginBtn';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect, ChangeEventHandler } from "react";
import { IsLoggedInContext, SocketContext } from '../context/contexts';
import { logOut, checkIfLogged } from "../api/APIHandler";
import { createSocketConnexion } from '../sockets/sockets';
import { Socket } from 'socket.io-client';

export default function Navbar(props: { 
	theme: string, 
	toggleTheme: ChangeEventHandler, 
	setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
	setSocket: React.Dispatch<React.SetStateAction<Socket | null>> }) {
	
	const [sidebar, setSidebar] = useState<boolean>(false);
	const isLoggedIn = useContext(IsLoggedInContext);
	const socket = useContext(SocketContext);
	const { setLoggedIn, setSocket } = props;
	
	useEffect( () => {
		const fetchData = async () => {
			const userStatus = await checkIfLogged();
			setLoggedIn(userStatus);
			if (isLoggedIn === true && socket === null) {
				const newSocket = createSocketConnexion();
				setSocket(newSocket);
			}
		};
		
		fetchData();
	}, [setLoggedIn, isLoggedIn, socket, setSocket]);
	
	
	const navigate = useNavigate();
	const handleLogout = async () => {
		try {
			await logOut();
			setLoggedIn(false);
			if (socket) {
				socket.disconnect();
			}
			setTimeout(() => {
				navigate('/');
			}, 1000);
		} catch (error) {
			console.log("logout error");
		}
	}

	const showSidebar = () => setSidebar(!sidebar);

	return (
	<>
		<div className='navbar'>
			<label className="nav-elements" id="burger-menu" htmlFor="check">
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
							<Avatar setLoggedIn={setLoggedIn} />
							<button onClick={handleLogout}>
								<FontAwesomeIcon className='nav-logout-icon' icon={faRightFromBracket} />
							</button>
						</div>
					}
				</>
		</div> 
	
		<Sidebar sidebar={sidebar} isLoggedIn={isLoggedIn}/>
	</>
  );
}
