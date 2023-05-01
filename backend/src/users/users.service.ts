import { Injectable } from '@nestjs/common';
// import CreateUserDto from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {

//   async create(body: CreateUserDto) {
//     return await prisma.user.create({
// 		data: body,
// 	});
//   }

  async findAll() {
    return await prisma.user.findMany();
  }

  async findOne(id: number) {
    return await prisma.user.findUnique({
		where: {id}
	});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await prisma.user.update({
		where: {id},
		data: updateUserDto,
	});
  }

  async remove(id: number) {
    return await prisma.user.delete({
		where: {id}
	});
  }
}
