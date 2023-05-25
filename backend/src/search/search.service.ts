import { Injectable } from "@nestjs/common";
import MeiliSearch, { SearchParams } from "meilisearch";
import { Index } from "meilisearch";

@Injectable()
export class SearchService {
	
	private _client: MeiliSearch;
	
	constructor() {
		this._client = new MeiliSearch({
			host: 'http://localhost:7700/',
			apiKey: 'BeA0IBhWWjN1XqqEyMAxhgWIUf-3FcRtcvcvZ8_17jk'
		});

	}
	
	// Returns a newly-created index.
	// Index : aka a group of documents with associated settings
	// Documents: containers for organizing data 
	private getMovieIndex(): Index {
		return (this._client.index('movies'));
	}

	public async addDocuments(documents) {
		const index = this.getMovieIndex();
		return await index.addDocuments(documents);
	}

	public async search(text: string, searchParams?: SearchParams) {
		const index = this.getMovieIndex();
		return await index.search(text, searchParams);
	}

}