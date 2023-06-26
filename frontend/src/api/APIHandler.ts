import axios from "axios";
import { IUser } from "./types";

const BASE_URL = 'http://localhost:3001';

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
		return Promise.reject(error);
	},
);

/* ######################*/
/* ######   AUTH   ######*/
/* ######################*/

export async function signUp(newNickname: string, password: string): Promise<any> {

	try {
		const response = await axios.post(`${BASE_URL}/auth/signup`,
			{
				nickname: newNickname,
				password: password
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': ['http://localhost:3001', 'http://localhost:3000']
				},
			},
		);
		return response.data;

	} catch (error) {
		console.log("Error signup: ", error);
	}
}


/* ######################*/
/* ######   USER   ######*/
/* ######################*/

export async function fetchUsers(): Promise<IUser[]> {
	const response = await api.get<IUser[]>(`/users`);
	return response.data;
}

export async function fetchUserById(id: number): Promise<IUser> {
	const response = await api.get<IUser>(`/users/${id}`);
	return response.data;
}

export async function fetchMe(): Promise<IUser> {
	const response = await api.get<IUser>(`/users/me`);
	return response.data;
}

export async function updateUserStringProperty(property: keyof IUser, newProperty: string) {
	try {
		console.log('property: ', property);
		const requestBody = { [property]: newProperty };

		const response = await api.patch<IUser>(
			`/users/me`, 				// url
			requestBody,					// request body
			{								// request config object
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': ['http://localhost:3001', 'http://localhost:3000']
				},
			},
		);
		return response.data;
	} catch (error) {
		console.log('Error updating user: ', error);
	}
}

export async function deleteUserById(id: number): Promise<IUser> {

	const userToDelete = await fetchUserById(id);

	if (userToDelete) {
		return api.delete(`/users/${id}`);
	} else {
		throw new Error('Deletion impossible: the user does not exist');
	}
}

/* ######################*/
/* ######  SEARCH  ######*/
/* ######################*/


export async function getMeiliData(): Promise<IUser> {
	const response = await api.get(`/search`);
	return response.data;
}


export async function postSearchQuery(userInput: string) {
	const response = await api.post(`/search`, {
		searchQuery: userInput,
	});
	return response;
}

/* ######################*/
/* ###   CLOUDINARY   ###*/
/* ######################*/

export async function uploadImage(file: File, userId: number) {
	try {
		
		const formData = new FormData();
		formData.append('file', file);
	
		const response = await api.post(`/cloudinary`, 
			formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				origin: ['http://localhost:3000', 'http://localhost:3001']
			},
			params: {
				id: userId,
			},
		});
		return response.data; // response.data = avatarUrl
	} catch (error) {
		console.error(`Error uploading image: ${error}`);
	}
}
