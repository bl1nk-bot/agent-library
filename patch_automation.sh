#!/bin/bash
sed -i '/runs-on: ubuntu-latest/a \    if: vars.PROJECT_URL != '\'''\''' .github/workflows/project-automation.yml
