import io from 'socket.io-client';

export function createSocketConnexion(){
	const base_url: string = process.env.REACT_APP_BACKEND_URL || "https://localhost:3001";

	const newSocket = io(base_url, {
	  withCredentials: true,
	});
	return (newSocket);
}
