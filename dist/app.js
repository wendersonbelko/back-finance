"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const auth_routes_1 = require("./modules/auth/auth.routes");
const wallet_routes_1 = require("./modules/wallet/wallet.routes");
const transaction_routes_1 = require("./modules/transaction/transaction.routes");
exports.app = (0, fastify_1.default)({ logger: true });
exports.app.register(cors_1.default, {
    origin: 'http://localhost:5173', // Defina a origem específica do seu frontend
    credentials: true, // Permite o envio de credenciais (cookies, etc)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
});
exports.app.register(auth_routes_1.authRoutes, { prefix: '/auth' });
exports.app.register(wallet_routes_1.walletRoutes, { prefix: '/wallet' });
exports.app.register(transaction_routes_1.transactionRoutes, { prefix: '/transactions' });
// ... restante da configuração
