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

export const onRequestError = async (...args: unknown[]) => {
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureRequestError(...(args as Parameters<typeof Sentry.captureRequestError>));
  } catch {
    // Sentry not installed
  }
};
