"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserController = registerUserController;
exports.loginUserController = loginUserController;
const auth_service_1 = require("./auth.service");
async function registerUserController(request, reply) {
    try {
        const { email, password, name } = request.body;
        const user = await (0, auth_service_1.registerUser)({ email, password, name });
        reply.code(201).send({ user });
    }
    catch (error) {
        reply.code(400).send({ error: error.message });
    }
}
async function loginUserController(request, reply) {
    try {
        const { email, password } = request.body;
        const token = await (0, auth_service_1.loginUser)({ email, password });
        reply.send({ token });
    }
    catch (error) {
        reply.code(401).send({ error: error.message });
    }
}
