import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

interface CsvRow {
  act: string;
  prompt: string;
  for_devs: string;
  type: string;
  contributor: string;
}

// Unescape literal escape sequences like \n, \t, etc.
function unescapeString(str: string): string {
  return str
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\\/g, "\\");
}

function parseCSV(content: string): CsvRow[] {
  const rows: CsvRow[] = [];
  const values: string[] = [];
  let current = "";
  let inQuotes = false;
  let isFirstRow = true;

  // Parse character by character to handle multi-line quoted fields
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"' && !inQuotes) {
      inQuotes = true;
    } else if (char === '"' && inQuotes) {
      if (nextChar === '"') {
        // Escaped quote ""
        current += '"';
        i++;
      } else {
        inQuotes = false;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else if ((char === "\n" || (char === "\r" && nextChar === "\n")) && !inQuotes) {
      // End of row (not inside quotes)
      if (char === "\r") i++; // Skip \r in \r\n

      values.push(current);
      current = "";

      if (isFirstRow) {
        // Skip header row
        isFirstRow = false;
      } else if (values.some((v) => v.trim())) {
        // Only add non-empty rows
        rows.push({
          act: values[0]?.trim() || "",
          prompt: unescapeString(values[1] || ""),
          for_devs: values[2]?.trim() || "",
          type: values[3]?.trim() || "",
          contributor: values[4]?.trim() || "",
        });
      }
      values.length = 0; // Clear array
    } else {
      current += char;
    }
  }

  // Handle last row if file doesn't end with newline
  if (current || values.length > 0) {
    values.push(current);
    if (!isFirstRow && values.some((v) => v.trim())) {
      rows.push({
        act: values[0]?.trim() || "",
        prompt: unescapeString(values[1] || ""),
        for_devs: values[2]?.trim() || "",
        type: values[3]?.trim() || "",
        contributor: values[4]?.trim() || "",
      });
    }
  }

  return rows;
}

