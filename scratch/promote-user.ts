import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.argv[2];
  const role = process.argv[3]; // ADMIN or WAREHOUSE

  if (!adminEmail || !role) {
    console.log("Usage: npx tsx promote-user.ts <email> <role>");
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email: adminEmail },
    data: { role: role as any },
  });

  console.log(`Successfully promoted ${user.email} to ${user.role}!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
