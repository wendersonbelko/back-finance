// src/app.ts
import Fastify from 'fastify'
import AuthPlugin from './plugins/AuthPlugin'
import cors from '@fastify/cors'
import { walletRoutes } from './modules/wallet/wallet.routes'
import { transactionRoutes } from './modules/transaction/transaction.routes'
import { authRoutes } from './modules/auth/auth.routes'
import { categoryRoutes } from './modules/category/category.routes'
import { calendarRoutes } from './modules/calendar/calendar.routes'

export const app = Fastify({ logger: true })

app.register(cors, {
  origin: 'http://localhost:4000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

app.register(authRoutes, { prefix: '/auth' })

// Registra o plugin de autenticação (agora usando fastify-plugin)
app.register(AuthPlugin)

// Rotas que dependem de authenticate
app.register(walletRoutes, { prefix: '/wallet' })
app.register(transactionRoutes, { prefix: '/transactions' })
app.register(categoryRoutes, { prefix: '/categories' })
app.register(calendarRoutes, { prefix: '/calendar' })
