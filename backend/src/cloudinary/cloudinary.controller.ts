import { Controller, Get, Post, Body, UseInterceptors, UploadedFile } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CloudinaryService } from "./cloudinary.service";
import { UsersService } from "src/users/users.service";
import { CloudinaryFileDto } from "./dto/cloudinary-file.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags('Cloudinary') // for swagger
@Controller('cloudinary')

export class CloudinaryController {
	constructor(
		private cloudinaryService: CloudinaryService,
		private usersService: UsersService) {}
	
		@Post('/')
		@UseInterceptors(FileInterceptor('file'))
		public async uploadImage(
			@UploadedFile() file: Express.Multer.File,
			// @Body() cloudinaryFileDto: CloudinaryFileDto, 
			id:number
			) {
			try {
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