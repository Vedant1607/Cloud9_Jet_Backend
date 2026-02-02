import { Module } from "@nestjs/common";
import { GridService } from "./grid.service";
import { MockGridProvider } from "./providers/mock-grid.provider";
import { GridGraphqlProvider } from "./providers/grid-graphql.provider";

@Module({
    providers: [GridService, MockGridProvider, GridGraphqlProvider],
    exports: [GridService]
})
export class GridModule {}