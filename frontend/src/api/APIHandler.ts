import axios from "axios";
import { IMatch, IUser, IChannel, IMessage } from "./types";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

axios.defaults.withCredentials = true;

/* ######################*/
/* ##   INTERCEPTORS   ##*/
/* ######################*/

const api = axios.create({
	baseURL: BASE_URL,
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// Redirect to the "Login" page
			window.location.href = '/Login';
		}
		// else if (error.response) {
		// 	// Redirect to the according error pages
		// 	window.location.href = '/Error' + error.response.status;
		// }
		return Promise.reject(error);
	},
);

/* ######################*/
/* ######   AUTH   ######*/
/* ######################*/

export async function signUp(newNickname: string, password: string): Promise<any> {

	try {
		const response = await api.post(`${BASE_URL}/auth/signup`,
			{
				nickname: newNickname,
				password: password
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': BASE_URL,
				},
			},
		);
		return response.data;

	} catch (error) {
		throw new Error('A user with this nickname already exists');
	}
}


export async function logIn(newNickname: string, password: string): Promise<any> {

	try {
		const response = await axios.post(`${BASE_URL}/auth/login`,
			{
				nickname: newNickname,
				password: password
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': BASE_URL,
				},
			},
		);
		return response;

	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response && error.response.data && error.response.data.message) {
				if (error.response.data.message === 'No such nickname') {
					throw new Error('No such nickname');
				} else {
					throw new Error('Password does not match');
				}
			}
		}
		throw new Error('An error occurred');
	}
}

export async function logOut(): Promise<any> {

	try {
		const response = await axios.delete(`${BASE_URL}/auth/logout`);
		return response.data;

	} catch (error) {
		console.log("Error signup: ", error);
	}
}

export async function fetch2FA(code: string, userId: string): Promise<any> {

	try {
		const response = await axios.get(`${BASE_URL}/auth/2fa?code=${code}&userId=${userId}`);
		return response;

	} catch (error) {
		console.log("Error signup: ", error);
	}
}

/* ######################*/
/* ######   USER   ######*/
/* ######################*/

export async function checkIfLogged(): Promise<boolean> {
	const response = await axios.get<boolean>(`${BASE_URL}/users/check`);
	return response.data;
}

export async function getUserMatches(id: number): Promise<IMatch[]> {
	const response = await api.get<IMatch[]>(`/users/matches/${id}`);

	// nécessaire car Prisma ne renvoie pas exactement un Date object selon JS
	// thread: https://github.com/prisma/prisma/discussions/5522
	const matches: IMatch[] = response.data.map((match) => ({
		...match,
		date: new Date(match.date),
	  }));

	return (matches);
}

export async function fetchUsers(): Promise<IUser[]> {
	const response = await api.get<IUser[]>(`/users`);
	return response.data;
}

export async function fetchUserById(id: number): Promise<IUser> {
	const response = await api.get<IUser>(`/users/${id}`);
	return response.data;
}

export async function fetchUserByNickname(nickname: string): Promise<IUser> {
	const response = await api.get<IUser>(`/users/${nickname}`);
	return response.data;
}

export async function fetchMe(): Promise<IUser> {
	const response = await api.get<IUser>(`/users/me`);
	return response.data;
}

export async function updateUserStringProperty(property: keyof IUser, newProperty: string) {
	try {
		const requestBody = { [property]: newProperty };

		const response = await api.patch<IUser>(
			`/users/me`, 					// url
			requestBody,					// request body
			{								// request config object
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': BASE_URL,
				},
			},
		);
		return response.data;
	} catch (error) {
		// console.log("Error updating user string property: ", error);
		// Handle possible exceptions from the backend accordingly! Recover the error code and eventually display the according page...
		throw new Error('Nickname is already taken');
	}
}


export async function updateUserBooleanProperty(property: keyof IUser, newProperty: boolean) {
	try {
		const requestBody = { [property]: newProperty };

		const response = await api.patch<IUser>(
			`/users/me`, 					// url
			requestBody,					// request body
			{								// request config object
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': BASE_URL,
				},
			},
		);
		return response.data;
	} catch (error) {
		throw new Error('Error during change of boolean user property');
	}
}

export async function deleteMe(): Promise<IUser> {
	return api.delete(`/users/me`);
}

/* ######################*/
/* ###      CHAT      ###*/
/* ######################*/

export async function getOneChannelById(id: number): Promise<IChannel> {
	const response = await api.get<IChannel>(`/chat/channel/${id}`);
	return response.data;
}

