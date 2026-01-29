import { PrismaClient, PromptType } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

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

async function getFiles(dir: string): Promise<string[]> {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

async function main() {
  console.log("🚀 Starting Agent Import...");

  const adminEmail = "billlzzz1808@gamil.com";
  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) {
    console.error(`❌ Admin user ${adminEmail} not found. Run seed-bill-admin first.`);
    process.exit(1);
  }

  const agentsDir = path.join(process.cwd(), "agents_old_json");
  if (!fs.existsSync(agentsDir)) {
    console.error("❌ agents_old_json directory not found!");
    process.exit(1);
  }

  const allFiles = await getFiles(agentsDir);
  const jsonFiles = allFiles.filter(f => f.endsWith(".json"));

  console.log(`📊 Found ${jsonFiles.length} JSON files to process`);

  let successCount = 0;
  let skippedCount = 0;

  for (const filePath of jsonFiles) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(content);

      if (data.type !== "agent" && !data.identifier) {
          skippedCount++;
          continue;
      }

      const identifier = data.identifier;
      const meta = data.meta || {};
      const config = data.config || {};

      const title = meta.title || identifier;
      const description = meta.description || "";
      const systemPrompt = config.systemRole || description || "No system role provided.";
      const avatar = meta.avatar || null;
      const categorySlug = slugify(meta.category || "General");
      const tags = meta.tags || [];

      // 1. Ensure Category
      let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (!category) {
          category = await prisma.category.create({
              data: {
                  name: meta.category || "General",
                  slug: categorySlug,
                  order: 10
              }
          });
      }

      // 2. Slug
      const slug = slugify(title);

      // 3. Upsert Prompt
      const prompt = await prisma.prompt.upsert({
          where: { identifier: identifier },
          update: {
              title,
              description,
              content: systemPrompt,
              avatar,
              agentConfig: config,
              type: "AGENT",
              categoryId: category.id,
          },
          create: {
              title,
              slug: `${slug}-${identifier.substring(0, 8)}`, // Ensure uniqueness if title is common
              identifier,
              description,
              content: systemPrompt,
              avatar,
              agentConfig: config,
              type: "AGENT",
              authorId: admin.id,
              categoryId: category.id,
          }
      });

      // 4. Tags
      for (const tagName of tags) {
          const tagSlug = slugify(tagName);
          let tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
          if (!tag) {
              tag = await prisma.tag.create({
                  data: { name: tagName, slug: tagSlug }
              });
          }

          // Connect tag
          await prisma.promptTag.upsert({
              where: {
                  promptId_tagId: {
                      promptId: prompt.id,
                      tagId: tag.id
                  }
              },
              update: {},
              create: {
                  promptId: prompt.id,
                  tagId: tag.id
              }
          });
      }

      successCount++;
      if (successCount % 10 === 0) process.stdout.write(".");
    } catch (err) {
      console.error(`\n❌ Error processing ${filePath}:`, err);
      skippedCount++;
    }
  }

  console.log(`\n\n🎉 Import Complete!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`⏭️  Skipped: ${skippedCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
