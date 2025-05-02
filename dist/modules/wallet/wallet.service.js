"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWallet = createWallet;
exports.getWalletById = getWalletById;
exports.getWalletsByUser = getWalletsByUser;
exports.updateWallet = updateWallet;
exports.deleteWallet = deleteWallet;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createWallet({ name }) {
    const wallet = await prisma.wallet.create({
        data: {
            name,
        },
    });
    return wallet;
}
async function getWalletById(id) {
    return prisma.wallet.findUnique({
        where: { id },
    });
}
/**
 * Retorna as carteiras às quais o usuário está vinculado.
 */
async function getWalletsByUser(userId) {
    return prisma.wallet.findMany({
        where: {
            users: {
                some: { userId },
            },
        },
    });
}
async function updateWallet(id, data) {
    return prisma.wallet.update({
        where: { id },
        data,
    });
}
async function deleteWallet(id) {
    return prisma.wallet.delete({
        where: { id },
    });
}
