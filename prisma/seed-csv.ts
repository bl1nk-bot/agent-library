import { PrismaClient, PromptType } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Slugify function
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// Robust CSV Parser
function parseCSV(text: string) {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuote && nextChar === '"') {
        currentCell += '"';
        i++; // Skip escaped quote
      } else {
        inQuote = !inQuote;
      }
    } else if (char === ',' && !inQuote) {
      currentRow.push(currentCell);
      currentCell = "";
    } else if ((char === '\r' || char === '\n') && !inQuote) {
      if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
      
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }
  
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

async function main() {
  console.log("🌱 Seeding database from prompts.csv...");

  // 1. Create Default Admin User
  const password = await bcrypt.hash("password123", 12);
  const adminEmail = "admin@prompts.chat";
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      username: "admin",
      name: "System Admin",
      password: password,
      role: "ADMIN",
      locale: "en",
      verified: true,
    },
  });
  console.log("✅ Admin user ready");

  // 2. Setup Category
  const defaultCategorySlug = "general";
  const defaultCategory = await prisma.category.upsert({
    where: { slug: defaultCategorySlug },
    update: {},
    create: {
      name: "General",
      slug: defaultCategorySlug,
      description: "General purpose prompts",
      order: 1,
    },
  });
  console.log("✅ Default category ready");

  // 3. Read & Parse CSV
  const csvPath = path.join(process.cwd(), "prompts.csv");
  if (!fs.existsSync(csvPath)) {
    console.error("❌ prompts.csv not found!");
    process.exit(1);
  }

  console.log("📖 Reading CSV file...");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  
  console.log("🧠 Parsing CSV data...");
  const rows = parseCSV(csvContent);
  
  // Remove header
  // Expected header: act,prompt,for_devs,type,contributor
  const header = rows[0].map(h => h.toLowerCase().trim());
  const dataRows = rows.slice(1);
  
  console.log(`📊 Found ${dataRows.length} rows to process`);

  // Column mapping
  const idxAct = header.indexOf("act");
  const idxPrompt = header.indexOf("prompt");
  const idxType = header.indexOf("type");
  const idxContributor = header.indexOf("contributor");

  if (idxAct === -1 || idxPrompt === -1) {
    console.error("❌ Missing required columns 'act' or 'prompt' in CSV");
    process.exit(1);
  }

  // Cache users to minimize DB lookups
  const userCache = new Map<string, string>(); // username -> id
  userCache.set("admin", admin.id);
  
  // Pre-load existing users if any (optional, but safer to just upsert on demand or check cache)

  let successCount = 0;
  let skippedCount = 0;

  console.log("🚀 Starting database insertion...");

  // Process in chunks/batches if needed, but for simplicity loop linearly
  for (const row of dataRows) {
    if (row.length < 2) continue; // Skip empty rows

    const title = row[idxAct]?.trim();
    const content = row[idxPrompt]?.trim();
    const typeStr = idxType !== -1 ? row[idxType]?.trim().toUpperCase() : "TEXT";
    const contributor = idxContributor !== -1 ? row[idxContributor]?.trim() : "admin";

    if (!title || !content) {
        skippedCount++;
        continue;
    }

    // 1. Handle Author
    let authorId = userCache.get(contributor);
    if (!authorId && contributor) {
      // Check or create user
      // Simple sanitization for username
      const username = slugify(contributor).replace(/-/g, '_').substring(0, 30); 
      const email = `${username}@prompts.chat`;

      try {
        // Try to find first
        let user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    username,
                    email,
                    name: contributor,
                    password: password, // Default password
                    role: "USER",
                }
            });
        }
        authorId = user.id;
        userCache.set(contributor, authorId);
      } catch (e) {
        // Fallback to admin if user creation fails (e.g. duplicate email/username collision logic issues)
        authorId = admin.id;
      }
    } else if (!authorId) {
        authorId = admin.id;
    }

    // 2. Handle Prompt
    let slug = slugify(title);
    
    // Ensure unique slug (simple append)
    // For bulk import, checking every slug is slow. 
    // We can just try create and catch error, or append random string.
    // Let's rely on Prisma's duplicate check and skip or append.
    
    // Check existence
    const existing = await prisma.prompt.findFirst({
        where: { slug },
        select: { id: true }
    });

    if (existing) {
        skippedCount++;
        continue; 
    }

    try {
        const typeMap: Record<string, PromptType> = {
            "TEXT": "TEXT",
            "IMAGE": "IMAGE",
            "CODE": "TEXT", // Map code to text or structured?
        };
        const promptType = typeMap[typeStr] || "TEXT";

        const prompt = await prisma.prompt.create({
            data: {
                title,
                slug,
                content,
                type: promptType,
                authorId: authorId!,
                categoryId: defaultCategory.id,
                viewCount: 0,
            }
        });

        // Version
        await prisma.promptVersion.create({
            data: {
                promptId: prompt.id,
                version: 1,
                content,
                createdBy: authorId!,
                changeNote: "Initial import via CSV"
            }
        });

        successCount++;
        if (successCount % 100 === 0) process.stdout.write(".");
    } catch (e) {
        // console.error(`Failed to create prompt ${title}:`, e);
        skippedCount++;
    }
  }

  console.log(`\n\n🎉 Import complete!`);
  console.log(`✅ Created: ${successCount}`);
  console.log(`⏭️  Skipped: ${skippedCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });