import { FastifyInstance } from 'fastify';
import {
  createTransactionController,
  getTransactionController,
  getTransactionsByWalletController,
  updateTransactionController,
  deleteTransactionController,
} from './transaction.controller';

export async function transactionRoutes(fastify: FastifyInstance) {
  // Cria uma nova transação
  fastify.post('/', { preHandler: [fastify.authenticate] }, createTransactionController);
  // Busca uma transação pelo ID
  fastify.get('/:id', { preHandler: [fastify.authenticate] }, getTransactionController);
  // Busca todas as transações de uma carteira (utiliza query parameters: walletId e userId)
  fastify.get('/', { preHandler: [fastify.authenticate] }, getTransactionsByWalletController);
  // Atualiza uma transação pelo ID
  fastify.put('/:id', { preHandler: [fastify.authenticate] }, updateTransactionController);
  // Exclui uma transação pelo ID
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, deleteTransactionController);
}
