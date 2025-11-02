'use server';

/**
 * @fileOverview Summarizes the latest market news to provide a quick understanding of market sentiment.
 *
 * - summarizeMarketNews - A function that summarizes market news.
 * - SummarizeMarketNewsInput - The input type for the summarizeMarketNews function.
 * - SummarizeMarketNewsOutput - The return type for the summarizeMarketNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMarketNewsInputSchema = z.object({
  newsArticles: z.array(
    z.object({
      title: z.string(),
      source: z.string(),
      timestamp: z.string(),
      url: z.string(),
    })
  ).describe('An array of news articles to summarize.')
});
export type SummarizeMarketNewsInput = z.infer<typeof SummarizeMarketNewsInputSchema>;

const SummarizeMarketNewsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the market news.')
});
export type SummarizeMarketNewsOutput = z.infer<typeof SummarizeMarketNewsOutputSchema>;

export async function summarizeMarketNews(input: SummarizeMarketNewsInput): Promise<SummarizeMarketNewsOutput> {
  return summarizeMarketNewsFlow(input);
}

const summarizeMarketNewsPrompt = ai.definePrompt({
  name: 'summarizeMarketNewsPrompt',
  input: {schema: SummarizeMarketNewsInputSchema},
  output: {schema: SummarizeMarketNewsOutputSchema},
  prompt: `You are an AI assistant that summarizes market news articles.

  Here are the news articles:
  {{#each newsArticles}}
  Source: {{this.source}}
  Title: {{this.title}}
  Timestamp: {{this.timestamp}}
  URL: {{this.url}}
  ---
  {{/each}}

  Please provide a concise summary of the key events and overall market sentiment reflected in these articles.`,
});

const summarizeMarketNewsFlow = ai.defineFlow(
  {
    name: 'summarizeMarketNewsFlow',
    inputSchema: SummarizeMarketNewsInputSchema,
    outputSchema: SummarizeMarketNewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeMarketNewsPrompt(input);
    return output!;
  }
);
