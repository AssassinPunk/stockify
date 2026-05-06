'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IntlBriefInputSchema = z.object({
  sp500:   z.object({ value: z.number(), change: z.number(), percentChange: z.number() }),
  nasdaq:  z.object({ value: z.number(), change: z.number(), percentChange: z.number() }),
  ftse100: z.object({ value: z.number(), change: z.number(), percentChange: z.number() }),
  topGainers:    z.array(z.object({ name: z.string(), percentChange: z.number() })),
  topLosers:     z.array(z.object({ name: z.string(), percentChange: z.number() })),
  topSectors:    z.array(z.object({ name: z.string(), change: z.number() })),
  newsHeadlines: z.array(z.string()),
  date: z.string(),
});
export type IntlBriefInput  = z.infer<typeof IntlBriefInputSchema>;

const IntlBriefOutputSchema = z.object({
  headline:  z.string().describe('A single punchy headline (max 12 words) capturing the global market mood.'),
  summary:   z.string().describe('3–4 sentence plain-English summary of today\'s global market conditions and key themes.'),
  outlook:   z.string().describe('1–2 sentence forward-looking statement for the near term.'),
  sentiment: z.enum(['Bullish', 'Neutral', 'Bearish', 'Volatile']).describe('Overall market sentiment.'),
  keyRisks:  z.array(z.string()).describe('Exactly 3 key risks to watch, each one sentence.'),
});
export type IntlBriefOutput = z.infer<typeof IntlBriefOutputSchema>;

export async function generateInternationalBrief(input: IntlBriefInput): Promise<IntlBriefOutput> {
  return intlBriefFlow(input);
}

const prompt = ai.definePrompt({
  name:   'intlBriefPrompt',
  input:  { schema: IntlBriefInputSchema },
  output: { schema: IntlBriefOutputSchema },
  prompt: `You are a senior global markets analyst writing a concise daily brief for retail investors.

Date: {{date}}

Market Snapshot:
- S&P 500:   {{sp500.value}} ({{sp500.percentChange}}%)
- NASDAQ:    {{nasdaq.value}} ({{nasdaq.percentChange}}%)
- FTSE 100:  {{ftse100.value}} ({{ftse100.percentChange}}%)

Top Gainers: {{#each topGainers}}{{this.name}} (+{{this.percentChange}}%) {{/each}}
Top Losers:  {{#each topLosers}}{{this.name}} ({{this.percentChange}}%) {{/each}}

S&P 500 Sector Performance: {{#each topSectors}}{{this.name}} ({{this.change}}%) {{/each}}

Recent Headlines:
{{#each newsHeadlines}}- {{this}}
{{/each}}

Write a daily global market brief with:
1. A punchy headline capturing the key market theme (max 12 words)
2. A 3–4 sentence summary explaining what is driving global markets in plain English
3. A 1–2 sentence near-term outlook
4. An overall sentiment label (Bullish/Neutral/Bearish/Volatile)
5. Exactly 3 key risks to monitor, each as one concise sentence

Be factual, concise, and avoid giving financial advice. Target audience: retail investors interested in global markets.`,
});

const intlBriefFlow = ai.defineFlow(
  {
    name:         'intlBriefFlow',
    inputSchema:  IntlBriefInputSchema,
    outputSchema: IntlBriefOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
