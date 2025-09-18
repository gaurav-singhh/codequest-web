export function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-4 min-h-[200px]">
      <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-800 rounded mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
        <div className="h-5 w-12 bg-gray-100 dark:bg-gray-800 rounded-full" />
      </div>
      <div className="h-8 w-full bg-gray-100 dark:bg-gray-800 rounded" />
    </div>
  );
}
