import axios from "axios";
import { IUser } from "./types";
// import * as argon2 from "argon2";

const BASE_URL = 'http://localhost:3003';

/* ######################*/
/* ##   INTERCEPTORS   ##*/
/* ######################*/

// const api = axios.create({
// 	baseURL: BASE_URL,
// });

// api.interceptors.response.use(
// 	(response) => response,
// 	(error) => {
// 		if (error.response && error.response.status === 401) {
// 			// Redirect to the "Login" page
// 			window.location.href = '/Login';
// 		}
// 		return Promise.reject(error);
// 	},
// );

/* ######################*/
/* ######   USER   ######*/
/* ######################*/

export async function fetchUsers(): Promise<IUser[]> {
	const response = await axios.get<IUser[]>(`${BASE_URL}/users`);
	return response.data;
}

export async function fetchUserById(id : number): Promise<IUser> {
	const response = await axios.get<IUser>(`${BASE_URL}/users/${id}`);
	return response.data;
}

/* Différence PUT et PATCH -> les deux updatent mais 
**	on préfére PATCH pour updater 1 field d'une ressource
** https://stackoverflow.com/questions/31089221/what-is-the-difference-between-put-post-and-patch#:~:text=PUT%20is%20for%20checking%20if,always%20for%20updating%20a%20resource
*/
export async function updateUserNickname( id : number, newNickname: string) {
	try 
	{
		const response = await axios.patch<IUser>(
			`${BASE_URL}/users/${id}`, 		// url
			{ nickname: newNickname},		// request body
			{								// request config object
				headers: {
					'Content-Type': 'application/json',
          			Accept: 'application/json',
				},
			},
		);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('Axios error: ', error.message);
		}
		console.log('Unexpected error: ', error);
	}
}

export async function updateUserStringProperty( id : number, property: keyof IUser, newProperty: string) {
	try 
	{
		console.log('property: ', property);
		const requestBody = { [property]: newProperty };
		
		const response = await axios.patch<IUser>(
			`${BASE_URL}/users/${id}`, 		// url
			requestBody,					// request body
			{								// request config object
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			},
		);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('Axios error: ', error.message);
		}
		console.log('Error updating user: ', error);
	}
}


// export async function updateUserPassword( id : number, newProperty: string) {
// 	try 
// 	{
// 		// const hashedPassword = await argon2.hash(newProperty);

// 		const response = await axios.patch<IUser>(
// 			`${BASE_URL}/users/${id}`, 		// url
// 			{ password: newProperty },					// request body
// 			{								// request config object
// 				headers: {
// 					'Content-Type': 'application/json',
// 					Accept: 'application/json',
// 				},
// 			},
// 		);
// 		return response.data;
// 	} catch (error) {
// 		if (axios.isAxiosError(error)) {
// 			console.log('Axios error: ', error.message);
// 		}
// 		console.log('Error updating user password: ', error);
// 	}
// }


export async function deleteUserById(id : number): Promise<IUser> {

	const userToDelete = await fetchUserById(id);
	
	if (userToDelete) {
		return axios.delete(`${BASE_URL}/users/${id}`);
	} else {
		throw new Error('Deletion impossible: the user does not exist');
	}
}

/* ######################*/
/* ######  SEARCH  ######*/
/* ######################*/


export async function getMeiliData(): Promise<IUser> {
	const response = await axios.get(`${BASE_URL}/search`);
	return response.data;
}


export async function postSearchQuery(userInput : string) {
	const response = await axios.post(`${BASE_URL}/search`, { 
		searchQuery : userInput,
	});
	return response;
}


// import axios from "axios";
// import { IUser } from "./types";

// const BASE_URL = 'http://localhost:3003';

// /* ######################*/
// /* ######   USER   ######*/
// /* ######################*/

// export async function fetchUsers(): Promise<IUser[]> {
// 	const response = await axios.get<IUser[]>(`${BASE_URL}/users`);
// 	return response.data;
// }

// export async function fetchUserById(id : number): Promise<IUser> {
// 	const response = await axios.get<IUser>(`${BASE_URL}/users/${id}`);
// 	return response.data;
// }

// /* Différence PUT et PATCH -> les deux updatent mais 
// **	on préfére PATCH pour updater 1 field d'une ressource
// ** https://stackoverflow.com/questions/31089221/what-is-the-difference-between-put-post-and-patch#:~:text=PUT%20is%20for%20checking%20if,always%20for%20updating%20a%20resource
// */
// export async function updateUserNickname( id : number, newNickname: string) {
// 	try 
// 	{
// 		const response = await axios.patch<IUser>(
// 			`${BASE_URL}/users/${id}`, 		// url
// 			{ nickname: newNickname},		// request body
// 			{								// request config object
// 				headers: {
// 					'Content-Type': 'application/json',
//           			Accept: 'application/json',
// 				},
// 			},
// 		);
// 		return response.data;
// 	} catch (error) {
// 		if (axios.isAxiosError(error)) {
// 			console.log('Axios error: ', error.message);
// 		}
// 		console.log('Unexpected error: ', error);
// 	}
// }

// export async function deleteUserById(id : number): Promise<IUser> {

// 	const userToDelete = await fetchUserById(id);
	
// 	if (userToDelete) {
// 		return axios.delete(`${BASE_URL}/users/${id}`);
// 	} else {
// 		throw new Error('Deletion impossible: the user does not exist');
// 	}
// }

// /* ############################################## */ 
// /* PREVIOUS API CALLS (sans React-Query ou Axios) */
// /* ############################################## */ 
// // export async function getUsers() {
	
// // 	const response = await fetch(`${BASE_URL}/users`);
// // 	const data = await response.json()
// // 							   .then( (data) => { return data;})
// // 							   .catch((error) => { console.error(error)});
// // 	const users = data;
	
// // 	console.log("users, ", users);
// // 	return users;
// // // }

// // export async function getOneUser( id : number ) {

// // 	const response = await fetch(`${BASE_URL}/users/${id}`);
// // 	if (!response.ok) {
// // 		throw new Error("Request failed with status: " + response.status);
// // 	}
// // 	const data = await response.json()
// // 							   .then( (data) => {return data;})
// // 							   .catch((error) => { console.error(error)});
// // 	const user = data;
// // 	console.log("user, ", user);
// // 	return user;
// // }

// // export async function deleteOneUser(id : number, abortController: AbortController ) {
// // 	const userToDelete = await getOneUser(id);

// // 	if (userToDelete)
// // 	{
// // 		await fetch(`${BASE_URL}/users/${id}`, 
// // 		{ 
// // 			method: 'DELETE',
// // 			signal: abortController.signal
// // 		});
// // 		console.log(`Delete of user #${id} done.`);
// // 	} else {
// // 		console.log('Delete impossible : User does not exist');
// // 	}
// // }
  
// /* ######################*/
// /* ######  SEARCH  ######*/
// /* ######################*/


// export async function getMeiliData(): Promise<IUser> {
// 	const response = await axios.get(`${BASE_URL}/search`);
// 	return response.data;
// }


// export async function postSearchQuery(userInput : string) {
// 	const response = await axios.post(`${BASE_URL}/search`, { 
// 		searchQuery : userInput,
// 	});
// 	return response;
// }
