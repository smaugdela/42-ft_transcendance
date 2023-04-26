import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    return await prisma.user.create({
		data: {
			avatar: createUserDto.avatar,
			nickname: createUserDto.nickname,
			mailAddress: createUserDto.mailAddress,
			coalition: createUserDto.coalition,
		},
	});
  }

  async findAll() {
    return await prisma.user.findMany();
  }

  async findOne(Id: number) {
    return await prisma.user.findUnique({
		where: { id: Id },
	});
  }

  async update(Id: number, updateUserDto: UpdateUserDto) {
    return await prisma.user.update({
		where: { id: Id },
		data: updateUserDto
	});
  }

  async remove(Id: number) {
    return await prisma.user.delete({
		where: { id: Id }
	});
  }
}
