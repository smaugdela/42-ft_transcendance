import { useState } from "react";
import "../styles/Avatar.css";
import {Link} from 'react-router-dom';



// export default function Avatar() {
//   const [open, setOpen] = useState(false);
//   const [fadeIn, setFadein] = useState(false);
//   let elem;

//   function handleClick() {
//     setOpen(!open);
//     setFadein(true);
//   }

//   if (open) {
//     elem = (
//       <>
//         {/* <img
//           className="avatarImg"
//           src="/assets/point-inter.png"
//           alt="broken png"
//           onClick={handleClick}
//           onAnimationEnd={() => setFadein(false)}
//           width="50"
//           height="50"
//         /> */}
//         <div className={"avatarPannel " + (fadeIn ? "fadeIn" : "")}>
//           <h1>Username</h1>
//           <button>
// 			  <Link to="/login">Log In</Link>
// 		  </button>
//         </div>
//       </>
//     );
// } else {
// 	elem = (
// 		<div>
// 		  <h2 className="login" onClick={handleClick} onAnimationEnd={() => setFadein(false)} >Log in</h2>
          	
//         {/* <img
//           className="avatarImg"
//           src="/assets/point-inter.png"
//           alt="broken png"
//           }
//           width="50"
//           height="50"
//         /> */}
//       </div>
//     );
//   }

//   return <>{elem}</>;
// }

const Avatar: React.FC = () => {
	const [open, setOpen] = useState(false);
  	const [fadeIn, setFadein] = useState(false);
	console.log(fadeIn);
	
//   let elem;
	function handleClick() {
		setOpen(!open);
		setFadein(true);
  }
	return (
	  <button className="login-button" onClick={handleClick}>
		{/* log in */}
		<Link className='link-login' to="/login">Log in</Link>
	  </button>
	);
  };
  
  export default Avatar;
  
