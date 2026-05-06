import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.item.deleteMany();

  await prisma.item.createMany({
    data: [
      {
        title: "Ship initial API",
        description: "Implement CRUD endpoints with Prisma and Express.",
        status: "active",
      },
      {
        title: "Write docs",
        description: "Document setup steps and endpoint examples.",
        status: "active",
      },
      {
        title: "Review pull request",
        description: "Validate API behavior and check edge cases.",
        status: "done",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seeding failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
