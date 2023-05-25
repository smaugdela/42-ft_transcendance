import { Controller, Get, Post, Body } from "@nestjs/common";
import { SearchService } from "./search.service";
import { ApiTags } from "@nestjs/swagger";
import { SearchMovieDto } from "./dto/search-movie.dto";


@ApiTags('Search') // for swagger
@Controller('search')

export class SearchController {
	constructor(private searchService: SearchService) {}

	@Get('/')
	public async getSearch(): Promise<void> {
		const response = await this.searchService.addDocuments([
			{ id: 1, title: 'Carol', genres: ['Romance', 'Drama'] },
			{ id: 2, title: 'Wonder Woman', genres: ['Action', 'Adventure'] },
			{ id: 3, title: 'Life of Pi', genres: ['Adventure', 'Drama'] },
			{ id: 4, title: 'Mad Max: Fury Road', genres: ['Adventure', 'Science Fiction'] },
			{ id: 5, title: 'Moana', genres: ['Fantasy', 'Action']},
			{ id: 6, title: 'Philadelphia', genres: ['Drama'] },
		]);
		console.log(response);
	}

	@Post('/')
	public async searchMovie(@Body() search: SearchMovieDto) {
		return await this.searchService.search(search.text, {
			attributesToHighlight: ['*'],
		})
	}
}