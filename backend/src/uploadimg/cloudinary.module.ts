import { Module } from "@nestjs/common";
import { CloudinaryProvider } from "./cloudinary.provider";
import { CloudinaryService } from "./cloudinary.service";
import { UsersService } from "src/users/users.service";
import { CloudinaryController } from "./cloudinary.controller";

@Module({
    controllers: [CloudinaryController],
    providers: [CloudinaryProvider, CloudinaryService, UsersService],
    exports: [CloudinaryProvider, CloudinaryService],
})

export class CloudinaryModule {}