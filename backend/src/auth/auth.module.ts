import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
	imports: [JwtModule.register({
		global: true,
		secret: jwtConstants.secret,
		signOptions: { expiresIn: '60' }, // In seconds by default
	})],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
