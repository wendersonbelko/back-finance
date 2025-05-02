import { FastifyReply, FastifyRequest } from 'fastify'
import {
  createTransaction,
  getTransactionById,
  getTransactionsByWallet,
  updateTransaction,
  deleteTransaction,
  TransactionDTO,
} from './transaction.service'
import { TransactionType, TransactionStatus } from '@prisma/client'
import { GetTransactionParams } from '../../types/getTransaction'

/* -------------------------------------------------------------------------- */
/* UTIL: mapeia strings do front → enums do Prisma                            */
/* -------------------------------------------------------------------------- */
function mapType(raw: string): TransactionType {
  return raw.toLowerCase() === 'entrada' ? 'income' : 'outcome'
}
function mapStatus(raw: string): TransactionStatus {
  return raw.toLowerCase() === 'completed' ? TransactionStatus.COMPLETED : TransactionStatus.PENDING
}

/* -------------------------------------------------------------------------- */
/* 1. CREATE                                                                  */
/* -------------------------------------------------------------------------- */
export async function createTransactionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user?.id
  if (!userId) return reply.code(401).send({ error: 'Unauthorized' })

  try {
    const {
      description,
      price,
      categoryId,
      type,
      status,
      transactionDate,  // ← front envia este
      createdAt,        // ← fallback p/ compatibilidade antiga
      walletId,
    } = request.body as any

    /* usa transactionDate se existir, senão createdAt */
    const dateStr: string = transactionDate || createdAt
    if (!dateStr) throw new Error('transactionDate é obrigatório')

    const transaction = await createTransaction({
      description,
      price: +price,
      categoryId,
      type: mapType(type),
      status: mapStatus(status),
      transactionDate: new Date(dateStr),   // agora válido
      walletId,
      userId,
    })

    reply.code(201).send({ transaction })
  } catch (e: any) {
    reply.code(400).send({ error: e.message })
  }
}

/* -------------------------------------------------------------------------- */
/* 2. READ – único                                                            */
/* -------------------------------------------------------------------------- */
export async function getTransactionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user?.id
  if (!userId) return reply.code(401).send({ error: 'Unauthorized' })

  try {
    const { id } = request.params as { id: string }
    const tx = await getTransactionById(+id, userId)
    reply.send({ transaction: tx })
  } catch (e: any) {
    reply.code(400).send({ error: e.message })
  }
}

/* -------------------------------------------------------------------------- */
/* 3. READ – lista por carteira (paginação p/ front)                          */
/*      ➜ devolve { transactions, total }                                     */
/* -------------------------------------------------------------------------- */
export async function getTransactionsByWalletController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user?.id
  if (!userId) return reply.code(401).send({ error: 'Unauthorized' })

  try {
    const q = request.query as unknown as GetTransactionParams
    const page    = Number(q.page  ?? 1)
    const perPage = Number(q.limit ?? 10)

    const { transactions, total } = await getTransactionsByWallet(
      q,
      userId,
      { page, limit: perPage }
    )

    /**  ←—— formato EXATO que o front original espera */
    reply.send({ transactions, total })
  } catch (e: any) {
    reply.code(400).send({ error: e.message })
  }
}

/* -------------------------------------------------------------------------- */
/* 4. UPDATE                                                                  */
/* -------------------------------------------------------------------------- */
export async function updateTransactionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user?.id
  if (!userId) return reply.code(401).send({ error: 'Unauthorized' })

  try {
    const { id } = request.params as { id: string }
    const body = request.body as Partial<{
      description: string
      price: number
      categoryId: number
      type: string
      status: string
      transactionDate: string | Date
    }>

    if (body.type)   body.type   = mapType(body.type as string)   as any
    if (body.status) body.status = mapStatus(body.status as string) as any
    if (typeof body.transactionDate === 'string')
      body.transactionDate = new Date(body.transactionDate)

    const tx = await updateTransaction(+id, body as any, userId)
    reply.send({ transaction: tx })
  } catch (e: any) {
    reply.code(400).send({ error: e.message })
  }
}

/* -------------------------------------------------------------------------- */
/* 5. DELETE                                                                  */
/* -------------------------------------------------------------------------- */
export async function deleteTransactionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user?.id
  if (!userId) return reply.code(401).send({ error: 'Unauthorized' })

  try {
    const { id } = request.params as { id: string }
    await deleteTransaction(+id, userId)
    reply.code(204).send()
  } catch (e: any) {
    reply.code(400).send({ error: e.message })
  }
}
