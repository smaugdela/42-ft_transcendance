import "../styles/Login.css";
import '../App.css';
import { useState } from 'react';
import { signUp } from "../api/APIHandler";
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
	const navigate = useNavigate();
	const [nickname, setNickname] = useState("");
	const [password, setPassword] = useState("");

	const handleSignUp = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		
		try {
			await signUp(nickname, password);
			setTimeout(() => {
				navigate('/');
			}, 500);
		} catch (error) {
			console.log(error);
		}
	}

	// const handleLogIn = async (event: React.MouseEvent<HTMLElement>) => {
	// 	event.preventDefault();
		
	// 	try {
	// 		await signUp(nickname, password);
	// 		setTimeout(() => {
	// 			navigate('/');
	// 		}, 500);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }
/*
	Chercher si le user existe
	si fail; proposer sign up
*/
	return (
		<div className="Login">
			<div className="background">
			</div>
			<form>

			<label className="login_label" htmlFor="username">Username</label>
			<input onChange={(event) => {setNickname(event.target.value)}} type="text" placeholder="Email or Phone" id="username" />

			<label  className="login_label" htmlFor="password">Password</label>
			<input onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password" id="password" />

			<button onClick={handleSignUp} id="login-btn">Log In</button>
			<div className="social">
				<div className="go">
					<a href={process.env.REACT_APP_URL_42}>Log with 42</a>
				</div>
				<div className="fb">
					<i  onClick={handleSignUp} className="fab fa-facebook"></i> Sign up
				</div>
			</div>
			</form>
		</div>
  );
}
