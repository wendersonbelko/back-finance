import { FastifyInstance } from 'fastify';
import { getCategoriesController, getCategoryController } from './category.controller';

export async function categoryRoutes(fastify: FastifyInstance) {
  // Busca todas as categorias
  fastify.get('/', getCategoriesController);

  // Busca uma categoria pelo ID
  fastify.get('/:id', getCategoryController);
}
