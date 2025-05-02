"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRoutes = transactionRoutes;
const transaction_controller_1 = require("./transaction.controller");
async function transactionRoutes(fastify) {
    // Cria uma nova transação
    fastify.post('/', transaction_controller_1.createTransactionController);
    // Busca uma transação pelo ID
    fastify.get('/:id', transaction_controller_1.getTransactionController);
    // Busca todas as transações de uma carteira (utiliza query parameters: walletId e userId)
    fastify.get('/', transaction_controller_1.getTransactionsByWalletController);
    // Atualiza uma transação pelo ID
    fastify.put('/:id', transaction_controller_1.updateTransactionController);
    // Exclui uma transação pelo ID
    fastify.delete('/:id', transaction_controller_1.deleteTransactionController);
}
