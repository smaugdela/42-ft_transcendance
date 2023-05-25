export interface IUser {
	id: number;
	avatar: string;
	nickname: string;
	mailAddress: string;
	bio: string;
	password: string;
	coalition: string;
	wins: number;
	loses: number;
	aces: number;
	accessToken: number;

	score: number;
	rank: number;
	isActive : boolean;
	isLogged: boolean;

	friendsList : IUser[];
	blockList : IUser[];
	pendingList : IUser[];
}