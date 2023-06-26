import "../styles/Login.css";
import '../App.css';
import { useState } from 'react';
import { signUp } from "../api/APIHandler";

export default function Login() {

	const [nickname, setNickname] = useState("");
	const [password, setPassword] = useState("");

	const handleNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
	setNickname(event.target.value);
	}

	const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
	setPassword(event.target.value);
	}

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
	event.preventDefault();
	console.log("je veux m'inscrire");

	const response = signUp(nickname, password).then((response) => {console.log(response)});
	console.log(response);
	}

	return (
	<div className="Login">
		<div className="background">
		</div>
		<form>
		{/* <h3>Login Here</h3> */}

		<label htmlFor="username">Username</label>
		<input onChange={handleNickname} type="text" placeholder="Email or Phone" id="username" />

		<label htmlFor="password">Password</label>
		<input onChange={handlePassword} type="password" placeholder="Password" id="password" />

		<button onClick={handleClick} id="login-btn">Log In</button>
		<div className="social">
			<div className="go">
				<i className="fab fa-google"></i> Log with 42
			</div>
			<div className="fb">
				<i className="fab fa-facebook"></i> Sign up
			</div>
		</div>
		</form>
	</div>
  );
}
