import { FastifyReply, FastifyRequest } from 'fastify';
import { registerUser, loginUser, getUserProfile } from './auth.service';
import jwt from 'jsonwebtoken';

export async function registerUserController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password, name } = request.body as { email: string; password: string; name: string };
    const user = await registerUser({ email, password, name });
    reply.code(201).send({ user });
  } catch (error: any) {
    reply.code(400).send({ error: error.message });
  }
}

export async function loginUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { email, password } = request.body as {
      email: string
      password: string
    }
    
    const token = await loginUser({ email, password })
    const decoded = jwt.decode(token) as { iat: number; exp: number; id: number }
    const user = await getUserProfile(decoded.id)

    reply.send({
      token,
      issuedAt: new Date(decoded.iat * 1000).toISOString(),
      expiresAt: new Date(decoded.exp * 1000).toISOString(),
      user,
    })
  } catch (err: any) {
    reply.code(401).send({ error: err.message })
  }
}
