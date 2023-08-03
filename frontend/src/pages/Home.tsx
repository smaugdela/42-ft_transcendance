import '../App.css';
import { IsLoggedInContext } from '../context/contexts';
import'../styles/Home.css';
import { useContext, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';

export default function Home() {
	const [open, setOpen] = useState(false);
	const [fadeIn, setFadein] = useState(false);
	const navigate = useNavigate();
	const isLogin = useContext(IsLoggedInContext);

	function handleClick() {
		if (!isLogin)
			navigate('/Login');
		setOpen(!open);
		setFadein(true);
	}
	void(fadeIn); // pour faire taire unused warning

	return (
        <div id="play-screen">
			<button className='glitch' data-text="PRESS TO PLAY" onClick={handleClick} >
				<Link className='link-login2' to="/gamepage"> PRESS TO PLAY  </Link>
			</button>
		</div>
	);
}
