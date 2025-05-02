// AuthPlugin.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'

// Envolvemos a função de plugin com `fp`
export default fp(async function authentication(app: FastifyInstance) {
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      reply.code(401).send({ error: 'Token não fornecido' })
      return
    }

    const token = authHeader.replace('Bearer ', '')
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number, email: string }
      request.user = { id: decoded.id, email: decoded.email }
    } catch (error: any) {
      reply.code(401).send({ error: error.message })
    }
  })
})
