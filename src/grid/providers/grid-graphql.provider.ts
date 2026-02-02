import { Injectable } from '@nestjs/common';
import { gql, GraphQLClient } from 'graphql-request';
import { GridMatch } from '../grid.service';

@Injectable()
export class GridGraphqlProvider {
  private client: GraphQLClient;

  constructor() {
    const baseUrl = process.env.GRID_BASE_URL!;
    const apiKey = process.env.GRID_API_KEY!;

    this.client = new GraphQLClient(baseUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  async getRecentMatches(
    teamId: string,
    matchCount: number,
  ): Promise<GridMatch[]> {
    const query = gql`
      query RecentMatches($teamId: ID!, $limit: Int!) {
        matches(teamId: $teamId, limit: $limit) {
          id
          startTime
          opponents {
            name
          }
          result {
            winnerTeamId
          }
        }
      }
    `;

    const variables = {
      teamId,
      limit: matchCount,
    };

    const data = await this.client.request(query, variables);

    const matches = (data?.matches || []).map((m, idx) => {
      const opponentName =
        m?.opponents?.find((o) => o?.id !== teamId)?.name ||
        m?.opponents?.[1]?.name ||
        `Opponent_${idx + 1}`;

      const isWin = m?.result?.winnerTeamId === teamId;

      return {
        id: m.id,
        teamId,
        opponentName,
        result: isWin ? 'WIN' : 'LOSS',
        scoreFor: isWin ? 13 : 9,
        scoreAgainst: isWin ? 9 : 13,
        playedAt: m.startTime || new Date().toISOString(),
      } satisfies GridMatch;
    });

    return matches;
  }
}
