export async function register() {
  try {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("../sentry.server.config");
    }

    if (process.env.NEXT_RUNTIME === "edge") {
      await import("../sentry.edge.config");
    }
  } catch {
    // Sentry not available in this environment
  }
}

interface RequestErrorMetadata {
  url?: string;
  method?: string;
}

export const onRequestError = async (
  error: Error,
  request: RequestErrorMetadata,
  _context: unknown
) => {
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(error, {
      extra: {
        url: request?.url,
        method: request?.method,
      },
    });
  } catch {
    // Sentry not installed
  }
};
