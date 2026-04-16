#!/bin/bash
# Insert Guardian comments before the toYaml function in src/lib/format.ts
sed -i '/export function toYaml/i \/\/ 🛡️ Guardian: Consolidated from src/components/ide/utils.ts (deleted)\n\/\/ This function was duplicated or misplaced - moved to canonical location\n\/\/ JULES Check: Verified no Autonomous task conflicts\n\/\/ Impact: 2 → 1 file\n\/\/ Date: '$(date '+%Y-%m-%d')'\n\/\/ Session: .Jules/guardian/'$(date '+%Y-%m-%d')'/' src/lib/format.ts
