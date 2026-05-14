"use client";

import { FileQuestion } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";

export default function NotFound() {
  return (
    <ErrorState
      icon={FileQuestion}
      code={404}
      namespace="notFound"
      titleKey="title"
      descriptionKey="description"
      showTryAgain={false}
    />
  );
}
