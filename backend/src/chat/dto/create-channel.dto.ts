import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, IsOptional, IsNumber } from "class-validator";
import { 
	ChanMode, 
	User, 
	Message 
} from '@prisma/client';

export class CreateChannelDto {

	@ApiProperty({
		description: 'Name of channel or DM',
	})

	@IsString()
	@IsNotEmpty()
	@Length(2, 30)
	roomName: string;

	@IsOptional()
	type: ChanMode;

	@IsOptional()
	password: string;

	owner: User;

	@IsNumber()
	@IsNotEmpty()
	ownerId: number;

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
}