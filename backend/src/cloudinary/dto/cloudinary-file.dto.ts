import { ApiProperty } from "@nestjs/swagger";

export class CloudinaryFileDto {

	@ApiProperty({
		description: 'Upload your avatar! Png, jpg, jpeg, gif are allowed.',
	})

	file: Express.Multer.File;
}