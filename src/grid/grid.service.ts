import { Injectable } from '@nestjs/common';
import { MockGridProvider } from './providers/mock-grid.provider';
import { GridGraphqlProvider } from './providers/grid-graphql.provider';

export type GridMatch = {
  id: string;
  teamId: string;
  opponentName: string;
  result: 'WIN' | 'LOSS';
  scoreFor: number;
  scoreAgainst: number;
  map?: string;
  playedAt: string;
};

@Injectable()
export class GridService {
  constructor(
    private readonly mock: MockGridProvider,
    private readonly gridGraphql: GridGraphqlProvider,
  ) {}

  async getRecentMatches(params: { teamId: string; matchCount: number }) {
    try {
      return this.gridGraphql.getRecentMatches(
        params.teamId,
        params.matchCount,
      );
    } catch (e) {
      return this.mock.getRecentMatches(params.teamId, params.matchCount);
    }
  }
}
