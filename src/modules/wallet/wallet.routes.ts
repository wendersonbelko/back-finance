import { FastifyInstance } from 'fastify'
import {
  createWalletController,
  getWalletController,
  getWalletsController,
  updateWalletController,
  deleteWalletController,
   getUsersFromWalletController,
   linkUserToWalletController,
} from './wallet.controller'

export async function walletRoutes(fastify: FastifyInstance) {
  fastify.post('/', { preHandler: [fastify.authenticate] }, createWalletController)
  fastify.get('/', { preHandler: [fastify.authenticate] }, getWalletsController)
  fastify.get('/:id', { preHandler: [fastify.authenticate] }, getWalletController)
  fastify.put('/:id', { preHandler: [fastify.authenticate] }, updateWalletController)
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, deleteWalletController)
  fastify.post('/:walletId', { preHandler: [fastify.authenticate] }, linkUserToWalletController)
  fastify.get('/:walletId/user', { preHandler: [fastify.authenticate] }, getUsersFromWalletController)
}
