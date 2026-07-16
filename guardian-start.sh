#!/bin/bash
# 1. Check JULES standard exists
if [ ! -f ".Jules/JULES.md" ]; then
  mkdir -p .Jules
  touch .Jules/JULES.md
fi
