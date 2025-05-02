"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletController = createWalletController;
exports.getWalletController = getWalletController;
exports.getWalletsController = getWalletsController;
exports.updateWalletController = updateWalletController;
exports.deleteWalletController = deleteWalletController;
const wallet_service_1 = require("./wallet.service");
async function createWalletController(request, reply) {
    try {
        const { name } = request.body;
        const wallet = await (0, wallet_service_1.createWallet)({ name });
        reply.code(201).send({ wallet });
    }
    catch (error) {
        reply.code(400).send({ error: error.message });
    }
}
async function getWalletController(request, reply) {
    try {
        const { id } = request.params;
        const wallet = await (0, wallet_service_1.getWalletById)(parseInt(id));
        if (!wallet) {
            reply.code(404).send({ error: 'Carteira não encontrada' });
        }
        else {
            reply.send({ wallet });
        }
    }
    catch (error) {
        reply.code(400).send({ error: error.message });
    }
}
/**
 * Retorna todas as carteiras que o usuário possui acesso.
 * Em uma aplicação real, o userId deve ser extraído do token de autenticação.
 */
async function getWalletsController(request, reply) {
    try {
        // Aqui, para simplificação, esperamos receber o userId via query string.
        const { userId } = request.query;
        const wallets = await (0, wallet_service_1.getWalletsByUser)(parseInt(userId));
        reply.send({ wallets });
    }
    catch (error) {
        reply.code(400).send({ error: error.message });
    }
}
async function updateWalletController(request, reply) {
    try {
        const { id } = request.params;
        const { name } = request.body;
        const wallet = await (0, wallet_service_1.updateWallet)(parseInt(id), { name });
        reply.send({ wallet });
    }
    catch (error) {
        reply.code(400).send({ error: error.message });
    }
}
async function deleteWalletController(request, reply) {
    try {
        const { id } = request.params;
        await (0, wallet_service_1.deleteWallet)(parseInt(id));
        reply.code(204).send();
    }
    catch (error) {
        reply.code(400).send({ error: error.message });
    }
}
