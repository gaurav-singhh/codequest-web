import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "green" | "yellow" | "red" | "secondary" | "default";
}

export function Badge({
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold";
  const variants: Record<string, string> = {
    green:
      "bg-green-100 text-green-800 border-transparent dark:bg-green-900 dark:text-green-300",
    yellow:
      "bg-yellow-100 text-yellow-800 border-transparent dark:bg-yellow-900 dark:text-yellow-300",
    red: "bg-red-100 text-red-800 border-transparent dark:bg-red-900 dark:text-red-300",
    secondary:
      "bg-purple-100 text-purple-800 border-transparent dark:bg-purple-900 dark:text-purple-300",
    default:
      "bg-gray-100 text-gray-800 border-transparent dark:bg-gray-800 dark:text-gray-300",
  };
  return (
    <div
      className={`${baseClasses} ${variants[variant] || variants.default} ${className}`}
      {...props}
    />
  );
}
