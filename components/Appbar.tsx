"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { Button } from "@codequest/ui/button";
import { CodeIcon } from "./Icon";
import { useDarkMode } from "./DarkModeProvider";

export function Appbar() {
  const { data: session, status: sessionStatus } = useSession();
  const isLoading = sessionStatus === "loading";
  const { isDark, setIsDark } = useDarkMode();
  return (
    <header className="bg-gray-900 text-white px-4 md:px-6 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <CodeIcon className="h-6 w-6" />
        <span className="text-lg font-bold">CodeQuest</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/contests" className="hover:underline" prefetch={false}>
          Contests
        </Link>
        <Link href="/problems" className="hover:underline" prefetch={false}>
          Problems
        </Link>
        <Link href="/standings" className="hover:underline" prefetch={false}>
          Standings
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <button
          className="rounded-full px-3 py-1 bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 transition-colors"
          onClick={() => setIsDark(!isDark)}
          aria-label="Toggle dark mode"
        >
          {isDark ? "🌙" : "☀️"}
        </button>
        {!isLoading && session?.user && (
          <Button onClick={() => signOut()}>Logout</Button>
        )}
        {!isLoading && !session?.user && (
          <Button onClick={() => signIn()}>Sign in</Button>
        )}
        {isLoading && <div className="flex items-center gap-4"></div>}
      </div>
    </header>
  );
}
