'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a validation score for a startup idea.
 *
 * It includes:
 * - generateValidationScore: An async function that takes a startup idea as input and returns a validation score.
 * - GenerateValidationScoreInput: The input type for the generateValidationScore function.
 * - GenerateValidationScoreOutput: The output type for the generateValidationScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateValidationScoreInputSchema = z.object({
  idea: z.string().describe('The startup idea to validate.'),
});
export type GenerateValidationScoreInput = z.infer<typeof GenerateValidationScoreInputSchema>;

const ValidationDetailsSchema = z.object({
  feasibility: z.string().describe('An analysis of the feasibility of the idea.'),
  demand: z.string().describe('An assessment of the market demand for the idea.'),
  challenges: z.string().describe('Potential challenges and risks associated with the idea.'),
});

const GenerateValidationScoreOutputSchema = z.object({
  validationScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A score between 0 and 100 indicating the potential of the idea.'),
  analysis: ValidationDetailsSchema.describe(
    'Detailed analysis of feasibility, demand, and challenges.'
  ),
});
export type GenerateValidationScoreOutput = z.infer<typeof GenerateValidationScoreOutputSchema>;

const analyzeIdeaTool = ai.defineTool({
  name: 'analyzeIdea',
  description: 'Analyzes a startup idea based on feasibility, demand, and challenges.',
  inputSchema: z.object({
    idea: z.string().describe('The startup idea to analyze.'),
  }),
  outputSchema: ValidationDetailsSchema,
},
async (input) => {
  // Placeholder implementation for idea analysis.
  // In a real application, this would involve calling external APIs,
  // analyzing market trends, competitor analysis, etc.
  return {
    feasibility: `Feasibility analysis for: ${input.idea} (Placeholder)`, // Replace with actual analysis
    demand: `Demand assessment for: ${input.idea} (Placeholder)`, // Replace with actual assessment
    challenges: `Challenges and risks for: ${input.idea} (Placeholder)`, // Replace with actual risks
  };
});

const shouldAnalyzeIdeaTool = ai.defineTool({
  name: 'shouldAnalyzeIdea',
  description: 'Decides whether to analyze certain topics or not for a given startup idea.',
  inputSchema: z.object({
    idea: z.string().describe('The startup idea to check.'),
    topic: z.string().describe('The topic to analyze.'),
  }),
  outputSchema: z.boolean().describe('Whether to analyze the specified topic or not.'),
},
async (input) => {
  // In a real application, this would involve calling external APIs,
  // analyzing market trends, competitor analysis, etc.
  // Placeholder implementation for deciding whether to analyze a topic.
  return true; // Replace with actual decision logic
});

const validationPrompt = ai.definePrompt({
  name: 'validationPrompt',
  input: {schema: GenerateValidationScoreInputSchema},
  output: {schema: GenerateValidationScoreOutputSchema},
  tools: [analyzeIdeaTool, shouldAnalyzeIdeaTool],
  prompt: `You are an AI-powered startup idea validator. Analyze the provided idea and provide a validation score between 0 and 100, along with a detailed analysis.

  Startup Idea: {{{idea}}}

  Consider the feasibility, market demand, and potential challenges. Use the 'analyzeIdea' tool to get the detailed analysis.

  Validation Score (0-100):`,
});

export async function generateValidationScore(
  input: GenerateValidationScoreInput
): Promise<GenerateValidationScoreOutput> {
  return generateValidationScoreFlow(input);
}

const generateValidationScoreFlow = ai.defineFlow(
  {
    name: 'generateValidationScoreFlow',
    inputSchema: GenerateValidationScoreInputSchema,
    outputSchema: GenerateValidationScoreOutputSchema,
  },
  async input => {
    const {output} = await validationPrompt(input);
    return output!;
  }
);
