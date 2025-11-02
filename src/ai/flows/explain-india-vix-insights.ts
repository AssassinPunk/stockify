// 'use server';

/**
 * @fileOverview Explains India VIX insights to new investors.
 *
 * - explainIndiaVIX - A function that explains the India VIX data.
 * - ExplainIndiaVIXInput - The input type for the explainIndiaVIX function.
 * - ExplainIndiaVIXOutput - The return type for the explainIndiaVIX function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainIndiaVIXInputSchema = z.object({
  vixValue: z.number().describe('The current value of the India VIX.'),
  dailyMove: z.number().describe('The daily implied move derived from the VIX.'),
  weeklyMove: z.number().describe('The weekly implied move derived from the VIX.'),
  monthlyMove: z.number().describe('The monthly implied move derived from the VIX.'),
  yearlyMove: z.number().describe('The yearly implied move derived from the VIX.'),
});
export type ExplainIndiaVIXInput = z.infer<typeof ExplainIndiaVIXInputSchema>;

const ExplainIndiaVIXOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the India VIX data and its implications for new investors.'),
});
export type ExplainIndiaVIXOutput = z.infer<typeof ExplainIndiaVIXOutputSchema>;

export async function explainIndiaVIX(input: ExplainIndiaVIXInput): Promise<ExplainIndiaVIXOutput> {
  return explainIndiaVIXFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainIndiaVIXPrompt',
  input: {schema: ExplainIndiaVIXInputSchema},
  output: {schema: ExplainIndiaVIXOutputSchema},
  prompt: `You are an expert financial analyst explaining the India VIX to a new investor.

  The current India VIX value is {{vixValue}}.
  The daily implied move is {{dailyMove}}.
  The weekly implied move is {{weeklyMove}}.
  The monthly implied move is {{monthlyMove}}.
  The yearly implied move is {{yearlyMove}}.

  Explain what this data means in simple terms, focusing on how it reflects market volatility and how it can be used to make informed investment decisions. Keep the explanation concise and easy to understand for someone new to investing.`,
});

const explainIndiaVIXFlow = ai.defineFlow(
  {
    name: 'explainIndiaVIXFlow',
    inputSchema: ExplainIndiaVIXInputSchema,
    outputSchema: ExplainIndiaVIXOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
