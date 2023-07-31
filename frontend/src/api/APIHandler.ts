import axios from "axios";
import { IMatch, IUser } from "./types";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

axios.defaults.withCredentials = true;

/* ######################*/
/* ##   INTERCEPTORS   ##*/
/* ######################*/

const api = axios.create({
	baseURL: BASE_URL,
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// Redirect to the "Login" page
			window.location.href = '/Login';
		}
		else if (error.response) {
			// Redirect to the according error pages
			window.location.href = '/Error' + error.response.status;
		}
		return Promise.reject(error);
	},
);

/* ######################*/
/* ######   AUTH   ######*/
/* ######################*/

export async function signUp(newNickname: string, password: string): Promise<any> {

	try {
		const response = await api.post(`${BASE_URL}/auth/signup`,
			{
				nickname: newNickname,
				password: password
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': BASE_URL,
				},
			},
		);
		return response.data;

	} catch (error) {
		throw new Error('A user with this nickname already exists');
	}
}


export async function logIn(newNickname: string, password: string): Promise<any> {

	try {
		const response = await axios.post(`${BASE_URL}/auth/login`,
			{
				nickname: newNickname,
				password: password
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': BASE_URL,
				},
			},
		);
		return response;

	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response && error.response.data && error.response.data.message) {
				if (error.response.data.message === 'No such nickname') {
					throw new Error('No such nickname');
				} else {
					throw new Error('Password does not match');
				}
			}
		}
		throw new Error('An error occurred');
	}
}

export async function logOut(): Promise<any> {

	try {
		const response = await axios.delete(`${BASE_URL}/auth/logout`);
		return response.data;

	} catch (error) {
		console.log("Error signup: ", error);
	}
}

export async function fetch2FA(code: string, userId: string): Promise<any> {

	try {
		const response = await axios.get(`${BASE_URL}/auth/2fa?code=${code}&userId=${userId}`);
		return response;

	} catch (error) {
		console.log("Error signup: ", error);
	}
}

/* ######################*/
/* ######   USER   ######*/
/* ######################*/

export async function checkIfLogged(): Promise<boolean> {
	const response = await axios.get<boolean>(`${BASE_URL}/users/check`);
	return response.data;
}

export async function getUserMatches(id: number): Promise<IMatch[]> {
	const response = await api.get<IMatch[]>(`/users/matches/${id}`);

	// nécessaire car Prisma ne renvoie pas exactement un Date object selon JS
	// thread: https://github.com/prisma/prisma/discussions/5522
	const matches: IMatch[] = response.data.map((match) => ({
		...match,
		date: new Date(match.date),
	  }));

	return (matches);
}

export async function fetchUsers(): Promise<IUser[]> {
	const response = await api.get<IUser[]>(`/users`);
	return response.data;
}

export async function fetchUserById(id: number): Promise<IUser> {
	const response = await api.get<IUser>(`/users/${id}`);
	return response.data;
}

export async function fetchUserByNickname(nickname: string): Promise<IUser> {
	const response = await api.get<IUser>(`/users/${nickname}`);
	return response.data;
}

export async function fetchMe(): Promise<IUser> {
	const response = await api.get<IUser>(`/users/me`);
	return response.data;
}

export async function updateUserStringProperty(property: keyof IUser, newProperty: string) {
	try {
		const requestBody = { [property]: newProperty };

		const response = await api.patch<IUser>(
			`/users/me`, 					// url
			requestBody,					// request body
			{								// request config object
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': BASE_URL,
				},
			},
		);
		return response.data;
	} catch (error) {
		// console.log("Error updating user string property: ", error);
		// Handle possible exceptions from the backend accordingly! Recover the error code and eventually display the according page...
		throw new Error('Nickname is already taken');
	}
}


