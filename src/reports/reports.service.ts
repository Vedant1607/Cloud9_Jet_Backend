import { Injectable } from '@nestjs/common';
import { AnalyticsService } from 'src/analytics/analytics.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { GridService } from 'src/grid/grid.service';
import { GenerateReportDto } from './dto/generate-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly grid: GridService,
    private readonly analytics: AnalyticsService,
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
        id: team?.id,
        name: team?.name,
        game: team?.game,
      },
      matches,
      insights,
      generatedAt: new Date().toISOString(),
    };

    // Placeholder text report for Step 3 (LLM in Step 4)
    const textReport = `
      Scouting Report: ${team?.name} (${dto.game}Matches analyzed: ${dto.matchCount}
      
      Win Rate: ${insights.winRate}
      Key Insights:
      - ${insights.keyInsights.join('\n- ')}
      
      Risks:
      - ${insights.risks.join('\n- ')}
      
      Recommendations:
      - ${insights.recommendations.join('\n- ')}
    `.trim();

    const report = await this.prisma.report.create({
      data: {
        teamId: team?.id,
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
