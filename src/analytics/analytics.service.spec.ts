import { AnalyticsService } from './analytics.service';
import { GridMatch } from 'src/grid/grid.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    service = new AnalyticsService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should build insights correctly for winning streak', () => {
    const matches: GridMatch[] = [
      {
        id: '1',
        teamId: 'team1',
        opponentName: 'opp1',
        result: 'WIN',
        scoreFor: 13,
        scoreAgainst: 10,
        map: 'Ascent',
        playedAt: new Date().toISOString(),
      },
      {
        id: '2',
        teamId: 'team1',
        opponentName: 'opp2',
        result: 'WIN',
        scoreFor: 13,
        scoreAgainst: 5,
        map: 'Bind',
        playedAt: new Date().toISOString(),
      },
      {
        id: '3',
        teamId: 'team1',
        opponentName: 'opp3',
        result: 'WIN',
        scoreFor: 13,
        scoreAgainst: 11,
        map: 'Haven',
        playedAt: new Date().toISOString(),
      },
    ];

    const insights = service.buildInsights(matches);

    expect(insights.winRate).toBe(1);
    expect(insights.wins).toBe(3);
    expect(insights.streak.type).toBe('WIN');
    expect(insights.streak.count).toBe(3);
    expect(insights.keyInsights).toContain(
      'High recent win rate - strong current form.',
    );
    expect(insights.keyInsights).toContain(
      'Winning streak (3) — momentum advantage.',
    );
  });

  it('should build insights correctly for losing streak', () => {
    const matches: GridMatch[] = [
      {
        id: '1',
        teamId: 'team1',
        opponentName: 'opp1',
        result: 'LOSS',
        scoreFor: 5,
        scoreAgainst: 13,
        map: 'Ascent',
        playedAt: new Date().toISOString(),
      },
      {
        id: '2',
        teamId: 'team1',
        opponentName: 'opp2',
        result: 'LOSS',
        scoreFor: 8,
        scoreAgainst: 13,
        map: 'Bind',
        playedAt: new Date().toISOString(),
      },
    ];

    const insights = service.buildInsights(matches);

    expect(insights.winRate).toBe(0);
    expect(insights.losses).toBe(2);
    expect(insights.streak.type).toBe('LOSS');
    expect(insights.streak.count).toBe(2);
    expect(insights.risks).toContain(
      'Low recent win rate — inconsistent or struggling form.',
    );
    expect(insights.risks).toContain(
      'Losing streak (2) — confidence/strategy issues likely.',
    );
  });
});
