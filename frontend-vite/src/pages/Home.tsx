import '../App.css';
import'../styles/Home.css';
import { useState } from "react";
import {Link} from 'react-router-dom';

export default function Home() {
const [open, setOpen] = useState(false);
const [fadeIn, setFadein] = useState(false);
	function handleClick() {
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
