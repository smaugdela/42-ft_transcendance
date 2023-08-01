// import { IconProp } from "@fortawesome/fontawesome-svg-core";
// import { faBaby, faJetFighterUp, faLemon, faUserSlash, faViruses, faUserAstronaut, faFrog, faRobot, faShieldDog, faHandSpock, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';

export interface IUser {
	id: number;
	avatar: string;
	nickname: string;
	mailAddress: string;
	coalition: string;
	nbGames: number;
	score: number;
	rank: number;
	isLogged: boolean;
	friendsList : IUser[];
	blockList : IUser[];
	pendingList : IUser[];
	isActive : boolean;
	matchHistory: IMatch[];
}

export interface IAchievement {
	icon : string;
	title : string;
	description : string;
	wasAchieved: boolean;
}

export interface IMatch {
	date: Date,
	score_p1: number,
	score_p2: number,
	id_p1: number,
	id_p2: number,
	mode: string,
}

export const users : IUser[] =  [
	{
		id: 0,
		avatar: "/assets/avatar2.png",
		nickname: "John",
		mailAddress: "",
		coalition: "Federation",
		nbGames: 14,
		score: 1000,
		rank: 1,
		isLogged:false,
		friendsList : [],
		blockList : [],
		pendingList : [],
		isActive : false,
		matchHistory: []
	},{
		id: 1,
		avatar: "/assets/avatar3.png",
		nickname: "Caitlyn",
		mailAddress: "",
		coalition: "Assembly",
		nbGames: 8,
		score: 750,
		rank: 4,
		isLogged:false,
		friendsList : [],
		blockList : [],
		pendingList : [],
		isActive : false,
		matchHistory: []
	},{
		id: 2,
		avatar: "/assets/avatar3.png",
		nickname: "Viktor",
		mailAddress: "",
		coalition: "Federation",
		nbGames: 3,
		score: 52,
		rank: 9,
		isLogged:false,
		friendsList : [],
		blockList : [],
		pendingList : [],
		isActive : false,
		matchHistory: []
	},{
		id: 3,
		avatar: "/assets/avatar2.png",
		nickname: "Sion",
		mailAddress: "",
		coalition: "Assembly",
		nbGames: 12,
		score: 896,
		rank: 3,
		isLogged:false,
		friendsList : [],
		blockList : [],
		pendingList : [],
		isActive : false,
		matchHistory: []
	},{
		id: 4,
		avatar: "/assets/avatar1.png",
		nickname: "Jinx",
		mailAddress: "",
		coalition: "Federation",
		nbGames: 13,
		score: 963,
		rank: 2,
		isLogged:false,
		friendsList : [],
		blockList : [],
		pendingList : [],
		isActive : false,
		matchHistory: []
  	},{
		id: 5,
		avatar: "/assets/avatar2.png",
		nickname: "Malphite",
		mailAddress: "",
		coalition: "Order",
		nbGames: 2,
		score: 89,
		rank: 8,
		isLogged:false,
		friendsList : [],
		blockList : [],
		pendingList : [],
		isActive : false,
		matchHistory: []
  	},{
		id: 6,
		avatar: "/assets/avatar3.png",
		nickname: "Le Blanc",
		mailAddress: "",
		coalition: "Alliance",
		nbGames: 6,
		score: 123,
		rank: 7,
		isLogged:false,
		friendsList : [],
		blockList : [],
		pendingList : [],
		isActive : false,
		matchHistory: []
	},{
		id: 7,
		avatar: "/assets/avatar2.png",
		nickname: "Lee Sin",
		mailAddress: "",
		coalition: "Alliance",
		nbGames: 15,
		score: 450,
		rank: 6,
		isLogged:false,
		friendsList : [],
		blockList : [],
		pendingList : [],
		isActive : true,
		matchHistory: []	
	},{
		id: 8,
		avatar: "/assets/avatar1.png",
		nickname: "Lulu",
		mailAddress: "",
		coalition: "Order",
		nbGames: 8,
		score: 487,
		rank: 5,
		isLogged: true,
		friendsList : [
			{
				id: 9,
				avatar: "/assets/avatar3.png",
				nickname: "Diana",
				mailAddress: "",
				coalition: "Alliance",
				nbGames: 2,
				score: 28,
				rank: 10,
				isLogged:false,
				friendsList : [],
				blockList : [],
				pendingList : [],
				isActive : true,
				matchHistory: []			
			},
			{
				id: 7,
				avatar: "/assets/avatar2.png",
				nickname: "Lee Sin",
				mailAddress: "",
				coalition: "Alliance",
				nbGames: 15,
				score: 450,
				rank: 6,
				isLogged:false,
				friendsList : [],
				blockList : [],
				pendingList : [],
				isActive : true,
				matchHistory: []			
			},
			{
				id: 4,
				avatar: "/assets/avatar1.png",
				nickname: "Jinx",
				mailAddress: "",
				coalition: "Federation",
				nbGames: 13,
				score: 963,
				rank: 2,
				isLogged:false,
				friendsList : [],
				blockList : [],
				pendingList : [],
				isActive : false,
				matchHistory: []
			}
		],
		blockList : [
			{
				id: 6,
				avatar: "/assets/avatar3.png",
				nickname: "Le Blanc",
				mailAddress: "",
				coalition: "Alliance",
				nbGames: 6,
				score: 123,
				rank: 7,
				isLogged:false,
				friendsList : [],
				blockList : [],
				pendingList : [],
				isActive : false,
				matchHistory: []
			},
			{
				id: 5,
				avatar: "/assets/avatar2.png",
				nickname: "Malphite",
				mailAddress: "",
				coalition: "Order",
				nbGames: 2,
				score: 89,
				rank: 8,
				isLogged:false,
				friendsList : [],
				blockList : [],
				pendingList : [],
				isActive : false,
				matchHistory: []
			  }
		],
		pendingList : [
			{
				id: 3,
				avatar: "/assets/avatar2.png",
				nickname: "Sion",
				mailAddress: "",
				coalition: "Assembly",
				nbGames: 12,
				score: 896,
				rank: 3,
				isLogged:false,
				friendsList : [],
				blockList : [],
				pendingList : [],
				isActive : false,
				matchHistory: []
			},
			{
				id: 2,
				avatar: "/assets/avatar3.png",
				nickname: "Viktor",
				mailAddress: "",
				coalition: "Federation",
				nbGames: 3,
				score: 52,
				rank: 9,
				isLogged:false,
				friendsList : [],
				blockList : [],
				pendingList : [],
				isActive : false,
				matchHistory: []
			}
		],
		isActive : true,
		matchHistory: [
		{
			date: new Date(2023, 5, 3, 12, 30, 6, 8),
			score_p1: 1,
			score_p2: 1,
			id_p1: 8,
			id_p2: 1,
			mode: "classic",
		},
		{
			date: new Date(2023, 5, 2, 18, 30, 24, 2),
			score_p1: 2,
			score_p2: 1,
			id_p1: 8,
			id_p2: 9,
			mode: "classic",
		},
		{
			date: new Date(2023, 4, 30, 20, 30, 5, 8),
			score_p1: 0,
			score_p2: 2,
			id_p1: 8,
			id_p2: 3,
			mode: "classic",
		},
		{
			date: new Date(2023, 4, 28, 4, 30, 16, 1),
			score_p1: 4,
			score_p2: 0,
			id_p1: 8,
			id_p2: 5,
			mode: "classic",
		}
	]
	},{
		id: 9,
		avatar: "/assets/avatar3.png",
		nickname: "Diana",
		mailAddress: "",
		coalition: "Alliance",
		nbGames: 2,
		score: 28,
		rank: 10,
		isLogged:false,
		friendsList : [],
		blockList : [],
		pendingList : [],
		isActive : true,
		matchHistory: []	
	}];

	export const achievements: IAchievement[] = [
		{
			icon : "fa-solid fa-baby",
			title : "Baby steps",
			description: "Played the game for the first time",
			wasAchieved: false,
		},
		{
			icon : "fa-solid fa-jet-fighter-up",
			title : "Veteran",
			description: "Played 10 games",
			wasAchieved: false,
		},
		{
			icon : "fa-solid fa-lemon",
			title : "Easy peasy lemon squeezy",
			description: "Won 3 games in a row",
			wasAchieved: false,
		},
		{
			icon : "fa-solid fa-user-slash",
			title : "It's my lil bro playing",
			description: "Lost 3 games in a row",
			wasAchieved: false,
		},
		{
			icon : "fa-solid fa-viruses",
			title : "Social butterfly",
			description: "Added 3 friends",
			wasAchieved: false,
		},
		{
			icon : "fa-solid fa-user-astronaut",
			title : "Influencer",
			description: "Added 10 friends",
			wasAchieved: false,
		},
		{
			icon : "fa-solid fa-frog",
			title : "Cosmetic change",
			description: "Updated their profile picture once",
			wasAchieved: false,
		},
		{
			icon : "fa-solid fa-robot",
			title : "Existential crisis",
			description: "Changed their nickname",
			wasAchieved: false,
		},
		{
			icon : "fa-solid fa-shield-dog",
			title : "Safety first",
			description: "Activated the 2FA authentification",
			wasAchieved: false,
		},
		{
			icon : "fa-solid fa-hand-spock",
			title : "My safe place",
			description: "Created their first channel",
			wasAchieved: false,
		},
		{
			icon : "fa-solid fa-hand-holding-dollar",
			title : "Pay to Win",
			description: "Donated to have an in-game advantage",
			wasAchieved: false,
		},
	];

