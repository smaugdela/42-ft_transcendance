import { useState } from "react";
import "../styles/Avatar.css";
import {Link} from 'react-router-dom';

export default function Avatar() {
  const [open, setOpen] = useState(false);
  const [fadeIn, setFadein] = useState(false);
  let elem;

  function handleClick() {
    setOpen(!open);
    setFadein(true);
  }

  if (open) {
    elem = (
      <>
        <img
          className="avatarImg"
          src={require("../assets/anonym_icon.png")}
          alt="broken png"
          onClick={handleClick}
          onAnimationEnd={() => setFadein(false)}
          width="50"
          height="50"
        />
        <div className={"avatarPannel " + (fadeIn ? "fadeIn" : "")}>
          <h1>Username</h1>
          <button>
			  <Link to="/login">Log In</Link>
		  </button>
        </div>
      </>
    );
  } else {
    elem = (
      <div>
        <img
          className="avatarImg"
          src={require("../assets/anonym_icon.png")}
          alt="broken png"
          onClick={handleClick}
          onAnimationEnd={() => setFadein(false)}
          width="50"
          height="50"
        />
      </div>
    );
  }

  return <>{elem}</>;
}
