import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { GridService } from '../grid/grid.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly grid: GridService,
    private readonly analytics: AnalyticsService,
    private readonly llm: LlmService,
  ) {}

  async generate(dto: GenerateReportDto) {
    let team = await this.prisma.team.findUnique({
      where: { id: dto.teamId },
    });

    if (!team) {
      team = await this.prisma.team.create({
        data: {
          id: dto.teamId,
          name: `Team_${dto.teamId.slice(0, 6)}`,
          game: dto.game,
        },
      });
    }

    const matches = await this.grid.getRecentMatches({
      teamId: dto.teamId,
      matchCount: dto.matchCount,
    });

    const insights = this.analytics.buildInsights(matches);

    const structuredJson = {
      team: {
        id: team.id,
        name: team.name,
        game: team.game,
      },
      matches,
      insights,
      generatedAt: new Date().toISOString(),
    };

    // Real LLM report text (Ollama)
    const textReport = await this.llm.generateReportText({
      teamName: team.name,
      game: dto.game,
      matchCount: dto.matchCount,
      structuredJson,
    });

    const report = await this.prisma.report.create({
      data: {
        teamId: team.id,
        game: dto.game,
        matchCount: dto.matchCount,
        structuredJson,
        textReport,
      },
    });

    return {
      reportId: report.id,
      structured: structuredJson,
      textReport,
    };
  }
}
