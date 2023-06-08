import "../styles/Login.css";
import '../App.css';

export default function Login() {
  return (
    <div className="Login">
      <div className="background">
      </div>
      <form>
        {/* <h3>Login Here</h3> */}

        <label htmlFor="username">Username</label>
        <input type="text" placeholder="Email or Phone" id="username" />

        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" id="password" />

        <button id="login-btn">Log In</button>
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
