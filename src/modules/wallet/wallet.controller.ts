import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createWallet,
  getWalletById,
  getWalletsByUser,
  updateWallet,
  deleteWallet,
  linkUserToWallet,
  getUserFromWallet,
  getUsersFromWallet,
} from './wallet.service';
import { getUserByEmail } from '../auth/auth.service';

export async function createWalletController(request: FastifyRequest, reply: FastifyReply) {
  try {
    
    const { name } = request.body as { name: string };
    if (!request.user) {
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }

    const wallet = await createWallet({ name, userId: request.user.id });
    reply.code(201).send({ wallet });
  } catch (error: any) {
    reply.code(400).send({ error: error.message });
  }
}

export async function getWalletController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const wallet = await getWalletById(parseInt(id));
    reply.send({ wallet });
  } catch (error: any) {
    reply.code(400).send({ error: error.message });
  }
}

/**
 * Retorna todas as carteiras que o usuário possui acesso.
 * Em uma aplicação real, o userId deve ser extraído do token de autenticação.
 */
export async function getWalletsController(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Aqui, para simplificação, esperamos receber o userId via query string.
    const user = request.user

    if (!user?.id) {
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }

    const wallets = await getWalletsByUser(user.id);
    reply.send({ wallets });
  } catch (error: any) {
    reply.code(400).send({ error: error.message });
  }
}

export async function updateWalletController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const { name } = request.body as { name?: string };
    const wallet = await updateWallet(parseInt(id), { name });
    reply.send({ wallet });
  } catch (error: any) {
    reply.code(400).send({ error: error.message });
  }
}

export async function deleteWalletController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    await deleteWallet(parseInt(id));
    reply.code(204).send();
  } catch (error: any) {
    reply.code(400).send({ error: error.message });
  }
}

export async function linkUserToWalletController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { walletId } = request.params as { walletId: number; };
    const { email } = request.body as { email: string; };
    const user = request.user;

    if (!user) {
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }

    const inWallet = await getUserFromWallet({
      walletId: parseInt(walletId as any),
      userId: parseInt(user.id as any)
    });

    if (!inWallet) {
      reply.code(400).send({ error: 'Usuário solicitante não pertence ao grupo' });
      return;
    }

    const userToLink = await getUserByEmail(email);

    if (!userToLink) {
      reply.code(404).send({ error: 'Usuário não encontrado' });
      return;
    }

    const linked = await getUserFromWallet({
      walletId: parseInt(walletId as any),
      userId: parseInt(userToLink.id as any)
    });
    
    if (linked) {
      reply.code(400).send({ error: 'Usuário já vinculado à carteira' });
      return;
    }

    await linkUserToWallet(parseInt(walletId as any), parseInt(userToLink.id as any));
    reply.code(204).send();
  } catch (error: any) {
    reply.code(400).send({ error: error.message });
  }
}

export async function getUsersFromWalletController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { walletId } = request.params as { walletId: string; };
    const inWallet = await getUsersFromWallet(parseInt(walletId));

    if (!inWallet) {
      reply.code(404).send({ error: 'Usuário não encontrado na carteira' });
    } else {
      reply.send({ inWallet });
    }
  } catch (error: any) {
    reply.code(400).send({ error: error.message });
  }
}
