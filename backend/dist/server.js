"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./bootstrap");
require("./database");
const net_1 = require("net");
const socket_1 = require("./libs/socket");
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors")); // importe o pacote
const app = (0, express_1.default)();
const PORT = 4000;
const HTTP_PORT = 4001;
app.use((0, cors_1.default)({
    origin: '*', // ou '*', mas sem credentials
}));
app.options('*', (0, cors_1.default)()); // responde requisições preflight
app.use(express_1.default.json());
app.use(routes_1.default);
async function start() {
    (0, net_1.createServer)(socket_1.handleConnection).listen(PORT, () => console.log(`Servidor TCP rodando na porta ${PORT}`));
    app.listen(HTTP_PORT, () => {
        console.log(`Servidor HTTP rodando em http://localhost:${HTTP_PORT}`);
    });
}
start().catch(console.error);
//# sourceMappingURL=server.js.map