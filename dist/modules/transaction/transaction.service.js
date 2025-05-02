"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = createTransaction;
exports.getTransactionById = getTransactionById;
exports.getTransactionsByWallet = getTransactionsByWallet;
exports.updateTransaction = updateTransaction;
exports.deleteTransaction = deleteTransaction;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createTransaction(data) {
    // Verifica se a carteira existe e se o usuário está vinculado a ela.
    const wallet = await prisma.wallet.findUnique({
        where: { id: data.walletId },
        include: { users: true },
    });
    if (!wallet) {
        throw new Error('Carteira não encontrada');
    }
    const isUserLinked = wallet.users.some((uw) => uw.userId === data.userId);
    if (!isUserLinked) {
        throw new Error('Usuário não tem acesso a essa carteira');
    }
    return prisma.walletTransaction.create({
        data: {
            description: data.description,
            price: data.price,
            category: data.category,
            type: data.type,
            status: data.status,
            transactionDate: data.transactionDate,
            wallet: { connect: { id: data.walletId } },
            user: { connect: { id: data.userId } },
        },
    });
}
async function getTransactionById(id) {
    return prisma.walletTransaction.findUnique({
        where: { id },
    });
}
/**
 * Retorna todas as transações de uma carteira,
 * verificando se o usuário informado está vinculado à carteira.
 */
async function getTransactionsByWallet(walletId, userId) {
    const wallet = await prisma.wallet.findUnique({
        where: { id: walletId },
        include: { users: true },
    });
    if (!wallet) {
        throw new Error('Carteira não encontrada');
    }
    const isUserLinked = wallet.users.some((uw) => uw.userId === userId);
    if (!isUserLinked) {
        throw new Error('Usuário não tem acesso a essa carteira');
    }
    return prisma.walletTransaction.findMany({
        where: { walletId },
    });
}
async function updateTransaction(id, data) {
    return prisma.walletTransaction.update({
        where: { id },
        data,
    });
}
async function deleteTransaction(id) {
    return prisma.walletTransaction.delete({
        where: { id },
    });
}
