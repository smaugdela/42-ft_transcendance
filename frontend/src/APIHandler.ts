import { useEffect, useState } from "react";

// to store the data when it returns from our data request to the API
const [test, setUsers] = useState()

useEffect( () => {
	fetch('http://localhost:3001/users')
	.then(response => {
		// console.log(response.json())
		return response.json();
	})
	.then((data) => setUsers(data))
	.catch( error => console.error(error));
}, []);


console.log(test);
