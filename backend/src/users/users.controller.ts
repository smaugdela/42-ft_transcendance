import { Controller, Get, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from "@nestjs/swagger";
import { Public } from 'src/auth/guards/public.decorator';
import { Request } from 'express';

@ApiTags('Users') // for swagger
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Public()
	@Get('check')
	checkIfLoggedIn(@Req() req: Request) {
		return this.usersService.checkIfLoggedIn(req.userId);
	}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get('me')
	findMe(@Req() req: Request) {
		return this.usersService.findMe(req.userId);
	}

	@Patch('/me')
	updateMe(@Req() req: Request, @Body() body: UpdateUserDto) {
		return this.usersService.updateMe(req.userId, body);
	}

	@Delete('/me')
	removeMe(@Req() req: Request) {
		return this.usersService.removeMe(req.userId);
	}

	@Get(':username')
	findOne(@Param('username') username: string) {
		return this.usersService.findOne(username);
	}

	@Patch(':username')
	updateOne(@Param('username') username: string, @Body() body: UpdateUserDto) {
		return this.usersService.updateOne(username, body);
	}
}
