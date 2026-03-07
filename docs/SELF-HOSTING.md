# Self-Hosting Guide

## Capabilities

- **Curated Agent Library** — Access high-quality, community-tested instructions for ChatGPT, Claude, Gemini, Llama, Mistral, and other AI models.
- **Discover & Browse** — Explore content by categories, tags, or AI-powered semantic search.
- **Agent Skills Support** — Submit and manage multi-file skills with support for text, structured (JSON/YAML), and media formats.
- **Enterprise-Grade Control** — Full version control, change requests, and private prompt management.
- **Community Features** — Voting, leaderboards, and subscriber feeds.
- **Multi-language UI** — Support for 16+ languages including English and Thai.

## Benefits

- **Privacy First:** Keep your proprietary agent instructions internal to your organization.
- **Custom Branding:** Deploy a white-labeled library with your own logos, themes, and domain.
- **Seamless Integration:** Native support for Model Context Protocol (MCP) to use instructions in IDEs and AI clients.
- **Open Source Foundation:** Built on top of the world's most starred prompt dataset, refined for modern agentic workflows.

## Getting Started

**Requirements:**
- **License:** Free and open-source (CC0 1.0)
- **Official Instance:** [agent.bl1nk.site](https://agent.bl1nk.site)

---

This guide explains how to deploy your own instance of the **Agent Library** on a private server.

## Prerequisites

- **Node.js** 24.x (Recommended)
- **PostgreSQL** database
- **npm**

## Environment Variables

Create a `.env.local` file in your root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/agent_library"

# Authentication (GitHub Example)
AUTH_GITHUB_ID="your-client-id"
AUTH_GITHUB_SECRET="your-client-secret"

# NextAuth Configuration
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-a-random-32-char-string"

# Optional: AI Search (OpenAI)
OPENAI_API_KEY="sk-..."
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bl1nk-bot/agent-library.git
   cd agent-library
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the setup wizard**
   ```bash
   npm run setup
   ```
   Follow the prompts to configure your branding, theme, and authentication providers.

4. **Prepare the database**
   ```bash
   npm run db:migrate
   ```

5. **Start development**
   ```bash
   npm run dev
   ```

6. **Production Build**
   ```bash
   npm run build
   npm run start
   ```

## Configuration

The setup wizard generates `prompts.config.ts`. You can enable **Clone Branding Mode** to completely remove references to the main instance:

```typescript
export default defineConfig({
  branding: {
    name: "My Company Agents",
    logo: "/logo.svg",
    description: "Internal knowledge hub",
  },
  homepage: {
    useCloneBranding: true, // Hides achievements and main repo links
  }
});
```

## Support

For technical issues or feature requests, please open a [GitHub Issue](https://github.com/bl1nk-bot/agent-library/issues).

---
© 2026 **bl1nk Team**.