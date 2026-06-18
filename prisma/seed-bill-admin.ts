import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Seeding Bill Admin user...");

  const email = "billlzzz1808@gamil.com";
  const username = "billlzzz";
  const password = await bcrypt.hash("Time_1808", 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: password,
      role: "ADMIN",
      verified: true,
    },
    create: {
      email,
      username,
      name: "Bill Admin",
      password: password,
      role: "ADMIN",
      locale: "en",
      verified: true,
    },
  });

  console.log("✅ Admin user created/updated successfully!");
  console.log(`   Email:    ${email}`);
  console.log(`   Username: ${username}`);
}

main()
  .catch((e) => {
    console.error("❌ Failed to seed admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
