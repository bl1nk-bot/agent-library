.PHONY: dev build setup db-studio db-push db-setup lint test qa sync-env help

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start Next.js development server
	npm run dev

build: ## Build Next.js for production
	npm run build

setup: ## Initial project setup
	node scripts/setup.js

db-studio: ## Open Prisma Studio
	npm run db:studio

db-push: ## Sync database schema
	npm run db:push

db-setup: ## Run full database setup (generate + migrate + seed)
	npm run db:setup

lint: ## Run ESLint
	npm run lint

test: ## Run unit tests
	npm run test

sync-env: ## Check for missing environment variables
	node scripts/sync-env.js

qa: ## Run all quality checks (lint, test, translations)
	npm run lint
	node scripts/check-translations.js
	npm run test
