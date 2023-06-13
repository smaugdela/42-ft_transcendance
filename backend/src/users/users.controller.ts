import { Controller, Get, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from "@nestjs/swagger";
import { Public } from 'src/auth/guards/public.decorator';

@ApiTags('Users') // for swagger
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Public()
	@Get('check')
	checkIfLoggedIn(@Request() req) {
		console.log("req.user", req.user);
		console.log("req['user']", req['user']);
		return this.usersService.checkIfLoggedIn(req['user']);
	}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get('me')
	findMe(@Request() req) {
		return this.usersService.findMe(+req.user.id);
	}

	@Patch('/me')
	updateMe(@Request() req, @Body() body: UpdateUserDto) {
		return this.usersService.updateMe(+req.user.id, body);
	}

	@Delete('/me')
	removeMe(@Request() req) {
		return this.usersService.removeMe(+req.user.id);
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
