import React from "react";
import "../styles/Avatar.css"

export default function Avatar() {
	let show = false;
	function setShow(value) {
		this.show = value;
		const elem = document.querySelector(".avatarPannel");
		if (show)
		{
			elem.animate("0% {transform: scale(0);} 100% {transform: scale(1);}");
		}
		else
		{
			elem.animate("0% {transform: scale(1);} 100% {transform: scale(0);}");
		}
	}


	if (show)
	{
		return <div className="avatarPannel">
			<img src="../../public/assets/anonym.png" alt="" onClick={setShow(!show)}/>
			<h1>username</h1>
			<button>Sign In</button>
		</div>
	}
	else
	{
		return <button className="avatar" onClick={setShow(!show)}>
  		</button>;
	}
}

