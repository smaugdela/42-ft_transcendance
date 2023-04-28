import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {

  async create(createUserDto: CreateUserDto) {

	console.log("createUserDto After:");
	console.log(createUserDto);

	return await prisma.user.create({
		data: createUserDto,
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

	console.log(`Updated user #${Id}`);
	console.log("updatedUserDto After: ", updateUserDto);

	const updated = await prisma.user.update({
		where: { id: Id },
		data: updateUserDto,
	});

	console.log("updated: ", updated);

    return updated;
  }

  async remove(Id: number) {
    return await prisma.user.delete({
		where: { id: Id }
	});
  }
}
