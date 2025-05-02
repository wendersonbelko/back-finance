import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCategories() {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}

export async function getCategoryById(id: number) {
  return prisma.category.findUnique({
    where: {
      id,
    },
  });
}
