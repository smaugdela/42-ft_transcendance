import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export default class AuthDto {

	@IsString()
	@IsNotEmpty()
	nickname:		string;

	@IsString()
	@IsNotEmpty()
	accessToken:		string;
	
	@IsOptional()
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
	mailAddress:	string;

}
