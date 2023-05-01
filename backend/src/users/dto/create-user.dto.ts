import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	nickname:		string;

	@IsString()
	@IsNotEmpty()
	password:		string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	avatar:			string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	mailAddress:	string;

	@IsString()
	@IsNotEmpty()
	coalition   :	string;
}
