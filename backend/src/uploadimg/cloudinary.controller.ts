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
    
        @Get('/')
        public async getImage(): Promise<void> {
            // const users = await this.usersService.findAll();
        }


        @Post('/')
        public async uploadImage(@Body() file: Express.Multer.File) {
            return await this.cloudinaryService.uploadImage(file);
        }
}