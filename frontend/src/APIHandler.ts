
export async function getUsers() {
	

	const response = await fetch('http://localhost:3001/users');
	const data = await response.json()
							   .then( (data) => { return data;})
							   .catch((error) => { console.error(error)});
	const users = data;
	
	console.log("users, ", users);
	return users;
}

export async function getOneUser( id : number ) {
	

	const response = await fetch(`http://localhost:3001/users/${id}`);
	const data = await response.json()
							   .then( (data) => { return data;})
							   .catch((error) => { console.error(error)});
	const users = data;
	
	console.log("users, ", users);
	return users;
}

// TODO : faire pareil pour le fetch loggedIn User, ainsi que les PATCH DELETE?

// export async function getOneUser() {
// 	const [test, setUsers] = useState()

// 	useEffect( () => {
// 		fetch('http://localhost:3001/users')
// 		.then(response => {
// 			// console.log(response.json())
// 			return response.json();
// 		})
// 		.then((data) => setUsers(data))
// 		.catch( error => console.error(error));
// 	}, []);


// 	console.log(test);
// }

	// const [test, setUsers] = useState()
	// // to store the data when it returns from our data request to the API

	
	// useEffect( () => {
	// 	fetch('http://localhost:3001/users')
	// 	.then(response => {
	// 		// console.log(response.json())
	// 		return response.json();
	// 	})
	// 	.then((data) => setUsers(data))
	// 	.catch( error => console.error(error));
	// }, []);


	// console.log(test);