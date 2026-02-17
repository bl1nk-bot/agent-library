-- CreateTable
CREATE TABLE "api_configs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "promptId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "baseUrl" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'GET',
    "headers" JSONB,
    "queryParams" JSONB,
    "bodySchema" JSONB,
    "responseSchema" JSONB,
    "authentication" JSONB,
    "testEndpoint" TEXT,
    "documentation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "api_configs_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "prompts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "api_configs_promptId_idx" ON "api_configs"("promptId");
