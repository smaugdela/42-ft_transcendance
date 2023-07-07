export interface IUser {
	id: number;
	avatar: string;
	nickname: string;
	email: string;
	bio: string;
	password: string;
	enabled2FA: boolean;
	coalition: string;
	wins: number;
	loses: number;
	aces: number;
	accessToken: number;

	score: number;
	rank: number;
	isActive : boolean;

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