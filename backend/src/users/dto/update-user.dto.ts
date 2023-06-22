import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateUserDto {

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	nickname: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	password: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	coalition: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	avatar: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	mailAddress: string;

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
