import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Module({
	controllers: [AuthController],
	providers: [AuthService, Reflector],
	imports: [JwtModule.register({})],
})
export class AuthModule { }
