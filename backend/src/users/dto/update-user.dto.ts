import { IsBoolean, IsNumber, IsOptional, IsPositive, IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
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
	
	@IsOptional()
	@IsNumber()
	@IsPositive()
	nbGames:		number;

	@IsOptional()
	@IsNumber()
	score:			number;

	@IsOptional()
	@IsNumber()
	rank:			number;

	@IsOptional()
	@IsBoolean()
	isLogged   : boolean;

	@IsOptional()
	@IsBoolean()
	isActive   : boolean;
}
