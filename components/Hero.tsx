import Link from "next/link";
import { ArrowRightIcon, CodeIcon } from "@radix-ui/react-icons";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 md:py-32 min-h-[70vh] flex items-center overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text content and CTAs */}
          <div className="flex flex-col justify-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 drop-shadow-lg">
              Welcome to{" "}
              <span className="inline-block animate-pulse">CodeQuest</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-xl">
              <span className="font-semibold text-purple-600 dark:text-purple-300">
                The ultimate arena for competitive programming.
              </span>{" "}
              Sharpen your skills, solve intricate problems, and rise to the top
              of the leaderboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                href="/contests"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:from-blue-400 dark:to-purple-400 dark:hover:from-blue-500 dark:hover:to-purple-500"
                prefetch={false}
              >
                <ArrowRightIcon className="h-6 w-6" />
                View Contests
              </Link>
              <Link
                href="/problems"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-purple-400 bg-white px-7 py-3 text-lg font-semibold text-purple-700 shadow-lg transition-transform hover:scale-105 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-900 dark:text-purple-200 dark:border-purple-500 dark:hover:bg-gray-800"
                prefetch={false}
              >
                <CodeIcon className="h-6 w-6" />
                Practice Problems
              </Link>
            </div>
          </div>
          {/* Right Column: Image with animation */}
          <div className="hidden md:flex justify-center animate-fade-in">
            <div className="relative">
              <img
                src="https://ideogram.ai/assets/image/lossless/response/jx-varyLRZuuXYtkAavUYg"
                width="520"
                height="360"
                alt="Futuristic coding workspace"
                className="rounded-2xl shadow-2xl border-4 border-purple-200 dark:border-purple-700 animate-float"
              />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-6 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 opacity-30 blur-2xl rounded-full" />
            </div>
          </div>
        </div>
      </div>
      {/* Removed styled-jsx. Use Tailwind animate-float class from tailwind.config.js */}
    </section>
  );
}

// **Note:** You'll need to add the `fade-in` animation to your `tailwind.config.js`
// keyframes: {
//   'fade-in': {
//     '0%': { opacity: '0', transform: 'translateY(10px)' },
//     '100%': { opacity: '1', transform: 'translateY(0)' },
//   },
// },
// animation: {
//   'fade-in': 'fade-in 0.5s ease-out forwards',
// },
