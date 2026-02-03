import { describe, it, expect } from "vitest";
import { execSync } from "child_process";

describe("Rebranding Sweep", () => {
  it("should fail if old URL references are found", () => {
    let output = "";
    try {
      output = execSync('git grep -l "awesome-chatgpt-prompts" -- ":(exclude)src/__tests__" ":(exclude)node_modules" ":(exclude).git" ":(exclude)package-lock.json" ":(exclude)conductor/tracks"', { encoding: 'utf8' });
    } catch (error: any) {
      // Grep returns 1 if no matches found, execSync throws
      return; 
    }
    
    if (output) {
      const files = output.trim().split("\n");
      throw new Error(`Found ${files.length} files with old URL references: ${files.join(", ")}`);
    }
  });
});