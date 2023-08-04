import { Controller, Get, Post, Body } from "@nestjs/common";
import { SearchService } from "./search.service";
import { ApiTags } from "@nestjs/swagger";
import { SearchUsersDto } from "./dto/search-users.dto";
import { UsersService } from "src/users/users.service";

@ApiTags('Search') // for swagger
@Controller('search')

export class SearchController {
	constructor(
		private searchService: SearchService,
		private usersService: UsersService) {}

	@Get('/')
	public async getSearch(): Promise<void> {
		const users = await this.usersService.findAll();
		const response = await this.searchService.addDocuments(users);
	}

	@Post('/')
	public async searchUser(@Body() search: SearchUsersDto) {
		this.getSearch();
		
		return await this.searchService.search(search.searchQuery, {
			attributesToHighlight: ['*'],
		})
	}
}