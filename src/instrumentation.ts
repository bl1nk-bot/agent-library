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

export const onRequestError = async (request: Request, error: Error) => {
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureRequestError(error, {
      request: {
        url: request.url,
        method: request.method,
        headers: request.headers as Record<string, string>,
      },
    });
  } catch {
    // Sentry not installed
  }
};