function mapCsvTypeToPromptType(csvType: string): {
  type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "STRUCTURED";
  structuredFormat: "JSON" | "YAML" | null;
} {
  const type = csvType.toUpperCase();
  if (type === "JSON") return { type: "STRUCTURED", structuredFormat: "JSON" };
  if (type === "YAML") return { type: "STRUCTURED", structuredFormat: "YAML" };
  if (type === "IMAGE") return { type: "IMAGE", structuredFormat: null };
  if (type === "VIDEO") return { type: "VIDEO", structuredFormat: null };
  if (type === "AUDIO") return { type: "AUDIO", structuredFormat: null };
  if (type === "STRUCTURED") return { type: "STRUCTURED", structuredFormat: "JSON" };
  return { type: "TEXT", structuredFormat: null };
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Read the prompts.csv file from the project root
    const csvPath = path.join(process.cwd(), "prompts.csv");
    const csvContent = await fs.readFile(csvPath, "utf-8");

    const rows = parseCSV(csvContent);

    if (rows.length === 0) {
      return NextResponse.json({ error: "No valid rows found in CSV" }, { status: 400 });
    }

    // Get the admin user ID for fallback author assignment
    const adminUserId = session.user.id;

    // Upsert "Coding" category for for_devs prompts
    const codingCategory = await db.category.upsert({
      where: { slug: "coding" },
      update: {},
      create: {
        name: "Coding",
        slug: "coding",
        description: "Programming and development prompts",
        icon: "💻",
      },
    });

    const uniqueTitles = Array.from(new Set(rows.map((row) => row.act)));

    // Fetch existing prompts to avoid duplicates
    const existingPrompts = await db.prompt.findMany({
      where: { title: { in: uniqueTitles } },
      select: { title: true },
    });
    const existingTitles = new Set(existingPrompts.map((p) => p.title));

    // Extract all unique contributors
    const contributorNames = new Set<string>();
    for (const row of rows) {
      if (row.contributor) {
        const contributors = row.contributor
          .split(",")
          .map((c) => c.trim().toLowerCase())
          .filter(Boolean);
        for (const c of contributors) {
          contributorNames.add(c);
        }
      }
    }

    const contributorCache = new Map<string, string>();

    if (contributorNames.size > 0) {
      const namesArray = Array.from(contributorNames);

      const pseudoEmails = namesArray.map((name) => `${name}@unclaimed.prompts.chat`);

      const existingUsers = await db.user.findMany({
        where: {
          OR: [{ username: { in: namesArray } }, { email: { in: pseudoEmails } }],
        },
        select: { id: true, username: true, email: true },
      });

      for (const u of existingUsers) {
        if (u.username) contributorCache.set(u.username.toLowerCase(), u.id);
        if (u.email && u.email.endsWith("@unclaimed.prompts.chat")) {
          contributorCache.set(u.email.split("@")[0], u.id);
        }
      }

      const missingUsers = namesArray.filter((name) => !contributorCache.has(name));
      if (missingUsers.length > 0) {
        const newUsers = await db.user.createManyAndReturn({
          data: missingUsers.map((name) => ({
            username: name,
            email: `${name}@unclaimed.prompts.chat`,
            name: name,
            role: "USER",
          })),
        });

        for (const u of newUsers) {
          if (u.username) contributorCache.set(u.username.toLowerCase(), u.id);
        }
      }
    }

    function getPrimaryContributorId(contributorField: string): string {
      if (!contributorField) return adminUserId;
      const contributors = contributorField
        .split(",")
        .map((c) => c.trim().toLowerCase())
        .filter(Boolean);

      if (contributors.length === 0) return adminUserId;

      const authorId = contributorCache.get(contributors[0]);
      return authorId || adminUserId;
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    const promptsToCreate = [];

    // First, process valid rows and prepare for batch insert
    for (const row of rows) {
      if (existingTitles.has(row.act)) {
        skipped++;
        continue;
      }

      const authorId = getPrimaryContributorId(row.contributor);
      const { type, structuredFormat } = mapCsvTypeToPromptType(row.type);
      const isForDevs = row.for_devs.toUpperCase() === "TRUE";
      const categoryId = isForDevs ? codingCategory.id : null;

      promptsToCreate.push({
        title: row.act,
        content: row.prompt,
        type,
        structuredFormat,
        isPrivate: false,
        authorId,
        categoryId,
      });

      // Mark as existing so duplicates in the same CSV are skipped
      existingTitles.add(row.act);
    }

    // Insert prompts in batch
    if (promptsToCreate.length > 0) {
      try {
        const createdPrompts = await db.prompt.createManyAndReturn({
          data: promptsToCreate,
        });

        imported += createdPrompts.length;

        // Prepare versions
        const versionsToCreate = createdPrompts.map((prompt) => ({
          promptId: prompt.id,
          version: 1,
          content: prompt.content,
          changeNote: "Imported from prompts.csv",
          createdBy: prompt.authorId,
        }));

        // Insert versions in batch
        await db.promptVersion.createMany({
          data: versionsToCreate,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        errors.push(`Failed to import batch: ${errorMessage}`);
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      total: rows.length,
      errors: errors.slice(0, 10), // Only return first 10 errors
    });
  } catch (error) {
    console.error("Error importing prompts:", error);
    return NextResponse.json({ error: "Failed to import prompts" }, { status: 500 });
  }
}

// Delete all community prompts (prompts imported from CSV)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Read CSV to get the titles of community prompts
    const csvPath = path.join(process.cwd(), "prompts.csv");
    const csvContent = await fs.readFile(csvPath, "utf-8");
    const rows = parseCSV(csvContent);

    const titles = rows.map((row) => row.act);

    // Delete all prompts that match the CSV titles
    const result = await db.prompt.deleteMany({
      where: {
        title: { in: titles },
      },
    });

    // Delete all unclaimed users (users with @unclaimed.prompts.chat emails)
    const deletedUsers = await db.user.deleteMany({
      where: {
        email: { endsWith: "@unclaimed.prompts.chat" },
      },
    });

    return NextResponse.json({
      success: true,
      deleted: result.count,
      deletedUsers: deletedUsers.count,
    });
  } catch (error) {
    console.error("Error deleting community prompts:", error);
    return NextResponse.json({ error: "Failed to delete community prompts" }, { status: 500 });
  }
}
