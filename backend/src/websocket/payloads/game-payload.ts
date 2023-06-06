import { IsString, IsNotEmpty } from "class-validator";

export default class GamePayload {

	@IsString()
	@IsNotEmpty()
	type: string;

	@IsString()
	@IsNotEmpty()
	content: string;
}