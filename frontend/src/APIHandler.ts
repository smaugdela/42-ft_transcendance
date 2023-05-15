const URL = 'http://localhost:3001'

export async function getUsers() {
	
	const response = await fetch(`${URL}/users`);
	const data = await response.json()
							   .then( (data) => { return data;})
							   .catch((error) => { console.error(error)});
	const users = data;
	
	console.log("users, ", users);
	return users;
}

export async function getOneUser( id : number ) {

	const response = await fetch(`${URL}/users/${id}`);
	if (!response.ok) {
		throw new Error("Request failed with status: " + response.status);
	}
	const data = await response.json()
							   .then( (data) => {return data;})
							   .catch((error) => { console.error(error)});
	const user = data;
	console.log("user, ", user);
	return user;
}

  
export async function deleteOneUser(id : number, abortController: AbortController ) {
	const userToDelete = await getOneUser(id);

	if (userToDelete)
	{
		await fetch(`${URL}/users/${id}`, 
		{ 
			method: 'DELETE',
			signal: abortController.signal
		});
		console.log(`Delete of user #${id} done.`);
	} else {
		console.log('Delete impossible : User does not exist');
	}
}

