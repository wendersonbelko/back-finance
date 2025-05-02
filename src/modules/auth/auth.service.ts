import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createWallet } from '../wallet/wallet.service';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Use environment variable in production

interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
}

export async function registerUser({ email, password, name }: RegisterUserInput) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  // Return only public fields

  await createWallet({ name: `Carteira de ${user.name.split(' ')[0]}`, userId: user.id });

  return { id: user.id, email: user.email, name: user.name };
}

interface LoginUserInput {
  email: string;
  password: string;
}

export async function loginUser({ email, password }: LoginUserInput) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Incorrect password');
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  return token;
}

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function getUserProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      // traga todas as “userWallets” (pivot)
      wallets: {
        include: {
          // dentro delas, traga apenas estes campos de wallet + nome de quem criou
          wallet: {
            select: {
              id: true,
              name: true,
              description: true,
              createdBy: {
                select: { name: true }
              }
            }
          }
        }
      }
    }
  })

  if (!user) throw new Error('User not found')

  // destruture para remover campos sensíveis/timestamps do user
  const { password, createdAt, updatedAt, deletedAt, ...publicUser } = user

  // remova timestamps e chaves estrangeiras do array de wallets
  publicUser.wallets = publicUser.wallets.map(uw => {
    const { createdAt, ...rest } = uw;
    return {
      ...rest,
      createdAt,
      deletedAt: uw.deletedAt || null,
      userId: uw.userId,
      walletId: uw.walletId,
    };
  });

  return publicUser
}