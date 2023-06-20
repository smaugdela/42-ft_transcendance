import "../styles/Settings.css";
import { IUser } from "../api/types";
import { fetchUserById, updateUserStringProperty, deleteUserById } from "../api/APIHandler";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faTrashCanArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

export function TextCardSettings({ property } : {property: keyof IUser}) {
	const [userInput, setUserInput] = useState<string>("");
	const [propertyChanged, setPropertyChange] = useState<boolean>(false);
	const queryClient = useQueryClient();

	const id:number = 1; // à remplacer par le token JWT de la personne loggée à ce moment là

	// Récupérer l'input user
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {setUserInput(event.target.value);}

	// Préparer les actions qui seront faites à la mutation du IUser
	const updateProperty = useMutation({
		mutationFn: () => updateUserStringProperty(id, property, userInput),
		onSuccess: () => {
			queryClient.invalidateQueries(['user']);
			console.log("Update of user attribute successful");
		},
	});

	// Actions qui seront prises lors du click du bouton
	const handleUpdate = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		updateProperty.mutate();
		setPropertyChange(true);
	};

	const userQuery = useQuery({ queryKey: ['user', id], queryFn: () => fetchUserById(id)});
	
	if (userQuery.error instanceof Error){
		return <div>Error: {userQuery.error.message}</div>
	}
	if (userQuery.isLoading || !userQuery.isSuccess){
		return <div>Loading</div>
	}

	const placeholderValue = String(userQuery.data[property]);

	return (
		<>
			<div className="settings__card">
				<div className="settings_property">{property}</div>
				<div className="settings_input">
					<input	type="text" 
							name={property}
							id={property} 
							placeholder={placeholderValue} 
							onChange={handleChange}
					/>
				</div>
				<button className="settings_btn" 
						onClick={handleUpdate}>
						<FontAwesomeIcon icon={faSquareCheck} />
				</button>
			</div>
			<>
			{
				propertyChanged && 
				<div className="settings__alert">
					<h6>Your modification was successful !</h6>
				</div>
			}
			</>
		</>
  );
}

export function ImageCardSettings() {
	return (
		<div>

		</div>
	);
}

export function PasswordCardSettings() {
	return (
		<div>

		</div>
	);
}

export function DeleteAccountCardSettings() {

	const [isDeleted, setDeleted] = useState<boolean>(false);
	const queryClient = useQueryClient();
	const id = 1;

	// fonction qui va delete le User
	const deleteUser = useMutation({
		mutationFn: deleteUserById,
		retry : false,
		onSuccess: () => {
			queryClient.invalidateQueries(['users']); // dit au serveur d'updater sa data plus à jour : ici, la liste des users en comprend un en moins
			console.log("Deletion successful");
		},
	});

	// fonction qui va être appelée au click du bouton, et activer deleteUser
	const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		try { deleteUser.mutate(id); } // (à remplacer par JWT accessToken quand on aura l'auth)
		catch (error) { console.log(error); } // J'ai throw une Erreur (user does not exist) dans ApiHandler.ts
		setDeleted(true);
	};

	// UseEffect to redirect to home page after account deletion
	const navigate = useNavigate();
	useEffect(() => {
		if (isDeleted === true) {
			setTimeout(() => {
				navigate('/');
			}, 3000);
			console.log("Redirected to home page...!");
		}
	}, [isDeleted]);

	return (
		<div className="delete_settings">
			<h2 className="delete_settings__title">Do you want to delete your account?</h2>
			<h4 className="delete_settings__subtitle">Beware, this action is irreversible.</h4>
			<button className="delete_settings__btn"
					onClick={handleDelete}>
				<FontAwesomeIcon icon={faTrashCanArrowUp} />
				Delete your account
			</button>
			<>
			{
				isDeleted && 
				<div className="delete_settings__alert">
					<h5>Your account was successfully deleted!</h5>
					<h6>You will now be redirected to the home page in a few seconds...</h6>
				</div>
			}
			</>
		</div>
	);
}

export default function Settings() {
	return (
	<div className='settings'>
		<h1>Settings</h1>
		<img src="" alt="" />
		<div className="settings__container">
			<ImageCardSettings />
			<TextCardSettings property={'nickname'}/>
			<TextCardSettings property={'bio'}/>
			<TextCardSettings property={'email'}/>
			<PasswordCardSettings />
			<DeleteAccountCardSettings />
		</div>
	</div>
	);
}

// TODO: Gérer l'erreur quand new nickname déjà pris
// TODO: mail: trouver lib pour vérifier que correct + bio, mettre une limite de caractères
// TODO: pour les images, vérifier que c'est un format accepté + stockage à prévoir