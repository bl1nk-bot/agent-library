import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Resetting admin user...");

  const password = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@prompts.chat" },
    update: {
      password: password,
      role: "ADMIN",
    },
    create: {
      email: "admin@prompts.chat",
      username: "admin",
      name: "Admin User",
      password: password,
      role: "ADMIN",
      locale: "en",
    },
  });

  console.log("✅ Admin user reset successfully!");
  console.log("\n📋 Credentials:");
  console.log("   Email:    admin@prompts.chat");
  console.log("   Password: password123");
}

main()
  .catch((e) => {
    console.error("❌ Failed to reset admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
