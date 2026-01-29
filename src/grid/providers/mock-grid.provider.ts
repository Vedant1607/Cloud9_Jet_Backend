import { Injectable } from '@nestjs/common';
import { GridMatch } from '../grid.service';

@Injectable()
export class MockGridProvider {
  getRecentMatches(teamId: string, matchCount: number): Promise<GridMatch[]> {
    const now = Date.now();

    const matches: GridMatch[] = Array.from({ length: matchCount }).map(
      (_, i) => {
        const win = i % 3 !== 0;
        return {
          id: `mock_match_${i + 1}`,
          teamId,
          opponentName: `Opponent_${i + 1}`,
          result: win ? 'WIN' : 'LOSS',
          scoreFor: win ? 13 : 9,
          scoreAgainst: win ? 9 : 13,
          map: ['Ascent', 'Bind', 'Haven'][i % 3],
          playedAt: new Date(now - i * 86400000).toISOString(),
        };
      },
    );

    return Promise.resolve(matches);
  }
}
