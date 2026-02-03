# Specification: Clean up & Rebranding

**Track ID:** rebrand_cleanup_20260204
**Type:** Feature

## 1. Overview
The goal of this track is to completely detach the project from its original fork source (`f/awesome-chatgpt-prompts`) and establish it as a standalone product under the `bl1nk-bot` brand. This involves a comprehensive sweep of the codebase to replace URLs, rewrite historical context, update metadata, and remove legacy attributions.

## 2. Functional Requirements

*   **Global URL Replacement:**
    *   Replace all instances of `github.com/f/awesome-chatgpt-prompts` with `github.com/bl1nk-bot/agent-library`.
    *   Update `package.json`, `package-lock.json` (where applicable/safe), `docker/Dockerfile`, and documentation links.
*   **Documentation & Content Rewrite:**
    *   **Book of Prompting (`src/content/book/`):** Rewrite `00a-preface.mdx` and `00b-history.mdx` to reflect the new project identity (`prompts.chat-v2` / `Agent Library`) and remove specific references to the original creator's personal history.
    *   **README.md & SELF-HOSTING.md:** Update all instructions, badges, and links to point to the new repository.
    *   **Legal Docs:** Update `src/app/terms/page.tsx` and `src/app/privacy/page.tsx` to reference the new entity/repo.
*   **UI/UX Cleanup:**
    *   **Remove Legacy Sections:** Permanently remove the "Testimonials" (Greg Brockman, etc.) and "Achievements" sections from `src/app/page.tsx` and related components (`src/components/home/`).
    *   **Star Count Logic:** Update `src/lib/github.ts` to fetch stars from `bl1nk-bot/agent-library` instead of the original repo.
*   **SEO & Metadata:**
    *   Update `src/components/seo/structured-data.tsx` to use the new author name and repository URL.
    *   Update `site.webmanifest` and other static meta files if they contain legacy links.

## 3. Non-Functional Requirements
*   **Cleanliness:** No dead code or commented-out legacy sections should remain.
*   **Consistency:** The term "Awesome ChatGPT Prompts" should be replaced with "Agent Library" or "Prompts Chat" (depending on preference, defaulting to "Agent Library" for repo references).

## 4. Acceptance Criteria
*   [ ] No visible links to `f/awesome-chatgpt-prompts` exist in the rendered application (Footer, Hero, Docs).
*   [ ] The "About" and "History" pages tell the story of *this* project, not the fork source.
*   [ ] The GitHub Star counter reflects the new repository's count.
*   [ ] `git grep` for the old repo URL returns 0 results (excluding necessary vendor/license acknowledgments if strictly required).

## 5. Out of Scope
*   Creating new graphical logo assets (we will use placeholders or existing files, but ensure code references are correct).
*   Changing the core domain name logic (assuming `prompts.chat` is still the target, or local dev).
