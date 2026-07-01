import { prisma } from "./src/lib/db";

async function main() {
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ["admin@mysteryscoop.in", "warehouse@mysteryscoop.in", "priya@example.com"],
      },
    },
  });
  console.log("Deleted old seed users");
}

main().finally(() => process.exit(0));
