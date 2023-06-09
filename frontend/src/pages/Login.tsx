import "../styles/Login.css";
import '../App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, logIn } from "../api/APIHandler";

export default function Login({ setLoggedIn }: { setLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }) {
	const [nickname, setNickname] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [successMsg, setSuccessMsg] = useState<string>("");
	const navigate = useNavigate();

	const handleSignUp = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		
		try {
			await signUp(nickname, password);
			setLoggedIn(true);
			setSuccessMsg("Successfully signed up! ")
			setErrorMsg('');
			setTimeout(() => {
				navigate('/');
			}, 2500);
		} catch (error) {
			setSuccessMsg('');
			setErrorMsg("A user with this nickname already exists");
		}
	}

	const handleLogIn = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		
		try {
			await logIn(nickname, password);
			setLoggedIn(true);
			setErrorMsg('');
			setTimeout(() => {
				navigate('/');
			}, 2500);
		} catch (error) {
			if ((error as Error).message === 'No such nickname') {
				setErrorMsg("User does not exist: please sign up before")
			}
			else {
				setErrorMsg("Password does not match");
			}
		}
	}

	return (
		<div className="Login">
			<div className="background">
			</div>
			<form  className="connection-form">

			<label className="login_label" htmlFor="username">Username</label>
			<input onChange={(event) => {setNickname(event.target.value)}} type="text" placeholder="Email or Phone" id="username" />

			<label  className="login_label" htmlFor="password">Password</label>
			<input onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password" id="password" />
			<>
			{
				successMsg && 
				<div className="login__alert_ok">
					<h6>{successMsg}</h6>
				</div>
			}
			</>
			<>
			{
				errorMsg && 
				<div className="login__alert_err">
					<h6>{errorMsg}</h6>
				</div>
			}
			</>
			<button onClick={handleLogIn} id="login-btn">Log In</button>
			<div className="social">
				<div className="go">
					<a className="title-logs" href={process.env.REACT_APP_URL_42}>Log with 42</a>
				</div>
				<div className="fb">
					<button  onClick={handleSignUp} id="signup_btn">Sign up</button>
				</div>
			</div>
			</form>
		</div>
  );
}
