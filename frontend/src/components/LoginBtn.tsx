import "../styles/Avatar.css";
import {Link} from 'react-router-dom';

export default function LoginBtn() {
	return (
	  <button className="login-button">
		<Link className='link-login' to="/login">Log in</Link>
	  </button>
	)
}