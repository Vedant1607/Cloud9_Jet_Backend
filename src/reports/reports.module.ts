import { Module } from "@nestjs/common";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { GridModule } from "src/grid/grid.module";
import { AnalyticsModule } from "src/analytics/analytics.module";
import { LlmModule } from "src/llm/llm.module";

@Module({
    imports: [GridModule, AnalyticsModule, LlmModule],
    controllers: [ReportsController],
    providers: [ReportsService],
})
export class ReportsModule {}