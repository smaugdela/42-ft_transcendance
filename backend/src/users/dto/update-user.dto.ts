import { PartialType } from '@nestjs/mapped-types';
import CreateUserDto from './create-user.dto';
import { IsBoolean, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
