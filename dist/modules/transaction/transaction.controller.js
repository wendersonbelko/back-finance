"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionController = createTransactionController;
exports.getTransactionController = getTransactionController;
exports.getTransactionsByWalletController = getTransactionsByWalletController;
exports.updateTransactionController = updateTransactionController;
exports.deleteTransactionController = deleteTransactionController;
const transaction_service_1 = require("./transaction.service");
// Cria uma nova transação
async function createTransactionController(request, reply) {
    try {
        /*
           Espera que o front envie no body:
           {
             "description": "mercado",
             "price": 2025,
             "category": 1,
             "type": "entrada" ou "saida",
             "status": "paid" ou "pending",
             "createdAt": "2025-03-04T21:09:21.705Z",
             "walletId": 1,
             "userId": 1
           }
           
           OBS.: Em uma aplicação real, o userId viria do token de autenticação.
        */
        const { description, price, category, type, status, createdAt, walletId, userId } = request.body;
        const transaction = await (0, transaction_service_1.createTransaction)({
            description,
            price,
            category,
            type,
            status,
            transactionDate: new Date(createdAt),
            walletId,
            userId,
        });
        reply.code(201).send({ transaction });
    }
    catch (error) {
        reply.code(400).send({ error: error.message });
    }
}
// Retorna uma transação pelo ID
async function getTransactionController(request, reply) {
    try {
        const { id } = request.params;
        const transaction = await (0, transaction_service_1.getTransactionById)(parseInt(id));
        if (!transaction) {
            reply.code(404).send({ error: 'Transação não encontrada' });
        }
        else {
            reply.send({ transaction });
        }
    }
    catch (error) {
        reply.code(400).send({ error: error.message });
    }
}
// Retorna todas as transações de uma carteira, verificando se o usuário está vinculado à carteira
async function getTransactionsByWalletController(request, reply) {
    try {
        /*
           Espera receber via query os parâmetros:
           walletId e userId
           OBS.: Em produção, o userId deve ser extraído do token de autenticação.
        */
        const { walletId, userId } = request.query;
        const transactions = await (0, transaction_service_1.getTransactionsByWallet)(parseInt(walletId), parseInt(userId));
        reply.send({ transactions });
    }
    catch (error) {
        reply.code(400).send({ error: error.message });
    }
}
// Atualiza uma transação
async function updateTransactionController(request, reply) {
    try {
        const { id } = request.params;
        const data = request.body;
        if (data.transactionDate && typeof data.transactionDate === 'string') {
            data.transactionDate = new Date(data.transactionDate);
        }
        const transaction = await (0, transaction_service_1.updateTransaction)(parseInt(id), data);
        reply.send({ transaction });
    }
    catch (error) {
        reply.code(400).send({ error: error.message });
    }
}
// Exclui uma transação
async function deleteTransactionController(request, reply) {
    try {
        const { id } = request.params;
        await (0, transaction_service_1.deleteTransaction)(parseInt(id));
        reply.code(204).send();
    }
    catch (error) {
        reply.code(400).send({ error: error.message });
    }
}
