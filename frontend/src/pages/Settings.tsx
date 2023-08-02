import "../styles/Settings.css";
import { IUser } from "../api/types";
import { updateUserStringProperty, deleteMe, fetchMe, uploadImage, updateUserBooleanProperty } from "../api/APIHandler";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTrashCanArrowUp, faEye, faEyeSlash, faFileArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import validator from 'validator';

export function TextCardSettings({ property } : {property: keyof IUser}) {
	const [userInput, setUserInput] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [propertyChanged, setPropertyChange] = useState<boolean>(false);
	const queryClient = useQueryClient();

	// Récupérer l'input du user
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {setUserInput(event.target.value);}

	// Préparer les actions qui seront faites à la mutation du IUser
	const updateProperty = useMutation({
		mutationFn: () => updateUserStringProperty(property, userInput),
		onSuccess: () => { 
			queryClient.invalidateQueries(['user']);
			setPropertyChange(true); },
		onError: (error: any) => {
			setErrorMsg(error.message || 'An error occurred');
		  },
	});

	// Actions qui seront prises lors du click du bouton
	const handleUpdate = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		if (property !== 'email' ||
			(property === 'email' && validator.isEmail(userInput) === true)) {
				updateProperty.mutate();
				setErrorMsg("");
		}
		else {
			setErrorMsg("Email must be formatted mail@mail.mail");
		}
	};

	const userQuery = useQuery({ queryKey: ['user'], queryFn: () => fetchMe()});
	
	if (userQuery.error instanceof Error){
		return <div>Error: {userQuery.error.message}</div>
	}
	if (userQuery.isLoading || !userQuery.isSuccess){
		return <div>Loading</div>
	}

	const placeholderValue: string = (userQuery.data[property] === null) ?
									"empty" : String(userQuery.data[property]);
	
	return (
		<>
			<div className="text_settings__card">
				<div className="text_settings_property">{property}</div>
				<div className="text_settings_input">
					<input	type="text" 
							name={property}
							id={property} 
							placeholder={placeholderValue}
							onChange={handleChange}
							className="text_input"
					/>
				<button className="text_settings_btn" 
						onClick={handleUpdate}>
						<FontAwesomeIcon icon={faCircleCheck} className="text_checkbox"/>
				</button>
				</div>
			</div>
			<>
			{
				propertyChanged && 
				<div className="settings__alert_ok">
					<h6>Your modification was successful !</h6>
				</div>
			}
			</>
			<>
			{
				errorMsg && 
				<div className="settings__alert_err">
					<h6>{errorMsg}</h6>
				</div>
			}
			</>
		</>
  );
}

