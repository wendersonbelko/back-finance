"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRoutes = walletRoutes;
const wallet_controller_1 = require("./wallet.controller");
async function walletRoutes(fastify) {
    fastify.post('/', wallet_controller_1.createWalletController);
    fastify.get('/', wallet_controller_1.getWalletsController);
    fastify.get('/:id', wallet_controller_1.getWalletController);
    fastify.put('/:id', wallet_controller_1.updateWalletController);
    fastify.delete('/:id', wallet_controller_1.deleteWalletController);
}
