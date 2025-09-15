'use server';

/**
 * @fileOverview Enhances the analysis of a startup idea by integrating live data sources.
 *
 * - enhanceAnalysisWithLiveData - A function that takes an initial analysis and integrates live data.
 * - EnhanceAnalysisWithLiveInput - The input type for the enhanceAnalysisWithLiveData function.
 * - EnhanceAnalysisWithLiveOutput - The return type for the enhanceAnalysisWithLiveData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceAnalysisWithLiveInputSchema = z.object({
  initialAnalysis: z
    .string()
    .describe('The initial AI analysis of the startup idea.'),
  ideaKeywords: z.array(z.string()).describe('Keywords related to the startup idea.'),
});
export type EnhanceAnalysisWithLiveInput = z.infer<
  typeof EnhanceAnalysisWithLiveInputSchema
>;

const EnhanceAnalysisWithLiveOutputSchema = z.object({
  enhancedAnalysis: z
    .string()
    .describe(
      'The enhanced AI analysis of the startup idea, incorporating live data.'
    ),
  liveDataSources: z
    .array(z.string())
    .describe('The live data sources used to enhance the analysis.'),
});
export type EnhanceAnalysisWithLiveOutput = z.infer<
  typeof EnhanceAnalysisWithLiveOutputSchema
>;

export async function enhanceAnalysisWithLiveData(
  input: EnhanceAnalysisWithLiveInput
): Promise<EnhanceAnalysisWithLiveOutput> {
  return enhanceAnalysisWithLiveDataFlow(input);
}

const getMarketTrends = ai.defineTool({
  name: 'getMarketTrends',
  description: 'Retrieves recent market trends based on keywords.',
  inputSchema: z.object({
    keywords: z
      .array(z.string())
      .describe('Keywords to search for market trends.'),
  }),
  outputSchema: z.array(z.string()).describe('A list of relevant market trends.'),
}, async (input) => {
    // Placeholder implementation
    return input.keywords.map(kw => `Trend related to ${kw}`);
});

const getNews = ai.defineTool({
  name: 'getNews',
  description: 'Retrieves recent news articles based on keywords.',
  inputSchema: z.object({
    keywords: z
      .array(z.string())
      .describe('Keywords to search for news articles.'),
  }),
  outputSchema: z.array(z.string()).describe('A list of relevant news articles.'),
}, async (input) => {
    // Placeholder implementation
    return input.keywords.map(kw => `News article about ${kw}`);
});

const enhanceAnalysisWithLiveDataPrompt = ai.definePrompt({
  name: 'enhanceAnalysisWithLiveDataPrompt',
  input: {schema: EnhanceAnalysisWithLiveInputSchema},
  output: {schema: EnhanceAnalysisWithLiveOutputSchema},
  tools: [
    getMarketTrends,
    getNews,
  ],
  prompt: `You are an expert business analyst. You are provided with an initial analysis of a startup idea, and your job is to enhance this analysis by incorporating live data sources such as market trends and news articles. Use the provided tools to fetch this information based on the idea keywords.

Initial Analysis: {{{initialAnalysis}}}
Idea Keywords: {{#each ideaKeywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Based on the initial analysis and any relevant live data you can find using the available tools, provide an enhanced analysis of the startup idea. Include a summary of the key findings from the live data sources and how they impact the potential of the idea. List the data sources you used.`,
});

const enhanceAnalysisWithLiveDataFlow = ai.defineFlow(
  {
    name: 'enhanceAnalysisWithLiveDataFlow',
    inputSchema: EnhanceAnalysisWithLiveInputSchema,
    outputSchema: EnhanceAnalysisWithLiveOutputSchema,
  },
  async input => {
    const {output} = await enhanceAnalysisWithLiveDataPrompt(input);
    return output!;
  }
);
