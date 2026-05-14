"use client";

import { ServerCrash } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <ErrorState
      icon={ServerCrash}
      code={500}
      namespace="serverError"
      titleKey="title"
      descriptionKey="description"
      showTryAgain={true}
      onTryAgain={reset}
    />
  );
}
