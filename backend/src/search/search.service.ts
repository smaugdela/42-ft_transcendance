import { Injectable } from "@nestjs/common";
import MeiliSearch, { SearchParams } from "meilisearch";
import { Index } from "meilisearch";

@Injectable()
export class SearchService {

	private _client: MeiliSearch;

	constructor() {
		this._client = new MeiliSearch({
			host: process.env.MEILISEARCH_HOST,
			apiKey: process.env.MEILISEARCH_APIKEY,
		});
	}

	// Returns a newly-created index.
	// Index : aka a group of documents with associated settings
	// Documents: containers for organizing data 
	private getUserIndex(): Index {
		return (this._client.index('users'));
	}
	
	public async addDocuments(documents) {
		const index = this.getUserIndex();
		console.log('An index was created');
		return await index.addDocuments(documents);
	}

	public async search(text: string, searchParams?: SearchParams) {
		const index = this.getUserIndex();
		
		index.updateSearchableAttributes([
			'nickname'
		]);
		index.updateTypoTolerance({
			'minWordSizeForTypos': {
				'oneTypo': 2,
				'twoTypos': 4
			}
		});
		return await index.search(text, searchParams);
	}
}