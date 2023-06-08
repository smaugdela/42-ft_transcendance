import { IsAlphanumeric, IsNotEmpty, IsString } from "class-validator";

export default class AuthDto {

	@IsString()
	@IsNotEmpty()
	@IsAlphanumeric()
	nickname: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
