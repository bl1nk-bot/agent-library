import { Skeleton } from "@/components/ui/skeleton";
import { PromptGridSkeleton } from "@/components/prompts/prompt-grid-skeleton";

export default function CollectionLoading() {
  return (
    <div className="container py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Collection Items */}
      <PromptGridSkeleton />
    </div>
  );
}
