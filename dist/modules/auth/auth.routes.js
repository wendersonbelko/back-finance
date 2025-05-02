"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const auth_controller_1 = require("./auth.controller");
async function authRoutes(fastify) {
    fastify.post('/register', auth_controller_1.registerUserController);
    fastify.post('/login', auth_controller_1.loginUserController);
}
