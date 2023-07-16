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
	@Length(2, 11)
	roomName: string;

	@IsOptional()
	type: ChanMode;

	@IsOptional()
	password: string;

	// @IsNotEmpty()
	owner: User;

	@IsNumber()
	@IsNotEmpty()
	ownerId: number;

	// @IsNotEmpty()
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