import { IdeaAnalyzer } from "@/components/gonogo/idea-analyzer";
import { Rocket } from "lucide-react";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col justify-center items-center text-center">
      <header className="mb-10 max-w-4xl">
        <div className="inline-flex items-center justify-center gap-4 mb-4">
          <Rocket className="w-12 h-12 text-primary" />
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            gonogo
          </h1>
        </div>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          Is your idea a Go or Nogo? Get instant validation and critical feedback before you launch.
        </p>
      </header>
      <div className="w-full max-w-4xl">
        <IdeaAnalyzer />
      </div>
      <footer className="mt-12 py-4">
        <p className="text-sm text-muted-foreground">in domino confido </p>
      </footer>
    </main>
  );
}
