# Joint Unified Logging and Execution Standard (JULES)

The JULES protocol ensures peaceful coexistence and coordination between autonomous agents and specialized personas (like Guardian, Sentinel, Palette).

## 1. Centralized Task Logging
All agents MUST log their start, progress, and completion to `.Jules/task-log.md`.
Format:
```markdown
## YYYY-MM-DD HH:MM - [AGENT_TYPE] Task description
- Status: [STARTED|IN_PROGRESS|COMPLETED|BLOCKED]
- Files: [file1.ts, file2.ts]
- Details: Context about the task
```

## 2. Conflict Prevention
Before modifying any file, an agent MUST check `.Jules/task-log.md` to ensure no other agent (especially Autonomous tasks) is currently working on those files. If there is a conflict, the agent MUST abort the operation and document the conflict.

## 3. Specialized Personas
- **Guardian**: Architectural refactoring, deduplication. (Logs to `.Jules/guardian/`)
- **Sentinel**: Security audits and fixes. (Logs to `.jules/sentinel.md`)
- **Palette**: UI/UX improvements. (Logs to `.Jules/palette.md`)
- **Bolt**: Performance optimizations. (Logs to `.jules/bolt.md`)

## 4. Verification
All changes MUST be verified with standard project commands (`npm run test`, `npm run lint`, etc.) before completion.

## 5. Non-Destructive Operations
Never delete files or change architecture without full test coverage and validation of all imports.
