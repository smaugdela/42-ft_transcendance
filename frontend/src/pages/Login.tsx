import "../styles/Login.css";
import '../App.css';
import { useState } from 'react';
import { signUp, logIn } from "../api/APIHandler";

export default function Login() {
	const [nickname, setNickname] = useState("");
	const [password, setPassword] = useState("");

	const handleSignUp = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		
		try {
			await signUp(nickname, password);
			console.log("c'est bon je suis sign up!");
			
		} catch (error) {
			console.log(error);
		}
	}

	const handleLogIn = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		
		try {
			await logIn(nickname, password);
			console.log("c'est bon je suis logged in!");
		} catch (error) {
			console.log("error logging in ", error);
			// TODO: si erreur, afficher que user does not exist
		}
	}

	return (
		<div className="Login">
			<div className="background">
			</div>
			<form>

			<label className="login_label" htmlFor="username">Username</label>
			<input onChange={(event) => {setNickname(event.target.value)}} type="text" placeholder="Email or Phone" id="username" />

			<label  className="login_label" htmlFor="password">Password</label>
			<input onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password" id="password" />

			<button onClick={handleLogIn} id="login-btn">Log In</button>
			<div className="social">
				<div className="go">
					<a href={process.env.REACT_APP_URL_42}>Log with 42</a>
				</div>
				<div className="fb">
					<button  onClick={handleSignUp} id="signup_btn">Sign up</button>
				</div>
			</div>
			</form>
		</div>
  );
}
