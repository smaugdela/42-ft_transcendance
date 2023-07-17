
import { IsOptional } from "class-validator";
import { 
	ChanMode, 
	User, 
	Message 
} from '@prisma/client';

export class UpdateChannelDto {
	
	@IsOptional()
	roomName: string;

	@IsOptional()
	type: ChanMode;

	@IsOptional()
	password: string;

	@IsOptional()
	admin      : User[];

	@IsOptional()
	joinedUsers: User[];

	@IsOptional()
	bannedUsers: User[];

	@IsOptional()
	kickedUsers: User[];

	@IsOptional()
	mutedUsers : User[];
	
	@IsOptional()
	messages: Message[];
	
	@IsOptional()
	groupToInsert: string;
	
	@IsOptional()
	userId: number;

	@IsOptional()
	action: string;
}