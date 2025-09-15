'use server';

import { z } from 'zod';
import { analyzeStartupIdea } from '@/ai/flows/analyze-startup-idea';
import { enhanceAnalysisWithLiveData } from '@/ai/flows/enhance-analysis-with-live-data';

const ideaSchema = z.string().min(10, "Please describe your idea in at least 10 characters.").max(5000);

function getKeywordsFromIdea(idea: string): string[] {
  const stopWords = new Set(['a', 'an', 'the', 'is', 'are', 'in', 'on', 'for', 'of', 'with', 'to', 'it', 'i', 'you', 'he', 'she', 'they', 'we', 'my', 'and', 'but', 'or', 'so', 'that', 'about', 'what', 'who', 'when', 'where', 'why', 'how', 'an', 'app', 'that']);
  return idea
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 10);
}

export async function getIdeaAnalysis(prevState: any, formData: FormData) {
  const idea = formData.get('idea') as string;
  
  const validatedIdea = ideaSchema.safeParse(idea);

  if (!validatedIdea.success) {
    return { error: validatedIdea.error.errors[0].message };
  }

  try {
    const result = await analyzeStartupIdea({ idea: validatedIdea.data });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: "Failed to analyze the idea. Please try again." };
  }
}

export async function getEnhancedAnalysis(initialAnalysis: {feasibility: string, demand: string, challenges: string}, idea: string) {
    if (!initialAnalysis || !idea) {
        return { error: "Missing initial analysis or idea for enhancement." };
    }
    
    try {
        const fullAnalysisText = `Feasibility: ${initialAnalysis.feasibility}\nDemand: ${initialAnalysis.demand}\nChallenges: ${initialAnalysis.challenges}`;
        const keywords = getKeywordsFromIdea(idea);

        const result = await enhanceAnalysisWithLiveData({
            initialAnalysis: fullAnalysisText,
            ideaKeywords: keywords,
        });
        return { data: result };
    } catch (e) {
        console.error(e);
        return { error: "Failed to enhance the analysis with live data. Please try again." };
    }
}
