import { Module } from "@nestjs/common";
import { GridService } from "./grid.service";
import { MockGridProvider } from "./providers/mock-grid.provider";

@Module({
    providers: [GridService, MockGridProvider],
    exports: [GridService]
})
export class GridModule {}