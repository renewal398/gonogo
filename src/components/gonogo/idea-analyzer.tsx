'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { getIdeaAnalysis } from '@/app/actions';
import type { AnalysisResult } from '@/lib/types';
import { LoadingSkeleton } from './loading-skeleton';
import { AnalysisResultDisplay } from './analysis-result';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useToast } from '@/hooks/use-toast';
import { Lightbulb } from 'lucide-react';


const ideaFormSchema = z.object({
  idea: z.string().min(10, {
    message: "Your idea must be at least 10 characters.",
  }).max(5000, {
    message: "Your idea must not be longer than 5000 characters.",
  }),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? "Analyzing..." : "Validate Idea"}
    </Button>
  );
}

export function IdeaAnalyzer() {
  const [state, formAction] = useActionState(getIdeaAnalysis, { error: null, data: null });
  const [submittedIdea, setSubmittedIdea] = React.useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ideaFormSchema>>({
    resolver: zodResolver(ideaFormSchema),
    defaultValues: {
      idea: "",
    },
    mode: "onChange"
  });

  const handleFormAction = (formData: FormData) => {
    setSubmittedIdea(formData.get('idea') as string);
    formAction(formData);
  };
  
  const analysisResult = state.data as AnalysisResult | null;

  React.useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <Form {...form}>
            <form action={handleFormAction} className="space-y-6">
              <FormField
                control={form.control}
                name="idea"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., An AI-powered personal chef that suggests recipes based on ingredients you have at home."
                        className="min-h-[120px] text-base resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton />
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="animate-in fade-in duration-500">
        <StatusSection state={state} submittedIdea={submittedIdea} />
      </div>
    </div>
  );
}

function StatusSection({ state, submittedIdea }: { state: { error: string | null, data: any }, submittedIdea: string }) {
  const { pending } = useFormStatus();

  if (pending) {
    return <LoadingSkeleton />;
  }

  if (state.data) {
    return <AnalysisResultDisplay initialResult={state.data as AnalysisResult} idea={submittedIdea} />;
  }

  if (!state.data && !pending && !state.error) {
    return (
        <div className="text-center py-10 px-4">
            <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-muted-foreground">Your analysis will appear here</h3>
            <p className="mt-1 text-sm text-muted-foreground/80">
                Describe your business or startup idea above to get started.
            </p>
        </div>
    )
  }
  
  return null;
}
