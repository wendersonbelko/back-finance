"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const start = async () => {
    try {
        await app_1.app.listen({ port: 3000 });
        console.log('Server running on port 3000');
    }
    catch (err) {
        app_1.app.log.error(err);
        process.exit(1);
    }
};
start();
