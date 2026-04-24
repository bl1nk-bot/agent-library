.PHONY: dev build setup db-studio db-push db-setup lint test qa sync-env format typecheck help

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start Next.js development server
	npm run dev

build: ## Build Next.js for production
	npm run build

setup: ## Initial project setup
	npm run setup

db-studio: ## Open Prisma Studio
	npm run db:studio

db-push: ## Sync database schema
	npm run db:push

db-setup: ## Run full database setup (generate + migrate + seed)
	npm run db:setup

lint: ## Run ESLint
	npm run lint

format: ## Run Prettier formatting
	npm run format

typecheck: ## Run TypeScript type checking
	npm run typecheck

test: ## Run unit tests
	npm run test

sync-env: ## Check for missing environment variables
	npm run env:sync

qa: ## Run all quality checks (lint, format, typecheck, i18n, test)
	npm run lint
	npm run format:check
	npm run typecheck
	npm run i18n:check
	npm run test

