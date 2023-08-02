export interface IUser {
	id: number;
	createdAt: Date;
	nickname: string;
	avatar: string;
	password: string;
	email: string;
	enabled2FA: boolean;
	accessToken: number;
	bio: string;
	coalition: string;
	
	aces: number;
	score: number;
	rank: number;
	isActive : boolean;

	ownerChans: IUser[];

	friendsList : IUser[];
	blockList : IUser[];
	pendingList : IUser[];

	achievements: IAchievement[];

	matchAsP1: IMatch[];
	matchAsP2: IMatch[];
}

export interface IAchievement {
	id: number;
	title: string;
	icon: string;
	description: string;
	date: Date;
	fullfilled: boolean;
	user: IUser;
	userId: number;
}

export interface IMatch {
	id: number;
	date: Date;
	mode: string;
	duration: number;
	winner: IUser;
	winnerId: number;
	scoreWinner: number;
	loser: IUser;
	loserId: number;
	scoreLoser: number;
}

export interface IChannel {
	id: number;
	date: Date;
	lastUpdated: Date;
	type: string;
	password: string;
	roomName: string;
	owner: IUser;
	ownerId: number;
	admin: IUser[];
	joinedUsers : IUser[]; 
	bannedUsers : IUser[]; 
	kickedUsers : IUser[]; 
	mutedUsers  : IUser[]; 
}

export interface IMessage {
	id: number;
	date: Date;
	from: IUser;
	fromId: number;
	to: number;
	content: string;
	channel: IChannel;
	channelId: number;
}