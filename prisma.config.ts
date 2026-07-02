import "dotenv/config";
import { defineConfig } from "prisma/config";

if (process.env.DATABASE_URL && !process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // @ts-expect-error - Prisma config requires a string, but we want to allow undefined at runtime to prevent hangs
    url: process.env.DATABASE_URL,
  },
});
