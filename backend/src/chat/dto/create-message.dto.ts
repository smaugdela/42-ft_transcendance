import { IsNotEmpty, IsString, IsNumber, Length, IsOptional } from "class-validator";
import { User } from "@prisma/client";

export class CreateMessageDto {

	@IsNotEmpty()
	@IsNumber()
	channelId: number;

	@IsOptional()
	from: User;

	@IsNotEmpty()
	@IsNumber()
	fromId: number;

	@IsNotEmpty()
	@IsString()
	to: string;

	@IsNotEmpty()
	@IsString()
	@Length(2, 1000)
	content: string;

}