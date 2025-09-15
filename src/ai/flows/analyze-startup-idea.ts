'use server';

/**
 * @fileOverview Analyzes a startup idea, providing feedback on feasibility, demand, and challenges.
 *
 * - analyzeStartupIdea - A function that analyzes the startup idea.
 * - AnalyzeStartupIdeaInput - The input type for the analyzeStartupIdea function.
 * - AnalyzeStartupIdeaOutput - The return type for the analyzeStartupIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStartupIdeaInputSchema = z.object({
  idea: z.string().describe('The startup idea to analyze.'),
});
export type AnalyzeStartupIdeaInput = z.infer<typeof AnalyzeStartupIdeaInputSchema>;

const AnalyzeStartupIdeaOutputSchema = z.object({
  feasibility: z.string().describe('An analysis of the feasibility of the idea.'),
  demand: z.string().describe('An assessment of the potential demand for the idea.'),
  challenges: z.string().describe('Potential challenges and risks associated with the idea.'),
  suggestions: z.string().describe('Actionable suggestions for improving the idea.'),
  validationScore: z.number().describe('A score indicating the overall potential of the idea.'),
});
export type AnalyzeStartupIdeaOutput = z.infer<typeof AnalyzeStartupIdeaOutputSchema>;

export async function analyzeStartupIdea(input: AnalyzeStartupIdeaInput): Promise<AnalyzeStartupIdeaOutput> {
  return analyzeStartupIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStartupIdeaPrompt',
  input: {schema: AnalyzeStartupIdeaInputSchema},
  output: {schema: AnalyzeStartupIdeaOutputSchema},
  prompt: `You are an expert business analyst specializing in evaluating startup ideas. Analyze the following startup idea and provide feedback on its feasibility, demand, potential challenges, and suggestions for improvement. Also, provide a validation score (0-100) indicating the overall potential of the idea.

Startup Idea: {{{idea}}}`,
});

const analyzeStartupIdeaFlow = ai.defineFlow(
  {
    name: 'analyzeStartupIdeaFlow',
    inputSchema: AnalyzeStartupIdeaInputSchema,
    outputSchema: AnalyzeStartupIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
