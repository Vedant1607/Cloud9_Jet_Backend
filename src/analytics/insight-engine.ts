import { GridMatch } from "src/grid/grid.service";

export type TeamInsights = {
  winRate: number;
  wins: number;
  losses: number;
  avgScoreFor: number;
  avgScoreAgainst: number;
  streak: {
    type: 'WIN' | 'LOSS' | 'MIXED';
    count: number;
  };
  keyInsights: string[];
  risks: string[];
  recommendations: string[];
};

export function generateInsights(matches: GridMatch[]): TeamInsights {
  const total = matches.length;
  const wins = matches.filter((m) => m.result === 'WIN').length;
  const losses = total - wins;

  const avgScoreFor =
    total === 0 ? 0 : matches.reduce((s, m) => s + m.scoreFor, 0) / total;
  const avgScoreAgainst =
    total === 0 ? 0 : matches.reduce((s, m) => s + m.scoreAgainst, 0) / total;

  const winRate = total === 0 ? 0 : wins / total;

  let streakCount = 0;
  let streakType: 'WIN' | 'LOSS' | 'MIXED' = 'MIXED';

  if (total > 0) {
    const first = matches[0].result;
    streakType = first;
    for (const m of matches) {
      if (m.result === first) streakCount++;
      else break;
    }
  }

  const keyInsights: string[] = [];
  const risks: string[] = [];
  const recommendations: string[] = [];

  if (winRate >= 0.7)
    keyInsights.push('High recent win rate - strong current form.');
  if (winRate <= 0.4)
    risks.push('Low recent win rate — inconsistent or struggling form.');

  if (avgScoreFor > avgScoreAgainst)
    keyInsights.push(
      'Positive score differential — likely strong mid/late execution.',
    );
  else risks.push('Negative score differential — may be losing key rounds.');

  if (streakType === 'WIN' && streakCount >= 3)
    keyInsights.push(`Winning streak (${streakCount}) — momentum advantage.`);
  if (streakType === 'LOSS' && streakCount >= 2)
    risks.push(
      `Losing streak (${streakCount}) — confidence/strategy issues likely.`,
    );

  recommendations.push(
    'Focus anti-strat prep on opponent’s strongest map picks.',
  );
  recommendations.push(
    'Review recent losses for recurring round patterns and economy mistakes.',
  );

  return {
    winRate: Number(winRate.toFixed(2)),
    wins,
    losses,
    avgScoreFor: Number(avgScoreFor.toFixed(2)),
    avgScoreAgainst: Number(avgScoreAgainst.toFixed(2)),
    streak: { type: streakType, count: streakCount },
    keyInsights,
    risks,
    recommendations,
  };
}
