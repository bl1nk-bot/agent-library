// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

async function initSentry() {
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn: "https://9c2eb3b4441745efad28a908001c30bf@o4510673866063872.ingest.de.sentry.io/4510673871306832",
      enabled: process.env.NODE_ENV === "production",
      tracesSampleRate: 0.2,
      enableLogs: true,
      sendDefaultPii: false,
    });
  } catch {
    // Sentry not available
  }
}

initSentry();
