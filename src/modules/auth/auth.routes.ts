import { FastifyInstance } from 'fastify';
import { registerUserController, loginUserController } from './auth.controller';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', registerUserController);
  fastify.post('/login', loginUserController);
}
