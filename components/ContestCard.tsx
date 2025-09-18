import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@codequest/ui/card";
import Link from "next/link";
import { parseFutureDate, parseOldDate } from "../app/lib/time";
import { PrimaryButton } from "./LinkButton";

interface ContestCardParams {
  title: string;
  id: string;
  endTime: Date;
  startTime: Date;
}

export function ContestCard({
  title,
  id,
  startTime,
  endTime,
}: ContestCardParams) {
  const duration = `${(new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60 * 60)} hours`;
  const isActive =
    startTime.getTime() < Date.now() && endTime.getTime() > Date.now();
  const isEnded = endTime.getTime() < Date.now();
  const isUpcoming = startTime.getTime() > Date.now();

  return (
    <Card className="flex flex-col h-full rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl bg-white dark:bg-gray-900">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white truncate pr-2">{title}</CardTitle>
          <div>
            {isEnded && (
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 animate-fade-in">Ended</span>
            )}
            {isActive && (
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 animate-fade-in">Active</span>
            )}
            {isUpcoming && (
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 animate-fade-in">Upcoming</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {startTime.getTime() < Date.now() ? "Started" : "Starts in"}
            </p>
            <p className="font-medium">
              {startTime.getTime() < Date.now()
                ? parseOldDate(new Date(startTime))
                : parseFutureDate(new Date(startTime))}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Duration</p>
            <p className="font-medium">{duration}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <PrimaryButton href={`/contest/${id}`}>View Contest</PrimaryButton>
      </CardFooter>
    </Card>
  );
}
