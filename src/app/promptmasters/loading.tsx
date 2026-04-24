import { Skeleton } from "@/components/ui/skeleton";

export default function PromptmastersLoading() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        {/* Header - centered */}
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-9 w-48" />
          </div>
          <Skeleton className="mx-auto h-4 w-64" />
        </div>

        {/* Tabs */}
        <Skeleton className="mb-6 h-10 w-full rounded-lg" />

        {/* Leaderboard */}
        <div className="divide-y">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-1 h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 w-12" />
                <Skeleton className="h-10 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
