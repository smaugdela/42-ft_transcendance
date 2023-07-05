import { Controller, Get, Body, Patch, Param, Delete, Req, Res, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from "@nestjs/swagger";
import { Public } from 'src/auth/guards/public.decorator';
import { Request, Response } from 'express';

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

	@Patch('me')
	updateMe(@Req() req: Request, @Body() body: UpdateUserDto) {
		try {
			this.usersService.updateMe(req.userId, body);
		} catch (error) {
			throw new HttpException('Error updating user', 400, { cause: error });
		}
	}

	@Delete('me')
	removeMe(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.usersService.removeMe(req.userId, res);
	}

	@Get(':username')
	findOne(@Param('username') username: string) {
		return this.usersService.findOne(username);
	}

	// @Patch(':username')
	// updateOne(@Param('username') username: string, @Body() body: UpdateUserDto) {
	// 	return this.usersService.updateOne(username, body);

	@Get(':id')
	findOneById(@Param('id') id: string) {
		return this.usersService.findOneById(+id);
	}
	@Patch(':id')
	update(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.usersService.updateMe(+id, body);
	}
	// @Delete(':id')
	// remove(@Param('id') id: string) {
	//   return this.usersService.removeMe(+id);
	// }
}
