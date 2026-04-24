import { Skeleton } from "@/components/ui/skeleton";

export default function PromptDetailLoading() {
  return (
    <div className="container max-w-4xl py-8">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Title & Actions */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <Skeleton className="mb-2 h-8 w-3/4" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      {/* Description */}
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-6 h-4 w-2/3" />

      {/* Tags */}
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>

      {/* Tabs */}
      <Skeleton className="mb-4 h-9 w-64" />

      {/* Content */}
      <div className="space-y-3 rounded-lg border p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
