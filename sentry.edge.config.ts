// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

async function initSentry() {
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn: "https://9c2eb3b4441745efad28a908001c30bf@o4510673866063872.ingest.de.sentry.io/4510673871306832",
      enabled: process.env.NODE_ENV === "production",
      tracesSampleRate: 1,
      enableLogs: true,
      sendDefaultPii: true,
    });
  } catch {
    // Sentry not available
  }
}

initSentry();
