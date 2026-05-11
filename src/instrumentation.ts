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

export const onRequestError = async (error: Error, request: any, context: any) => {
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
