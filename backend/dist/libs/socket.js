"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnection = void 0;
const Logs_1 = __importDefault(require("../models/Logs"));
const clients = [];
const userColors = [
    'text-green-400',
    'text-blue-500',
    'text-yellow-400',
    'text-pink-500',
    'text-purple-500',
    'text-indigo-500',
    'text-teal-400',
];
function getRandomColor() {
    return userColors[Math.floor(Math.random() * userColors.length)];
}
function getCurrentTime() {
    const d = new Date();
    return d.toLocaleTimeString('pt-BR', { hour12: false });
}
function handleConnection(socket) {
    clients.push(socket);
    socket.write('Bem-vindo ao chat TCP!\nDigite seu nome: ');
    let username = '';
    socket.on('data', async (data) => {
        const txt = data.toString().trim();
        broadcastClientCount();
        if (!username) {
            username = txt;
            const messsage = {
                type: "message",
                time: getCurrentTime(),
                user: 'Servidor',
                message: `${username} entrou no chat.`,
                color: 'text-red-400'
            };
            const ip = socket.remoteAddress || 'IP desconhecido';
            const logData = {
                content: "Novo usuário conectou-se de " + ip + ` com o nome ${username}`,
            };
            await Logs_1.default.create(logData);
            const json = JSON.stringify(messsage);
            broadcast(json, socket);
            return;
        }
        const messsage = {
            type: "message",
            time: getCurrentTime(),
            user: username,
            message: txt,
            color: 'text-green-400'
        };
        const logData = {
            content: `${username} enviou uma mensagem`,
        };
        await Logs_1.default.create(logData);
        const json = JSON.stringify(messsage);
        broadcast(json, socket);
    });
    socket.on('end', async () => {
        clients.splice(clients.indexOf(socket), 1);
        broadcastClientCount();
        const messsage = {
            type: "message",
            time: getCurrentTime(),
            user: 'Servidor',
            message: `${username} saiu do chat.`,
            color: 'text-red-400'
        };
        const logData = {
            content: `${username} desconectou-se`,
        };
        await Logs_1.default.create(logData);
        const json = JSON.stringify(messsage);
        broadcast(json, socket);
    });
    socket.on('error', () => {
        clients.splice(clients.indexOf(socket), 1);
    });
}
exports.handleConnection = handleConnection;
function broadcastClientCount() {
    const count = clients.length;
    const msg = JSON.stringify({ type: 'clientCount', count });
    for (const c of clients) {
        c.write(msg);
    }
}
function broadcast(msg, sender) {
    for (const c of clients) {
        c.write(msg + '\n');
    }
}
//# sourceMappingURL=socket.js.map