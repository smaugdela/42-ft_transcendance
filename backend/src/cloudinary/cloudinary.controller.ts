import { Controller, Post, UseInterceptors, UploadedFile, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CloudinaryService } from "./cloudinary.service";
import { UsersService } from "src/users/users.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { v2 as cloudinary } from 'cloudinary';

@ApiTags('Cloudinary')
@Controller('cloudinary')

export class CloudinaryController {
	constructor(
		private cloudinaryService: CloudinaryService,
		private usersService: UsersService) {}
	
		@Post('/')
		@UseInterceptors(FileInterceptor('file'))
		public async uploadImage(
			@UploadedFile() file: Express.Multer.File,
			@Query('id') id: number
			) {
			try {
				const uploadedImage =  await this.cloudinaryService.uploadImage(file);
				
				const secureUrl = cloudinary.url(uploadedImage.public_id, { secure: true });
				await this.usersService.updateAvatar(+id, secureUrl);
				return secureUrl;

			} catch (error) {
				throw new Error('Cloudinary image upload error');
			}
		}
}