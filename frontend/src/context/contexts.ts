
import React, { createContext} from 'react';
import { Socket } from 'socket.io-client';
import { IChannel } from '../api/types';

export const IsLoggedInContext = React.createContext<boolean>(false);

export const SocketContext = React.createContext<Socket | null>(null);

export interface ChatStatusType {
	activeTab: number;
	setActiveTab: React.Dispatch<React.SetStateAction<number>>;
	activeConv: IChannel | null;
	setActiveConv: React.Dispatch<React.SetStateAction<IChannel | null>>;
	isExpanded: boolean;
	setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChatStatusContext: React.Context<ChatStatusType> = createContext<ChatStatusType>({
	activeTab: 0,
	setActiveTab: () => {},
	activeConv: null,
	setActiveConv: () => {},
	isExpanded: true,
	setIsExpanded: () => {}
});

// export interface MuteType {
// 	isMuted: boolean;
// 	setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
// 	muteExpiration: number | null;
// 	setMuteExpiration: React.Dispatch<React.SetStateAction<number | null>>,
// }
// export const MuteContext : React.Context<MuteType>= createContext<MuteType>({
// 	isMuted: false,
// 	setIsMuted: () => {},
// 	muteExpiration: null,
// 	setMuteExpiration: () => {},
// })
