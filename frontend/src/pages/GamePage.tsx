import { useContext } from 'react';
import { SocketContext } from '../App';
import '../App.css';
import'../styles/GamePage.css';

export default function GamePage() {

	const socket = useContext(SocketContext);
	
	const handleMulti = () => {
		if (socket)
			socket.emit('Join Queue');
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
