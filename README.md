# Agent Library 🤖

<p align="center">
  <strong>The world's most advanced open-source agent & prompt library</strong><br>
  <sub>Works with ChatGPT, Claude, Gemini, Llama, Mistral, and more</sub>
</p>

<p align="center">
  <a href="https://agent.bl1nk.site"><img src="https://img.shields.io/badge/Website-agent.bl1nk.site-cyan?style=flat-square" alt="Website"></a>
  <a href="https://github.com/bl1nk-bot/agent-library"><img src="https://img.shields.io/badge/GitHub-bl1nk--bot-black?style=flat-square&logo=github" alt="GitHub"></a>
  <a href="https://github.com/bl1nk-bot/agent-library/stargazers"><img src="https://img.shields.io/github/stars/bl1nk-bot/agent-library?style=flat-square" alt="Stars"></a>
  <a href="https://github.com/bl1nk-bot/agent-library/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-CC0_1.0-green?style=flat-square" alt="License"></a>
</p>

<p align="center">
  <a href="https://agent.bl1nk.site/prompts">🌐 Browse Library</a> •
  <a href="https://agent.bl1nk.site/book">📖 Learning Guide</a> •
  <a href="https://raw.githubusercontent.com/bl1nk-bot/agent-library/main/PROMPTS.md">📄 View Source</a> •
  <a href="#-self-hosting">🚀 Self-Host</a>
</p>

---

## What is this?

**Agent Library** is a curated, community-driven collection of high-performance instructions and workflows for AI Agents and Large Language Models. Built for the era of autonomous digital intelligence, it provides the building blocks for developers and enthusiasts to create specialized AI capabilities.

### Key Pillars

- **Agent Skills:** Multi-file prompts that add specialized tools and logic to AI agents.
- **Context Engineering:** Beyond simple chat—manage complex reasoning and data flows.
- **Platform Neutral:** Designed to work across ChatGPT, Claude, Gemini, and local models.
- **Enterprise Ready:** Fully self-hostable with built-in authentication and customization.

---

## 📖 The Interactive Book of Prompting

Master the art of communicating with machines. Our free, interactive guide covers everything from basics to advanced techniques like:

- **Chain-of-Thought** reasoning
- **Multi-step Agent Workflows**
- **Model Context Protocol (MCP)** integration
- **Structured Output** optimization

**[Start Learning →](https://agent.bl1nk.site/book)**

---

## 🚀 Self-Hosting

Deploy your own private instance of the Agent Library for your team or organization.

### Quick Start

```bash
git clone https://github.com/bl1nk-bot/agent-library.git
cd agent-library
bun install && bun run setup
```

The interactive setup wizard will guide you through:

- **Custom Branding** (Name, Logo, Theme)
- **Authentication Providers** (GitHub, Google, Azure AD)
- **Feature Toggles** (Private Prompts, AI Search, MCP Support)

📖 **[Full Self-Hosting Guide](SELF-HOSTING.md)** • 🐳 **[Docker Guide](DOCKER.md)**

---

## 🔌 Integrations

### MCP Server

Integrate this entire library directly into VS Code, Cursor, or Claude Desktop.

**Configuration:**

```json
{
  "mcpServers": {
    "agent-library": {
      "url": "https://agent.bl1nk.site/api/mcp"
    }
  }
}
```

---

## 👥 Community & Contributions

We believe in open knowledge. Contributions are welcome through GitHub pull requests or via the platform's change request system.

### Development

This project uses:

- **Next.js 16** with App Router
- **TypeScript 5** (strict mode)
- **Prisma ORM** for database management
- **NextAuth.js v5** for authentication
- **Tailwind CSS 4** for styling
- **Vitest** for testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

For more information, see [AGENTS.md](AGENTS.md) for development guidelines.

### Development

This project uses:

- **Next.js 16** with App Router
- **TypeScript 5** (strict mode)
- **Prisma ORM** for database management
- **NextAuth.js v5** for authentication
- **Tailwind CSS 4** for styling
- **Vitest** for testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

For more information, see [AGENTS.md](AGENTS.md) for development guidelines.

---

## 📜 License

**[CC0 1.0 Universal (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/)** — This project belongs to everyone. Copy, modify, and use it freely without any restrictions.

---

<sub>Built with passion by **bl1nk Team**. Based on the open-source community's collective wisdom.</sub>
