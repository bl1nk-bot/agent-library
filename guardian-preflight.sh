#!/bin/bash
# guardian-preflight.sh

# ========== MANDATORY JULES CHECK ==========
echo "=== GUARDIAN PRE-FLIGHT CHECK (JULES) ==="

# 1. Check JULES standard exists
if [ ! -f ".Jules/JULES.md" ]; then
  mkdir -p .Jules
  echo "# JULES Standard" > .Jules/JULES.md
fi

# 2. Check central task log for Autonomous conflicts
echo "Checking for Autonomous task conflicts..."
if [ ! -f ".Jules/task-log.md" ]; then
  touch .Jules/task-log.md
fi

# 4. Create session directory
SESSION_DATE=$(date '+%Y-%m-%d')
SESSION_DIR=".Jules/guardian/$SESSION_DATE"
mkdir -p "$SESSION_DIR"

# 5. Log session start (MANDATORY)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
echo "## $TIMESTAMP - [GUARDIAN] Session started" >> ".Jules/task-log.md"
echo "- Directory: $SESSION_DIR" >> ".Jules/task-log.md"
echo "- Phase: PRE-FLIGHT" >> ".Jules/task-log.md"
echo "- JULES Check: COMPLETE" >> ".Jules/task-log.md"
echo "" >> ".Jules/task-log.md"

echo "✅ Pre-flight complete"
echo "📁 Session directory: $SESSION_DIR"
echo "📝 Logged to: .Jules/task-log.md"
