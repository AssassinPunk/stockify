'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MarketBriefInputSchema = z.object({
  nifty:     z.object({ value: z.number(), change: z.number(), percentChange: z.number() }),
  sensex:    z.object({ value: z.number(), change: z.number(), percentChange: z.number() }),
  bankNifty: z.object({ value: z.number(), change: z.number(), percentChange: z.number() }),
  vix:      z.number(),
  vixZone:  z.enum(['Low', 'Moderate', 'High', 'Extreme']),
  topGainers:   z.array(z.object({ name: z.string(), percentChange: z.number() })),
  topLosers:    z.array(z.object({ name: z.string(), percentChange: z.number() })),
  topSectors:   z.array(z.object({ name: z.string(), change: z.number() })),
  newsHeadlines: z.array(z.string()),
  date: z.string(),
});
export type MarketBriefInput = z.infer<typeof MarketBriefInputSchema>;

const MarketBriefOutputSchema = z.object({
  headline:  z.string().describe('A single punchy headline (max 12 words) capturing the market mood.'),
  summary:   z.string().describe('3–4 sentence plain-English summary of today\'s market conditions and key themes.'),
  outlook:   z.string().describe('1–2 sentence forward-looking statement for the near term.'),
  sentiment: z.enum(['Bullish', 'Neutral', 'Bearish', 'Volatile']).describe('Overall market sentiment.'),
  keyRisks:  z.array(z.string()).describe('Exactly 3 key risks to watch, each one sentence.'),
});
export type MarketBriefOutput = z.infer<typeof MarketBriefOutputSchema>;

export async function generateMarketBrief(input: MarketBriefInput): Promise<MarketBriefOutput> {
  return marketBriefFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketBriefPrompt',
  input:  { schema: MarketBriefInputSchema },
  output: { schema: MarketBriefOutputSchema },
  prompt: `You are a senior Indian stock market analyst writing a concise daily brief for retail investors.

Date: {{date}}

Market Snapshot:
- NIFTY 50:    {{nifty.value}} ({{nifty.percentChange}}%)
- SENSEX:      {{sensex.value}} ({{sensex.percentChange}}%)
- BANK NIFTY:  {{bankNifty.value}} ({{bankNifty.percentChange}}%)
- India VIX:   {{vix}} ({{vixZone}} zone)

Top Gainers: {{#each topGainers}}{{this.name}} (+{{this.percentChange}}%) {{/each}}
Top Losers:  {{#each topLosers}}{{this.name}} ({{this.percentChange}}%) {{/each}}

Sector Performance: {{#each topSectors}}{{this.name}} ({{this.change}}%) {{/each}}

Recent Headlines:
{{#each newsHeadlines}}- {{this}}
{{/each}}

Write a daily market brief with:
1. A punchy headline capturing the key market theme (max 12 words)
2. A 3–4 sentence summary explaining what is driving the market in plain English
3. A 1–2 sentence near-term outlook
4. An overall sentiment label (Bullish/Neutral/Bearish/Volatile)
5. Exactly 3 key risks to monitor, each as one concise sentence

Be factual, concise, and avoid giving financial advice. Target audience: retail investors new to markets.`,
});

const marketBriefFlow = ai.defineFlow(
  {
    name: 'marketBriefFlow',
    inputSchema: MarketBriefInputSchema,
    outputSchema: MarketBriefOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
