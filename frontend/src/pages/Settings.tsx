import "../styles/Settings.css";
import { IUser } from "../api/types";
import { fetchUserById, updateUserStringProperty, deleteUserById, fetchMe, uploadImage } from "../api/APIHandler";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faTrashCanArrowUp, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import validator from 'validator';

// TODO: Gérer l'erreur quand new nickname déjà pris
// TODO: mail: trouver lib pour vérifier que correct + bio, mettre une limite de caractères
export function TextCardSettings({ property } : {property: keyof IUser}) {
	const [userInput, setUserInput] = useState<string>("");
	const [propertyChanged, setPropertyChange] = useState<boolean>(false);
	const queryClient = useQueryClient();

	// Récupérer l'input user
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {setUserInput(event.target.value);}

	// Préparer les actions qui seront faites à la mutation du IUser
	const updateProperty = useMutation({
		mutationFn: () => updateUserStringProperty(property, userInput),
		onSuccess: () => {
			queryClient.invalidateQueries(['user']);
			console.log("Update of user attribute successful");
		},
	});

	// Actions qui seront prises lors du click du bouton
	const handleUpdate = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		if (validator.isEmail(userInput) === true) {
			updateProperty.mutate();
			setPropertyChange(true);
		}
	};

	const userQuery = useQuery({ queryKey: ['user'], queryFn: () => fetchMe()});
	
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

export function AvatarCardSettings() {
	
	const id = 1;
	const [avatar, setAvatar] = useState<File>();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files)
		{
			setAvatar(event.target.files[0]);
		}
	}

	const handleSubmit = () => {
		if (!avatar)
			return;
		const response = uploadImage(avatar, id).then((response) => {
			console.log(response);});
	}

	const userQuery = useQuery({ queryKey: ['user', id], queryFn: () => fetchUserById(id)});

	if (userQuery.error instanceof Error){
		return <div>Error: {userQuery.error.message}</div>
	}
	if (userQuery.isLoading || !userQuery.isSuccess){
		return <div>Loading</div>
	}
	return (
		<div>
			<div><img src={userQuery.data.avatar} alt={userQuery.data.nickname} /></div>
			<h5>Change your avatar</h5>
			<div><input onChange={handleChange} type="file" accept="image/png, image/jpeg, image/gif"  name="avatar" id="avatar" /></div>
			<div><button onClick={handleSubmit}>Upload</button></div>
		</div>
	);
}

export function PasswordCardSettings() {

	const [errorMsg, setErrorMsg] = useState<string>("");
	const [userInput, setUserInput] = useState<string>("");
	const [passwordChanged, setPasswordChange] = useState<boolean>(false);
	const queryClient = useQueryClient();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserInput(event.target.value);
		if (validator.isStrongPassword(userInput, { 
			minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
		}) === false){
			setErrorMsg("Your password is not strong enough");
		} else {
			setErrorMsg("");
		}
	}

	const handleConfirmation = (event: React.ChangeEvent<HTMLInputElement>) => {
		let confirmInput = event.target.value;
		if (confirmInput !== userInput) {
			console.log("Passwords don't match");
			setErrorMsg("Passwords don't match");
		}
		else {
			setErrorMsg("");
		}
	}

	const updatePassword = useMutation({
		mutationFn: () => updateUserStringProperty('password', userInput),
		onSuccess: () => {
			queryClient.invalidateQueries(['user']);
			console.log("Update of user's password successful");
		},
	});

	const handleUpdate = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		if (errorMsg === "") {
			console.log("Updating password");
			updatePassword.mutate();
			setPasswordChange(true);
		}
	};

	const [type, setType] = useState<string>("password");
	const [icon, setIcon] = useState<any>(faEye);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		if (type === "password") {
			setType("text");
			setIcon(faEyeSlash);
		} else {
			setType("password");
			setIcon(faEye);
		}
	}

	return (
		<div>
			<h2>Changing your password</h2>
			<h4>New password</h4>
			<input type={type} name="password" id="password" onChange={handleChange}/>
			<span onClick={handleClick}><FontAwesomeIcon icon={icon} /></span>
			<h4>Confirm the new password</h4>
			<input type={type} name="password" id="password2" onChange={handleConfirmation}/>
			<span onClick={handleClick}><FontAwesomeIcon icon={icon} /></span>
			<>
			{
				errorMsg && 
				<div className="settings__alert">
					<h6>{errorMsg}</h6>
				</div>
			}
			</>
			<hr />
			<button onClick={handleUpdate}>Save changes</button>
			<>
			{
				passwordChanged && 
				<div className="settings__alert">
					<h6>Your modification was successful !</h6>
				</div>
			}
			</>
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
			<AvatarCardSettings />
			<TextCardSettings property={'nickname'}/>
			<TextCardSettings property={'bio'}/>
			<TextCardSettings property={'email'}/>
			<PasswordCardSettings />
			<DeleteAccountCardSettings />
		</div>
	</div>
	);
}
