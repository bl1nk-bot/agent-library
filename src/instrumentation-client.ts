// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// Patterns to ignore - typically from browser extensions or third-party scripts
const ignoreErrors = [
  /MetaMask/i,
  /ethereum/i,
  /tronlink/i,
  /tron/i,
  /webkit\.messageHandlers/i,
  /disconnected port/i,
  /__firefox__/i,
  /removeChild.*not a child/i,
  /parentNode.*null/i,
  /CONFIG.*not defined/i,
  /Can't find variable: CONFIG/i,
];

async function initSentry() {
  try {
    const Sentry = await import("@sentry/nextjs");

    Sentry.init({
      dsn: "https://9c2eb3b4441745efad28a908001c30bf@o4510673866063872.ingest.de.sentry.io/4510673871306832",
      enabled: process.env.NODE_ENV === "production",
      integrations: [Sentry.replayIntegration()],
      tracesSampleRate: 1,
      enableLogs: true,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      sendDefaultPii: true,
      beforeSend(event) {
        const message = event.exception?.values?.[0]?.value || "";
        const type = event.exception?.values?.[0]?.type || "";
        const fullMessage = `${type}: ${message}`;

        if (ignoreErrors.some((pattern) => pattern.test(fullMessage))) {
          return null;
        }

        const frames = event.exception?.values?.[0]?.stacktrace?.frames || [];
        const hasExtensionFrame = frames.some((frame) => {
          const filename = frame.filename || "";
          return (
            filename.includes("extension://") ||
            filename.includes("moz-extension://") ||
            filename.includes("chrome-extension://")
          );
        });

        if (hasExtensionFrame) {
          return null;
        }

        return event;
      },
    });

    return Sentry;
  } catch {
    return null;
  }
}

const sentryPromise = initSentry();

export const onRouterTransitionStart = async (...args: unknown[]) => {
  const Sentry = await sentryPromise;
  if (Sentry) {
    Sentry.captureRouterTransitionStart(...(args as Parameters<typeof Sentry.captureRouterTransitionStart>));
  }
};
