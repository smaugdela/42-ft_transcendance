import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";

export class SearchUsersDto {

	@ApiProperty({
		description: 'Search for a user to add',
		example: 'wo',
	})

	@IsNotEmpty()
	@Length(2, 255)
	searchQuery: string;
}