import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateWalletInput {
  name: string;
  userId: number; // ID do usuário que criou a carteira
}

export async function createWallet({ name, userId }: CreateWalletInput) {
  const wallet = await prisma.wallet.create({
    data: {
      name,
      createdBy: {
        connect: { id: userId },
      },
      users: { // Assume que existe uma relação "users" no modelo Wallet que representa a tabela de junção UserWallet
        create: { 
          userId, 
        },
      },
    },
  });
  return wallet;
}

export async function getWalletById(id: number) {
  return prisma.wallet.findUnique({
    where: { id },
  });
}

/**
 * Retorna as carteiras às quais o usuário está vinculado.
 */
export async function getWalletsByUser(userId: number) {
  return prisma.userWallet.findMany({
    where: {
      userId,
    },
    select: {
      wallet: {
        select: {
          id: true,
          name: true,
          updatedAt: true,
          createdAt: true,
        },
      },
    },
  });
}

export interface UpdateWalletInput {
  name?: string;
}

export async function updateWallet(id: number, data: UpdateWalletInput) {
  return prisma.wallet.update({
    where: { id },
    data,
  });
}

export async function deleteWallet(id: number) {
  return prisma.wallet.delete({
    where: { id },
  });
}

export async function linkUserToWallet(walletId: number, userId: number) {
  return prisma.userWallet.create({
    data: {
      walletId,
      userId,
    },
  });
}

export async function getUsersFromWallet(walletId: number) {
  return prisma.userWallet.findMany({
    where: {
      walletId: parseInt(walletId as any),
    },
    include: {
      user: true,
    },
  });
}

export async function getUserFromWallet({
  walletId,
  userId,
}: {
  walletId: number;
  userId: number;
}) {
  if (userId) {
    return await prisma.userWallet.findFirst({
      where: {
        walletId,
        userId,
      },
    });
  }
  throw new Error('É necessário informar userId ou para buscar o usuário.');
}

