import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmService {
  async generateReportText(params: {
    teamName: string;
    game: string;
    matchCount: number;
    structuredJson: any;
  }): Promise<string> {
    const baseUrl = process.env.OLLAMA_BASE_URL!;
    const model = process.env.OLLAMA_MODEL || 'llama3.1:latest';

    const insights = params.structuredJson?.insights;

    const prompt = `
You are an esports analyst.
Write a concise scouting report.

Team: ${params.teamName}
Game: ${params.game}
Matches analyzed: ${params.matchCount}

Insights JSON:
${JSON.stringify(insights, null, 2)}

Return sections:
1) Summary
2) Strengths
3) Weaknesses
4) Preparation Recommendations
`.trim();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          options: {
            temperature: 0.4,
            num_predict: 120,
            num_ctx: 2048,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Ollama error: ${res.status} ${errText}`);
      }

      const data = (await res.json()) as { response?: string };
      return data.response?.trim() || 'No response generated.';
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return `Scouting Report (Fallback)

        Summary:
        LLM timed out. Returning quick rule-based report.

        Strengths:
        - ${insights?.keyInsights?.join('\n- ') || 'N/A'}

        Weaknesses / Risks:
        - ${insights?.risks?.join('\n- ') || 'N/A'}

        Recommendations:
        - ${insights?.recommendations?.join('\n- ') || 'N/A'}
        `;
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
}
