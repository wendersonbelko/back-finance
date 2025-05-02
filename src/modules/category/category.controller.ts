import { FastifyReply, FastifyRequest } from 'fastify';
import { getCategories, getCategoryById } from './category.service';

// Retorna todas as categorias
export async function getCategoriesController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const categories = await getCategories();
    reply.send({ categories });
  } catch (error: any) {
    reply.code(400).send({ error: error.message });
  }
}

// Retorna uma categoria pelo ID
export async function getCategoryController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const category = await getCategoryById(parseInt(id));
    if (!category) {
      reply.code(404).send({ error: 'Categoria não encontrada' });
    } else {
      reply.send({ category });
    }
  } catch (error: any) {
    reply.code(400).send({ error: error.message });
  }
}