// export const achievements: IAchievement[] = [
// 	{
// 		icon : faBaby,
// 		title : "Baby steps",
// 		description: "Played the game for the first time",
// 		wasAchieved: false,
// 	},
// 	{
// 		icon : faJetFighterUp,
// 		title : "Veteran",
// 		description: "Played 10 games",
// 		wasAchieved: false,
// 	},
// 	{
// 		icon : faLemon,
// 		title : "Easy peasy lemon squeezy",
// 		description: "Won 3 games in a row",
// 		wasAchieved: false,
// 	},
// 	{
// 		icon : faUserSlash,
// 		title : "It's my lil bro playing",
// 		description: "Lost 3 games in a row",
// 		wasAchieved: false,
// 	},
// 	{
// 		icon : faViruses,
// 		title : "Social butterfly",
// 		description: "Added 3 friends",
// 		wasAchieved: false,
// 	},
// 	{
// 		icon : faUserAstronaut,
// 		title : "Influencer",
// 		description: "Added 10 friends",
// 		wasAchieved: false,
// 	},
// 	{
// 		icon : faFrog,
// 		title : "Cosmetic change",
// 		description: "Updated their profile picture once",
// 		wasAchieved: false,
// 	},
// 	{
// 		icon : faRobot,
// 		title : "Existential crisis",
// 		description: "Changed their nickname",
// 		wasAchieved: false,
// 	},
// 	{
// 		icon : faShieldDog,
// 		title : "Safety first",
// 		description: "Activated the 2FA authentification",
// 		wasAchieved: false,
// 	},
// 	{
// 		icon : faHandSpock,
// 		title : "My safe place",
// 		description: "Created their first channel",
// 		wasAchieved: false,
// 	},
// 	{
// 		icon : faHandHoldingDollar,
// 		title : "Pay to Win",
// 		description: "Donated to have an in-game advantage",
// 		wasAchieved: false,
// 	},
// ];

export const matches: IMatch[] = [
	{
		date: new Date(2023, 5, 3, 12, 30, 6, 8),
		score_p1: 1,
		score_p2: 1,
		id_p1: 8,
		id_p2: 1,
		mode: "classic",
	},
	{
		date: new Date(2023, 5, 2, 18, 30, 24, 2),
		score_p1: 2,
		score_p2: 1,
		id_p1: 8,
		id_p2: 9,
		mode: "classic",
	},
	{
		date: new Date(2023, 4, 30, 20, 30, 5, 8),
		score_p1: 0,
		score_p2: 2,
		id_p1: 8,
		id_p2: 3,
		mode: "classic",
	},
	{
		date: new Date(2023, 4, 28, 4, 30, 16, 1),
		score_p1: 4,
		score_p2: 0,
		id_p1: 8,
		id_p2: 5,
		mode: "classic",
	},
	{
		date: new Date(2023, 4, 28, 4, 30, 16, 1),
		score_p1: 4,
		score_p2: 0,
		id_p1: 7,
		id_p2: 5,
		mode: "classic",
	}
];