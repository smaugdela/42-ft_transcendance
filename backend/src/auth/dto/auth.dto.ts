import { IsNotEmpty, IsString } from "class-validator";

export default class AuthDto {

	@IsString()
	@IsNotEmpty()
	nickname: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
