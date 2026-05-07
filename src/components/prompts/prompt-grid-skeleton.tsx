import { Skeleton } from "@/components/ui/skeleton";

// 🛡️ Guardian: Consolidated from src/app/collection/loading.tsx and src/app/feed/loading.tsx
// This component extracts the identical skeleton grid layout used for loading prompt lists.
// JULES Check: Verified no Autonomous task conflicts
// Impact: Reduced duplication across loading screens
// Date: 2026-05-07
export function PromptGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
