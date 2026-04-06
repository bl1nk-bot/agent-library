import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";

let withSentryConfig: ((config: NextConfig, options: Record<string, unknown>) => NextConfig) | null = null;
try {
  // eslint-disable-next-line `@typescript-eslint/no-require-imports`
  withSentryConfig = require("@sentry/nextjs").withSentryConfig;
} catch {
  // Sentry not available
}

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const baseNextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactCompiler: true,
  // Configure webpack for raw imports
  webpack: (config) => {
    config.module.rules.push({
      resourceQuery: /raw/,
      type: 'asset/source',
    });
    return config;
  },
  // Enable standalone output for Docker
  output: "standalone",
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Redirects
  async redirects() {
    return [
      {
        source: "/vibe",
        destination: "/categories/vibe",
        permanent: true,
      },
      {
        source: "/sponsors",
        destination: "/categories/sponsors",
        permanent: true,
      },
      {
        source: "/embed-preview",
        destination: "/embed",
        permanent: true,
      },
    ];
  },
};

const configWithPlugins = withMDX(withNextIntl(baseNextConfig));

let finalConfig: NextConfig;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { withSentryConfig } = require("@sentry/nextjs");

  finalConfig = withSentryConfig(configWithPlugins, {
    org: "promptschat",
    project: "prompts-chat",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: "/monitoring",
    webpack: {
      automaticVercelMonitors: true,
      treeshake: {
        removeDebugLogging: true,
      },
    },
  });
} catch {
  // Sentry not available, use config without Sentry
  finalConfig = configWithPlugins;
}

export default finalConfig;
