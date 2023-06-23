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
    
        // // retrieve url of image from cloudinary
        // @Get('/')
        // public async getImage(id: number): Promise<void> {
        //     const user = await this.usersService.findMe(id);
        //     return await this.cloudinaryService.getImage(user.avatar);
        // }


        @Post('/')
        public async uploadImage(@Body() file: Express.Multer.File) {
            return await this.cloudinaryService.uploadImage(file);
        }
}