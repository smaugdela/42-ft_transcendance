import { IUser } from "../api/types";
import { fetchUsers, fetchUserById, deleteUserById, updateUserNickname } from "../api/APIHandler";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import "../styles/Sandbox.css"

export function GetAllUsers() {

	const [showUsers, setShowUsers] = useState<boolean>(false);
	
	const usersQuery = useQuery<IUser[]>({ queryKey: ['users'], queryFn: fetchUsers });	

	if (usersQuery.error instanceof Error){
		return <div>Error: {usersQuery.error.message}</div>
	}
	if (usersQuery.isLoading || !usersQuery.isSuccess){
		return <div>Loading</div>
	}

	const handleUsersNames = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		setShowUsers(true);
	};
	return (
		<div>
		<button className="btn_sandbox" onClick={handleUsersNames}>Click Here to display all users names</button>
			<>
			{ showUsers && usersQuery.data.map( user => 
					<div key={user.id} className="users_sandbox">{user.nickname}</div>
			)}
			</>
		</div>
	);
}

export function GetOneUser() {
	const [showUserRank, setShowUserRank] = useState<boolean>(false);
	
	const id = 7;
	const userQuery = useQuery({ queryKey: ['user', id], queryFn: () => fetchUserById(id)});
	
	if (userQuery.error instanceof Error){
		return <div>Error: {userQuery.error.message}</div>
	}
	if (userQuery.isLoading || !userQuery.isSuccess){
		return <div>Loading</div>
	}

	const handleUserRank = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		setShowUserRank(true);
	};

	return (
		<div>
			<button className="btn_sandbox" onClick={handleUserRank}>Click Here to display this person's rank</button>
			<>
			{ 
				showUserRank && <div className="users_sandbox">{userQuery.data.rank}</div>
			}
			</>
		</div>
	);
}

export function DeleteOneUser() {
	const [isDeleted, setDeleted] = useState<boolean>(false);
	const queryClient = useQueryClient();
	const id = 7;

	const deleteUser = useMutation({
		mutationFn: deleteUserById,
		retry : false,
		onSuccess: () => {
			queryClient.invalidateQueries(['users']); // dit au serveur d'updater sa data plus à jour : ici, la liste des users en comprend un en moins
			console.log("Deletion successful");
		},
	});

	const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		try { deleteUser.mutate(7); } // 7 étant l'id de la personne à delete (à remplacer par JWT accessToken quand on aura l'auth)
		catch (error) { console.log(error); } // J'ai throw une Erreur (user does not exist) dans ApiHandler.ts
		setDeleted(true);
	};

	return (
		<div>
			<button className="btn_sandbox" onClick={handleDelete}>Click Here to Delete the User 7 (Malphite)</button>
			<>
			{
				isDeleted && <div className="users_sandbox">User {id} is successfully deleted!</div>
			}
			</>
		</div>
	);
}

export function UpdateUser() {
	const [userInput, setUserInput] = useState<string>("");
	const [nameChanged, setNameChange] = useState<boolean>(false);
	const queryClient = useQueryClient();
	const id: number = 1; // à remplacer par le token JWT de la personne loggée à ce moment là
	
	// Récupérer le nouveau nickname de la barre d'input
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserInput(event.target.value);
	}
	console.log("User input: ", userInput);
	
	// Préparer les actions qui seront faites à la mutation du IUser
	const updateNickname = useMutation({
		mutationFn: () => updateUserNickname(id, userInput),
		onSuccess: () => {
			queryClient.invalidateQueries(['user']);
			console.log("Update successful");
		},
	});

	// Actions qui seront prises lors du click du bouton
	const handleUpdate = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		updateNickname.mutate();
		setNameChange(true);
	};
	
	// Appel des data de ce IUser pour afficher son nouveau nom
	const userQuery = useQuery({ queryKey: ['user', id], queryFn: () => fetchUserById(id)});
	
	if (userQuery.error instanceof Error){
		return <div>Error: {userQuery.error.message}</div>
	}
	if (userQuery.isLoading || !userQuery.isSuccess){
		return <div>Loading</div>
	}

	return ( 
	<div>
		<label htmlFor="name">Tired of your ol'name?</label>
		<input onChange={handleChange} type="text" id="name" />
		<button className="btn_sandbox" 
		onClick={handleUpdate}>Click Here to confirm your new nickname</button>
		<>
		{
			nameChanged && 
			<div className="users_sandbox">Your new name is {userQuery.data?.nickname}</div>
		}
		</>
	</div> 
	);	
}

export default function Sandbox() {
	return (
		<div id="page-sandbox">
			<GetAllUsers />
			<GetOneUser />
			<DeleteOneUser />
			<UpdateUser />
		</div>
	);
}