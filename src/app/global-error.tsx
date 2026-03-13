"use client";

import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    try {
      import("@sentry/nextjs").then((Sentry) => {
        Sentry.captureException(error);
      }).catch(() => {
        // Sentry not available
      });
    } catch {
      // Sentry not installed
    }
  }, [error]);

  return (
    <html lang="en">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
