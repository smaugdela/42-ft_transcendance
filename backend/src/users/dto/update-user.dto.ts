import { IsBoolean, IsNumber, IsOptional, IsPositive, IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	avatar:	string;
	
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	nickname:		string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	accessToken:	string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	coalition:		string;


	@IsOptional()
	@IsString()
	@IsNotEmpty()
	email:	string;

	@IsOptional()
	@IsString()
	bio:	string;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	password:		string;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	nbGames: number;

	@IsOptional()
	@IsNumber()
	score: number;

	@IsOptional()
	@IsNumber()
	rank: number;

	@IsOptional()
	@IsBoolean()
	isLogged: boolean;

	@IsOptional()
	@IsBoolean()
	isActive: boolean;
}
