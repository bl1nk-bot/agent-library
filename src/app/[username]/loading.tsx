import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfileLoading() {
  return (
    <div className="container py-6">
      {/* Profile Header */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full md:h-20 md:w-20" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-7 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      {/* Tabs */}
      <Skeleton className="mb-4 h-9 w-72" />

      {/* Content Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
