import { IsNotEmpty, IsString } from "class-validator";

export default class MessagePayload {

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	content: string;
}