export function AvatarCardSettings( props: {user : IUser}) {

	const [errorMsg, setErrorMsg] = useState<string>("");
	const [avatar, setAvatar] = useState<File>();
	const [browseMsg, setBrowseMsg] = useState<string>("Choose a file");
	const [avatarUrl, setAvatarUrl] = useState<string>(props.user.avatar);
	
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files){
			setAvatar(event.target.files[0]);
			setBrowseMsg("File chosen!");
		}
	}

	const handleSubmit = async () => {
		if (!avatar) return;
		try {
			const url = await uploadImage(avatar);
			setAvatarUrl(url);
			setErrorMsg("");
		} catch (error) {
			setErrorMsg("File must be png/jpg/gif and not exceed 5MB!");
		}
		setBrowseMsg("Choose a file");
	}
	if (avatarUrl === undefined) {
		setAvatarUrl(props.user.avatar);
	}
	
	return (
		<div id="avatar_settings">
			<div>
				<img src={avatarUrl} alt={props.user.nickname} id="user_avatar"/>
			</div>
			<div className="avatar_block">
				<h5>Change your avatar :</h5>
				<input onChange={handleChange} type="file" accept="image/png, image/jpeg, image/gif"  name="file" id="file" />
				<label htmlFor="file" id="choose_file">
					<FontAwesomeIcon icon={faFileArrowUp} />
					<span>{browseMsg}</span>
				</label>
				<>
				{
					errorMsg && 
					<div className="settings__alert_err">
						<h6>{errorMsg}</h6>
					</div>
				}
				</>
				<button id="avatar_upload_btn" onClick={handleSubmit}>Upload</button>
			</div>
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
			minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}) 
			=== false) {
			setErrorMsg("Your password is not strong enough");
		} else {
			setErrorMsg("");
		}
	}

	const handleConfirmation = (event: React.ChangeEvent<HTMLInputElement>) => {
		(event.target.value !== userInput) ? 
			setErrorMsg("Passwords don't match") 
			: setErrorMsg("");
	}

	const updatePassword = useMutation({
		mutationFn: () => updateUserStringProperty('password', userInput),
		onSuccess: () => { queryClient.invalidateQueries(['user']); },
	});

	const handleUpdate = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		if (errorMsg === "") {
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
		<div className="password__card">
			<h2>Change your password</h2>
			<h4>New password</h4>
			<div className="input_container">
				<input 
					type={type}
					name="password"
					id="password"
					onChange={handleChange}
					className="password__input"
				/>
				<span onClick={handleClick}><FontAwesomeIcon icon={icon} /></span>
			</div>
			<h4>Confirm the new password</h4>
			<div className="input_container">
				<input type={type} name="password" id="password2" className="password__input" onChange={handleConfirmation}></input>
				<span onClick={handleClick}><FontAwesomeIcon icon={icon} /></span>
			</div>
			<>
			{
				errorMsg && 
				<div className="settings__alert_err">
					<h6>{errorMsg}</h6>
				</div>
			}
			</>
			<button id="password__btn" onClick={handleUpdate}>Save changes</button>
			<>
			{
				passwordChanged &&
				<div className="settings__alert_ok">
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

	// fonction qui va delete le User
	const deleteUser = useMutation({
		mutationFn: deleteMe,
		retry : false,
		onSuccess: () => {
			queryClient.invalidateQueries(['users']); // dit au serveur d'updater sa data plus à jour : ici, la liste des users en comprend un en moins
		},
	});

	// fonction qui va être appelée au click du bouton, et activer deleteUser
	const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		try { deleteUser.mutate(); }
		catch (error) { console.log(error); }
		setDeleted(true);
	};

	// UseEffect to redirect to home page after account deletion
	const navigate = useNavigate();
	useEffect(() => {
		if (isDeleted === true) {
			setTimeout(() => {
				navigate('/');
			}, 3000);
		}
	}, [isDeleted, navigate]);

	return (
			<div className="delete_settings">
				<h2 className="delete_settings__title">Do you want to delete your account?</h2>
				<h4 className="delete_settings__subtitle">Beware, this action is irreversible.</h4>
				<button className="delete_settings__btn"
						onClick={handleDelete}>
					<FontAwesomeIcon icon={faTrashCanArrowUp} />
					<span>Delete your account</span>
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

// Pour Simon quand tu feras le 2FA:
/* 
	Roadmap 2FA côté Front:
	- FAIT/ useState<boolean> de la propriété prisma du User
	- FAIT/ check si la personne a bien renseigné son adresse mail et message d'err
	- FAIT/ utiliser UseMutation hook pour call la fonction API qui va Patch ce booléen
	- FAIT/ utiliser React-Query pour get les infos du User et afficher le statut du 2FA
	- FAIT/ un onClick pour récupérer l'état du slider et le lier au UseMutation
	- FAIT/ par défaut, afficher le switch d'après le statut du user (si 2FA activé, afficher
		 par défaut en vert quand le user retourne sur sa page)
	
	RESTE A FAIRE:
	- utiliser le state du booléen pour afficher la popup du code à rentrer
*/
export function Activate2FA() {
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [isEnabled, setIsEnabled] = useState<boolean>(false);
	const queryClient = useQueryClient();
	
	const enable2FA = useMutation({
		mutationFn: () => updateUserBooleanProperty("enabled2FA", isEnabled),
		onSuccess: () => { 
			queryClient.invalidateQueries(['user']);
		},
		onError: (error: any) => {
			setErrorMsg(error.message || 'An error occurred');
		},
	});
	
	const userQuery = useQuery({ queryKey: ['user'], queryFn: () => fetchMe()});
	
	useEffect(() => {
		if (userQuery.data && !userQuery.data.email) {
			setErrorMsg("You must provide your email above to use this feature.");
		} else {
			setErrorMsg("");
		}
	}, [userQuery.data, userQuery.data?.email, isEnabled]);
	
	if (userQuery.error instanceof Error){
		return <div>Error: {userQuery.error.message}</div>
	}
	if (userQuery.isLoading || !userQuery.isSuccess){
		return <div>Loading</div>
	}
	
	const handleChange= () => {
			const tmp = (isEnabled === true)? false : true;
			setIsEnabled(tmp);
			enable2FA.mutate();
	}

	return (
		<div id="fa_settings">
			<h2>Two-factor authentication</h2>
			<h4>Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.</h4>
			<input type="checkbox" id="switch" checked={userQuery.data.enabled2FA} onChange={handleChange}/>
			<label htmlFor="switch" className="switch-label"></label>
			<h4> Please note that you must confirm your email adress to enable 2FA. You will receive an email to do so if you change your email adress or if you activate this switch.</h4>
			<>
			{
				errorMsg && 
				<div className="settings__alert_err">
					<h6>{errorMsg}</h6>
				</div>
			}
			</>
		</div>
	);
}

export default function Settings() {

	const userQuery = useQuery({ queryKey: ['user'], queryFn: () => fetchMe()});
	
	if (userQuery.error instanceof Error){
		return <div>Error: {userQuery.error.message}</div>
	}
	if (userQuery.isLoading || !userQuery.isSuccess){
		return <div>Loading</div>
	}

	return (
		<div className="settings__flex">
			<div className='settings'>
				<h1>Settings</h1>
				<img src="" alt="" />
				<div className="settings__container">
					<AvatarCardSettings user={userQuery.data}/>
					<TextCardSettings property={'nickname'}/>
					<TextCardSettings property={'bio'}/>
					<TextCardSettings property={'email'}/>
					<PasswordCardSettings />
					<Activate2FA/>
					<DeleteAccountCardSettings />
				</div>
			</div>
		</div>
	);
}
