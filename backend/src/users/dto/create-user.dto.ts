import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class CreateUserDto {

	@IsNotEmpty()
	@IsString()
	nickname:		string;

	@IsString()
	@IsNotEmpty()
	accessToken:	string;

	@IsString()
	@IsNotEmpty()
	coalition:		string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	avatar:			string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	email:	string;

	@IsOptional()
	@IsString()
	bio:	string;

	@IsNotEmpty()
	@IsString()
	password:		string;

}