export async function updateUserBooleanProperty(property: keyof IUser, newProperty: boolean) {
	try {
		const requestBody = { [property]: newProperty };

		const response = await api.patch<IUser>(
			`/users/me`, 					// url
			requestBody,					// request body
			{								// request config object
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': BASE_URL,
				},
			},
		);
		return response.data;
	} catch (error) {
		throw new Error('Error during change of boolean user property');
	}
}

export async function deleteMe(): Promise<IUser> {
	return api.delete(`/users/me`);
}

/* ######################*/
/* ######  SEARCH  ######*/
/* ######################*/

export async function getMeiliData(): Promise<IUser> {
	const response = await api.get(`/search`);
	return response.data;
}


export async function postSearchQuery(userInput: string) {

	try {
		const response = await api.post(`/search`, {
			searchQuery: userInput,
		});
		return response;
	} catch (error) {
		throw new Error('Meilisearch: error caught during search');
	}

}

/* ######################*/
/* ###   CLOUDINARY   ###*/
/* ######################*/

export async function uploadImage(file: File) {
	try {
		const formData = new FormData();
		formData.append('file', file);

		const user = await fetchMe();

		const response = await api.post(`/cloudinary`,
			formData, {
			params: {
				id: user.id,
			},
		});
		return response.data; // response.data = avatarUrl
	} catch (error) {
		throw new Error('Error uploading image');
	}
}



/* ######################*/
/* ###     SOCIAL     ###*/
/* ######################*/

export async function getMyFriends(): Promise<IUser> {
	try{
		const response = await axios.get(`${BASE_URL}/social/friends`);
		return response.data;
	} catch (error) {
		console.log("Error getMyFriends: ", error);
		throw error; // Rejette la promesse avec l'erreur d'origine pour la gestion des erreurs par l'appelant
	}
}

export async function getBlockerFriends(): Promise<IUser> {
	try{
		const response = await axios.get(`${BASE_URL}/social/blocked-list`);
		return response.data;
	} catch (error) {
		console.log("Error getBlockerFriends: ", error);
		throw error; 
	}
}

export async function getPendingList(): Promise<IUser> {
	try{
		const response = await axios.get(`${BASE_URL}/social/pending-list`);
		return response.data;
	} catch (error) {
		console.log("Error getPendingList: ", error);
		throw error; 
	}
}

export async function RemoveFromBlock(id : number): Promise<IUser> {

	try {
		const response = await axios.delete(`${BASE_URL}/social/block/${id}`);
		return response.data;

	} catch (error) {
		console.log("Error RemoveFromBlock: ", error);
		throw error; 
	}
}

export async function RejectFriendRequest(id : number): Promise<IUser> {

	try {
		const response = await axios.delete(`${BASE_URL}/social/friend-request/${id}/reject`);
		return response.data;

	} catch (error) {
		console.log("Error RejectFriendRequest: ", error);
		throw error; 
	}
}

export async function RemoveFriend(id : number): Promise<IUser> {

	try {
		const response = await axios.delete(`${BASE_URL}/social/friends/${id}`);
		return response.data;

	} catch (error) {
		console.log("Error RemoveFriend: ", error);
		throw error; 
	}
}

export async function AcceptFriendRequest(id : number): Promise<IUser> {

	try {
		const response = await axios.post(`${BASE_URL}/social/friend-request/${id}/accept`);
		return response.data;

	} catch (error) {
		console.log("Error AcceptFriendRequest: ", error);
		throw error; 
	}
}

export async function FriendRequest(username: string): Promise<IUser> {

	try {
		const response = await axios.post(`${BASE_URL}/social/friend-request/${username}`);
		return response.data;

	} catch (error) {
		console.log("Error FriendRequest: ", error);
		throw error; 
	}
}

export async function BlockUser(username: string): Promise<IUser> {

	try {
		const response = await axios.post(`${BASE_URL}/social/block/${username}`);
		return response.data;

	} catch (error) {
		console.log("Error BlockUser: ", error);
		throw error; 
	}
}