import '../App.css';
import { matchmaking } from '../api/APIHandler';
import'../styles/GamePage.css';

export default function GamePage() {

	const handleMulti = () => {
		matchmaking();
	}

	return (
        <div id="play-screen2">
          <button className="button1" data-text="MODE SOLO">MODE SOLO
		  </button>
		  <button className="button2" onClick={handleMulti} data-text="MODE MULTI">MODE MULTI
		  </button>
	    </div>
	);
}
