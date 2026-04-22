---
description: "Create or update AGENTS.md file based on pull request changes"
argument-hint: "PR number or URL (e.g., 123 or https://github.com/owner/repo/pull/123)"
agent: "agent"
tools: [github-pull-request_currentActivePullRequest, github-pull-request_issue_fetch, github-pull-request_doSearch, read_file, list_dir, semantic_search]
---

Create or update the AGENTS.md file based on the provided pull request changes.

## Step 1: Check AGENTS.md Existence
- Verify if AGENTS.md exists in the repository root
- If it exists, read its current contents
- If it doesn't exist, proceed to creation workflow

## Step 2: Analyze Pull Request Changes
- Fetch the pull request details using the provided PR number/URL
- Review all changed files and their modifications
- Identify key changes that would impact AI agent guidance:
  - New dependencies or build tools
  - Code structure/architecture changes
  - Testing framework updates
  - New conventions or patterns
  - Configuration changes
  - New directories or file types

## Step 3: Determine Update Requirements
If AGENTS.md exists:
- Compare current AGENTS.md content with PR changes
- Assess if any sections need updates:
  - Build commands
  - Testing instructions
  - Code style guidelines
  - Project structure
  - Key architectural decisions
  - Tooling and dependencies
- If updates needed, prepare suggested changes
- If no updates needed, explain reasoning

## Step 4: Create/Update AGENTS.md
If AGENTS.md doesn't exist:
- Scan key project files efficiently:
  - package.json (dependencies, scripts)
  - README.md (project overview)
  - Directory structure (src/, tests/, etc.)
  - Configuration files (tsconfig.json, eslint.config.js, etc.)
- Create comprehensive AGENTS.md with:
  - Project overview
  - Build and run commands
  - Testing instructions
  - Code style and conventions
  - Project structure
  - Key architectural decisions
  - Tooling and dependencies

## Step 5: Handle Pull Request Integration
- For existing AGENTS.md: Leave a commit suggestion comment on the PR with proposed changes
- For new AGENTS.md: Create a new pull request to the base branch with the file
- Link the new PR to the original PR that triggered this workflow

## Output Format
- Clear summary of actions taken
- If updating existing: Show diff of proposed changes
- If creating new: Show complete AGENTS.md content
- PR comment or new PR details
- Reasoning for any decisions made

Focus on information that helps AI coding agents work effectively with this codebase.