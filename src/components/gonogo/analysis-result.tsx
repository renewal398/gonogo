'use client';

import * as React from 'react';
import type { AnalysisResult, EnhancedAnalysisResult } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, TrendingUp, ShieldAlert, Sparkles, Loader2, Lightbulb } from "lucide-react";
import { getEnhancedAnalysis } from "@/app/actions";
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { MarkdownDisplay } from './markdown-display';

interface AnalysisResultDisplayProps {
  initialResult: AnalysisResult;
  idea: string;
}

const getScoreColor = (score: number) => {
  if (score < 40) return "text-chart-1 border-chart-1/30";
  if (score < 70) return "text-chart-2 border-chart-2/30";
  return "text-chart-3 border-chart-3/30";
};

const ScoreCircle = ({ score }: { score: number }) => {
  const [displayScore, setDisplayScore] = React.useState(0);

  React.useEffect(() => {
    const animation = requestAnimationFrame(() => {
        setDisplayScore(score);
    });
    return () => cancelAnimationFrame(animation);
  }, [score]);
  
  return (
    <div
      className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-8 bg-card flex items-center justify-center transition-colors duration-500 ${getScoreColor(score)}`}
    >
      <div className="text-center">
        <span className="text-6xl sm:text-7xl font-bold transition-all duration-1000" style={{ transitionProperty: 'color' }}>
          {Math.round(displayScore)}
        </span>
        <p className="text-sm text-muted-foreground font-medium tracking-wider uppercase">
          Validation Score
        </p>
      </div>
    </div>
  );
};

export function AnalysisResultDisplay({ initialResult, idea }: AnalysisResultDisplayProps) {
  const [enhancedAnalysis, setEnhancedAnalysis] = React.useState<EnhancedAnalysisResult | null>(null);
  const [isEnhancing, setIsEnhancing] = React.useState(false);
  const { toast } = useToast();

  const handleEnhanceClick = async () => {
    setIsEnhancing(true);
    const result = await getEnhancedAnalysis({
        feasibility: initialResult.feasibility,
        demand: initialResult.demand,
        challenges: initialResult.challenges
    }, idea);

    if (result.error) {
        toast({
            variant: "destructive",
            title: "Enhancement Failed",
            description: result.error,
        });
    } else {
        setEnhancedAnalysis(result.data as EnhancedAnalysisResult);
    }
    setIsEnhancing(false);
  }

  return (
    <div className="space-y-8">
      <Card className="text-center shadow-md">
        <CardContent className="p-6 sm:p-10 flex flex-col items-center justify-center">
          <ScoreCircle score={initialResult.validationScore} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <FeedbackCard icon={<ThumbsUp />} title="Feasibility" content={initialResult.feasibility} />
        <FeedbackCard icon={<TrendingUp />} title="Demand" content={initialResult.demand} />
        <FeedbackCard icon={<ShieldAlert />} title="Challenges" content={initialResult.challenges} />
        <FeedbackCard icon={<Lightbulb />} title="Suggestions" content={initialResult.suggestions} />
      </div>

      <Card className="shadow-md">
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-accent" />
                Live Data Enhancement
              </CardTitle>
              <CardDescription>
                Incorporate real-time market trends and news for a more accurate analysis.
              </CardDescription>
          </CardHeader>
          <CardContent>
            {isEnhancing ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Fetching live data...</span>
              </div>
            ) : enhancedAnalysis ? (
                <div className="space-y-4">
                    <MarkdownDisplay content={enhancedAnalysis.enhancedAnalysis} />
                    {enhancedAnalysis.liveDataSources.length > 0 && (
                        <div>
                            <h4 className="font-semibold mt-4 mb-2">Data Sources:</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {enhancedAnalysis.liveDataSources.map((source, i) => <li key={i}>{source}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <Button onClick={handleEnhanceClick} disabled={isEnhancing} className="w-full sm:w-auto">
                    Enhance with Live Data
                </Button>
            )}
          </CardContent>
      </Card>
    </div>
  );
}

const FeedbackCard = ({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) => (
  <Card className="shadow-md h-full">
    <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
      <span className="text-primary">{React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}</span>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{content}</p>
    </CardContent>
  </Card>
);
