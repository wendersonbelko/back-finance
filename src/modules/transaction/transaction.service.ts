import { PrismaClient, TransactionStatus, TransactionType } from '@prisma/client'
import { GetTransactionParams } from '../../types/getTransaction'
import { pagination, PaginationType } from '../../utils/pagination'

const prisma = new PrismaClient()

/* -------------------------------------------------------------------------- */
/*  DTO + helpers                                                             */
/* -------------------------------------------------------------------------- */
export interface TransactionDTO {
  id: number
  description: string
  price: number
  type: TransactionType          // 'INCOME' | 'OUTCOME'
  status: TransactionStatus
  transactionDate: string        // ISO-8601
  category: { id: number; name: string }
}

function toDTO(tx: any): TransactionDTO {
  return {
    id: tx.id,
    description: tx.description,
    price: tx.price,
    type: tx.type,
    status: tx.status,
    transactionDate: tx.transactionDate.toISOString(),
    category: { id: tx.category.id, name: tx.category.name },
  }
}

async function assertWalletAccess(walletId: number, userId: number) {
  const wallet = await prisma.wallet.findUnique({
    where: { id: walletId },
    include: { users: true },
  })
  if (!wallet) throw new Error('Carteira não encontrada')
  if (!wallet.users.some(u => u.userId === userId))
    throw new Error('Usuário não tem acesso a essa carteira')
}

/* -------------------------------------------------------------------------- */
/*  CREATE                                                                    */
/* -------------------------------------------------------------------------- */
interface CreateTransactionInput {
  description: string
  price: number
  categoryId: number
  type: TransactionType
  status: TransactionStatus
  transactionDate: Date
  walletId: number
  userId: number
}

export async function createTransaction(data: CreateTransactionInput) {
  await assertWalletAccess(data.walletId, data.userId)

  const tx = await prisma.walletTransaction.create({
    data: {
      description: data.description,
      price: data.price,
      category: { connect: { id: data.categoryId } },
      type: data.type,
      status: data.status,
      transactionDate: data.transactionDate,
      wallet: { connect: { id: data.walletId } },
      user: { connect: { id: data.userId } },
    },
    include: { category: true },
  })
  return toDTO(tx)
}

/* -------------------------------------------------------------------------- */
/*  READ – único                                                              */
/* -------------------------------------------------------------------------- */
export async function getTransactionById(id: number, userId: number) {
  const tx = await prisma.walletTransaction.findUnique({
    where: { id },
    include: { wallet: { include: { users: true } }, category: true },
  })
  if (!tx) throw new Error('Transação não encontrada')
  if (!tx.wallet.users.some(u => u.userId === userId))
    throw new Error('Usuário não tem acesso a essa transação')
  return toDTO(tx)
}

/* -------------------------------------------------------------------------- */
/*  READ – lista por carteira (contrato esperado pelo front)                  */
/*      ➜ retorna { transactions: TransactionDTO[], total: number }          */
/* -------------------------------------------------------------------------- */
export async function getTransactionsByWallet(
  params: GetTransactionParams,
  userId: number,
  paginationParams: PaginationType
) {
  const walletId = +params.walletId
  await assertWalletAccess(walletId, userId)

  const where: any = { walletId }
  const { search, startDate, endDate, category } = params

  if (search) where.description = { contains: search, mode: 'insensitive' }
  if (startDate) where.transactionDate = { gte: new Date(startDate) }
  if (endDate)
    where.transactionDate = { ...(where.transactionDate || {}), lte: new Date(endDate) }
  if (category) where.categoryId = +category

  const { skip, take } = pagination(paginationParams)

  const [items, total] = await Promise.all([
    prisma.walletTransaction.findMany({
      where,
      include: { category: { select: { id: true, name: true } } },
      skip,
      take,
      orderBy: { transactionDate: 'desc' },
    }),
    prisma.walletTransaction.count({ where }),
  ])

  /* ---- formato exato que o front (original) espera ---- */
  return { transactions: items.map(toDTO), total }
}

/* -------------------------------------------------------------------------- */
/*  UPDATE                                                                    */
/* -------------------------------------------------------------------------- */
interface UpdateTransactionInput {
  description?: string
  price?: number
  categoryId?: number
  type?: TransactionType
  status?: TransactionStatus
  transactionDate?: Date
}

export async function updateTransaction(
  id: number,
  data: UpdateTransactionInput,
  userId: number
) {
  await getTransactionById(id, userId) // valida acesso

  const tx = await prisma.walletTransaction.update({
    where: { id },
    data: {
      description: data.description,
      price: data.price,
      type: data.type,
      status: data.status,
      transactionDate: data.transactionDate,
      category: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
    },
    include: { category: true },
  })
  return toDTO(tx)
}

/* -------------------------------------------------------------------------- */
/*  DELETE (soft delete opcional)                                             */
/* -------------------------------------------------------------------------- */
export async function deleteTransaction(id: number, userId: number) {
  await getTransactionById(id, userId) // valida acesso
  return prisma.walletTransaction.delete({ where: { id } })
}
