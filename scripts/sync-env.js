#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ENV_PATH = path.join(process.cwd(), ".env");
const EXAMPLE_PATH = path.join(process.cwd(), ".env.example");

if (!fs.existsSync(EXAMPLE_PATH)) {
  console.error("❌ .env.example not found");
  process.exit(1);
}

const exampleContent = fs.readFileSync(EXAMPLE_PATH, "utf-8");
const exampleKeys = exampleContent
  .split("\n")
  .filter((line) => line.includes("=") && !line.startsWith("#"))
  .map((line) => line.split("=")[0].trim());

if (!fs.existsSync(ENV_PATH)) {
  console.log("⚠️  .env not found. Creating from .env.example...");
  fs.copyFileSync(EXAMPLE_PATH, ENV_PATH);
  process.exit(0);
}

const envContent = fs.readFileSync(ENV_PATH, "utf-8");
const envKeys = envContent
  .split("\n")
  .filter((line) => line.includes("=") && !line.startsWith("#"))
  .map((line) => line.split("=")[0].trim());

const missingKeys = exampleKeys.filter((key) => !envKeys.includes(key));

if (missingKeys.length > 0) {
  console.log("⚠️  Missing keys in .env:");
  missingKeys.forEach((key) => console.log(`   - ${key}`));
  console.log("\nPlease update your .env file with these keys.");
} else {
  console.log("✅ .env is up to date with .env.example");
}
