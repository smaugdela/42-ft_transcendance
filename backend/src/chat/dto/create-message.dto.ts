import { IsNotEmpty, IsString, IsNumber, Length } from "class-validator";

export class CreateMessageDto {

	@IsNotEmpty()
	@IsNumber()
	channelId: number;

	@IsNotEmpty()
	@IsNumber()
	from: number;

	@IsNotEmpty()
	@IsString()
	to: string;

	@IsNotEmpty()
	@IsString()
	@Length(2, 1000)
	content: string;

}