import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@codequest/ui/card";
import { getProblems } from "../app/db/problem";
import { PrimaryButton } from "./LinkButton";
import { CheckCircledIcon, LightningBoltIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Badge } from "./Badge";
import { Suspense } from "react";
import { SkeletonCard } from "./SkeletonCard";

// Define a type for your problem object for better code quality
type Problem = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  solved: number;
  tags: string[]; // Added tags for better description
};


export async function Problems() {
  // Use Suspense fallback for skeletons
  return (
    <Suspense
      fallback={
        <section className="bg-gray-50 dark:bg-gray-900/50 py-16 md:py-24 min-h-screen">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                  Popular Problems
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Challenge yourself with our curated collection of problems. Filter by
                difficulty and climb the leaderboard.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </section>
      }
    >
      <ProblemsContent />
    </Suspense>
  );
}

async function ProblemsContent() {
  const problemsRaw = await getProblems();
  // Ensure every problem has a tags property (default to empty array if missing)
  const problems: Problem[] = problemsRaw.map((p: any) => ({
    ...p,
    tags: Array.isArray(p.tags) ? p.tags : [],
    solved: typeof p.solved === 'number' ? p.solved : 0,
  }));

  return (
    <section className="relative py-16 md:py-24 min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-full h-full bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-80 blur-2xl" />
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-300 dark:to-purple-400 animate-fade-in">
            Popular Problems
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto animate-fade-in">
            Challenge yourself with our curated collection of problems. Filter by difficulty, tags, and climb the leaderboard.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {problems.map((problem: Problem) => (
            <ProblemCard problem={problem} key={problem.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ problem }: { problem: Problem }) {
  // Logic to determine badge color based on difficulty
  const difficultyVariant = {
    Easy: "green",
    Medium: "yellow",
    Hard: "red",
  }[problem.difficulty] as "green" | "yellow" | "red" | "default";

  return (
    <Card className="flex flex-col h-full rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl bg-white/80 dark:bg-gray-900/90 backdrop-blur-md animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate pr-2">
            {problem.title}
          </CardTitle>
          <Badge variant={difficultyVariant} className="px-3 py-1 text-xs font-bold animate-fade-in">
            {problem.difficulty}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {problem.tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="px-2 py-0.5 text-xs animate-fade-in">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <CheckCircledIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
            <span className="font-medium">{problem.solved.toLocaleString()} Solves</span>
          </div>
          <div className="flex items-center gap-2">
            <LightningBoltIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-300" />
            <span className="font-medium">55% Acceptance</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {problem.id ? (
          <PrimaryButton href={`/problem/${problem.id}`} className="w-full py-2 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:from-blue-600 hover:to-purple-700 transition-all duration-200 animate-fade-in dark:from-blue-400 dark:to-purple-500">
            Solve Problem
          </PrimaryButton>
        ) : (
          <button className="w-full inline-flex items-center justify-center rounded-xl bg-gray-300 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300 cursor-not-allowed" disabled>
            Invalid Problem
          </button>
        )}
      </CardFooter>
    </Card>
  );
}

