import axios from "axios";
import { QueryFunctionContext } from 'react-query'
const URL = 'http://localhost:3001';

export async function fetchUsers() {
	const response = await axios.get(`${URL}/users`);
	return response.data;
}

export async function fetchUserById(context: QueryFunctionContext<(string | number)[], any>) {
	// 	context.queryKey: Accesses the queryKey array from the context parameter.
	// [1]: Retrieves the second element from the queryKey array (index 1), which corresponds to the id value.
	// as number: Informs TypeScript that we are asserting the extracted value as a number type.
	const id = context.queryKey[1] as number;
	const response = await axios.get(`${URL}/users/${id}`);
	return response.data;
}

// TODO: gérer le Delete et le Patch
// export async function deleteOneUser(id : number, abortController: AbortController ) {
// 	const userToDelete = await getOneUser(id);

// 	if (userToDelete)
// 	{
// 		await fetch(`${URL}/users/${id}`, 
// 		{ 
// 			method: 'DELETE',
// 			signal: abortController.signal
// 		});
// 		console.log(`Delete of user #${id} done.`);
// 	} else {
// 		console.log('Delete impossible : User does not exist');
// 	}
// }


/* PREVIOUS API CALLS (sans React Query ou Axios) */
// export async function getUsers() {
	
// 	const response = await fetch(`${URL}/users`);
// 	const data = await response.json()
// 							   .then( (data) => { return data;})
// 							   .catch((error) => { console.error(error)});
// 	const users = data;
	
// 	console.log("users, ", users);
// 	return users;
// // }

// export async function getOneUser( id : number ) {

// 	const response = await fetch(`${URL}/users/${id}`);
// 	if (!response.ok) {
// 		throw new Error("Request failed with status: " + response.status);
// 	}
// 	const data = await response.json()
// 							   .then( (data) => {return data;})
// 							   .catch((error) => { console.error(error)});
// 	const user = data;
// 	console.log("user, ", user);
// 	return user;
// }

  
