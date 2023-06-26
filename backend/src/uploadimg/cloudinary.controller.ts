import { Controller, Get, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CloudinaryService } from "./cloudinary.service";
import { UsersService } from "src/users/users.service";

@ApiTags('Cloudinary') // for swagger
@Controller('cloudinary')

export class CloudinaryController {
	constructor(
		private cloudinaryService: CloudinaryService,
		private usersService: UsersService) {}
	
		@Post('/')
		public async uploadImage(@Body() file: Express.Multer.File, id:number) {
			try {
				// const user = await this.usersService.findMe(id);
				const uploadedImage =  await this.cloudinaryService.uploadImage(file);

				const avatarUrl = uploadedImage.url;
				// await this.usersService.updateMe(id, {avatar: avatarUrl});
				await this.usersService.updateMe(id, avatarUrl);
				return avatarUrl;

			} catch (error) {
				console.error(error);
				throw new Error('Cloudinary image upload error');
			}
		}
}