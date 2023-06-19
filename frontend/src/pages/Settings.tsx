import "../styles/Settings.css";
import { IUser } from "../api/types";
import { fetchUserById, updateUserStringProperty } from "../api/APIHandler";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';

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
			console.log("Update successful");
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
	return (
		<div>

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
// TODO: mettre une confirmation que c'est fait
// TODO: vérifier que nickname est unique ! Le faire dans le back !!!
// TODO: mail: trouver lib pour vérifier que correct + bio, mettre une limite de caractères
// TODO: pour les images, vérifier que c'est un format accepté + stockage à prévoir