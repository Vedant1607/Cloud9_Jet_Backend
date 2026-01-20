import { Injectable } from '@nestjs/common';
import { MockGridProvider } from './providers/mock-grid.provider';

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
  constructor(private readonly mock: MockGridProvider) {}

  async getRecentMatches(params: { teamId: string; matchCount: number }) {
    return this.mock.getRecentMatches(params.teamId, params.matchCount);
  }
}
