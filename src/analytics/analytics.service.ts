import { Injectable } from "@nestjs/common";
import { GridMatch } from "src/grid/grid.service";
import { generateInsights } from "./insight-engine";

@Injectable()
export class AnalyticsService {
    buildInsights(matches: GridMatch[]) {
        return generateInsights(matches)
    }
}