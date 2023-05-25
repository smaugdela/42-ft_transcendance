import { Module } from "@nestjs/common"
import { SearchService } from "./search.service";
import { SearchController } from "./search.controller";
import { UsersService } from "src/users/users.service";

@Module({
	controllers: [SearchController],
	providers: [SearchService, UsersService]
})

export class SearchModule {}