export async function getOneChannelByName(roomName: string): Promise<IChannel> {
	const response = await api.get<IChannel>(`/chat/channel/find/${roomName}`);
	return response.data;
}

export async function getAllUserChannels(): Promise<IChannel[]> {
	const user = await fetchMe();
	const response = await api.get<IChannel[]>(`/chat/channels/all/${user.id}`);
	return response.data;
}

export async function getAllChannels(): Promise<IChannel[]> {
	const user = await fetchMe();
	const response = await api.get<IChannel[]>(`/chat/channels/more/${user.id}`);
	return response.data;
}

export async function createChannel(roomName: string, password: string, type: string)
: Promise<IChannel> {
	try {
		const user = await fetchMe();
		const userId = user.id;
		const response = await api.post(`/chat/channel`,
			{
				roomName: roomName,
				ownerId: userId,
				password: password,
				type: type,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': BASE_URL,
				},
			},
		);
		return response.data;

	} catch (error) {
		throw new Error('A channel with this name already exists');
	}
}

export async function updateMeInChannel(channelId: number, groupToInsert: string, action: string) {
	try {
		const user = await fetchMe();
		const response = await api.post(`/chat/channel/${channelId}`,
			{
				groupToInsert,
				action,
				userId: user.id,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': BASE_URL,
				},
			},
		);
		return response.data;
	} catch (error) {
		throw new Error('Error: cannot join this channel');
	}
}

export async function updateUserInChannel(userId: number, channelId: number, groupToInsert: string, action: string) {
	try {
		const response = await api.post(`/chat/channel/${channelId}`,
			{
				groupToInsert,
				action,
				userId: userId,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': BASE_URL,
				},
			},
		);
		return response.data;
	} catch (error) {
		throw new Error('Error: cannot join this channel');
	}
}

/**
 * @description Find the convo, and if it doesn't exist, create it and join both users to it
 * @param roomName Name of the conversation (Syntax: senderNickname + ' ' + receiverNickname)
 * @param contactedUserId Id of the person you're trying to message
 * @returns the channel of the conversation (DM)
 */
export async function manageDirectMessages(roomName: string, contactedUserId: number): Promise<IChannel> {
	
	try {
        let conv: IChannel = await getOneChannelByName(roomName);
        if (!conv) {
            conv = await createChannel(roomName, "", 'DM'); // Using '' for password for DM type
        }
        await updateUserInChannel(contactedUserId, conv.id, 'joinedUsers', 'connect' );
        return conv;
    } catch (error) {
        throw new Error('Error: cannot establish this personal convo');
    }
}

/**
 * 
 * @param from The sender id
 * @param to The recipient, aka roomName of a Channel
 * @param content The sender's message
 * @param channelId Number id of the conversation
 * @returns the newly-created message
 */
export async function createMessage(channel: IChannel, content: string): Promise<IMessage> {

	try {
		const { roomName, id } = channel;
		const user = await fetchMe();
		const response = await api.post(`/chat/message`,
			{
				from: user.id,
				to: roomName,
				content: content,
				channelId: id
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': BASE_URL,
				},
			},
		);
		return response.data;
	} catch (error) {
		throw new Error("API: Could not store message");
	}
}

export async function getAllMsgsofChannel(channelId: number): Promise<IMessage[]> {
	try {
		const response =  await api.get(`/chat/messages/${channelId}`);
		const messages: IMessage[] = response.data.map((message: IMessage) => ({
			...message,
			date: new Date(message.date),
		  }));

		return messages;
	} catch (error) {
		throw new Error("API: Could not retrieve messages");
	}
}

export async function deleteAllMsgsofChannel(channelId: number) {
	try {
		return api.delete(`/chat/messages/${channelId}`);
	} catch (error) {
		throw new Error("API: Error during deletion of messages");
	}
}

/* ######################*/
/* ######  SEARCH  ######*/
/* ######################*/

export async function getMeiliData(): Promise<IUser> {
	const response = await api.get(`/search`);
	return response.data;
}


export async function postSearchQuery(userInput: string) {

	try {
		const response = await api.post(`/search`, {
			searchQuery: userInput,
		});
		return response;
	} catch (error) {
		throw new Error('Meilisearch: error caught during search');
	}

}

/* ######################*/
/* ###   CLOUDINARY   ###*/
/* ######################*/

export async function uploadImage(file: File) {
	try {
		const formData = new FormData();
		formData.append('file', file);

		const user = await fetchMe();

		const response = await api.post(`/cloudinary`,
			formData, {
			params: {
				id: user.id,
			},
		});
		return response.data; // response.data = avatarUrl
	} catch (error) {
		throw new Error('Error uploading image');
	}
}
